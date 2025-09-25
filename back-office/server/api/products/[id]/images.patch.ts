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

    // Update product images
    database.products[productId].selectedImages = selectedImages
    if (allAvailableImages) {
      database.products[productId].allAvailableImages = allAvailableImages
    }
    database.products[productId].lastModified = new Date().toISOString()

    // Update database metadata
    database.lastUpdated = new Date().toISOString()
    database.metadata.totalImages = Object.values(database.products)
      .reduce((total, p) => total + p.selectedImages.length, 0)
    database.metadata.lastSync = new Date().toISOString()

    // Write updated database
    await writeFile(productsFile, JSON.stringify(database, null, 2), 'utf-8')

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