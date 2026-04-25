# Cloudinary → DigitalOcean Spaces Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Cloudinary image storage with DigitalOcean Spaces across the Cruzar Deportes API and both frontends, including migrating all existing product images.

**Architecture:** The API generates 3 image variants (original, main 800px, thumbnail 400px) using Sharp, uploads all 3 to DO Spaces via the S3-compatible SDK, and returns the same `{ url, publicId, thumbnail, main }` response shape the frontends already expect. A one-time migration script moves existing Cloudinary images to Spaces and updates Firestore.

**Tech Stack:** Node.js, `@aws-sdk/client-s3`, `sharp`, Firebase Admin SDK (migration script), Nuxt 4 (frontends)

---

## File Map

### Created
- `services/api/src/config/spaces.js` — S3 client + bucket constants
- `services/api/scripts/migrate-to-spaces.js` — one-time migration script
- `apps/back-office/composables/useUpload.js` — replaces useCloudinary.js

### Modified
- `services/api/src/controllers/uploadController.js` — full rewrite (Sharp + S3)
- `services/api/src/controllers/productController.js` — swap Cloudinary delete for Spaces delete
- `services/api/.env` — add DO_SPACES_KEY, DO_SPACES_SECRET; remove CLOUDINARY_* vars
- `services/api/package.json` — add sharp + @aws-sdk/client-s3; remove cloudinary
- `apps/back-office/composables/useSharedProducts.js` — remove getFolderImages call
- `apps/back-office/components/products/ProductCreateModal.vue` — useCloudinary → useUpload, cloudinaryFolderPath → folderPath
- `apps/back-office/pages/products/manage.vue` — useCloudinary → useUpload, cloudinaryFolderPath → folderPath, remove getFolderImages
- `apps/home/utils/imageHelpers.ts` — remove applyCloudinaryOptimizations

### Deleted
- `services/api/src/config/cloudinary.js`
- `apps/back-office/composables/useCloudinary.js`
- `apps/home/composables/useCloudinaryUrl.ts`

---

## Task 1: Install new dependencies, remove old ones

**Files:**
- Modify: `services/api/package.json`

- [ ] **Step 1: Install new packages and remove Cloudinary**

```bash
cd services/api
npm install sharp @aws-sdk/client-s3
npm uninstall cloudinary
```

- [ ] **Step 2: Verify package.json reflects the changes**

```bash
grep -E "sharp|aws-sdk|cloudinary" package.json
```

Expected output: `sharp` and `@aws-sdk/client-s3` present; `cloudinary` absent.

- [ ] **Step 3: Commit**

```bash
git add services/api/package.json services/api/package-lock.json
git commit -m "chore(api): replace cloudinary with sharp and @aws-sdk/client-s3"
```

---

## Task 2: Create spaces.js config

**Files:**
- Create: `services/api/src/config/spaces.js`
- Delete: `services/api/src/config/cloudinary.js`

- [ ] **Step 1: Create spaces.js**

Create `services/api/src/config/spaces.js`:

```js
const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  forcePathStyle: false,
})

const BUCKET = 'wiseutils-cdn'
const CDN_BASE = 'https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com'

module.exports = { s3, BUCKET, CDN_BASE }
```

- [ ] **Step 2: Delete cloudinary.js**

```bash
rm services/api/src/config/cloudinary.js
```

- [ ] **Step 3: Commit**

```bash
git add services/api/src/config/spaces.js services/api/src/config/cloudinary.js
git commit -m "feat(api): add DO Spaces config, remove Cloudinary config"
```

---

## Task 3: Rewrite uploadController.js

**Files:**
- Modify: `services/api/src/controllers/uploadController.js`

- [ ] **Step 1: Rewrite the full controller**

