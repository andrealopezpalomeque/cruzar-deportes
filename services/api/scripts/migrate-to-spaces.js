require('dotenv').config({ path: require('path').join(__dirname, '../.env') })

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { S3Client } = require('@aws-sdk/client-s3')
const sharp = require('sharp')
const https = require('https')
const http = require('http')
const { randomUUID } = require('crypto')

const DRY_RUN = process.argv.includes('--dry-run')

const BUCKET = 'wiseutils-cdn'
const CDN_BASE = 'https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com'
const SPACES_PREFIX = `${CDN_BASE}/`

const s3 = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  forcePathStyle: false,
})

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const db = getFirestore()

// Download URL to buffer
function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadBuffer(res.headers.location))
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// Extract base Cloudinary key from URL (strips transforms and version)
function extractCloudinaryKey(url) {
  const uploadIdx = url.indexOf('/upload/')
  if (uploadIdx === -1) return null
  const afterUpload = url.slice(uploadIdx + '/upload/'.length)
  const segments = afterUpload.split('/')
  let keyStart = 0
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (/^[a-z]_/.test(seg) || /^v\d+$/.test(seg) || seg.includes(',')) {
      keyStart = i + 1
    } else {
      break
    }
  }
  const keyWithExt = segments.slice(keyStart).join('/')
  return keyWithExt.replace(/\.[^/.]+$/, '') // strip extension
}

// Detect variant from Cloudinary URL transforms
function detectVariant(url) {
  if (url.includes('w_400')) return 'thumbnail'
  if (url.includes('w_800')) return 'main'
  return 'original'
}

// Upload buffer to Spaces
async function uploadBuffer(buffer, key, contentType = 'image/webp') {
  if (DRY_RUN) {
    console.log(`  [DRY-RUN] Would upload: ${key}`)
    return `${CDN_BASE}/${key}`
  }
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  }))
  return `${CDN_BASE}/${key}`
}

// Migrate a single image entry (string or {original, main, thumbnail} object)
async function migrateImageEntry(entry, fallbackKey) {
  if (typeof entry === 'string') {
    if (entry.startsWith(SPACES_PREFIX)) return entry // already migrated
    const baseKey = extractCloudinaryKey(entry) || fallbackKey

    const buffer = await downloadBuffer(entry)
    const [origBuf, mainBuf, thumbBuf] = await Promise.all([
      sharp(buffer).webp({ quality: 85 }).toBuffer(),
      sharp(buffer).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
      sharp(buffer).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
    ])
    const [originalUrl, mainUrl, thumbnailUrl] = await Promise.all([
      uploadBuffer(origBuf, `${baseKey}_original.webp`),
      uploadBuffer(mainBuf, `${baseKey}_main.webp`),
      uploadBuffer(thumbBuf, `${baseKey}_thumbnail.webp`),
    ])

    return {
      url: originalUrl,
      publicId: baseKey,
      main: mainUrl,
      thumbnail: thumbnailUrl,
    }
  }

  // Object with { original, main, thumbnail } (or { url, main, thumbnail })
  const originalUrl = entry.original || entry.url
  if (!originalUrl) return entry
  if (originalUrl.startsWith(SPACES_PREFIX)) return entry // already migrated

  const baseKey = entry.publicId || extractCloudinaryKey(originalUrl) || fallbackKey

  const [origBuf, mainBuf, thumbBuf] = await Promise.all([
    downloadBuffer(originalUrl).then(b => sharp(b).webp({ quality: 85 }).toBuffer()),
    entry.main
      ? downloadBuffer(entry.main).then(b => sharp(b).webp({ quality: 85 }).toBuffer())
      : downloadBuffer(originalUrl).then(b => sharp(b).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer()),
    entry.thumbnail
      ? downloadBuffer(entry.thumbnail).then(b => sharp(b).webp({ quality: 85 }).toBuffer())
      : downloadBuffer(originalUrl).then(b => sharp(b).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer()),
  ])

  const [newOriginal, newMain, newThumb] = await Promise.all([
    uploadBuffer(origBuf, `${baseKey}_original.webp`),
    uploadBuffer(mainBuf, `${baseKey}_main.webp`),
    uploadBuffer(thumbBuf, `${baseKey}_thumbnail.webp`),
  ])

  return {
    url: newOriginal,
    publicId: baseKey,
    main: newMain,
    thumbnail: newThumb,
  }
}

async function migrateProduct(doc) {
  const data = doc.data()
  const slug = data.slug || doc.id
  const folderBase = data.cloudinaryFolderPath || `cruzar-deportes/products/${data.productType || 'misc'}/${slug}`

  const migrateArray = async (arr, label) => {
    if (!arr || arr.length === 0) return arr
    const results = []
    for (let i = 0; i < arr.length; i++) {
      const entry = arr[i]
      const fallbackKey = `${folderBase}/${randomUUID()}`
      try {
        results.push(await migrateImageEntry(entry, fallbackKey))
      } catch (err) {
        console.warn(`    ⚠ ${label}[${i}] failed: ${err.message}`)
        results.push(entry) // keep original on failure
      }
    }
    return results
  }

  const [images, selectedImages, allAvailableImages] = await Promise.all([
    migrateArray(data.images, 'images'),
    migrateArray(data.selectedImages, 'selectedImages'),
    migrateArray(data.allAvailableImages, 'allAvailableImages'),
  ])

  if (!DRY_RUN) {
    await db.collection('products').doc(doc.id).update({
      images,
      selectedImages,
      allAvailableImages,
      folderPath: folderBase,
    })
  }

  const count = (images?.length || 0) + (selectedImages?.length || 0) + (allAvailableImages?.length || 0)
  return count
}

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN — no changes will be written\n' : '🚀 LIVE RUN — writing to Spaces and Firestore\n')

  const snapshot = await db.collection('products').get()
  console.log(`Found ${snapshot.size} products\n`)

  let migrated = 0
  let failed = 0

  for (const doc of snapshot.docs) {
    const slug = doc.data().slug || doc.id
    process.stdout.write(`  Migrating: ${slug} ... `)
    try {
      const count = await migrateProduct(doc)
      console.log(`✓ (${count} image entries)`)
      migrated++
    } catch (err) {
      console.log(`✗ ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${migrated} products migrated, ${failed} failed.`)
  if (failed > 0) {
    console.log('Re-run the script to retry failed products (already-migrated URLs are skipped).')
  }
}

main().catch(err => { console.error(err); process.exit(1) })
