# Cloudinary Cost Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate on-demand Cloudinary transformations by pre-generating 2 image sizes at upload time, migrating existing data, and simplifying the storefront image pipeline.

**Architecture:** Upload flow generates thumbnail (400px) and main (800px) variants via Cloudinary eager transforms. Firestore stores `{original, main, thumbnail}` objects instead of raw URL strings. Storefront uses pre-generated URLs directly instead of building transform URLs on-the-fly.

**Tech Stack:** Node.js, Cloudinary SDK, Firebase Admin SDK, Nuxt 3, Vue 3, sharp (for static image compression)

---

### Task 1: Compress Static Images

These large static images hurt page load time regardless of Cloudinary. Compress them first as a standalone quick win.

**Files:**
- Modify: `apps/home/public/images/football-team-1.webp`
- Modify: `apps/home/public/images/football-team-2.webp`
- Modify: `apps/home/public/images/stadium-crowd.webp`
- Modify: `apps/home/public/images/stadium-field.webp`
- Modify: `apps/home/public/images/cruzar-logo-no-bg.png`
- Modify: `apps/home/public/images/cruzar-logo-short-1.png`

- [ ] **Step 1: Install sharp as a dev dependency at the monorepo root**

```bash
npm install --save-dev sharp
```

- [ ] **Step 2: Create a compression script**

Create file `scripts/compress-static-images.js`:

```js
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
```

- [ ] **Step 3: Run the compression script**

```bash
node scripts/compress-static-images.js
```

Expected: Each file prints its before/after size. WebP files should drop to ~200-400KB, PNGs to ~50-150KB.

- [ ] **Step 4: Verify images still look correct**

Open the images in a viewer to confirm visual quality is acceptable.

- [ ] **Step 5: Commit**

```bash
git add apps/home/public/images/ scripts/compress-static-images.js package.json package-lock.json
git commit -m "perf: compress static images from 13MB to ~2MB"
```

---

### Task 2: Update Image Type Definitions

Define the new image object shape in both home and back-office type files.

**Files:**
- Modify: `apps/home/types/index.ts`
- Modify: `apps/back-office/types/index.ts`

- [ ] **Step 1: Add ProductImage interface and update Product in home types**

In `apps/home/types/index.ts`, add the `ProductImage` interface and update the `Product.images` field:

```ts
export interface ProductImage {
  original: string
  main: string
  thumbnail: string
}
```

Update the `Product` interface's `images` field from:
```ts
images: string[]
```
to:
```ts
images: (ProductImage | string)[]
```

The union type `(ProductImage | string)[]` allows backward compatibility during migration — components can handle both old string URLs and new image objects.

- [ ] **Step 2: Add ProductImage interface and update Product in back-office types**

In `apps/back-office/types/index.ts`, add the same `ProductImage` interface:

```ts
export interface ProductImage {
  original: string
  main: string
  thumbnail: string
}
```

Update the `Product` interface's `images` field from:
```ts
images: string[]
```
to:
```ts
images: (ProductImage | string)[]
```

Also update `BackofficeProduct` — its `selectedImages` field stays as `string[]` since selected/available images in the back-office still reference raw Cloudinary URLs for the image browser.

- [ ] **Step 3: Commit**

```bash
git add apps/home/types/index.ts apps/back-office/types/index.ts
git commit -m "feat: add ProductImage type for pre-generated image variants"
```

---

### Task 3: Add Image Helper Utility

Create a small utility that extracts the correct URL from both old `string` and new `ProductImage` formats. This is used by every consumer.

**Files:**
- Create: `apps/home/utils/imageHelpers.ts`

- [ ] **Step 1: Create the image helper utility**

Create `apps/home/utils/imageHelpers.ts`:

