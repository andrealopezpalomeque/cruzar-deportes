import type { ApiResponse } from '~/types'
import { requireSession } from '../../../utils/session'
import {
  readProductsDatabase,
  updateProductImages as updateProductImagesInDb
} from '@cruzar/shared/utils/productSync'

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    // Validate session
    requireSession(event)

    const productId = getRouterParam(event, 'id')
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    // Get image data from request body
    const { selectedImages, allAvailableImages } = await readBody<{
      selectedImages: string[]
      allAvailableImages?: string[]
    }>(event)

    if (!selectedImages || !Array.isArray(selectedImages)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Selected images array is required'
      })
    }

    // Ensure database exists and get current state
    const database = await readProductsDatabase()

    const product = database.products[productId]
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    await updateProductImagesInDb(
      productId,
      selectedImages,
      allAvailableImages ?? product.allAvailableImages
    )

    return {
      success: true,
      message: 'Product images updated successfully'
    }
  } catch (error: any) {
    console.error('Update product images error:', error)

    return {
      success: false,
      error: error.message || 'Failed to update product images'
    }
  }
})
