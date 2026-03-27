# Cloudinary Cost Optimization — Option D + Quick Wins

## Goal

Eliminate on-demand Cloudinary transformations to fit within the free tier (25 credits/month). Pre-generate 2 optimized sizes at upload time, store them in Firestore, and simplify the storefront image pipeline.

## Current State

- **Product images** stored in Cloudinary under `cruzar-deportes/products/`
- **Firestore schema**: `images: string[]` — array of raw Cloudinary URLs
- **Storefront** uses `OptimizedImage.vue` + `CloudinaryImageLoader` to generate up to 18 variants per image (3 formats x 3 sizes x 2 viewports) via URL-based transformations
- **Back-office** uploads via API (`uploadController.js`) with `quality: 'auto'`, client-side compression for files >2MB
- **Static images** in `/public/images/` total 13MB, with individual files up to 3.9MB
- **Cache-buster** hardcoded in `cloudinaryImageLoader.ts` forces re-serving cached images
- `generateResponsiveImageData` defaults to `['webp', 'avif', 'jpeg']`, tripling transform count

## Changes

### 1. Upload Flow — Pre-generate 2 Sizes

**File:** `services/api/src/controllers/uploadController.js`

Add `eager` transformations to the Cloudinary upload call:

```js
transformation: [{ quality: 'auto' }],
eager: [
  { width: 400, crop: 'limit', quality: 'auto', format: 'auto' },
  { width: 800, crop: 'limit', quality: 'auto', format: 'auto' }
],
eager_async: false
```

The upload response includes `eager[0].secure_url` and `eager[1].secure_url`. Return all three URLs (original + 2 eager) from the API.

**Updated API response shape:**

```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../original.jpg",
    "publicId": "cruzar-deportes/products/abc123",
    "thumbnail": "https://res.cloudinary.com/.../w_400,c_limit,q_auto,f_auto/original.jpg",
    "main": "https://res.cloudinary.com/.../w_800,c_limit,q_auto,f_auto/original.jpg"
  }
}
```

The multi-upload endpoint returns the same shape per image.

### 2. Firestore Schema Change

**Current:** `images: string[]`

**New:**

```ts
images: Array<{
  original: string   // Full-size Cloudinary URL
  main: string       // 800px wide, q_auto, f_auto
  thumbnail: string  // 400px wide, q_auto, f_auto
}>
```

Both the back-office and storefront must adapt to this shape.

### 3. Simplify OptimizedImage.vue

**File:** `apps/home/components/OptimizedImage.vue`

Replace the `<picture>` element with multiple `<source>` tags with a simpler approach:

```html
<img
  :src="mainUrl"
  :srcset="`${thumbnailUrl} 400w, ${mainUrl} 800w`"
  sizes="(max-width: 768px) 400px, 800px"
  :alt="alt"
  :loading="loading"
  :decoding="decoding"
/>
```

Since the URLs already include `f_auto`, Cloudinary serves WebP/AVIF automatically based on the browser's `Accept` header. No need for explicit format sources.

**Props simplified:** Remove `formats`, `crop`, `quality`, `type` props. Keep `src` (now expects the image object or a main URL), `alt`, `loading`, `decoding`, `fetchpriority`, `wrapperClass`, `imgClass`, `width`, `height`.

Add a new `variant` prop (`'main' | 'thumbnail'`, default `'main'`) so consumers can choose which size to display.

### 4. Update Consumers

Components that use `OptimizedImage` need to pass the correct URL from the new image object shape:

- **ProductCard.vue** — pass `image.thumbnail` or `image.main`
- **ImageGallery.vue** — pass `image.main` for the large view, `image.thumbnail` for thumbnails
- **AppHeader.vue / AppFooter.vue** — these use local logos, no change needed

Back-office components that read/write `images`:
- **ProductCreateModal.vue** — update to work with the new image object shape
- **useSharedProducts.js** — update product image handling

### 5. Migration Script

**New file:** `scripts/migrate-images.js`

A Node.js script that:

1. Connects to Firestore using the existing Firebase config
2. Reads all products
3. For each product's `images` array:
   - Each string URL gets converted to `{ original, main, thumbnail }`
   - `main` and `thumbnail` URLs are constructed by inserting transformation segments into the existing Cloudinary URL (e.g., `/upload/` becomes `/upload/w_800,c_limit,q_auto,f_auto/`)
   - No re-upload or API call to Cloudinary needed — just URL manipulation
4. Batch-updates all products in Firestore
5. Logs progress and any errors

This is a safe, idempotent operation (running it twice produces the same result).

### 6. Remove/Simplify Unused Code

**Remove:**
- `apps/home/utils/cloudinaryImageLoader.ts` — the `CloudinaryImageLoader` class is no longer needed
- `apps/home/composables/useCloudinary.ts` — the `getImageUrl`, `getResponsiveUrls` functions are unnecessary

**Keep:**
- `apps/back-office/composables/useCloudinary.js` — still needed for upload/delete operations; update `getOptimizedUrl` and `getThumbnailUrl` to be simple pass-throughs or remove them
- `services/api/src/controllers/uploadController.js` — update with eager transforms
- `services/api/src/config/cloudinary.js` — unchanged

### 7. Quick Wins

#### 7a. Compress Static Images

Compress the large files in `apps/home/public/images/`:

| File | Current | Target |
|------|---------|--------|
| football-team-1.webp | 3.9MB | ~300KB |
| football-team-2.webp | 2.2MB | ~250KB |
| stadium-crowd.webp | 2.5MB | ~250KB |
| stadium-field.webp | 1.6MB | ~200KB |
| cruzar-logo-no-bg.png | 1.3MB | ~100KB |
| cruzar-logo-short-1.png | 1.2MB | ~100KB |

Use `sharp` or `cwebp`/`pngquant` CLI tools to compress. Target quality: 80 for WebP, optimize PNG with pngquant.

#### 7b. Remove Cache-Buster

**File:** `apps/home/utils/cloudinaryImageLoader.ts` (being removed entirely — but if any code references `addCacheBuster`, remove those calls too)

#### 7c. Fix Default Formats

**File:** `apps/home/utils/cloudinaryImageLoader.ts` line 185 — change default from `['webp', 'avif', 'jpeg']` to `['webp', 'jpeg']`. (Moot if the file is removed, but relevant if any other code copies this pattern.)

## What Stays the Same

- Cloudinary remains the image host and CDN
- Back-office upload UX unchanged (user picks files, uploads)
- Client-side compression before upload stays (reduces storage usage)
- Delete image functionality unchanged
- API authentication (x-api-key) unchanged

## Risk / Rollback

- **Migration is safe**: constructing optimized URLs from existing URLs is just string manipulation. Original URLs are preserved in the `original` field.
- **Rollback**: if needed, a reverse migration script can flatten `images` back to `string[]` using the `original` field.
- **Backward compatibility during rollout**: `OptimizedImage` can check if `src` is a string (old format) or object (new format) and handle both during the transition period.

## Success Criteria

- All product images load correctly on the storefront using pre-generated URLs
- No on-demand Cloudinary transformations occur during normal browsing
- Upload flow creates 2 eager transforms per image
- Static images reduced from 13MB to ~2MB
- Cloudinary usage drops to free-tier levels (under 25 credits/month)
