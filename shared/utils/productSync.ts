import { promises as fs } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import type { ProductDatabase, SharedProduct, CategoryType } from '../types'

let admin: typeof import('firebase-admin') | null = null
let adminInitialized = false

const REPO_SHARED_DIR = fileURLToPath(new URL('..', import.meta.url))
const isServerEnv = !!process.env.K_SERVICE || !!process.env.GCLOUD_PROJECT
const LOCAL_FALLBACK_DIR = isServerEnv
  ? join(os.tmpdir(), 'cruzar-deportes')
  : REPO_SHARED_DIR
const LOCAL_PRODUCTS_FILE = join(LOCAL_FALLBACK_DIR, 'products.json')
const STORAGE_OBJECT_PATH = 'shared/products.json'

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }

    for (let index = 0; index < a.length; index += 1) {
      if (!deepEqual(a[index], b[index])) {
        return false
      }
    }

    return true
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])

    for (const key of keys) {
      if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false
      }
    }

    return true
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return Number.isNaN(a) && Number.isNaN(b)
  }

  return false
}

const resolveFirebaseConfig = () => {
  if (!process.env.FIREBASE_CONFIG) return undefined
  try {
    return JSON.parse(process.env.FIREBASE_CONFIG)
  } catch (error) {
    console.warn('Unable to parse FIREBASE_CONFIG:', error)
    return undefined
  }
}

const resolveProjectId = (): string | undefined => {
  if (process.env.GCLOUD_PROJECT) {
    return process.env.GCLOUD_PROJECT
  }

  const firebaseConfig = resolveFirebaseConfig()
  if (firebaseConfig?.projectId) {
    return firebaseConfig.projectId
  }

  return undefined
}

const extractBucketName = (value: string): string => {
  let bucket = value.trim()

  if (bucket.startsWith('gs://')) {
    bucket = bucket.slice('gs://'.length)
  }

  if (bucket.includes('://')) {
    try {
      const url = new URL(bucket)
      bucket = `${url.host}${url.pathname}`
    } catch {
      // ignore parse errors, fall back to simple heuristics
    }
  }

  // When provided a full REST path like /v0/b/<bucket>/o/...
  const bucketMatch = bucket.match(/\/b\/([^/]+)/)
  if (bucketMatch) {
    bucket = bucketMatch[1]
  }

  // Remove any trailing path segments
  const slashIndex = bucket.indexOf('/')
  if (slashIndex >= 0) {
    bucket = bucket.slice(0, slashIndex)
  }

  return bucket
}

const resolveStorageBucketCandidates = (projectId?: string): string[] => {
  const candidates = new Set<string>()

  const addBucket = (value?: string) => {
    if (!value) return
    const bucket = extractBucketName(value)
    if (!bucket) return
    candidates.add(bucket)

    if (bucket.endsWith('.firebasestorage.app')) {
      candidates.add(bucket.replace(/\.firebasestorage\.app$/, '.appspot.com'))
    }

    if (bucket.endsWith('.appspot.com')) {
      candidates.add(bucket.replace(/\.appspot\.com$/, '.firebasestorage.app'))
    }
  }

  addBucket(process.env.FIREBASE_STORAGE_BUCKET)

  const firebaseConfig = resolveFirebaseConfig()
  addBucket(firebaseConfig?.storageBucket)

  if (projectId) {
    addBucket(`${projectId}.appspot.com`)
    addBucket(`${projectId}.firebasestorage.app`)
  }

  return Array.from(candidates)
}

const loadFirebaseAdmin = async (): Promise<typeof import('firebase-admin') | null> => {
  if (adminInitialized) {
    return admin
  }

  const projectId = resolveProjectId()
  if (!process.env.K_SERVICE && !projectId) {
    adminInitialized = true
    return null
  }

  const module = await import('firebase-admin')
  admin = module.default ?? module

  if (!admin.apps.length) {
    const bucketCandidates = resolveStorageBucketCandidates(projectId)
    const options: Record<string, any> = {}

    if (projectId) options.projectId = projectId
    if (bucketCandidates.length > 0) options.storageBucket = bucketCandidates[0]

    admin.initializeApp(options)
  }

  adminInitialized = true
  return admin
}

