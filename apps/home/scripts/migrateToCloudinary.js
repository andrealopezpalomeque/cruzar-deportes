#!/usr/bin/env node

import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') })

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const mappingPath = join(__dirname, 'url-mapping.json')
const reportPath = join(__dirname, 'cloudinary-migration-report.json')
const cliOptions = parseCliOptions()

function parseCliOptions() {
  const args = process.argv.slice(2)
  const options = {
    dirs: [],
    force: false,
    limit: null
  }

  for (const arg of args) {
    if (arg.startsWith('--dir=')) {
      const rawValue = arg.split('=')[1]?.trim()
      if (!rawValue) continue
      if (rawValue.includes('..')) {
        throw new Error(`Invalid --dir value "${rawValue}". Relative paths outside public/images are not allowed.`)
      }
      const sanitized = rawValue.replace(/^\/+/, '')
      options.dirs.push(sanitized)
    } else if (arg === '--force') {
      options.force = true
    } else if (arg.startsWith('--limit=')) {
      const limitValue = Number.parseInt(arg.split('=')[1] ?? '', 10)
      if (!Number.isNaN(limitValue) && limitValue > 0) {
        options.limit = limitValue
      }
    } else {
      console.warn(`⚠️  Unknown argument ignored: ${arg}`)
    }
  }

  return options
}

function getAllImageFiles(dir, fileList = []) {
  const files = readdirSync(dir)

  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList)
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      fileList.push(filePath)
    }
  })

  return fileList
}

function collectImageFiles(baseDir, dirs) {
  if (!dirs || dirs.length === 0) {
    return getAllImageFiles(baseDir)
  }

  const seen = new Set()

  dirs.forEach(dir => {
    if (!dir) return
    const normalized = dir.replace(/\\/g, '/')
    const targetDir = join(baseDir, normalized)

    if (!existsSync(targetDir)) {
      throw new Error(`Directory not found: ${targetDir}`)
    }

    getAllImageFiles(targetDir).forEach(filePath => seen.add(filePath))
  })

  return Array.from(seen)
}

function loadExistingMapping(filePath) {
  if (!existsSync(filePath)) {
    return { mapping: {}, raw: null }
  }

  try {
    const raw = readFileSync(filePath, 'utf-8')
    if (!raw.trim()) {
      return { mapping: {}, raw }
    }
    return { mapping: JSON.parse(raw), raw }
  } catch (error) {
    console.warn(`⚠️  Could not parse existing mapping file at ${filePath}. Starting fresh.`)
    console.warn(error.message)
    return { mapping: {}, raw: null }
  }
}

