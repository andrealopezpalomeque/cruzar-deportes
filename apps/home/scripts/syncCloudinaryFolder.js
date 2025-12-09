#!/usr/bin/env node

import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

const args = process.argv.slice(2)

const getArg = (name, fallback) => {
  const prefix = `--${name}=`
  const match = args.find(arg => arg.startsWith(prefix))
  if (!match) {
    return fallback
  }
  return match.slice(prefix.length)
}

const folder = getArg('folder', 'basket')
const prefix = getArg('prefix', `cruzar-deportes/products/${folder}`)
const localRoot = getArg('local', folder)
const dryRun = args.includes('--dry-run')

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Missing Cloudinary credentials. Populate CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET in home/.env')
  process.exit(1)
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

async function fetchAllResources(cloudinaryPrefix) {
  const resources = []
  let nextCursor

  do {
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: cloudinaryPrefix,
      max_results: 500,
      next_cursor: nextCursor
    })

    resources.push(...response.resources)
    nextCursor = response.next_cursor
    console.log(`Fetched ${resources.length} assets so far...`)
  } while (nextCursor)

  return resources
}

function buildLocalMappingEntry(resource) {
  const publicId = resource.public_id.replace(/^cruzar-deportes\/products\//, '')

  if (!publicId.startsWith(`${localRoot}`)) {
    return null
  }

  const relativePath = publicId // includes folder/filename-without-ext
  const extension = resource.format ? `.${resource.format}` : ''
  const localPath = `/images/${relativePath}${extension}`

  return { localPath, url: resource.secure_url }
}

async function main() {
  console.log(`🔍 Pulling Cloudinary resources for prefix "${prefix}"`)
  const resources = await fetchAllResources(prefix)
  console.log(`✅ Retrieved ${resources.length} assets from Cloudinary`)

  const mappingEntries = resources
    .map(buildLocalMappingEntry)
    .filter((entry) => entry !== null)

  if (mappingEntries.length === 0) {
    console.warn('⚠️  No mapping entries were built. Check folder/local arguments.')
    return
  }

  const mappingPath = join(__dirname, 'url-mapping.json')
  const backupPath = `${mappingPath}.backup-${Date.now()}`

  const rawMapping = await fs.readFile(mappingPath, 'utf-8')
  const mapping = JSON.parse(rawMapping)

  // Remove any existing entries for the same local folder to avoid stale URLs
  for (const key of Object.keys(mapping)) {
    if (key.startsWith(`/images/${localRoot}/`)) {
      delete mapping[key]
    }
  }

  mappingEntries.forEach(({ localPath, url }) => {
    mapping[localPath] = url
  })

  if (dryRun) {
    console.log('🧪 Dry run complete. Preview of first 5 entries:')
    mappingEntries.slice(0, 5).forEach(entry => console.log(entry))
    return
  }

  await fs.writeFile(backupPath, rawMapping)
  await fs.writeFile(mappingPath, JSON.stringify(mapping, null, 2))

  console.log(`💾 Backup saved to ${backupPath}`)
  console.log(`🗺️  url-mapping.json updated with ${mappingEntries.length} entries for /images/${localRoot}`)
}

main().catch(error => {
  console.error('💥 syncCloudinaryFolder failed:', error)
  process.exit(1)
})
