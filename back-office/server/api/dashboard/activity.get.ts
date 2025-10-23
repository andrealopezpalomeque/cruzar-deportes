import type { ApiResponse } from '~/types'
import { requireSession } from '../../utils/session'
import { readProductsDatabase } from '~/shared/utils/productSync'

const MAX_ACTIVITY_ITEMS = 50

interface ActivityItem {
  id: string
  type: 'create' | 'update' | 'delete'
  description: string
  timestamp: string
}

export default defineEventHandler(async (event): Promise<ApiResponse<ActivityItem[]>> => {
  try {
    // Validate session (simple implementation)
    requireSession(event)

    const database = await readProductsDatabase()

    const sortedProducts = Object.values(database.products)
      .filter(product => product.lastModified)
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

    const activity: ActivityItem[] = sortedProducts.slice(0, MAX_ACTIVITY_ITEMS).map(product => {
      const createdAt = product.createdAt ? new Date(product.createdAt).getTime() : 0
      const lastModifiedAt = product.lastModified ? new Date(product.lastModified).getTime() : createdAt
      const timeDiff = Math.abs(lastModifiedAt - createdAt)

      const type: ActivityItem['type'] = timeDiff <= 5 * 60 * 1000 ? 'create' : 'update'

      const description = type === 'create'
        ? `Añadió el producto "${product.name}"`
        : `Actualizó "${product.name}"`

      return {
        id: product.id,
        type,
        description,
        timestamp: product.lastModified || new Date().toISOString()
      }
    })

    return {
      success: true,
      data: activity,
      message: 'Activity retrieved successfully'
    }
  } catch (error: any) {
    console.error('Dashboard activity error:', error)

    return {
      success: false,
      error: error.statusMessage || 'Failed to retrieve activity'
    }
  }
})
