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
  categoryId?: string
  category?: string
  images?: ApiImage[]
  selectedImages?: string[]
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
 * @param apiProduct - The product from the API
 * @param categoryIdToSlug - Map of category ID to slug for proper lookup
 */
const transformProduct = (apiProduct: ApiProduct, categoryIdToSlug: Map<string, string>): Product => {
  // Handle images: prefer selectedImages (array of URLs), fall back to images (array of objects)
  let images: string[] = []

  if (apiProduct.selectedImages && apiProduct.selectedImages.length > 0) {
    // API returns selectedImages as array of URL strings
    images = apiProduct.selectedImages.filter(Boolean)
  } else if (apiProduct.images && apiProduct.images.length > 0) {
    // Fallback: extract URLs from image objects, sorted by order/main
    const sortedImages = [...apiProduct.images].sort((a, b) => {
      if (a.isMain && !b.isMain) return -1
      if (!a.isMain && b.isMain) return 1
      return (a.order ?? 0) - (b.order ?? 0)
    })
    images = sortedImages.map(img => img.url).filter(Boolean)
  }

  if (images.length === 0) {
    images = [FALLBACK_IMAGE]
  }

  // Handle category: prefer category (slug), fall back to categoryId mapped through lookup
  let categorySlug = apiProduct.category || ''
  if (!categorySlug && apiProduct.categoryId) {
    categorySlug = categoryIdToSlug.get(apiProduct.categoryId) ?? apiProduct.categoryId
  }

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: apiProduct.originalPrice,
    category: categorySlug as CategoryType,
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

    // Process categories first to build the ID → slug map
    const categoryIdToSlug = new Map<string, string>()
    let allCategories: Category[] = []
    if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
      for (const cat of categoriesResponse.data) {
        categoryIdToSlug.set(cat.id, cat.slug)
      }
      allCategories = categoriesResponse.data
        .map(transformCategory)
        .sort((a, b) => a.name.localeCompare(b.name))
    } else {
      console.error('Failed to fetch categories:', categoriesResponse.error)
    }

    if (productsResponse.success && Array.isArray(productsResponse.data)) {
      products = productsResponse.data
        .filter(p => p.isActive)
        .map(p => transformProduct(p, categoryIdToSlug))
        .sort((a, b) => a.name.localeCompare(b.name))
    } else {
      console.error('Failed to fetch products:', productsResponse.error)
    }

    // Only include categories that have at least one active product
    const categorySlugsWithProducts = new Set(products.map(p => p.category))
    categories = allCategories.filter(c => categorySlugsWithProducts.has(c.slug))

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
