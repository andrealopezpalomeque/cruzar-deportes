import { readFile, writeFile, access } from 'fs/promises'
import { join } from 'path'
import type { ApiResponse } from '~/types'
import type { ProductDatabase } from '../../../../../shared/types'
import { generateAllProducts } from '~/utils/productGenerator'

async function ensureProductsDatabase(productsFile: string): Promise<ProductDatabase> {
  try {
    await access(productsFile)
    const data = await readFile(productsFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // Create default database structure if file doesn't exist
    const now = new Date().toISOString()
    return {
      version: '1.0.0',
      lastUpdated: now,
      products: {},
      categories: {
        afc: { id: 'afc', name: 'Equipos AFC', slug: 'afc', productCount: 0, lastModified: now },
        caf: { id: 'caf', name: 'Equipos CAF', slug: 'caf', productCount: 0, lastModified: now },
        eredivisie: { id: 'eredivisie', name: 'Equipos Eredivisie', slug: 'eredivisie', productCount: 0, lastModified: now },
        serie_a_enilive: { id: 'serie_a_enilive', name: 'Serie A Enilive', slug: 'serie_a_enilive', productCount: 0, lastModified: now },
        lpf_afa: { id: 'lpf_afa', name: 'Liga Profesional Argentina', slug: 'lpf_afa', productCount: 0, lastModified: now },
        national_retro: { id: 'national_retro', name: 'Camisetas Retro Selecciones', slug: 'national_retro', productCount: 0, lastModified: now }
      },
      metadata: {
        totalProducts: 0,
        totalImages: 0,
        lastSync: now
      }
    }
  }
}

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
    const productsFile = join(process.cwd(), '../shared/products.json')
    const database = await ensureProductsDatabase(productsFile)

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
      database.products[productId] = {
        ...sourceProduct,
        isProcessed: true,
        lastModified: new Date().toISOString()
      }
    }

    // Update product pricing
    database.products[productId].price = price
    if (originalPrice !== undefined) {
      database.products[productId].originalPrice = originalPrice
    }
    database.products[productId].lastModified = new Date().toISOString()

    // Update database metadata
    database.lastUpdated = new Date().toISOString()
    database.metadata.lastSync = new Date().toISOString()

    // Write updated database
    await writeFile(productsFile, JSON.stringify(database, null, 2), 'utf-8')

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