import type { ApiResponse } from '~/types'
import { requireSession } from '../../utils/session'
import { deleteProduct as deleteSharedProduct } from '@cruzar/shared/utils/productSync'

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    requireSession(event)

    const productId = getRouterParam(event, 'id')
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    const deleted = await deleteSharedProduct(productId)
    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    return {
      success: true,
      message: 'Product deleted successfully'
    }
  } catch (error: any) {
    console.error('Delete product error:', error)

    return {
      success: false,
      error: error.message || 'Failed to delete product'
    }
  }
})
