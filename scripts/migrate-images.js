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
const path = require('path')
const fs = require('fs')

// Load .env from services/api (manual parse to avoid dotenv version issues)
const envPath = path.join(__dirname, '../services/api/.env')
const envContent = fs.readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIndex = trimmed.indexOf('=')
  if (eqIndex === -1) continue
  const key = trimmed.slice(0, eqIndex)
  let value = trimmed.slice(eqIndex + 1)
  // Strip surrounding quotes (before \n conversion)
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  // Trim trailing whitespace/newlines before \n conversion
  value = value.trimEnd()
  // Convert literal \n to real newlines (after quote stripping and trimming)
  value = value.replace(/\\n/g, '\n')
  if (!process.env[key]) {
    process.env[key] = value
  }
}

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
