import type { Product, Category } from '~/types'
import type { SharedProduct, SharedCategory } from '~/shared/types'
import { readProductsDatabase } from '~/shared/utils/productSync'

interface CatalogResponse {
  products: Product[]
  categories: Category[]
}

const mapProductToStorefront = (product: SharedProduct): Product => {
  const images = product.selectedImages.length > 0
    ? product.selectedImages
    : product.allAvailableImages.slice(0, 5)

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    category: product.category,
    subcategory: product.subcategory,
    images,
    totalImages: product.allAvailableImages.length,
    sizes: product.sizes,
    colors: product.colors,
    inStock: product.inStock,
    featured: product.featured
  }
}

const mapCategoryToStorefront = (category: SharedCategory): Category => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description
})

export default defineEventHandler(async (): Promise<CatalogResponse> => {
  try {
    const database = await readProductsDatabase()

    const products = Object.values(database.products)
      .map(mapProductToStorefront)
      // Keep consistent ordering for storefront sections
      .sort((a, b) => a.name.localeCompare(b.name))

    const categories = Object.values(database.categories)
      .map(mapCategoryToStorefront)
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      products,
      categories
    }
  } catch (error) {
    console.error('Catalog API error:', error)
    return {
      products: [],
      categories: []
    }
  }
})