Replace the entire contents of `services/api/src/controllers/uploadController.js` with:

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add services/api/src/controllers/uploadController.js
git commit -m "feat(api): rewrite uploadController to use Sharp + DO Spaces"
```

---

## Task 4: Update productController.js (remove Cloudinary, add Spaces cleanup)

**Files:**
- Modify: `services/api/src/controllers/productController.js`

- [ ] **Step 1: Replace the Cloudinary import with Spaces**

At line 2, change:
```js
const cloudinary = require('../config/cloudinary');
```
to:
```js
const { DeleteObjectsCommand } = require('@aws-sdk/client-s3')
const { s3, BUCKET, CDN_BASE } = require('../config/spaces')
```

- [ ] **Step 2: Replace the Cloudinary delete block in deleteProduct**

Find this block (around line 229–238):
```js
for (const image of images) {
  const publicId = typeof image === 'string' ? null : image.publicId;
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error(`Failed to delete Cloudinary image ${publicId}:`, err.message);
    }
  }
}
```

Replace with:
```js
const keysToDelete = []
for (const image of images) {
  const publicId = typeof image === 'string' ? null : image.publicId
  if (publicId) {
    keysToDelete.push(
      { Key: `${publicId}_original.webp` },
      { Key: `${publicId}_main.webp` },
      { Key: `${publicId}_thumbnail.webp` },
    )
  }
}
if (keysToDelete.length > 0) {
  try {
    await s3.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: keysToDelete } }))
  } catch (err) {
    console.error('Failed to delete Spaces images:', err.message)
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add services/api/src/controllers/productController.js
git commit -m "feat(api): replace Cloudinary image cleanup with Spaces on product delete"
```

---

## Task 5: Add env vars locally and on the droplet

**Files:**
- Modify: `services/api/.env`

- [ ] **Step 1: Update local .env**

In `services/api/.env`, add after the existing vars and remove the Cloudinary block:
```
DO_SPACES_KEY=<REDACTED — pull from secret vault>
DO_SPACES_SECRET=<REDACTED — pull from secret vault>
```

Remove these lines:
```
CLOUDINARY_CLOUD_NAME=<REDACTED>
CLOUDINARY_API_KEY=<REDACTED>
CLOUDINARY_API_SECRET=<REDACTED>
```

- [ ] **Step 2: Update .env on the droplet**

```bash
ssh root@<DROPLET_IP> "sed -i '/CLOUDINARY/d' /var/www/cruzar-deportes/services/api/.env && echo 'DO_SPACES_KEY=<REDACTED>' >> /var/www/cruzar-deportes/services/api/.env && echo 'DO_SPACES_SECRET=<REDACTED>' >> /var/www/cruzar-deportes/services/api/.env"
```

- [ ] **Step 3: Commit the local .env.example update**

Update `services/api/.env.example` — replace Cloudinary vars with Spaces vars:
```
DO_SPACES_KEY=your-do-spaces-key
DO_SPACES_SECRET=your-do-spaces-secret
```

```bash
git add services/api/.env.example
git commit -m "chore(api): update .env.example for DO Spaces"
```

---

## Task 6: Deploy API changes to droplet and restart PM2

- [ ] **Step 1: Pull latest code on droplet**

```bash
ssh root@<DROPLET_IP> "cd /var/www/cruzar-deportes && git pull origin main"
```

- [ ] **Step 2: Install new dependencies on droplet**

```bash
ssh root@<DROPLET_IP> "cd /var/www/cruzar-deportes/services/api && npm install"
```

- [ ] **Step 3: Restart cruzar-api via PM2**

```bash
ssh root@<DROPLET_IP> "pm2 restart cruzar-api && pm2 logs cruzar-api --lines 20 --nostream"
```

Expected: no error lines, process shows `online`.

- [ ] **Step 4: Test health endpoint**

```bash
curl -s https://api.cruzardeportes.com/api/health
```

Expected: `{"status":"ok","timestamp":"..."}`.

---

## Task 7: Test upload endpoint with curl

- [ ] **Step 1: Download a test image**

```bash
curl -o /tmp/test-jersey.jpg https://via.placeholder.com/1200x1200.jpg
```

- [ ] **Step 2: Upload it to the API**

```bash
curl -s -X POST \
  -H "x-api-key: <REDACTED — pull from secret vault>" \
  -F "image=@/tmp/test-jersey.jpg" \
  "https://api.cruzardeportes.com/api/upload?folder=cruzar-deportes/products/test" | jq .
```

Expected response shape:
```json
{
  "success": true,
  "data": {
    "url": "https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com/cruzar-deportes/products/test/UUID_original.webp",
    "publicId": "cruzar-deportes/products/test/UUID",
    "thumbnail": "https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com/cruzar-deportes/products/test/UUID_thumbnail.webp",
    "main": "https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com/cruzar-deportes/products/test/UUID_main.webp"
  }
}
```

- [ ] **Step 3: Verify the image is accessible via CDN**

Copy the `url` from the response and open it in a browser, or:

```bash
curl -I "PASTE_URL_HERE"
```

Expected: `HTTP/2 200` with `Content-Type: image/webp`.

- [ ] **Step 4: Test delete endpoint**

Copy the `publicId` from the upload response and run:

```bash
curl -s -X DELETE \
  -H "x-api-key: <REDACTED — pull from secret vault>" \
  "https://api.cruzardeportes.com/api/upload/PASTE_PUBLIC_ID_HERE" | jq .
```

Expected: `{"success":true,"message":"Image deleted successfully"}`.

---

## Task 8: Write migration script

**Files:**
- Create: `services/api/scripts/migrate-to-spaces.js`

- [ ] **Step 1: Create the scripts directory and migration file**

```bash
mkdir -p services/api/scripts
```

Create `services/api/scripts/migrate-to-spaces.js`:

```js
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

// Migrate a single Cloudinary URL — returns new Spaces URL for the same variant
async function migrateUrl(cloudinaryUrl, baseKey) {
  const variant = detectVariant(cloudinaryUrl)
  const spacesKey = `${baseKey}_${variant}.webp`

  const buffer = await downloadBuffer(cloudinaryUrl)
  const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer()
  return uploadBuffer(webpBuffer, spacesKey)
}

// Migrate a single image entry (string or {original, main, thumbnail} object)
// Returns the migrated entry in the same shape, with publicId added.
async function migrateImageEntry(entry, fallbackKey) {
  if (typeof entry === 'string') {
    if (entry.startsWith(SPACES_PREFIX)) return entry // already migrated
    const baseKey = extractCloudinaryKey(entry) || fallbackKey
    const newUrl = await migrateUrl(entry, baseKey)

    // For string URLs, also generate the other two variants
    const buffer = await downloadBuffer(entry)
    const [mainBuf, thumbBuf] = await Promise.all([
      sharp(buffer).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
      sharp(buffer).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
    ])
    await Promise.all([
      uploadBuffer(mainBuf, `${baseKey}_main.webp`),
      uploadBuffer(thumbBuf, `${baseKey}_thumbnail.webp`),
    ])

    return {
      url: `${CDN_BASE}/${baseKey}_original.webp`,
      publicId: baseKey,
      main: `${CDN_BASE}/${baseKey}_main.webp`,
      thumbnail: `${CDN_BASE}/${baseKey}_thumbnail.webp`,
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

  const [originalUrl2, mainUrl, thumbnailUrl] = await Promise.all([
    uploadBuffer(origBuf, `${baseKey}_original.webp`),
    uploadBuffer(mainBuf, `${baseKey}_main.webp`),
    uploadBuffer(thumbBuf, `${baseKey}_thumbnail.webp`),
  ])

  return {
    url: originalUrl2,
    publicId: baseKey,
    main: mainUrl,
    thumbnail: thumbnailUrl,
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
```

- [ ] **Step 2: Commit**

```bash
git add services/api/scripts/migrate-to-spaces.js
git commit -m "feat(api): add Cloudinary → Spaces migration script"
```

---

## Task 9: Run the migration

- [ ] **Step 1: Push and pull to droplet**

```bash
git push origin main
ssh root@<DROPLET_IP> "cd /var/www/cruzar-deportes && git pull origin main"
```

- [ ] **Step 2: Run dry-run on droplet**

```bash
ssh root@<DROPLET_IP> "cd /var/www/cruzar-deportes/services/api && node scripts/migrate-to-spaces.js --dry-run"
```

Expected: lists all products with `[DRY-RUN] Would upload:` lines. No errors.

- [ ] **Step 3: Run live migration**

```bash
ssh root@<DROPLET_IP> "cd /var/www/cruzar-deportes/services/api && node scripts/migrate-to-spaces.js"
```

Expected: `✓` for every product, `0 failed`.

- [ ] **Step 4: Spot-check a migrated image URL in the browser**

From the script output, copy one of the CDN URLs and open it:
```
https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com/cruzar-deportes/products/.../..._main.webp
```

Expected: the jersey image loads in the browser.

---

## Task 10: Update back-office useCloudinary → useUpload

**Files:**
- Create: `apps/back-office/composables/useUpload.js`
- Delete: `apps/back-office/composables/useCloudinary.js`

- [ ] **Step 1: Create useUpload.js**

Create `apps/back-office/composables/useUpload.js`:

```js
export const useUpload = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  const getAuthHeaders = () => {
    const headers = {}
    if (config.public.apiKey) {
      headers['x-api-key'] = config.public.apiKey
    }
    return headers
  }

  const compressImage = (file, { maxSize = 1920, quality = 0.8 } = {}) => {
    if (file.size <= 2 * 1024 * 1024) return Promise.resolve(file)

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression failed'))
            const name = file.name.replace(/\.\w+$/, '.jpg')
            resolve(new File([blob], name, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadImage = async (file, folder = 'cruzar-deportes/products') => {
    const formData = new FormData()
    formData.append('image', file)

    const url = `${apiUrl}/api/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`

    const response = await $fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    })

    if (response.success && response.data) {
      return {
        original: response.data.url,
        main: response.data.main || response.data.url,
        thumbnail: response.data.thumbnail || response.data.url,
        publicId: response.data.publicId,
      }
    }
    throw new Error(response.error || 'Upload failed')
  }

  const uploadMultipleImages = async (files, folder = 'cruzar-deportes/products') => {
    const formData = new FormData()
    for (const file of files) {
      formData.append('images', file)
    }

    const url = `${apiUrl}/api/upload/multiple${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`

    const response = await $fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    })

    if (response.success && response.data) {
      return response.data.map(img => ({
        original: img.url,
        main: img.main || img.url,
        thumbnail: img.thumbnail || img.url,
        publicId: img.publicId,
      }))
    }
    throw new Error(response.error || 'Upload failed')
  }

  const deleteImage = async (publicId) => {
    try {
      const response = await $fetch(`${apiUrl}/api/upload/${publicId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      return response.success === true
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  return { compressImage, uploadImage, uploadMultipleImages, deleteImage }
}
```

- [ ] **Step 2: Delete useCloudinary.js**

```bash
rm apps/back-office/composables/useCloudinary.js
```

- [ ] **Step 3: Commit**

```bash
git add apps/back-office/composables/useUpload.js apps/back-office/composables/useCloudinary.js
git commit -m "feat(back-office): replace useCloudinary with useUpload composable"
```

---

## Task 11: Update useSharedProducts.js

**Files:**
- Modify: `apps/back-office/composables/useSharedProducts.js`

- [ ] **Step 1: Remove the getFolderImages fallback block**

Find and remove this block (around lines 49–66):

```js
// If product doesn't have allAvailableImages populated, try to load them from Cloudinary
if (!product.allAvailableImages || product.allAvailableImages.length === 0) {
  try {
    const { getFolderImages } = useCloudinary()
    const folderPath = product.cloudinaryFolderPath
    if (folderPath) {
      const images = await getFolderImages(folderPath)
      product.allAvailableImages = images.map(img => img.secure_url)

      // If selectedImages is empty, use first 5 images as default selection
      if (!product.selectedImages || product.selectedImages.length === 0) {
        product.selectedImages = product.allAvailableImages.slice(0, 5)
      }
    }
  } catch (err) {
    console.warn(`Failed to load images for product ${product.id}:`, err)
  }
}
```

Replace with nothing — the `await Promise.all(response.data.map(async (product) => {` wrapper will still work, just return the product directly:

```js
// allAvailableImages is now always populated from Firestore after migration
return product
```

Also remove the `useCloudinary` import if it exists at the top of the file.

- [ ] **Step 2: Commit**

```bash
git add apps/back-office/composables/useSharedProducts.js
git commit -m "feat(back-office): remove Cloudinary folder listing from useSharedProducts"
```

---

## Task 12: Update ProductCreateModal.vue

**Files:**
- Modify: `apps/back-office/components/products/ProductCreateModal.vue`

- [ ] **Step 1: Update the composable import at line 467**

Change:
```js
const { compressImage, uploadImage } = useCloudinary()
```
to:
```js
const { compressImage, uploadImage } = useUpload()
```

- [ ] **Step 2: Rename cloudinaryFolderPath in the form payload at line 785**

Change:
```js
cloudinaryFolderPath: generatedFolderPath.value,
```
to:
```js
folderPath: generatedFolderPath.value,
```

- [ ] **Step 3: Commit**

```bash
git add apps/back-office/components/products/ProductCreateModal.vue
git commit -m "feat(back-office): update ProductCreateModal to use useUpload"
```

---

## Task 13: Update manage.vue

**Files:**
- Modify: `apps/back-office/pages/products/manage.vue`

- [ ] **Step 1: Update the composable import at line 1075**

Change:
```js
const { compressImage, getFolderImages, uploadImage, deleteImage: deleteCloudinaryImage } = useCloudinary()
```
to:
```js
const { compressImage, uploadImage, deleteImage: deleteCloudinaryImage } = useUpload()
```

- [ ] **Step 2: Replace all cloudinaryFolderPath references with folderPath**

Run this to find all occurrences:
```bash
grep -n "cloudinaryFolderPath" apps/back-office/pages/products/manage.vue
```

Replace each occurrence of `cloudinaryFolderPath` with `folderPath` in the file. There are approximately 6 occurrences (lines 1256, 1257, 1325, 1882, 2013, 2027, 2038).

- [ ] **Step 3: Remove the getFolderImages block in openImageBrowser (around lines 1882–1894)**

Find:
```js
if (product.cloudinaryFolderPath) {
  try {
    const assets = await getFolderImages(product.cloudinaryFolderPath)
    resolvedImages = assets.map(asset => asset.secure_url)
  } catch (cloudError) {
    console.warn(`No se pudo leer la carpeta ${product.cloudinaryFolderPath}:`, cloudError)
  }
}
```

Replace with:
```js
// Images are stored in allAvailableImages after Spaces migration
```

The existing fallback logic below (`resolvedImages = product.images || product.selectedImages || []`) already handles this.

- [ ] **Step 4: Commit**

```bash
git add apps/back-office/pages/products/manage.vue
git commit -m "feat(back-office): update manage.vue to use useUpload, remove Cloudinary folder listing"
```

---

## Task 14: Update storefront imageHelpers.ts

**Files:**
- Modify: `apps/home/utils/imageHelpers.ts`
- Delete: `apps/home/composables/useCloudinaryUrl.ts`

- [ ] **Step 1: Remove applyCloudinaryOptimizations from imageHelpers.ts**

Replace the entire file with:

```ts
import type { ProductImage } from '~/types'

export function getImageUrl(
  image: ProductImage | string | undefined,
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string {
  if (!image) return ''
  return typeof image === 'string' ? image : (image[variant] || image.main || image.original || '')
}

export function getImageUrls(
  images: (ProductImage | string)[],
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string[] {
  return images.map(img => getImageUrl(img, variant)).filter(Boolean)
}

export function getFirstImageUrl(
  images: (ProductImage | string)[] | undefined,
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string {
  if (!images || images.length === 0) return ''
  return getImageUrl(images[0], variant)
}
```

- [ ] **Step 2: Delete useCloudinaryUrl.ts**

```bash
rm apps/home/composables/useCloudinaryUrl.ts
```

- [ ] **Step 3: Verify no remaining references to useCloudinaryUrl in the storefront**

```bash
grep -r "useCloudinaryUrl\|applyCloudinaryOptimizations\|res.cloudinary.com" apps/home/ --include="*.ts" --include="*.vue" --include="*.js"
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add apps/home/utils/imageHelpers.ts apps/home/composables/useCloudinaryUrl.ts
git commit -m "feat(home): remove Cloudinary URL optimizations, clean up imageHelpers"
```

---

## Task 15: Rebuild and redeploy both frontends

- [ ] **Step 1: Build the storefront**

```bash
cd apps/home && npm run build
```

Expected: `✨ Build complete!` with no errors.

- [ ] **Step 2: Build the back-office**

```bash
cd apps/back-office && npm run build
```

Expected: `✨ Build complete!` with no errors.

- [ ] **Step 3: Deploy both to Firebase**

```bash
cd ../.. && npm run deploy:storefront && npm run deploy:admin
```

Expected: `✔ Deploy complete!` for both.

---

## Task 16: Final verification

- [ ] **Step 1: Check storefront product images load**

Open `https://cruzardeportes.com/products` in a browser.

Expected: product cards show images. Open DevTools → Network → filter by `.webp` → all image requests should resolve to `wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com`.

- [ ] **Step 2: Check back-office still uploads**

Log into the back-office admin panel. Open any product → edit → upload a new image.

Expected: image uploads successfully, preview shows with a `wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com` URL.

- [ ] **Step 3: Verify no Cloudinary traffic**

In DevTools Network tab on the storefront, confirm zero requests to `res.cloudinary.com`.

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "chore: Cloudinary → DO Spaces migration complete"
```
