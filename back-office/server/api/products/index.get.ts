import { readFile } from 'fs/promises'
import { join } from 'path'
import type { ApiResponse, CategoryType } from '~/types'
import type { SharedProduct, ProductDatabase } from '../../../shared/types'

export default defineEventHandler(async (event): Promise<ApiResponse<SharedProduct[]>> => {
  try {
    // Validate session
    const sessionToken = getCookie(event, 'backoffice_session')
    if (!sessionToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get query parameters for filtering
    const query = getQuery(event)
    const category = query.category as CategoryType | undefined
    const search = query.search as string | undefined
    const featured = query.featured ? query.featured === 'true' : undefined
    const inStock = query.inStock ? query.inStock === 'true' : undefined
    const isProcessed = query.isProcessed ? query.isProcessed === 'true' : undefined

    // Read shared products database
    const sharedDir = '/Users/andreavictorialopezpalomeque/Documents/personal-projects/cruzar-deportes/shared'
    const productsFile = join(sharedDir, 'products.json')

    const data = await readFile(productsFile, 'utf-8')
    const database: ProductDatabase = JSON.parse(data)

    let products = Object.values(database.products)

    // Apply filters
    if (category) {
      products = products.filter(p => p.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      )
    }

    if (featured !== undefined) {
      products = products.filter(p => !!p.featured === featured)
    }

    if (inStock !== undefined) {
      products = products.filter(p => p.inStock === inStock)
    }

    if (isProcessed !== undefined) {
      products = products.filter(p => p.isProcessed === isProcessed)
    }

    // Sort by last modified (newest first)
    products.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

    return {
      success: true,
      data: products,
      message: `Retrieved ${products.length} products`
    }
  } catch (error: any) {
    console.error('Products API error:', error)

    return {
      success: false,
      error: error.message || 'Failed to retrieve products'
    }
  }
})