type StorageContext = {
  storage: import('firebase-admin').storage.Storage
  buckets: string[]
}

export type ProductDatabaseReadResult = {
  database: ProductDatabase
  source: 'remote' | 'local'
  bucket?: string
}

const getStorageContext = async (): Promise<StorageContext | null> => {
  const fbAdmin = await loadFirebaseAdmin()
  if (!fbAdmin) return null

  const projectId = resolveProjectId()
  const candidates = resolveStorageBucketCandidates(projectId)
  const storage = fbAdmin.storage()

  if (candidates.length === 0) {
    const defaultBucket = storage.bucket().name
    if (defaultBucket) {
      candidates.push(defaultBucket)
    }
  }

  return {
    storage,
    buckets: candidates
  }
}

// Initialize empty database structure
const createEmptyDatabase = (): ProductDatabase => ({
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  products: {},
  categories: {
    afc: { id: 'afc', name: 'Equipos AFC', slug: 'afc', productCount: 0, lastModified: new Date().toISOString() },
    caf: { id: 'caf', name: 'Equipos CAF', slug: 'caf', productCount: 0, lastModified: new Date().toISOString() },
    eredivisie: { id: 'eredivisie', name: 'Equipos Eredivisie', slug: 'eredivisie', productCount: 0, lastModified: new Date().toISOString() },
    lpf_afa: { id: 'lpf_afa', name: 'Liga Profesional Argentina', slug: 'lpf_afa', productCount: 0, lastModified: new Date().toISOString() },
    serie_a_enilive: { id: 'serie_a_enilive', name: 'Serie A Enilive', slug: 'serie_a_enilive', productCount: 0, lastModified: new Date().toISOString() },
    national_retro: { id: 'national_retro', name: 'Camisetas Retro Selecciones', slug: 'national_retro', productCount: 0, lastModified: new Date().toISOString() },
    basket: { id: 'basket', name: 'Equipos de Básquet', slug: 'basket', productCount: 0, lastModified: new Date().toISOString() }
  },
  metadata: {
    totalProducts: 0,
    totalImages: 0,
    lastSync: new Date().toISOString()
  }
})

type ReadProductsDatabaseOptions =
  | undefined
  | {
      withMetadata?: false
    }
  | {
      withMetadata: true
    }

export async function readProductsDatabase(): Promise<ProductDatabase>
export async function readProductsDatabase(options: { withMetadata: true }): Promise<ProductDatabaseReadResult>
// Read products database
export async function readProductsDatabase(options?: ReadProductsDatabaseOptions): Promise<ProductDatabase | ProductDatabaseReadResult> {
  const storageContext = await getStorageContext()

  if (storageContext) {
    const { storage, buckets } = storageContext

    for (const bucketName of buckets) {
      const file = storage.bucket(bucketName).file(STORAGE_OBJECT_PATH)
      try {
        const [contents] = await file.download()
        const json = contents.toString('utf-8')
        await fs.mkdir(LOCAL_FALLBACK_DIR, { recursive: true })
        await fs.writeFile(LOCAL_PRODUCTS_FILE, json, 'utf-8')
        const database = JSON.parse(json) as ProductDatabase

        if (options?.withMetadata) {
          return {
            database,
            source: 'remote',
            bucket: bucketName
          }
        }

        return database
      } catch (error: any) {
        const errorMessage = error?.message ?? String(error)
        const errorCode = error?.code
        const isMissingBucket = errorCode === 404 || /bucket does not exist/i.test(errorMessage) || /not found/i.test(errorMessage)
        console.warn(`Unable to download catalog from bucket "${bucketName}": ${errorMessage}`)

        if (!isMissingBucket) {
          throw error
        }
      }
    }

    console.warn('All remote storage buckets unavailable, using local products.json fallback')
  }

  try {
    const data = await fs.readFile(LOCAL_PRODUCTS_FILE, 'utf-8')
    const database = JSON.parse(data) as ProductDatabase

    if (options?.withMetadata) {
      return {
        database,
        source: 'local'
      }
    }

    return database
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const emptyDb = createEmptyDatabase()
      await writeProductsDatabase(emptyDb)
      if (options?.withMetadata) {
        return {
          database: emptyDb,
          source: 'local'
        }
      }

      return emptyDb
    }
    throw error
  }
}

