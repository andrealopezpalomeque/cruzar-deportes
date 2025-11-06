import type { ApiResponse } from '~/types'
import { generateAllProducts } from '~/utils/productGenerator'
import { requireSession } from '../../../utils/session'
import {
  readProductsDatabase,
  saveProduct,
  updateProductPricing as updateProductPricingInDb
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

    // Get pricing data from request body
    const { price, originalPrice } = await readBody<{
      price: number
      originalPrice?: number
    }>(event)

    if (typeof price !== 'number' || price <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid price is required'
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

      // Add the product to the database
      await saveProduct({
        ...sourceProduct,
        lastModified: new Date().toISOString()
      })
    }

    await updateProductPricingInDb(productId, price, originalPrice)

    return {
      success: true,
      message: 'Product pricing updated successfully'
    }
  } catch (error: any) {
    console.error('Update product pricing error:', error)

    return {
      success: false,
      error: error.message || 'Failed to update product pricing'
    }
  }
})
