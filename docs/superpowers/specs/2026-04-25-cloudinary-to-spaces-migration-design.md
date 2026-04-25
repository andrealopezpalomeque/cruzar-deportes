# Cloudinary → DigitalOcean Spaces Migration — Cruzar Deportes

**Date:** 2026-04-25  
**Scope:** Replace Cloudinary image storage with DigitalOcean Spaces across the full stack  
**Approach:** Direct swap — same API response contract, Sharp for server-side resizing, S3 SDK for upload

---

## 1. Context

All product images are currently stored on Cloudinary. The API generates 3 variants per image (original, main 800px, thumbnail 400px) using Cloudinary's eager transforms. URLs are stored directly in Firestore. The back-office and storefront both rely on these stored URLs.

The goal is to move storage to the existing DigitalOcean Space (`wiseutils-cdn`, region `nyc3`) while keeping the API response shape identical so the frontend requires minimal changes.

---

## 2. Architecture Overview

| Layer | Change |
|-------|--------|
| `services/api/src/config/cloudinary.js` | Replaced by `spaces.js` (S3 client config) |
| `services/api/src/controllers/uploadController.js` | Full rewrite — Sharp resizes, S3 uploads |
| `services/api/src/routes/upload.js` | Minor — remove multer-storage-cloudinary, use memory storage only |
| `apps/back-office/composables/useCloudinary.js` | Renamed to `useUpload.js`, Cloudinary-specific code removed |
| `apps/home/utils/imageHelpers.ts` | Remove `applyCloudinaryOptimizations()` |
| `apps/home/composables/useCloudinaryUrl.ts` | Deleted entirely |
| Firestore product documents | URLs updated by migration script, structure unchanged |

**New API dependencies:**
- `sharp` — server-side image resizing
- `@aws-sdk/client-s3` — S3-compatible client for DO Spaces

**Removed API dependencies:**
- `cloudinary`
- `multer-storage-cloudinary`

---

## 3. DO Spaces Configuration

| Setting | Value |
|---------|-------|
| Bucket | `wiseutils-cdn` |
| Region | `nyc3` |
| Endpoint | `https://nyc3.digitaloceanspaces.com` |
| CDN base | `https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com` |
| Prefix | `cruzar-deportes/products/` |

**New env vars for the API (`.env` on droplet and locally):**
```
DO_SPACES_KEY=<REDACTED — pull from secret vault>
DO_SPACES_SECRET=<REDACTED — pull from secret vault>
```

---

## 4. Image URL Format After Migration

```
# Thumbnail (400px wide, WebP)
https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com/cruzar-deportes/products/{type}/{league}/{slug}_thumbnail.webp

# Main (800px wide, WebP)
https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com/cruzar-deportes/products/{type}/{league}/{slug}_main.webp

# Original (unchanged dimensions, WebP)
https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com/cruzar-deportes/products/{type}/{league}/{slug}_original.webp
```

---

## 5. API Changes

### `src/config/spaces.js` (new file, replaces cloudinary.js)

```js
const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
})

const BUCKET = 'wiseutils-cdn'
const CDN_BASE = 'https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com'

module.exports = { s3, BUCKET, CDN_BASE }
```

### `src/controllers/uploadController.js` (full rewrite)

Upload flow per image:
1. Receive buffer from Multer memory storage
2. Use Sharp to produce 3 buffers:
   - `_original.webp` — original dimensions, converted to WebP
   - `_main.webp` — resized to 800px wide, WebP
   - `_thumbnail.webp` — resized to 400px wide, WebP
3. Upload all 3 to Spaces with `ACL: public-read`
4. Return same response shape:

```js
{
  url: '{CDN_BASE}/{key}_original.webp',
  publicId: 'cruzar-deportes/products/{folder}/{filename}',  // key prefix, no variant suffix
  thumbnail: '{CDN_BASE}/{key}_thumbnail.webp',
  main: '{CDN_BASE}/{key}_main.webp'
}
```

### Delete flow

Given a `publicId` (key prefix), delete all 3 variants (`_original`, `_main`, `_thumbnail`) using `DeleteObjectsCommand`.

### `src/routes/upload.js` (minor update)

Remove `multer-storage-cloudinary`. Use plain `multer({ storage: multer.memoryStorage() })` — already used for validation, just remove the Cloudinary storage reference.

---

## 6. Migration Script

**Location:** `services/api/scripts/migrate-to-spaces.js`

**Flow:**
1. Fetch all products from Firestore
2. For each product, for each URL in `images`, `selectedImages`, `allAvailableImages`:
   - Skip if already a Spaces URL
   - Detect variant from Cloudinary URL (`w_400` → thumbnail, `w_800` → main, neither → original)
   - Download image buffer via HTTP
   - Upload to Spaces under the same folder path with correct variant suffix
   - Collect new Spaces URL
3. Update Firestore document with all new URLs
4. Log: `✓ product-slug — N images migrated` or `✗ product-slug — error`

**Safety:**
- `--dry-run` flag: logs actions without writing to Firestore or Spaces
- Does not delete from Cloudinary — kept as fallback until migration is verified
- Idempotent — safe to re-run, already-migrated URLs are skipped

**Usage:**
```bash
node services/api/scripts/migrate-to-spaces.js --dry-run
node services/api/scripts/migrate-to-spaces.js
```

---

## 7. Frontend Changes

### `apps/home/utils/imageHelpers.ts`
- Remove `applyCloudinaryOptimizations()` — injects `f_auto,q_auto` which corrupts non-Cloudinary URLs
- `getImageUrl()` and `getFirstImageUrl()` unchanged

### `apps/home/composables/useCloudinaryUrl.ts`
- Delete entirely

### `apps/back-office/composables/useCloudinary.js`
- Rename to `useUpload.js`
- Remove `getFolderImages()` (Cloudinary folder listing, no Spaces equivalent needed)
- `uploadImage()`, `uploadMultipleImages()`, `deleteImage()`, `compressImage()` unchanged — they call the API, not Cloudinary directly

### `apps/back-office/components/products/ProductCreateModal.vue`
- Update import: `useCloudinary` → `useUpload`
- Rename `cloudinaryFolderPath` → `folderPath` in form state and API payload

### Both apps
- Rebuild and redeploy to Firebase after API is updated

---

## 8. Deployment Order

1. Add `DO_SPACES_KEY` and `DO_SPACES_SECRET` to API `.env` on droplet
2. Update API code (install deps, rewrite upload controller)
3. Restart `cruzar-api` via PM2
4. Run migration script (dry-run first, then live)
5. Update back-office and storefront frontend code
6. Rebuild and redeploy both apps to Firebase
7. Verify images load in production
8. Optionally decommission Cloudinary account
