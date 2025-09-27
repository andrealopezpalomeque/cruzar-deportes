import { promises as fs } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import type { ProductDatabase, SharedProduct, CategoryType } from '../types'

const SHARED_DIR = fileURLToPath(new URL('..', import.meta.url))
const PRODUCTS_FILE = join(SHARED_DIR, 'products.json')

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
    national_retro: { id: 'national_retro', name: 'Camisetas Retro Selecciones', slug: 'national_retro', productCount: 0, lastModified: new Date().toISOString() }
  },
  metadata: {
    totalProducts: 0,
    totalImages: 0,
    lastSync: new Date().toISOString()
  }
})

// Read products database
export async function readProductsDatabase(): Promise<ProductDatabase> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create an empty database
    if ((error as any)?.code === 'ENOENT') {
      const emptyDb = createEmptyDatabase()
      await writeProductsDatabase(emptyDb)
      return emptyDb
    }
    throw error
  }
}

// Write products database
export async function writeProductsDatabase(database: ProductDatabase): Promise<void> {
  // Update metadata
  database.lastUpdated = new Date().toISOString()
  database.metadata.totalProducts = Object.keys(database.products).length
  database.metadata.totalImages = Object.values(database.products)
    .reduce((total, product) => total + product.selectedImages.length, 0)
  database.metadata.lastSync = new Date().toISOString()

  // Update category counts
  for (const categoryId of Object.keys(database.categories) as CategoryType[]) {
    database.categories[categoryId].productCount = Object.values(database.products)
      .filter(p => p.category === categoryId).length
    database.categories[categoryId].lastModified = new Date().toISOString()
  }

  const data = JSON.stringify(database, null, 2)
  await fs.writeFile(PRODUCTS_FILE, data, 'utf-8')
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