// Write products database
export async function writeProductsDatabase(database: ProductDatabase): Promise<void> {
  const nowIso = new Date().toISOString()

  let previousDatabase: ProductDatabase | null = null
  try {
    const previousContent = await fs.readFile(LOCAL_PRODUCTS_FILE, 'utf-8')
    previousDatabase = JSON.parse(previousContent) as ProductDatabase
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      console.warn('Unable to read previous products database:', error)
    }
  }

  let hasMeaningfulChanges = previousDatabase === null

  // Preserve product lastModified when nothing changed for that product
  const previousProducts = previousDatabase?.products || {}
  const currentProducts = database.products

  for (const [productId, product] of Object.entries(currentProducts)) {
    const previousProduct = previousProducts[productId]

    if (previousProduct) {
      const { lastModified: _prevLastModified, ...prevRest } = previousProduct
      const { lastModified: _currLastModified, ...currRest } = product

      if (deepEqual(prevRest, currRest)) {
        product.lastModified = previousProduct.lastModified
      } else {
        product.lastModified = product.lastModified || nowIso
        hasMeaningfulChanges = true
      }
    } else {
      // New product added
      product.lastModified = product.lastModified || nowIso
      hasMeaningfulChanges = true
    }
  }

  // Detect removed products
  if (!hasMeaningfulChanges && previousDatabase) {
    const prevIds = Object.keys(previousDatabase.products)
    const currentIds = Object.keys(currentProducts)
    if (prevIds.length !== currentIds.length || prevIds.some(id => !currentProducts[id])) {
      hasMeaningfulChanges = true
    }
  }

  // Update metadata totals
  database.metadata.totalProducts = Object.keys(database.products).length
  database.metadata.totalImages = Object.values(database.products)
    .reduce((total, product) => total + product.selectedImages.length, 0)

  // Update category counts, but only bump lastModified if the count changed
  for (const categoryId of Object.keys(database.categories) as CategoryType[]) {
    const category = database.categories[categoryId]
    const previousCategory = previousDatabase?.categories?.[categoryId]

    const productCount = Object.values(database.products)
      .filter(p => p.category === categoryId).length

    const previousCount = previousCategory?.productCount
    category.productCount = productCount

    if (previousCategory && previousCount === productCount) {
      category.lastModified = previousCategory.lastModified
    } else {
      category.lastModified = category.lastModified || nowIso
      hasMeaningfulChanges = true
    }
  }

  // Carry over missing categories from previous state (if any) to detect removals
  if (previousDatabase) {
    for (const categoryId of Object.keys(previousDatabase.categories) as CategoryType[]) {
      if (!database.categories[categoryId]) {
        hasMeaningfulChanges = true
      }
    }
  }

  if (hasMeaningfulChanges) {
    database.lastUpdated = nowIso
    database.metadata.lastSync = nowIso
  } else {
    database.lastUpdated = previousDatabase?.lastUpdated || database.lastUpdated
    database.metadata.lastSync = previousDatabase?.metadata?.lastSync || database.metadata.lastSync
  }

  const data = JSON.stringify(database, null, 2)

  const storageContext = await getStorageContext()

  if (storageContext) {
    const { storage, buckets } = storageContext

    for (const bucketName of buckets) {
      const file = storage.bucket(bucketName).file(STORAGE_OBJECT_PATH)
      try {
        await file.save(data, {
          contentType: 'application/json',
          resumable: false
        })
        await fs.mkdir(LOCAL_FALLBACK_DIR, { recursive: true })
        await fs.writeFile(LOCAL_PRODUCTS_FILE, data, 'utf-8')
        return
      } catch (error: any) {
        const errorMessage = error?.message ?? String(error)
        const errorCode = error?.code
        const isMissingBucket = errorCode === 404 || /bucket does not exist/i.test(errorMessage) || /not found/i.test(errorMessage)
        console.warn(`Unable to write catalog to bucket "${bucketName}": ${errorMessage}`)

        if (!isMissingBucket) {
          throw error
        }
      }
    }

    console.warn('All remote storage buckets unavailable, writing to local products.json')
  }

  await fs.mkdir(LOCAL_FALLBACK_DIR, { recursive: true })
  await fs.writeFile(LOCAL_PRODUCTS_FILE, data, 'utf-8')
}

