# Cloudinary Cleanup Automation

## Overview

This document describes how to implement an automated cleanup script to remove unused product images from Cloudinary that are no longer referenced in the product database.

## Current Situation

- **Database**: 132 active products in `products.json`
- **Cloudinary**: ~336 team folders with images
- **Gap**: ~204 unused image folders still stored in Cloudinary

### Why Images Remain After Product Deletion

When a product is deleted from the back-office:
- ✅ Product entry is removed from `products.json`
- ✅ Product no longer appears on storefront
- ❌ Images remain in Cloudinary (not automatically deleted)

This is intentional for safety and reversibility, but results in unused images accumulating over time.

---

## Automated Cleanup Script Design

### Goals

1. Identify image folders in Cloudinary that aren't referenced in the database
2. Provide a preview/report of what would be deleted
3. Safely delete unused folders with confirmation
4. Log all deletions for audit trail

### Script Location

Create the script at:
```
apps/back-office/scripts/cleanup-cloudinary.ts
```

### Prerequisites

- Cloudinary credentials (already in `.env`)
- Firebase Storage access (to read current `products.json`)
- Node.js with TypeScript support

---

## Implementation Guide

### Step 1: Core Logic Pseudocode

```typescript
// 1. Load current products from Firebase Storage
const products = await readProductsDatabase()

// 2. Extract all Cloudinary folder paths from active products
const activeFolders = new Set<string>()
for (const product of products) {
  // Each product has: cloudinaryFolderPath
  activeFolders.add(product.cloudinaryFolderPath)
}

// 3. Get all folders from Cloudinary
const cloudinaryFolders = await getAllCloudinaryFolders()

// 4. Find unused folders
const unusedFolders = cloudinaryFolders.filter(
  folder => !activeFolders.has(folder)
)

// 5. Generate report
console.log(`Active products: ${products.length}`)
console.log(`Active folders: ${activeFolders.size}`)
console.log(`Total Cloudinary folders: ${cloudinaryFolders.length}`)
console.log(`Unused folders: ${unusedFolders.length}`)

// 6. Delete (with confirmation)
if (confirm) {
  for (const folder of unusedFolders) {
    await deleteCloudinaryFolder(folder)
  }
}
```

### Step 2: Implementation Details

#### A. Read Active Products

```typescript
import { readProductsDatabase } from '../../../packages/shared/utils/productSync'

async function getActiveCloudinaryFolders(): Promise<Set<string>> {
  const { database } = await readProductsDatabase({ withMetadata: true })
  const folders = new Set<string>()

  Object.values(database.products).forEach(product => {
    if (product.cloudinaryFolderPath) {
      folders.add(product.cloudinaryFolderPath)
    }
  })

  return folders
}
```

#### B. List All Cloudinary Folders

```typescript
import cloudinary from 'cloudinary'

async function getAllCloudinaryFolders(): Promise<string[]> {
  const folders: string[] = []
  const baseFolder = 'cruzar-deportes/products'

  // Get category folders
  const categories = await cloudinary.v2.api.sub_folders(baseFolder)

  for (const category of categories.folders) {
    const categoryPath = `${baseFolder}/${category.name}`

    // Get team folders within each category
    const teams = await cloudinary.v2.api.sub_folders(categoryPath)

    for (const team of teams.folders) {
      folders.push(`${categoryPath}/${team.name}`)
    }
  }

  return folders
}
```

#### C. Delete Cloudinary Folder

```typescript
async function deleteCloudinaryFolder(folderPath: string): Promise<void> {
  try {
    // Delete all resources in the folder
    const result = await cloudinary.v2.api.delete_resources_by_prefix(
      folderPath,
      { type: 'upload', resource_type: 'image' }
    )

    // Delete the empty folder
    await cloudinary.v2.api.delete_folder(folderPath)

    console.log(`✅ Deleted: ${folderPath} (${result.deleted.length} images)`)
  } catch (error) {
    console.error(`❌ Failed to delete ${folderPath}:`, error.message)
  }
}
```

### Step 3: Safety Features

#### Dry Run Mode

