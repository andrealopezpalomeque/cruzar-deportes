const sharp = require('sharp')
const { PutObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3')
const { randomUUID } = require('crypto')
const { s3, BUCKET, CDN_BASE } = require('../config/spaces')

const DEFAULT_FOLDER = 'cruzar-deportes/products'

// Generate 3 variants from a buffer using Sharp
async function generateVariants(buffer) {
  const [originalBuf, mainBuf, thumbBuf] = await Promise.all([
    sharp(buffer).webp({ quality: 85 }).toBuffer(),
    sharp(buffer).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
    sharp(buffer).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
  ])
  return { originalBuf, mainBuf, thumbBuf }
}

// Upload a single buffer to Spaces
async function uploadBuffer(buffer, key) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'image/webp',
    ACL: 'public-read',
  }))
  return `${CDN_BASE}/${key}`
}

// Upload buffer → 3 variants → Spaces. Returns response data object.
async function uploadToSpaces(buffer, folder) {
  const { originalBuf, mainBuf, thumbBuf } = await generateVariants(buffer)
  const key = `${folder}/${randomUUID()}`

  const [originalUrl, mainUrl, thumbnailUrl] = await Promise.all([
    uploadBuffer(originalBuf, `${key}_original.webp`),
    uploadBuffer(mainBuf, `${key}_main.webp`),
    uploadBuffer(thumbBuf, `${key}_thumbnail.webp`),
  ])

  return {
    url: originalUrl,
    publicId: key,
    thumbnail: thumbnailUrl,
    main: mainUrl,
  }
}

// POST /api/upload — single image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' })
    }

    const folder = req.query.folder || DEFAULT_FOLDER
    const data = await uploadToSpaces(req.file.buffer, folder)

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ success: false, error: 'Failed to upload image', message: error.message })
  }
}

// POST /api/upload/multiple — up to 10 images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No image files provided' })
    }

    const folder = req.query.folder || DEFAULT_FOLDER
    const images = await Promise.all(
      req.files.map(file => uploadToSpaces(file.buffer, folder))
    )

    res.json({ success: true, data: images })
  } catch (error) {
    console.error('Error uploading images:', error)
    res.status(500).json({ success: false, error: 'Failed to upload images', message: error.message })
  }
}

// DELETE /api/upload/:publicId — deletes all 3 variants
const deleteImage = async (req, res) => {
  try {
    const publicId = req.params[0]

    if (!publicId) {
      return res.status(400).json({ success: false, error: 'Public ID is required' })
    }

    await s3.send(new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: [
          { Key: `${publicId}_original.webp` },
          { Key: `${publicId}_main.webp` },
          { Key: `${publicId}_thumbnail.webp` },
        ],
      },
    }))

    res.json({ success: true, message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(500).json({ success: false, error: 'Failed to delete image', message: error.message })
  }
}

module.exports = { uploadImage, uploadMultipleImages, deleteImage }
