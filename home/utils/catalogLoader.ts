import type { Product, Category } from '~/types'
import type { ProductDatabase, SharedProduct } from '~/shared/types'
import { getTeamCloudinaryUrls } from '~/utils/cloudinaryUrlMapping'

interface CatalogPayload {
  products: Product[]
  categories: Category[]
}

let cachedCatalog: CatalogPayload | null = null

const FALLBACK_IMAGE = '/images/cruzar-logo-1.png'

const toProduct = (shared: SharedProduct): Product => {
  const teamKey = shared.slug.replace(/-/g, '_')
  const cloudinaryImages = getTeamCloudinaryUrls(teamKey, shared.category) || []

  const candidateImages = [cloudinaryImages, shared.selectedImages, shared.allAvailableImages]
  const uniqueImages = candidateImages
    .flatMap(images => images || [])
    .filter(Boolean)
    .reduce<string[]>((acc, imageUrl) => {
      if (!acc.includes(imageUrl)) {
        acc.push(imageUrl)
      }
      return acc
    }, [])

  const images = uniqueImages.slice(0, 5)
  const totalImages = cloudinaryImages.length || shared.allAvailableImages.length || uniqueImages.length

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
    totalImages: totalImages || (images.length > 0 ? images.length : 1),
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
