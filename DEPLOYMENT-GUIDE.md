# Cruzar Deportes - Deployment Guide

## Problem Fixed ✅

The storefront was ignoring back-office edits because:
1. Firebase credentials weren't configured locally (but Firebase CLI was authenticated)
2. 96% of product image URLs lacked file extensions (e.g., `.jpg`), causing the storefront to filter them out

## Current Status

- ✅ **Firebase Authentication**: Already configured via Firebase CLI
- ✅ **Image URLs**: All 5,707 Cloudinary URLs now have proper `.jpg` extensions
- ✅ **Firebase Storage**: Updated with fixed `products.json`
- ✅ **Back-office**: Updated to automatically append `.jpg` to Cloudinary URLs

## How to Deploy Changes from Back-Office → Storefront

### 1. Make Edits in Back-Office
- Update prices, images, product details as needed
- All changes are automatically saved to Firebase Storage

### 2. Deploy to Storefront

```bash
cd /Users/andreavictorialopezpalomeque/Documents/personal-projects/cruzar-deportes
./shared/scripts/deploy-home.sh
```

This will:
1. Download latest `products.json` from Firebase Storage
2. Build the storefront with updated data
3. Deploy to Firebase Hosting

## Troubleshooting

### If images still don't appear after deployment:

**Cause**: Old products in Firebase Storage may still have URLs without extensions.

**Solution**: Re-select images in the back-office:
1. Open back-office
2. For affected products, click "Manage Images"
3. Re-select the same images
4. Save

This will automatically append `.jpg` extensions thanks to the fix in `back-office/utils/cloudinaryImageLoader.ts`.

### If bootstrap-storage.ts fails:

Check Firebase CLI authentication:
```bash
firebase login
firebase projects:list
```

Ensure you see `cruzar-back-office` in the list.

## Scripts Reference

### Upload products.json to Firebase Storage
```bash
node back-office/scripts/upload-products.ts
```

### Download products.json from Firebase Storage
```bash
node back-office/scripts/bootstrap-storage.ts
```

## Files Modified

- `back-office/utils/cloudinaryImageLoader.ts` - Added `ensureImageExtension()` method
- `back-office/scripts/upload-products.ts` - New script for manual uploads
- `shared/products.json` - Fixed all URLs to include `.jpg` extensions

## Technical Details

### Image URL Validation
The storefront filters images using this regex:
```javascript
/\.(jpe?g|png|webp|avif|gif|bmp|tiff)(\?|$)/i
```

URLs like:
```
❌ .../164829969_photo_img_0_1756150226653
✅ .../164829969_photo_img_0_1756150226653.jpg
```

### Firebase Storage Path
```
gs://cruzar-back-office.appspot.com/shared/products.json
```

---

**Last Updated**: 2025-09-29
**Status**: All systems operational