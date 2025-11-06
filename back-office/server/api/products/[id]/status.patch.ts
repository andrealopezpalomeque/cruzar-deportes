import type { ApiResponse } from '~/types'
import { generateAllProducts } from '~/utils/productGenerator'
import { requireSession } from '../../../utils/session'
import {
  readProductsDatabase,
  saveProduct,
  updateProductStatus as updateProductStatusInDb
} from '~/shared/utils/productSync'

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

    const updates = await readBody<{
      featured?: boolean
      inStock?: boolean
      stockStatus?: 'in_stock' | 'available_on_order'
    }>(event)

    if (Object.keys(updates).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one status field is required'
      })
    }

    const database = await readProductsDatabase()

    if (!database.products[productId]) {
      const allProducts = generateAllProducts()
      const sourceProduct = allProducts.find(p => p.id === productId)

      if (!sourceProduct) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found'
        })
      }

      await saveProduct({
        ...sourceProduct,
        lastModified: new Date().toISOString()
      })
    }

    await updateProductStatusInDb(productId, updates)

    return {
      success: true,
      message: 'Product status updated successfully'
    }
  } catch (error: any) {
    console.error('Update product status error:', error)

    return {
      success: false,
      error: error.message || 'Failed to update product status'
    }
  }
})