```ts
import type { ProductImage } from '~/types'

/**
 * Extract the display URL from a product image entry.
 * Handles both legacy string URLs and new {original, main, thumbnail} objects.
 */
export function getImageUrl(
  image: ProductImage | string | undefined,
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string {
  if (!image) return ''
  if (typeof image === 'string') return image
  return image[variant] || image.main || image.original || ''
}

/**
 * Extract display URLs from a product images array.
 * Returns an array of URL strings for the given variant.
 */
export function getImageUrls(
  images: (ProductImage | string)[],
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string[] {
  return images.map(img => getImageUrl(img, variant)).filter(Boolean)
}

/**
 * Get the first image URL from a product's images array.
 */
export function getFirstImageUrl(
  images: (ProductImage | string)[] | undefined,
  variant: 'main' | 'thumbnail' | 'original' = 'main'
): string {
  if (!images || images.length === 0) return ''
  return getImageUrl(images[0], variant)
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/home/utils/imageHelpers.ts
git commit -m "feat: add image helper utilities for ProductImage format"
```

---

### Task 4: Update Upload Controller with Eager Transforms

Modify the API upload endpoint to pre-generate thumbnail and main variants using Cloudinary's `eager` option.

**Files:**
- Modify: `services/api/src/controllers/uploadController.js`

- [ ] **Step 1: Update uploadToCloudinary to include eager transforms**

In `services/api/src/controllers/uploadController.js`, replace the `uploadToCloudinary` function (lines 7-27):

```js
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || DEFAULT_FOLDER,
      resource_type: 'image',
      allowed_formats: ALLOWED_FORMATS,
      transformation: [{ quality: 'auto' }],
      eager: [
        { width: 400, crop: 'limit', quality: 'auto', format: 'auto' },
        { width: 800, crop: 'limit', quality: 'auto', format: 'auto' }
      ],
      eager_async: false,
      ...options
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};
```

- [ ] **Step 2: Update uploadImage response to include variant URLs**

Replace the `uploadImage` function (lines 30-54):

```js
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const folder = req.query.folder || DEFAULT_FOLDER;
    const result = await uploadToCloudinary(req.file.buffer, { folder });

    const thumbnailUrl = result.eager && result.eager[0] ? result.eager[0].secure_url : result.secure_url;
    const mainUrl = result.eager && result.eager[1] ? result.eager[1].secure_url : result.secure_url;

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        thumbnail: thumbnailUrl,
        main: mainUrl
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      message: error.message
    });
  }
};
```

- [ ] **Step 3: Update uploadMultipleImages response to include variant URLs**

Replace the `uploadMultipleImages` function (lines 57-87):

```js
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No image files provided' });
    }

    const folder = req.query.folder || DEFAULT_FOLDER;
    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, { folder })
    );

    const results = await Promise.all(uploadPromises);

    const images = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      thumbnail: result.eager && result.eager[0] ? result.eager[0].secure_url : result.secure_url,
      main: result.eager && result.eager[1] ? result.eager[1].secure_url : result.secure_url
    }));

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload images',
      message: error.message
    });
  }
};
```

- [ ] **Step 4: Commit**

```bash
git add services/api/src/controllers/uploadController.js
git commit -m "feat: add eager transforms to Cloudinary uploads for pre-generated variants"
```

---

### Task 5: Simplify OptimizedImage Component

Replace the complex `<picture>` element with a simple `<img>` that uses pre-generated URLs.

**Files:**
- Modify: `apps/home/components/OptimizedImage.vue`

- [ ] **Step 1: Rewrite OptimizedImage.vue**

Replace the entire file content with:

```vue
<template>
  <div :class="['optimized-image', 'block', wrapperClass]">
    <img
      :src="resolvedSrc"
      :alt="alt"
      :class="imgClass"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  imgClass: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  },
  loading: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  decoding: {
    type: String,
    default: 'async',
    validator: (value) => ['async', 'sync', 'auto'].includes(value)
  },
  fetchpriority: {
    type: String,
    default: 'auto',
    validator: (value) => ['high', 'low', 'auto'].includes(value)
  },
  wrapperClass: {
    type: [String, Array, Object],
    default: ''
  }
})

const emit = defineEmits(['load', 'error'])

const resolvedSrc = computed(() => props.src || '')

function handleLoad(event) {
  emit('load', event)
}

function handleError(event) {
  console.warn('OptimizedImage: Failed to load image:', props.src)
  emit('error', event)
  const img = event.target
  if (img && !img.src.includes('/images/cruzar-logo-1.png')) {
    img.src = '/images/cruzar-logo-1.png'
  }
}
</script>
```

