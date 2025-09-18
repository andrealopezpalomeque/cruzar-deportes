#!/usr/bin/env node

import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
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
  const imageFiles = getAllImageFiles(imagesDir)

  console.log('🚀 Starting Cloudinary migration...')
  console.log(`📊 Found ${imageFiles.length} images to migrate`)
  console.log('⚙️  Using Cloudinary cloud:', process.env.CLOUDINARY_CLOUD_NAME)

  const migrationResults = {
    successful: [],
    failed: [],
    urlMapping: {} // Map old local paths to new Cloudinary URLs
  }

  for (let i = 0; i < imageFiles.length; i++) {
    const localPath = imageFiles[i]
    const cloudinaryFolder = getCloudinaryFolderFromLocal(localPath)
    const fileName = basename(localPath)

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
      const relativePath = localPath.replace(join(__dirname, '../public'), '')
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

  if (migrationResults.failed.length > 0) {
    console.log('\n⚠️  Failed uploads:')
    migrationResults.failed.forEach(({ localPath, error }) => {
      console.log(`   - ${basename(localPath)}: ${error}`)
    })
  }

  // Save migration report and URL mapping
  const reportPath = join(__dirname, 'cloudinary-migration-report.json')
  const mappingPath = join(__dirname, 'url-mapping.json')

  writeFileSync(reportPath, JSON.stringify(migrationResults, null, 2))
  writeFileSync(mappingPath, JSON.stringify(migrationResults.urlMapping, null, 2))

  console.log(`\n📄 Migration report saved to: ${reportPath}`)
  console.log(`🗺️  URL mapping saved to: ${mappingPath}`)

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