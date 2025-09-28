import type { ApiResponse, DashboardStats } from '~/types'
import { readProductsDatabase } from '~/shared/utils/productSync'
import { requireSession } from '../../utils/session'

export default defineEventHandler(async (event): Promise<ApiResponse<DashboardStats>> => {
  try {
    // Validate session (simple implementation)
    requireSession(event)

    const database = await readProductsDatabase()

    const products = Object.values(database.products)
    const now = Date.now()
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000

    const stats: DashboardStats = {
      totalProducts: products.length,
      totalCategories: Object.keys(database.categories).length,
      featuredProducts: products.filter(product => product.featured).length,
      inStockProducts: products.filter(product => product.inStock).length,
      availableOnOrderProducts: products.filter(product => product.stockStatus === 'available_on_order').length,
      recentlyModified: products.filter(product => {
        if (!product.lastModified) return false
        const modifiedAt = new Date(product.lastModified).getTime()
        return (now - modifiedAt) <= sevenDaysInMs
      }).length
    }

    return {
      success: true,
      data: stats,
      message: 'Dashboard stats retrieved successfully'
    }
  } catch (error: any) {
    console.error('Dashboard stats error:', error)

    return {
      success: false,
      error: error.statusMessage || 'Failed to retrieve dashboard stats'
    }
  }
})