This removes all Cloudinary-specific logic. The component is now a thin wrapper around `<img>` with error handling. The caller is responsible for passing the correct pre-generated URL.

- [ ] **Step 2: Commit**

```bash
git add apps/home/components/OptimizedImage.vue
git commit -m "refactor: simplify OptimizedImage to use pre-generated URLs"
```

---

### Task 6: Update Storefront Consumers

Update components that pass images to `OptimizedImage` to use the new `getImageUrl`/`getImageUrls` helpers.

**Files:**
- Modify: `apps/home/components/ProductCard.vue`
- Modify: `apps/home/components/ImageGallery.vue`
- Modify: `apps/home/pages/products/[slug].vue`

- [ ] **Step 1: Update ProductCard.vue**

In `apps/home/components/ProductCard.vue`, add the import after the existing imports (after line 108):

```js
import { getFirstImageUrl } from '~/utils/imageHelpers'
```

Replace the `OptimizedImage` usage (line 15) from:
```vue
:src="product.images[0]"
```
to:
```vue
:src="getFirstImageUrl(product.images, 'thumbnail')"
```

Also update the images length check on line 13 from:
```vue
v-if="product.images?.length > 0"
```
to:
```vue
v-if="product.images?.length"
```

Remove the now-unused `type="productCard"` prop from the OptimizedImage on line 18 (the `type` prop no longer exists).

The full OptimizedImage block should become:
```vue
<OptimizedImage
  v-if="product.images?.length"
  wrapper-class="aspect-content block"
  :src="getFirstImageUrl(product.images, 'thumbnail')"
  :alt="product.name"
  loading="lazy"
  fetchpriority="auto"
  img-class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
/>
```

- [ ] **Step 2: Update ImageGallery.vue**

In `apps/home/components/ImageGallery.vue`, add the import after the existing icon imports (after line 121):

```js
import { getImageUrl, getImageUrls } from '~/utils/imageHelpers'
```

Add a computed property for resolved image URLs after the `currentIndex` ref (after line 126):

```js
// Resolve image URLs from ProductImage objects or strings
const resolvedImages = computed(() => getImageUrls(props.images, 'main'))
const resolvedThumbnails = computed(() => getImageUrls(props.images, 'thumbnail'))
```

Update `currentImage` computed (line 132) from:
```js
const currentImage = computed(() => props.images[currentIndex.value])
```
to:
```js
const currentImage = computed(() => resolvedImages.value[currentIndex.value])
```

Update the main `OptimizedImage` (line 22) — remove `type="gallery"`, the `:src` already uses `currentImage` which is now resolved.

Update the thumbnail `OptimizedImage` in the v-for loop. Change the `v-for` (line 95) from:
```vue
v-for="(image, index) in images"
```
to:
```vue
v-for="(thumbnailUrl, index) in resolvedThumbnails"
```

And update the thumbnail OptimizedImage `:src` (line 106) from:
```vue
:src="image"
```
to:
```vue
:src="thumbnailUrl"
```

Remove the `type="thumbnail"` prop from the thumbnail OptimizedImage (line 108).

Update `showThumbnailNav` (line 134) — replace `props.images.length` with `resolvedImages.value.length`.

Update `images.length` references in the template (lines 41, 49, 59, 66) — these all check `images.length`. Change them to use `resolvedImages.value.length`. Specifically:

- Line 41: `v-if="images.length > 1 && currentIndex > 0"` -> `v-if="resolvedImages.length > 1 && currentIndex > 0"`
- Line 49: `v-if="images.length > 1 && currentIndex < images.length - 1"` -> `v-if="resolvedImages.length > 1 && currentIndex < resolvedImages.length - 1"`
- Line 59: `v-if="images.length > 1"` -> `v-if="resolvedImages.length > 1"`
- Line 66: `v-if="images.length > 1"` -> `v-if="resolvedImages.length > 1"`

