#!/usr/bin/env node

import sharp from 'sharp'
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function getAllImageFiles(dir, fileList = []) {
  const files = readdirSync(dir)

  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList)
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      fileList.push(filePath)
    }
  })

  return fileList
}

async function compressImage(inputPath, outputPath) {
  const ext = extname(inputPath).toLowerCase()

  try {
    if (ext === '.png') {
      await sharp(inputPath)
        .png({ quality: 80, compressionLevel: 6 })
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .toFile(outputPath)
    } else {
      await sharp(inputPath)
        .jpeg({ quality: 85, progressive: true })
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .toFile(outputPath)
    }

    return true
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error.message)
    return false
  }
}

async function compressImages() {
  const imagesDir = join(__dirname, '../public/images')
  const compressedDir = join(__dirname, '../public/images-compressed')

  if (!existsSync(compressedDir)) {
    mkdirSync(compressedDir, { recursive: true })
  }

  const imageFiles = getAllImageFiles(imagesDir)
  console.log(`Found ${imageFiles.length} images to compress`)

  let compressed = 0
  let failed = 0

  for (let i = 0; i < imageFiles.length; i++) {
    const inputPath = imageFiles[i]
    const relativePath = inputPath.replace(imagesDir, '')
    const outputPath = join(compressedDir, relativePath)

    // Create directory structure
    const outputDir = dirname(outputPath)
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    console.log(`Compressing ${i + 1}/${imageFiles.length}: ${basename(inputPath)}`)

    const success = await compressImage(inputPath, outputPath)
    if (success) {
      compressed++
    } else {
      failed++
    }
  }

  console.log('\n=== Compression Complete ===')
  console.log(`Compressed: ${compressed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Compressed images saved to: ${compressedDir}`)
}

compressImages().catch(console.error)