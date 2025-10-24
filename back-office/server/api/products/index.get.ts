import { requireSession } from '../../utils/session'
import type { ApiResponse, CategoryType } from '~/types'
import type { SharedProduct, ProductDatabase } from '../../../shared/types'
import { generateAllProducts } from '~/utils/productGenerator'
import { readProductsDatabase } from '~/shared/utils/productSync'

export default defineEventHandler(async (event): Promise<ApiResponse<SharedProduct[]>> => {
  try {
    // Validate session
    requireSession(event)

    // Get query parameters for filtering
    const query = getQuery(event)
    const category = query.category as CategoryType | undefined
    const search = query.search as string | undefined
    const featured = query.featured ? query.featured === 'true' : undefined
    const inStock = query.inStock ? query.inStock === 'true' : undefined
    const isProcessed = query.isProcessed ? query.isProcessed === 'true' : undefined

    // Generate all products from static data
    const allProducts = generateAllProducts()

    // Read managed products database for overrides
    let managedProducts: Record<string, SharedProduct> = {}
    try {
      const database: ProductDatabase = await readProductsDatabase()
      managedProducts = database.products || {}
    } catch (error) {
      console.warn('No shared products found, using generated products only', error)
    }

    // Merge generated products with managed overrides
    let products = allProducts.map(product => {
      const managedProduct = managedProducts[product.id]
      if (managedProduct) {
        // Extract the correct folder path from the URLs in allAvailableImages
        let correctFolderPath = product.cloudinaryFolderPath
        if (managedProduct.allAvailableImages && managedProduct.allAvailableImages.length > 0) {
          const firstUrl = managedProduct.allAvailableImages[0]
          const match = firstUrl.match(/cruzar-deportes\/[^\/]+\/[^\/]+\/[^\/]+/)
          if (match) {
            correctFolderPath = match[0]
          }
        }

        // Merge managed data with generated data, prioritizing managed fields
        const managedProcessed = managedProduct.isProcessed
        return {
          ...product,
          ...managedProduct,
          isProcessed: managedProcessed !== undefined ? managedProcessed : true,
          cloudinaryFolderPath: correctFolderPath
        }
      }
      return product
    })

    // Apply filters
    if (category) {
      products = products.filter(p => p.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      )
    }

    if (featured !== undefined) {
      products = products.filter(p => !!p.featured === featured)
    }

    if (inStock !== undefined) {
      products = products.filter(p => p.inStock === inStock)
    }

    if (isProcessed !== undefined) {
      products = products.filter(p => p.isProcessed === isProcessed)
    }

    // Sort by last modified (newest first)
    products.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

    return {
      success: true,
      data: products,
      message: `Retrieved ${products.length} products`
    }
  } catch (error: any) {
    console.error('Products API error:', error)

    return {
      success: false,
      error: error.message || 'Failed to retrieve products'
    }
  }
})
