import { promises as fs } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import type { ProductDatabase } from '../../shared/types'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT_DIR = join(__dirname, '..', '..')
const SHARED_DIR = join(ROOT_DIR, 'shared')
const LOCAL_FILE = join(SHARED_DIR, 'products.json')

async function loadSharedUtils() {
  const path = join(SHARED_DIR, 'utils', 'productSync.ts')
  return await import(path)
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
  const remoteDb = await readProductsDatabase()

  if (Object.keys(remoteDb.products).length === 0 && Object.keys(localDb.products).length > 0) {
    console.log('Remote catalog empty, uploading local products.json to storage...')
    await writeProductsDatabase(localDb)
    console.log('Upload complete.')
  } else {
    console.log('Remote catalog already populated or local file empty; no action taken.')
  }
}

main().catch((error) => {
  console.error('Bootstrap storage failed:', error)
  process.exit(1)
})
