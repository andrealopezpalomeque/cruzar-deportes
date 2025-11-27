import { requireSession } from '../../utils/session'
import type { ApiResponse, CategoryType } from '~/types'
import type { SharedProduct } from '../../../shared/types'
import { readProductsDatabase } from '~/shared/utils/productSync'

export default defineEventHandler(async (event): Promise<ApiResponse<SharedProduct[]>> => {
  try {
    // Validate session
    requireSession(event)

    // Get query parameters for filtering
    const query = getQuery(event)
    const category = query.category as CategoryType | undefined
    const search = query.search as string | undefined
    const featured = query.featured ? query.featured === 'true' : undefined
    const inStock = query.inStock ? query.inStock === 'true' : undefined

    // Read managed products database as the single source of truth
    const database = await readProductsDatabase()
    let products = Object.values(database.products || {})

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

    // Sort by last modified (newest first)
    const resolveTimestamp = (value?: string) => value ? new Date(value).getTime() : 0
    products.sort((a, b) =>
      resolveTimestamp(b.lastModified || b.createdAt) - resolveTimestamp(a.lastModified || a.createdAt)
    )

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
