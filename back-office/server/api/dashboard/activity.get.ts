import type { ApiResponse } from '~/types'

interface ActivityItem {
  id: string
  type: 'create' | 'update' | 'delete'
  description: string
  timestamp: string
}

export default defineEventHandler(async (event): Promise<ApiResponse<ActivityItem[]>> => {
  try {
    // Validate session (simple implementation)
    const sessionToken = getCookie(event, 'backoffice_session')
    if (!sessionToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Mock activity data
    // In a real implementation, this would fetch from your activity log
    const activity: ActivityItem[] = [
      {
        id: '1',
        type: 'update',
        description: 'Actualizó el precio de "Boca Juniors Jersey"',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
      },
      {
        id: '2',
        type: 'create',
        description: 'Añadió nuevo producto "Inter Milan Kids Kit"',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
      },
      {
        id: '3',
        type: 'update',
        description: 'Marcó como destacado "Argentina Retro 1986"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        id: '4',
        type: 'update',
        description: 'Actualizó imágenes de "Ajax Amsterdam"',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      },
      {
        id: '5',
        type: 'create',
        description: 'Creó nueva categoría de productos',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
      }
    ]

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