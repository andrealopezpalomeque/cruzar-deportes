import type { ApiResponse } from '~/types'
import { generateAllProducts } from '~/utils/productGenerator'
import { requireSession } from '../../../utils/session'
import {
  readProductsDatabase,
  saveProduct,
  updateProductImages as updateProductImagesInDb
} from '~/shared/utils/productSync'

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

    // If product doesn't exist in database, find it from generated products and add it
    if (!database.products[productId]) {
      const allProducts = generateAllProducts()
      const sourceProduct = allProducts.find(p => p.id === productId)

      if (!sourceProduct) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found'
        })
      }

      const generatedProduct = {
        ...sourceProduct,
        lastModified: new Date().toISOString()
      }

      await saveProduct(generatedProduct)
      database.products[productId] = generatedProduct
    }

    await updateProductImagesInDb(
      productId,
      selectedImages,
      allAvailableImages ?? database.products[productId].allAvailableImages
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