Template counter (line 61): `{{ currentIndex + 1 }} / {{ images.length }}` -> `{{ currentIndex + 1 }} / {{ resolvedImages.length }}`

In `setCurrentImage` (line 146): `props.images.length` -> `resolvedImages.value.length`
In `nextImage` (line 153): `props.images.length` -> `resolvedImages.value.length`
In watch on `props.images` (line 225): `newImages.length` stays fine since it checks the raw array.

- [ ] **Step 3: Update product detail page [slug].vue**

In `apps/home/pages/products/[slug].vue`, add the import after the existing imports (after line 64):

```js
import { getImageUrls, getFirstImageUrl } from '~/utils/imageHelpers'
```

Update `loadProductImages` function (lines 90-98) from:
```js
function loadProductImages() {
  if (!product.value) {
    productImages.value = []
    return
  }

  const images = Array.isArray(product.value.images) ? product.value.images.filter(Boolean) : []
  productImages.value = images.length > 0 ? images : ['/images/cruzar-logo-1.png']
}
```
to:
```js
function loadProductImages() {
  if (!product.value) {
    productImages.value = []
    return
  }

  const images = Array.isArray(product.value.images) ? product.value.images.filter(Boolean) : []
  productImages.value = images.length > 0 ? images : ['/images/cruzar-logo-1.png']
}
```

Note: `productImages` still passes the raw `images` array (which may contain `ProductImage` objects or strings) to `ImageGallery`. The gallery component now handles resolution via `getImageUrls` internally.

Update OG/Twitter meta image (lines 149 and 169) from:
```js
content: () => productImages.value[0] || (product.value?.images?.[0] || '/images/cruzar-logo-1.png')
```
to:
```js
content: () => getFirstImageUrl(product.value?.images, 'main') || '/images/cruzar-logo-1.png'
```

- [ ] **Step 4: Commit**

```bash
git add apps/home/components/ProductCard.vue apps/home/components/ImageGallery.vue apps/home/pages/products/\[slug\].vue
git commit -m "feat: update storefront components to use pre-generated image URLs"
```

---

### Task 7: Update Back-Office Image Handling

Update the back-office to handle the new image object format in uploads while keeping the image browser functional.

**Files:**
- Modify: `apps/back-office/composables/useCloudinary.js`
- Modify: `apps/back-office/pages/products/manage.vue`

- [ ] **Step 1: Update useCloudinary.js upload response handling**

In `apps/back-office/composables/useCloudinary.js`, update the `uploadImage` function (lines 88-104).

The function currently returns `response.data.url` (a single string). Update it to return the full image object:

```js
const uploadImage = async (file, folder = 'cruzar-deportes/products') => {
  const formData = new FormData()
  formData.append('image', file)

  const url = `${apiUrl}/api/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`

  const response = await $fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  })

  if (response.success && response.data) {
    return {
      original: response.data.url,
      main: response.data.main || response.data.url,
      thumbnail: response.data.thumbnail || response.data.url
    }
  }
  throw new Error(response.error || 'Upload failed')
}
```

Update the `uploadMultipleImages` function (lines 112-130) similarly:

