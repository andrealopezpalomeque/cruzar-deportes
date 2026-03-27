const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const IMAGES_DIR = path.join(__dirname, '../apps/home/public/images')

const webpFiles = [
  'football-team-1.webp',
  'football-team-2.webp',
  'stadium-crowd.webp',
  'stadium-field.webp'
]

const pngFiles = [
  'cruzar-logo-no-bg.png',
  'cruzar-logo-short-1.png'
]

async function compressImages() {
  for (const file of webpFiles) {
    const filePath = path.join(IMAGES_DIR, file)
    const originalSize = fs.statSync(filePath).size
    const buffer = await sharp(filePath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
    fs.writeFileSync(filePath, buffer)
    const newSize = fs.statSync(filePath).size
    console.log(`${file}: ${(originalSize / 1024 / 1024).toFixed(1)}MB -> ${(newSize / 1024).toFixed(0)}KB`)
  }

  for (const file of pngFiles) {
    const filePath = path.join(IMAGES_DIR, file)
    const originalSize = fs.statSync(filePath).size
    const buffer = await sharp(filePath)
      .resize({ width: 800, withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer()
    fs.writeFileSync(filePath, buffer)
    const newSize = fs.statSync(filePath).size
    console.log(`${file}: ${(originalSize / 1024 / 1024).toFixed(1)}MB -> ${(newSize / 1024).toFixed(0)}KB`)
  }

  console.log('Done!')
}

compressImages().catch(console.error)
