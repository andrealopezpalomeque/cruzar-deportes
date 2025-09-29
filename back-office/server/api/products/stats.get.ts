import type { ApiResponse, CategoryType } from '~/types'
import { requireSession } from '../../utils/session'
import { readProductsDatabase } from '~/shared/utils/productSync'

export default defineEventHandler(async (event): Promise<ApiResponse<{
  totalProducts: number
  totalImages: number
  categoryCounts: Record<CategoryType, number>
  lastUpdated: string
  processedProducts: number
  featuredProducts: number
  inStockProducts: number
}>> => {
  try {
    requireSession(event)

    const database = await readProductsDatabase()
    const products = Object.values(database.products)

    const categoryCounts: Record<CategoryType, number> = {
      afc: 0,
      caf: 0,
      eredivisie: 0,
      lpf_afa: 0,
      serie_a_enilive: 0,
      national_retro: 0,
      misc: 0
    }

    for (const product of products) {
      if (categoryCounts[product.category] !== undefined) {
        categoryCounts[product.category]++
      }
    }

    const processedProducts = products.filter(p => p.isProcessed).length
    const featuredProducts = products.filter(p => p.featured).length
    const inStockProducts = products.filter(p => p.inStock).length

    return {
      success: true,
      data: {
        totalProducts: database.metadata.totalProducts,
        totalImages: database.metadata.totalImages,
        categoryCounts,
        lastUpdated: database.lastUpdated,
        processedProducts,
        featuredProducts,
        inStockProducts
      },
      message: 'Stats retrieved successfully'
    }
  } catch (error: any) {
    console.error('Stats API error:', error)

    return {
      success: false,
      error: error.message || 'Failed to retrieve stats'
    }
  }
})