```js
const uploadMultipleImages = async (files, folder = 'cruzar-deportes/products') => {
  const formData = new FormData()
  for (const file of files) {
    formData.append('images', file)
  }

  const url = `${apiUrl}/api/upload/multiple${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`

  const response = await $fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  })

  if (response.success && response.data) {
    return response.data.map(img => ({
      original: img.url,
      main: img.main || img.url,
      thumbnail: img.thumbnail || img.url
    }))
  }
  throw new Error(response.error || 'Upload failed')
}
```

Remove `getOptimizedUrl` and `getThumbnailUrl` functions (lines 160-208) and remove them from the return statement. They are no longer needed.

- [ ] **Step 2: Update manage.vue optimizeUrl helper**

In `apps/back-office/pages/products/manage.vue`, the `optimizeUrl` function on line 1079-1085 currently inserts Cloudinary transforms into URLs. Since the back-office image browser still works with raw Cloudinary URLs (for `selectedImages` and `allAvailableImages`), keep this function but also handle image objects:

```js
const optimizeUrl = (urlOrImage, size = 300) => {
  const url = typeof urlOrImage === 'object' && urlOrImage !== null
    ? (urlOrImage.thumbnail || urlOrImage.main || urlOrImage.original || '')
    : urlOrImage
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }
  return url.replace('/upload/', `/upload/c_thumb,w_${size},h_${size},g_face/`)
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/back-office/composables/useCloudinary.js apps/back-office/pages/products/manage.vue
git commit -m "feat: update back-office to handle new image object format from uploads"
```

---

### Task 8: Create Migration Script

Build the script that converts existing Firestore products from `images: string[]` to `images: ProductImage[]`.

**Files:**
- Create: `scripts/migrate-images.js`

- [ ] **Step 1: Create the migration script**

Create `scripts/migrate-images.js`:

```js
/**
 * Migration script: Convert product images from string[] to {original, main, thumbnail}[]
 *
 * This script reads all products from Firestore and converts their `images` arrays
 * from plain Cloudinary URL strings to objects with pre-generated variant URLs.
 *
 * The variant URLs are constructed by inserting Cloudinary transformations into
 * the existing URLs - no re-upload or Cloudinary API calls needed.
 *
 * Safe to run multiple times (idempotent).
 *
 * Usage:
 *   Requires the same env vars as the API server:
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 *
 *   node scripts/migrate-images.js [--dry-run]
 */

const admin = require('firebase-admin')

// --- Config ---
const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY')
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n')
  })
})

const db = admin.firestore()
const isDryRun = process.argv.includes('--dry-run')

// --- Helpers ---

/**
 * Insert Cloudinary transformations into an upload URL.
 * e.g., .../upload/v12345/folder/file.jpg -> .../upload/w_800,c_limit,q_auto,f_auto/v12345/folder/file.jpg
 */
function buildVariantUrl(url, transforms) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/${transforms}/`)
}

/**
 * Convert a single image entry. Handles both strings and already-migrated objects.
 */
function migrateImageEntry(entry) {
  // Already migrated
  if (typeof entry === 'object' && entry !== null && entry.original) {
    return entry
  }

  // Plain URL string
  if (typeof entry === 'string' && entry.length > 0) {
    return {
      original: entry,
      main: buildVariantUrl(entry, 'w_800,c_limit,q_auto,f_auto'),
      thumbnail: buildVariantUrl(entry, 'w_400,c_limit,q_auto,f_auto')
    }
  }

  // Skip empty/falsy entries
  return null
}

// --- Main ---

