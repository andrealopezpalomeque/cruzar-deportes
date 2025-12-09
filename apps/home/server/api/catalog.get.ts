import type { Product, Category } from '~/types'
import { loadCatalog } from '~/utils/catalogLoader'

interface CatalogResponse {
  products: Product[]
  categories: Category[]
}

export default defineEventHandler(async (): Promise<CatalogResponse> => {
  try {
    return await loadCatalog()
  } catch (error) {
    console.error('Catalog API error:', error)
    return {
      products: [],
      categories: []
    }
  }
})