// Get all products
export async function getAllProducts(): Promise<SharedProduct[]> {
  const db = await readProductsDatabase()
  return Object.values(db.products)
}

// Get products by category
export async function getProductsByCategory(category: CategoryType): Promise<SharedProduct[]> {
  const products = await getAllProducts()
  return products.filter(p => p.category === category)
}

// Get single product
export async function getProduct(productId: string): Promise<SharedProduct | null> {
  const db = await readProductsDatabase()
  return db.products[productId] || null
}

// Create or update product
export async function saveProduct(product: SharedProduct): Promise<void> {
  const db = await readProductsDatabase()

  // Update timestamp
  product.lastModified = new Date().toISOString()

  // If new product, set creation time
  if (!db.products[product.id]) {
    product.createdAt = new Date().toISOString()
  }

  db.products[product.id] = product
  await writeProductsDatabase(db)
}

// Delete product
export async function deleteProduct(productId: string): Promise<boolean> {
  const db = await readProductsDatabase()

  if (db.products[productId]) {
    delete db.products[productId]
    await writeProductsDatabase(db)
    return true
  }
  return false
}

// Update product images
export async function updateProductImages(
  productId: string,
  selectedImages: string[],
  allAvailableImages: string[]
): Promise<void> {
  const db = await readProductsDatabase()

  if (db.products[productId]) {
    db.products[productId].selectedImages = selectedImages
    db.products[productId].allAvailableImages = allAvailableImages
    db.products[productId].lastModified = new Date().toISOString()
    await writeProductsDatabase(db)
  }
}

// Update product pricing
export async function updateProductPricing(
  productId: string,
  price: number,
  originalPrice?: number
): Promise<void> {
  const db = await readProductsDatabase()

  if (db.products[productId]) {
    db.products[productId].price = price
    db.products[productId].originalPrice = originalPrice
    db.products[productId].lastModified = new Date().toISOString()
    await writeProductsDatabase(db)
  }
}

// Update product status
export async function updateProductStatus(
  productId: string,
  updates: {
    featured?: boolean
    inStock?: boolean
    stockStatus?: 'in_stock' | 'available_on_order'
  }
): Promise<void> {
  const db = await readProductsDatabase()

  if (db.products[productId]) {
    Object.assign(db.products[productId], updates)
    db.products[productId].lastModified = new Date().toISOString()
    await writeProductsDatabase(db)
  }
}

// Bulk operations
export async function bulkUpdateProducts(
  productIds: string[],
  updates: Partial<SharedProduct>
): Promise<void> {
  const db = await readProductsDatabase()

  for (const productId of productIds) {
    if (db.products[productId]) {
      Object.assign(db.products[productId], updates)
      db.products[productId].lastModified = new Date().toISOString()
    }
  }

  await writeProductsDatabase(db)
}

// Initialize database with existing products from main store
export async function initializeFromMainStore(): Promise<void> {
  // This will be called to migrate existing productGenerator.ts data
  // We'll implement this after we understand the current data better
}
