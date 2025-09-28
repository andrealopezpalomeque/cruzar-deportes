import { readFile } from 'fs/promises'
import { join } from 'path'
import type { ApiResponse, CategoryType } from '~/types'
import type { ProductDatabase } from '../../../shared/types'
import { requireSession } from '../../utils/session'

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
    // Validate session
    requireSession(event)

    // Read shared products database
    const productsFile = join(process.cwd(), '../shared/products.json')

    const data = await readFile(productsFile, 'utf-8')
    const database: ProductDatabase = JSON.parse(data)

    const products = Object.values(database.products)

    // Calculate category counts
    const categoryCounts: Record<CategoryType, number> = {
      afc: 0,
      caf: 0,
      eredivisie: 0,
      lpf_afa: 0,
      serie_a_enilive: 0,
      national_retro: 0
    }

    for (const product of products) {
      if (categoryCounts[product.category] !== undefined) {
        categoryCounts[product.category]++
      }
    }

    // Calculate other stats
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
