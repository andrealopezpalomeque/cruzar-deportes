import { promises as fs } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT_DIR = join(__dirname, '..', '..')
const SHARED_DIR = join(ROOT_DIR, 'shared')
const LOCAL_FILE = join(SHARED_DIR, 'products.json')

async function loadSharedUtils() {
  const moduleUrl = new URL('../../shared/utils/productSync.ts', import.meta.url)
  return await import(moduleUrl.href)
}

async function main() {
  console.log('Loading shared utilities...')
  const { writeProductsDatabase } = await loadSharedUtils()

  console.log('Reading local products.json...')
  const data = await fs.readFile(LOCAL_FILE, 'utf-8')
  const database = JSON.parse(data)

  console.log(`Found ${Object.keys(database.products).length} products`)
  console.log('Uploading to Firebase Storage...')

  await writeProductsDatabase(database)

  console.log('✅ Successfully uploaded products.json to Firebase Storage!')
}

main().catch((error) => {
  console.error('❌ Upload failed:', error)
  process.exit(1)
})