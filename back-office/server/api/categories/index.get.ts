import { requireSession } from '../../utils/session'
import type { ApiResponse } from '~/types'
import { readProductsDatabase } from '~/shared/utils/productSync'
import { loadAvailableCategories, buildCategoryLabel } from '~/shared/utils/categoryLoader'

type CategoryListItem = {
  slug: string
  label: string
  name: string
  nameEs?: string | null
  emoji?: string | null
  productCount: number
}

export default defineEventHandler(async (event): Promise<ApiResponse<CategoryListItem[]>> => {
  try {
    requireSession(event)

    const [database, availableCategories] = await Promise.all([
      readProductsDatabase(),
      loadAvailableCategories()
    ])

    const databaseCategories = database.categories || {}
    const responseCategories: CategoryListItem[] = []
    const seen = new Set<string>()

    for (const category of availableCategories) {
      const storedCategory = databaseCategories[category.slug]
      const name = storedCategory?.name || category.name
      const nameEs = storedCategory?.description || category.nameEs
      const label = buildCategoryLabel({
        ...category,
        name,
        nameEs
      })

      responseCategories.push({
        slug: category.slug,
        label,
        name,
        nameEs,
        emoji: category.emoji,
        productCount: storedCategory?.productCount ?? 0
      })
      seen.add(category.slug)
    }

    for (const [slug, storedCategory] of Object.entries(databaseCategories)) {
      if (seen.has(slug)) continue

      responseCategories.push({
        slug,
        label: storedCategory.name || slug,
        name: storedCategory.name || slug,
        nameEs: storedCategory.description,
        emoji: null,
        productCount: storedCategory.productCount ?? 0
      })
    }

    responseCategories.sort((a, b) => a.label.localeCompare(b.label, 'es'))

    return {
      success: true,
      data: responseCategories
    }
  } catch (error: any) {
    console.error('Failed to load categories:', error)
    return {
      success: false,
      error: error?.message || 'No se pudieron cargar las categorías'
    }
  }
})
