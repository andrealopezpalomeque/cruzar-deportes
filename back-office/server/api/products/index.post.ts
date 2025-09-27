import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { ApiResponse } from '~/types'
import type { SharedProduct, ProductDatabase } from '../../../shared/types'

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

    // Get product data from request body
    const product = await readBody<SharedProduct>(event)

    if (!product.id || !product.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID and name are required'
      })
    }

    // Read current database
    const productsFile = join(process.cwd(), '../shared/products.json')

    const data = await readFile(productsFile, 'utf-8')
    const database: ProductDatabase = JSON.parse(data)

    // Update timestamp
    product.lastModified = new Date().toISOString()

    // If new product, set creation time
    if (!database.products[product.id]) {
      product.createdAt = new Date().toISOString()
      product.createdBy = 'admin'
    }

    // Save product
    database.products[product.id] = product

    // Update metadata
    database.lastUpdated = new Date().toISOString()
    database.metadata.totalProducts = Object.keys(database.products).length
    database.metadata.totalImages = Object.values(database.products)
      .reduce((total, p) => total + p.selectedImages.length, 0)
    database.metadata.lastSync = new Date().toISOString()

    // Update category counts
    for (const categoryId of Object.keys(database.categories)) {
      const category = database.categories[categoryId as keyof typeof database.categories]
      if (category) {
        category.productCount = Object.values(database.products)
          .filter(p => p.category === categoryId).length
        category.lastModified = new Date().toISOString()
      }
    }

    // Write updated database
    await writeFile(productsFile, JSON.stringify(database, null, 2), 'utf-8')

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