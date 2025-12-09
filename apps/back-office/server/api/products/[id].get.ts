import { readFile } from 'fs/promises'
import { join } from 'path'
import type { ApiResponse } from '~/types'
import type { SharedProduct } from '@cruzar/shared/types'
import { readProductsDatabase } from '@cruzar/shared/utils/productSync'
import { requireSession } from '../../utils/session'

export default defineEventHandler(async (event): Promise<ApiResponse<SharedProduct | null>> => {
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

    // Read shared products database
    const productsFile = join(process.cwd(), '../shared/products.json')

    const data = await readFile(productsFile, 'utf-8')
    const database: ProductDatabase = JSON.parse(data)

    const product = database.products[productId]

    return {
      success: true,
      data: product || null,
      message: product ? 'Product retrieved successfully' : 'Product not found'
    }
  } catch (error: any) {
    console.error('Get product error:', error)

    return {
      success: false,
      error: error.message || 'Failed to retrieve product'
    }
  }
})