```typescript
const DRY_RUN = process.env.DRY_RUN === 'true'

if (DRY_RUN) {
  console.log(`[DRY RUN] Would delete: ${folder}`)
} else {
  await deleteCloudinaryFolder(folder)
}
```

#### Backup Before Deletion

```typescript
// Save list of folders to be deleted
const backupFile = `cloudinary-cleanup-${Date.now()}.json`
await fs.writeFile(
  backupFile,
  JSON.stringify({ unusedFolders, deletedAt: new Date().toISOString() }, null, 2)
)
console.log(`Backup saved to: ${backupFile}`)
```

#### Confirmation Prompt

```typescript
import * as readline from 'readline'

async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve => {
    rl.question(`${message} (yes/no): `, answer => {
      rl.close()
      resolve(answer.toLowerCase() === 'yes')
    })
  })
}

// Usage
const proceed = await confirm(
  `Delete ${unusedFolders.length} unused folders?`
)
```

### Step 4: Complete Script Template

```typescript
#!/usr/bin/env node
import { promises as fs } from 'fs'
import cloudinary from 'cloudinary'
import { readProductsDatabase } from '../../../packages/shared/utils/productSync'

// Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const DRY_RUN = process.env.DRY_RUN === 'true'

async function main() {
  console.log('🧹 Cloudinary Cleanup Script\n')

  // 1. Get active folders from database
  console.log('📊 Loading active products from database...')
  const activeFolders = await getActiveCloudinaryFolders()
  console.log(`   Found ${activeFolders.size} active product folders\n`)

  // 2. Get all folders from Cloudinary
  console.log('☁️  Scanning Cloudinary for all folders...')
  const allFolders = await getAllCloudinaryFolders()
  console.log(`   Found ${allFolders.length} total folders\n`)

  // 3. Identify unused folders
  const unusedFolders = allFolders.filter(f => !activeFolders.has(f))
  console.log(`🗑️  Found ${unusedFolders.length} unused folders\n`)

  if (unusedFolders.length === 0) {
    console.log('✅ No cleanup needed!')
    return
  }

  // 4. Save backup
  const backupFile = `./cloudinary-cleanup-backup-${Date.now()}.json`
  await fs.writeFile(backupFile, JSON.stringify({
    unusedFolders,
    activeFolders: Array.from(activeFolders),
    deletedAt: new Date().toISOString()
  }, null, 2))
  console.log(`💾 Backup saved: ${backupFile}\n`)

  // 5. Show preview
  console.log('Folders to be deleted:')
  unusedFolders.slice(0, 10).forEach(f => console.log(`  - ${f}`))
  if (unusedFolders.length > 10) {
    console.log(`  ... and ${unusedFolders.length - 10} more\n`)
  }

  // 6. Delete (with confirmation)
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes made')
    return
  }

  const proceed = await confirm(
    `\n⚠️  Delete ${unusedFolders.length} folders from Cloudinary?`
  )

  if (!proceed) {
    console.log('❌ Cleanup cancelled')
    return
  }

  // 7. Perform deletion
  console.log('\n🗑️  Deleting folders...')
  let deleted = 0
  let failed = 0

  for (const folder of unusedFolders) {
    try {
      await deleteCloudinaryFolder(folder)
      deleted++
    } catch (error) {
      failed++
    }
  }

  console.log(`\n✅ Cleanup complete!`)
  console.log(`   Deleted: ${deleted}`)
  console.log(`   Failed: ${failed}`)
}

// Helper functions (implement as shown above)
async function getActiveCloudinaryFolders() { /* ... */ }
async function getAllCloudinaryFolders() { /* ... */ }
async function deleteCloudinaryFolder(path: string) { /* ... */ }
async function confirm(message: string) { /* ... */ }

main().catch(console.error)
```

---

## Usage Instructions

### Running the Script

#### 1. Dry Run (Preview Only)
```bash
cd apps/back-office
DRY_RUN=true node scripts/cleanup-cloudinary.ts
```

This will show what would be deleted without making changes.

#### 2. Actual Cleanup
```bash
cd apps/back-office
node scripts/cleanup-cloudinary.ts
```

You'll be prompted to confirm before deletion.

