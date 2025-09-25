import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { ApiResponse } from '~/types'
import type { ProductDatabase } from '../../../../../shared/types'

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    // Validate session
    const sessionToken = getCookie(event, 'backoffice_session')
    if (!sessionToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const productId = getRouterParam(event, 'id')
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    // Get status data from request body
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

    // Read current database
    const sharedDir = '/Users/andreavictorialopezpalomeque/Documents/personal-projects/cruzar-deportes/shared'
    const productsFile = join(sharedDir, 'products.json')

    const data = await readFile(productsFile, 'utf-8')
    const database: ProductDatabase = JSON.parse(data)

    // Check if product exists
    if (!database.products[productId]) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Update product status fields
    if (updates.featured !== undefined) {
      database.products[productId].featured = updates.featured
    }
    if (updates.inStock !== undefined) {
      database.products[productId].inStock = updates.inStock
    }
    if (updates.stockStatus !== undefined) {
      database.products[productId].stockStatus = updates.stockStatus
    }
    database.products[productId].lastModified = new Date().toISOString()

    // Update database metadata
    database.lastUpdated = new Date().toISOString()
    database.metadata.lastSync = new Date().toISOString()

    // Write updated database
    await writeFile(productsFile, JSON.stringify(database, null, 2), 'utf-8')

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