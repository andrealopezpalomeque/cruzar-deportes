import type { Product, Category, CategoryType } from '~/types'

interface CatalogPayload {
  products: Product[]
  categories: Category[]
}

// API response types
interface ApiImage {
  url: string
  publicId?: string
  isMain?: boolean
  order?: number
}

interface ApiProduct {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  currency?: string
  categoryId: string
  images: ApiImage[]
  sizes: string[]
  colors?: string[]
  isActive: boolean
  inStock: boolean
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

interface ApiCategory {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount?: number
}

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

let cachedCatalog: CatalogPayload | null = null

const FALLBACK_IMAGE = '/images/cruzar-logo-1.png'

/**
 * Transform API product to storefront Product type
 */
const transformProduct = (apiProduct: ApiProduct): Product => {
  // Extract image URLs, sorted by order, main image first
  const sortedImages = [...apiProduct.images].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1
    if (!a.isMain && b.isMain) return 1
    return (a.order ?? 0) - (b.order ?? 0)
  })

  const imageUrls = sortedImages.map(img => img.url).filter(Boolean)
  const images = imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE]

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: apiProduct.originalPrice,
    category: apiProduct.categoryId as CategoryType,
    images,
    totalImages: images.length,
    sizes: apiProduct.sizes ?? [],
    colors: apiProduct.colors ?? [],
    inStock: apiProduct.inStock,
    featured: apiProduct.featured ?? false
  }
}

/**
 * Transform API category to storefront Category type
 */
const transformCategory = (apiCategory: ApiCategory): Category => {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    description: apiCategory.description,
    image: apiCategory.image
  }
}

/**
 * Load catalog data from the external API
 */
export const loadCatalog = async (): Promise<CatalogPayload> => {
  if (cachedCatalog) {
    return cachedCatalog
  }

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl as string

  try {
    // Fetch products and categories in parallel
    const [productsResponse, categoriesResponse] = await Promise.all([
      $fetch<ApiResponse<ApiProduct[]>>(`${apiUrl}/api/products`),
      $fetch<ApiResponse<ApiCategory[]>>(`${apiUrl}/api/categories`)
    ])

    let products: Product[] = []
    let categories: Category[] = []

    if (productsResponse.success && Array.isArray(productsResponse.data)) {
      products = productsResponse.data
        .filter(p => p.isActive)
        .map(transformProduct)
        .sort((a, b) => a.name.localeCompare(b.name))
    } else {
      console.error('Failed to fetch products:', productsResponse.error)
    }

    if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
      categories = categoriesResponse.data
        .filter(c => (c.productCount ?? 0) > 0)
        .map(transformCategory)
        .sort((a, b) => a.name.localeCompare(b.name))
    } else {
      console.error('Failed to fetch categories:', categoriesResponse.error)
    }

    cachedCatalog = { products, categories }
    return cachedCatalog
  } catch (error) {
    console.error('Error loading catalog from API:', error)
    return { products: [], categories: [] }
  }
}

/**
 * Clear the cached catalog data
 */
export const clearCatalogCache = () => {
  cachedCatalog = null
}
