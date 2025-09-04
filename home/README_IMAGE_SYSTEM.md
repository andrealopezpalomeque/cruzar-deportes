# Image System Documentation

## Overview
The image system has been completely refactored to be more maintainable and efficient.

## How it works
1. **Image Manifest**: All images are cataloged in `utils/imageManifest.ts` which is auto-generated
2. **Simple Loading**: `utils/imageLoader.ts` uses the manifest to load images efficiently
3. **Clean Product Generator**: `utils/productGenerator.ts` no longer contains hardcoded image lists

## Regenerating the Image Manifest

When you add new images or teams, run:

```bash
node utils/generateImageManifest.cjs
```

This will:
- Scan all directories in `public/images/`
- Find all image files (jpg, jpeg, png, webp)
- Generate a new manifest with proper paths
- Sort images by their numeric index

## Benefits of the new system
- ✅ **No hardcoded file lists** - images are discovered automatically
- ✅ **Easy maintenance** - just run the script when images change
- ✅ **Proper sorting** - images are ordered by their index number
- ✅ **Fallback handling** - graceful degradation for missing images
- ✅ **Performance** - no need to check if files exist at runtime

## File Structure
```
utils/
├── generateImageManifest.cjs  # Script to generate manifest
├── imageManifest.ts           # Auto-generated manifest (don't edit manually)
├── imageLoader.ts             # Simple image loading functions
└── productGenerator.ts        # Clean product generation
```

## Before vs After

### Before (❌ Problems):
- 27,000+ lines of hardcoded image paths in `imageLoader.ts`
- Duplicate image counts in `productGenerator.ts`
- Manual maintenance required for every new image
- Error-prone and difficult to maintain

### After (✅ Clean):
- ~35 lines in `imageLoader.ts`
- Auto-generated manifest
- Single command to update all images
- Clean and maintainable code