### Add to package.json

```json
{
  "scripts": {
    "cleanup:cloudinary": "node scripts/cleanup-cloudinary.ts",
    "cleanup:cloudinary:dry": "DRY_RUN=true node scripts/cleanup-cloudinary.ts"
  }
}
```

Then run:
```bash
npm run cleanup:cloudinary:dry  # Preview
npm run cleanup:cloudinary      # Execute
```

---

## Safety Checklist

Before running the cleanup script:

- [ ] **Backup created** - Unused folders list saved to JSON
- [ ] **Dry run tested** - Verified list of folders to delete
- [ ] **Database verified** - Confirmed `products.json` has correct 132 products
- [ ] **Cloudinary API tested** - Confirmed API credentials work
- [ ] **Deletion logic reviewed** - Verified only unused folders will be deleted
- [ ] **Rollback plan** - Know how to restore from backup if needed

---

## Rollback Plan

If images are deleted accidentally:

### Option 1: Restore from Cloudinary Backup
If Cloudinary backup is enabled:
1. Go to Cloudinary Dashboard → Settings → Backup
2. Restore from the latest backup before deletion

### Option 2: Re-upload Images
If backup JSON was saved:
1. Review `cloudinary-cleanup-backup-*.json`
2. Re-upload images for specific folders if needed

### Option 3: Restore Products
If products need to be restored to database:
```bash
# Restore from git history
git log -- packages/shared/products.json
git checkout <commit-hash> -- packages/shared/products.json
```

---

## Monitoring & Logging

### Track Cleanup History

Create a log file for each cleanup:
```typescript
const logEntry = {
  timestamp: new Date().toISOString(),
  unusedFoldersCount: unusedFolders.length,
  deletedCount: deleted,
  failedCount: failed,
  folders: unusedFolders
}

await fs.writeFile(
  `./logs/cleanup-${Date.now()}.json`,
  JSON.stringify(logEntry, null, 2)
)
```

### Cloudinary Storage Metrics

Before cleanup:
```bash
# Check current storage usage
curl -u "${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}" \
  "https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/usage"
```

After cleanup, compare to see storage reduction.

---

## Cost Analysis

### Cloudinary Pricing (as of 2024)

- **Free tier**: 25 GB storage, 25 GB bandwidth/month
- **Plus plan**: $89/month - 150 GB storage
- **Storage overage**: ~$0.18/GB/month

### Potential Savings

If ~204 unused folders average 10MB each:
- **Current unused**: ~2 GB
- **Monthly cost**: ~$0.36/month
- **Annual savings**: ~$4.32/year

*Note: Savings are minimal on free tier, but cleanup helps organization and prevents hitting limits.*

---

## Future Enhancements

### 1. Automatic Cleanup on Product Deletion

Modify the back-office delete API to also remove Cloudinary images:

```typescript
// In /api/products/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Get product before deletion
  const product = await getProduct(id)

  // Delete from database
  await deleteProduct(id)

  // OPTIONAL: Delete from Cloudinary
  if (product.cloudinaryFolderPath) {
    await deleteCloudinaryFolder(product.cloudinaryFolderPath)
  }

  return { success: true }
})
```

### 2. Scheduled Cleanup

Run cleanup automatically via cron job or Firebase Scheduled Function:

```typescript
// Firebase Scheduled Function (once per month)
export const cleanupCloudinary = onSchedule('0 0 1 * *', async (event) => {
  // Run cleanup script
  await cleanupUnusedImages()
})
```

### 3. Soft Delete with Grace Period

Instead of immediate deletion:
1. Mark images as "unused" with timestamp
2. Keep for 30 days grace period
3. Delete after grace period expires

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview
- [Firebase Storage Setup](./.env.example) - Environment configuration
- [Cloudinary API Docs](https://cloudinary.com/documentation/admin_api) - Official API reference

---

## Questions or Issues?

If you encounter problems:
1. Check the backup JSON file was created
2. Verify Cloudinary API credentials are correct
3. Review deletion logs for error messages
4. Test with DRY_RUN mode first

---

**Last Updated**: December 16, 2024
**Status**: Documentation ready for implementation