async function migrate() {
  console.log(isDryRun ? '=== DRY RUN ===' : '=== LIVE MIGRATION ===')

  const snapshot = await db.collection('products').get()
  console.log(`Found ${snapshot.size} products`)

  let updated = 0
  let skipped = 0
  let errors = 0

  const batch = db.batch()
  let batchCount = 0
  const MAX_BATCH = 400 // Firestore limit is 500, leave headroom

  for (const doc of snapshot.docs) {
    const data = doc.data()
    const images = data.images

    if (!Array.isArray(images) || images.length === 0) {
      skipped++
      continue
    }

    // Check if already fully migrated (all entries are objects with .original)
    const alreadyMigrated = images.every(
      img => typeof img === 'object' && img !== null && img.original
    )
    if (alreadyMigrated) {
      skipped++
      continue
    }

    const migratedImages = images.map(migrateImageEntry).filter(Boolean)

    console.log(`  ${data.name || doc.id}: ${images.length} images -> ${migratedImages.length} migrated`)

    if (!isDryRun) {
      batch.update(doc.ref, { images: migratedImages })
      batchCount++
      updated++

      if (batchCount >= MAX_BATCH) {
        await batch.commit()
        console.log(`  Committed batch of ${batchCount}`)
        batchCount = 0
      }
    } else {
      updated++
    }
  }

  // Commit remaining
  if (!isDryRun && batchCount > 0) {
    await batch.commit()
    console.log(`  Committed final batch of ${batchCount}`)
  }

  console.log(`\nResults: ${updated} updated, ${skipped} skipped, ${errors} errors`)
  if (isDryRun) console.log('(Dry run - no changes written)')

  process.exit(0)
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
```

- [ ] **Step 2: Test with dry run**

```bash
# Load env vars from the API .env file, then run
cd services/api && source .env && cd ../..
node scripts/migrate-images.js --dry-run
```

Expected: Lists each product and its image count, ends with "Results: N updated, N skipped, 0 errors" and "(Dry run - no changes written)".

- [ ] **Step 3: Run the actual migration**

```bash
cd services/api && source .env && cd ../..
node scripts/migrate-images.js
```

Expected: Same output but without the dry run notice. Products are updated in Firestore.

- [ ] **Step 4: Commit**

```bash
git add scripts/migrate-images.js
git commit -m "feat: add migration script to convert images to pre-generated variant format"
```

---

### Task 9: Remove Unused Cloudinary Code from Home App

Clean up the files that are no longer needed now that images are pre-generated.

**Files:**
- Delete: `apps/home/utils/cloudinaryImageLoader.ts`
- Delete: `apps/home/composables/useCloudinary.ts`
- Modify: `apps/home/nuxt.config.ts` (if it references cloudinary packages)

- [ ] **Step 1: Check for remaining imports of removed files**

Search for any other files importing `cloudinaryImageLoader` or `useCloudinary` in the home app:

```bash
grep -r "cloudinaryImageLoader\|composables/useCloudinary" apps/home/ --include="*.vue" --include="*.ts" --include="*.js" -l
```

Expected: Only `OptimizedImage.vue` (already updated in Task 5) should reference `cloudinaryImageLoader`. If any other files reference them, update those files to remove the imports.

- [ ] **Step 2: Delete the files**

```bash
rm apps/home/utils/cloudinaryImageLoader.ts
rm apps/home/composables/useCloudinary.ts
```

- [ ] **Step 3: Check nuxt.config.ts for Cloudinary module references**

Read `apps/home/nuxt.config.ts` and remove any `@cloudinary` module references or `cloudinary` configuration keys if present. Keep the `cloudinaryCloudName` runtime config key since it may still be used elsewhere.

- [ ] **Step 4: Check if @cloudinary packages can be removed from home app**

```bash
grep -E "cloudinary" apps/home/package.json
```

If `@cloudinary/url-gen` or similar packages are listed and no longer imported anywhere, remove them:

```bash
cd apps/home && npm uninstall @cloudinary/url-gen && cd ../..
```

- [ ] **Step 5: Commit**

```bash
git add -A apps/home/utils/cloudinaryImageLoader.ts apps/home/composables/useCloudinary.ts apps/home/nuxt.config.ts apps/home/package.json apps/home/package-lock.json
git commit -m "refactor: remove unused Cloudinary transform code from home app"
```

---

### Task 10: Verify End-to-End

Verify everything works together.

**Files:** None (verification only)

- [ ] **Step 1: Build the home app to check for compile errors**

```bash
cd apps/home && npm run build
```

Expected: Build succeeds with no errors. Warnings about unused vars are acceptable but should be reviewed.

- [ ] **Step 2: Build the back-office app to check for compile errors**

```bash
cd apps/back-office && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Start the home app in dev mode and visually verify**

```bash
cd apps/home && npm run dev
```

Navigate to:
- Home page — check hero images load (static, should be smaller now)
- Products listing — check product cards show thumbnail images
- Product detail page — check gallery shows main images and thumbnails

- [ ] **Step 4: Start the back-office in dev mode and verify**

```bash
cd apps/back-office && npm run dev
```

Navigate to:
- Products manage page — check product thumbnails load in the list
- Edit a product — check image browser still works
- Upload a new image — verify the API returns `thumbnail` and `main` fields

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address issues found during end-to-end verification"
```
