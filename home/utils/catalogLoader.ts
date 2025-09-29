import type { Product, Category } from '~/types'
import type { ProductDatabase, SharedProduct } from '~/shared/types'

interface CatalogPayload {
  products: Product[]
  categories: Category[]
}

let cachedCatalog: CatalogPayload | null = null

const FALLBACK_IMAGE = '/images/cruzar-logo-1.png'

const toProduct = (shared: SharedProduct): Product => {
  const images = shared.selectedImages.length > 0
    ? shared.selectedImages
    : shared.allAvailableImages.slice(0, 5)

  return {
    id: shared.id,
    name: shared.name,
    slug: shared.slug,
    description: shared.description,
    price: shared.price,
    originalPrice: shared.originalPrice,
    category: shared.category,
    subcategory: shared.subcategory,
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    totalImages: shared.allAvailableImages.length || images.length,
    sizes: shared.sizes,
    colors: shared.colors,
    inStock: shared.inStock,
    featured: shared.featured
  }
}

const toCategory = (database: ProductDatabase): Category[] => {
  return Object.values(database.categories).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description
  }))
}

export const loadCatalog = async (): Promise<CatalogPayload> => {
  if (cachedCatalog) {
    return cachedCatalog
  }

  const module = await import('~/shared/products.json')
  const database = (module.default || module) as ProductDatabase

  const products = Object.values(database.products)
    .map(toProduct)
    .sort((a, b) => a.name.localeCompare(b.name))

  const categories = toCategory(database)
    .sort((a, b) => a.name.localeCompare(b.name))

  cachedCatalog = { products, categories }
  return cachedCatalog
}

export const clearCatalogCache = () => {
  cachedCatalog = null
}