async function uploadImageToCloudinary(localPath, cloudinaryFolder) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: `cruzar-deportes/${cloudinaryFolder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, height: 1200, crop: 'limit' }
      ],
      overwrite: false, // Don't overwrite existing images
      unique_filename: true
    })

    return {
      original_filename: basename(localPath),
      cloudinary_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    }
  } catch (error) {
    console.error(`Error uploading ${localPath}:`, error)
    throw error
  }
}

function getCloudinaryFolderFromLocal(localPath) {
  // Convert local path structure to Cloudinary folder structure
  // Example: public/images/afc/johor/image.jpg -> products/afc/johor
  const relativePath = localPath.replace(join(__dirname, '../public/images'), '')
  const pathParts = relativePath.split('/').filter(part => part && part !== '.')

  if (pathParts.length >= 2) {
    // Remove the filename and join the rest
    pathParts.pop() // Remove filename
    return `products/${pathParts.join('/')}`
  }

  return 'products/misc'
}

async function migrateImages() {
  const imagesDir = join(__dirname, '../public/images')
  let imageFiles = collectImageFiles(imagesDir, cliOptions.dirs)

  if (cliOptions.limit) {
    imageFiles = imageFiles.slice(0, cliOptions.limit)
  }

  const { mapping: existingMapping, raw: existingMappingRaw } = loadExistingMapping(mappingPath)

  console.log('🚀 Starting Cloudinary migration...')
  console.log(`📁 Target: ${cliOptions.dirs.length > 0 ? cliOptions.dirs.join(', ') : 'all folders'}`)
  console.log(`📊 Found ${imageFiles.length} images to evaluate`)
  console.log('⚙️  Using Cloudinary cloud:', process.env.CLOUDINARY_CLOUD_NAME)
  console.log(`🗺️  Existing mapping entries: ${Object.keys(existingMapping).length}`)
  console.log(cliOptions.force
    ? '♻️  Force mode enabled - existing entries will be re-uploaded.'
    : '⏭️  Existing mapping entries will be skipped automatically.')

  if (imageFiles.length === 0) {
    console.log('Nothing to upload. Exiting.')
    return {
      successful: [],
      failed: [],
      skipped: [],
      urlMapping: existingMapping
    }
  }

  const migrationResults = {
    successful: [],
    failed: [],
    skipped: [],
    urlMapping: { ...existingMapping } // Preserve existing mapping entries
  }

  for (let i = 0; i < imageFiles.length; i++) {
    const localPath = imageFiles[i]
    const cloudinaryFolder = getCloudinaryFolderFromLocal(localPath)
    const fileName = basename(localPath)
    const relativePath = localPath.replace(join(__dirname, '../public'), '')

    if (!cliOptions.force && migrationResults.urlMapping[relativePath]) {
      migrationResults.skipped.push({
        localPath,
        reason: 'already uploaded'
      })
      console.log(`📤 Skipping ${i + 1}/${imageFiles.length}: ${fileName}`)
      console.log('   ⏭️  Reason: already present in url-mapping.json')
      continue
    }

    console.log(`📤 Uploading ${i + 1}/${imageFiles.length}: ${fileName}`)
    console.log(`   📁 Folder: ${cloudinaryFolder}`)

    try {
      const result = await uploadImageToCloudinary(localPath, cloudinaryFolder)

      migrationResults.successful.push({
        localPath,
        cloudinaryFolder,
        ...result
      })

      // Create URL mapping for updating product generator
      migrationResults.urlMapping[relativePath] = result.cloudinary_url

      console.log(`   ✅ Success: ${result.cloudinary_url}`)
      console.log(`   📏 Size: ${Math.round(result.bytes / 1024)}KB (${result.width}x${result.height})`)
    } catch (error) {
      migrationResults.failed.push({
        localPath,
        cloudinaryFolder,
        error: error.message
      })
      console.log(`   ❌ Failed: ${error.message}`)
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n🎉 Migration Complete!')
  console.log(`✅ Successful uploads: ${migrationResults.successful.length}`)
  console.log(`❌ Failed uploads: ${migrationResults.failed.length}`)
  console.log(`⏭️  Skipped (already uploaded): ${migrationResults.skipped.length}`)

  if (migrationResults.failed.length > 0) {
    console.log('\n⚠️  Failed uploads:')
    migrationResults.failed.forEach(({ localPath, error }) => {
      console.log(`   - ${basename(localPath)}: ${error}`)
    })
  }

  // Save migration report and URL mapping
  const reportData = {
    ...migrationResults,
    options: cliOptions
  }

  writeFileSync(reportPath, JSON.stringify(reportData, null, 2))

  if (migrationResults.successful.length > 0) {
    if (existingMappingRaw) {
      const backupPath = `${mappingPath}.backup-${Date.now()}`
      writeFileSync(backupPath, existingMappingRaw)
      console.log(`💾 Backup of previous mapping saved to: ${backupPath}`)
    }

    writeFileSync(mappingPath, JSON.stringify(migrationResults.urlMapping, null, 2))
    console.log(`🗺️  URL mapping updated with ${migrationResults.successful.length} new entries.`)
  } else {
    console.log('ℹ️  No new uploads performed; url-mapping.json left untouched.')
  }

  console.log(`\n📄 Migration report saved to: ${reportPath}`)
  console.log(`🗺️  URL mapping located at: ${mappingPath}`)

  if (migrationResults.successful.length > 0) {
    console.log('\n🔄 Next steps:')
    console.log('1. Update your product generator to use Cloudinary URLs')
    console.log('2. Test the application with new image URLs')
    console.log('3. Remove local images after confirming everything works')
  }

  return migrationResults
}

// Check if Cloudinary config is set
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary configuration not found. Please set environment variables:')
  console.error('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET')
  console.error('\n💡 You can find these in your Cloudinary dashboard: https://cloudinary.com/console')
  process.exit(1)
}

// Run migration
migrateImages().catch(error => {
  console.error('💥 Migration failed:', error)
  process.exit(1)
})
