import type { ApiResponse } from '~/types'
import type { SharedProduct } from '../../../shared/types'
import { requireSession } from '../../utils/session'
import { saveProduct } from '~/shared/utils/productSync'

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    requireSession(event)

    const product = await readBody<SharedProduct>(event)

    if (!product.id || !product.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID and name are required'
      })
    }

    product.lastModified = new Date().toISOString()

    if (!product.createdAt) {
      product.createdAt = new Date().toISOString()
    }
    if (!product.createdBy) {
      product.createdBy = 'admin'
    }

    await saveProduct(product)

    return {
      success: true,
      message: 'Product saved successfully'
    }
  } catch (error: any) {
    console.error('Save product error:', error)

    return {
      success: false,
      error: error.message || 'Failed to save product'
    }
  }
})
