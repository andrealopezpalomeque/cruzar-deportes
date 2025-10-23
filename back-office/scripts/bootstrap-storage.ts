import { promises as fs } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import type { ProductDatabase } from '../../shared/types'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT_DIR = join(__dirname, '..', '..')
const SHARED_DIR = join(ROOT_DIR, 'shared')
const LOCAL_FILE = join(SHARED_DIR, 'products.json')

async function loadSharedUtils() {
  const moduleUrl = new URL('../../shared/utils/productSync.ts', import.meta.url)
  return await import(moduleUrl.href) as typeof import('../../shared/utils/productSync.ts')
}

async function ensureLocalFile(): Promise<ProductDatabase> {
  try {
    const data = await fs.readFile(LOCAL_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const empty: ProductDatabase = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        products: {},
        categories: {} as any,
        metadata: {
          totalProducts: 0,
          totalImages: 0,
          lastSync: new Date().toISOString()
        }
      }
      await fs.writeFile(LOCAL_FILE, JSON.stringify(empty, null, 2), 'utf-8')
      return empty
    }
    throw error
  }
}

async function main() {
  const { readProductsDatabase, writeProductsDatabase } = await loadSharedUtils()
  const localDb = await ensureLocalFile()
  const remoteResult = await readProductsDatabase({ withMetadata: true })
  const remoteDb = remoteResult.database

  if (remoteResult.source !== 'remote') {
    console.error('Unable to download catalog from Firebase Storage. Aborting deploy to avoid using stale data.')
    console.error('Please verify Google Cloud credentials and network access, then retry.')
    process.exit(1)
  }

  const localProductCount = Object.keys(localDb.products).length
  const remoteProductCount = Object.keys(remoteDb.products).length

  const parseTimestamp = (value?: string) => {
    if (!value) return 0
    const time = Date.parse(value)
    return Number.isNaN(time) ? 0 : time
  }

  const localUpdatedAt = parseTimestamp(localDb.lastUpdated)
  const remoteUpdatedAt = parseTimestamp(remoteDb.lastUpdated)

  const remoteIsEmpty = remoteProductCount === 0
  const localHasCatalog = localProductCount > 0
  const localIsNewer = localUpdatedAt > remoteUpdatedAt
  const remoteIsNewer = remoteUpdatedAt > localUpdatedAt

  if ((remoteIsEmpty && localHasCatalog) || localIsNewer) {
    const reason = remoteIsEmpty
      ? 'remote catalog empty'
      : `local catalog newer (local ${localDb.lastUpdated ?? 'unknown'} > remote ${remoteDb.lastUpdated ?? 'unknown'})`

    console.log(`${reason}, uploading local products.json to storage...`)
    await writeProductsDatabase(localDb)
    console.log('Upload complete.')
    return
  } else {
    if (remoteProductCount > 0 && (remoteIsNewer || !localHasCatalog)) {
      const bucketInfo = remoteResult.bucket ? ` from bucket ${remoteResult.bucket}` : ''
      console.log(`Remote catalog newer or local empty; syncing local products.json${bucketInfo}...`)
      await fs.mkdir(SHARED_DIR, { recursive: true })
      await fs.writeFile(LOCAL_FILE, JSON.stringify(remoteDb, null, 2), 'utf-8')
      console.log('Local catalog updated from Firebase Storage.')
    } else if (remoteProductCount > 0) {
      console.log('Remote catalog already up-to-date; ensuring local copy matches storage...')
      await fs.mkdir(SHARED_DIR, { recursive: true })
      await fs.writeFile(LOCAL_FILE, JSON.stringify(remoteDb, null, 2), 'utf-8')
      console.log('Local catalog refreshed from Firebase Storage.')
    } else {
      console.log('Remote and local catalogs are empty; nothing to synchronize.')
    }
  }
}

main().catch((error) => {
  console.error('Bootstrap storage failed:', error)
  process.exit(1)
})
