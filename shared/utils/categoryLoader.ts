import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export interface ScraperCategory {
  category_id: number
  path?: string
  label_raw?: string
  label_core?: string
  label_en_guess?: string
  label_es_guess?: string
  label_emoji?: string
}

export interface AvailableCategory {
  slug: string
  name: string
  nameEs?: string | null
  emoji?: string | null
  sourceId?: number
}

const RESOLVED_FROM_SOURCE = fileURLToPath(new URL('../../scraper/data/categories.json', import.meta.url))
const CANDIDATE_CATEGORY_PATHS = [
  RESOLVED_FROM_SOURCE,
  path.resolve(process.cwd(), '../scraper/data/categories.json'),
  path.resolve(process.cwd(), 'scraper/data/categories.json'),
  path.resolve(process.cwd(), '../../scraper/data/categories.json')
]

let cachedCategories: AvailableCategory[] | null = null
let cachedTimestamp: number | null = null
let resolvedCategoriesPath: string | null = null
let cachedPathSignature: string | null = null

export const sanitizeCategorySlug = (text?: string | null): string => {
  if (!text) {
    return ''
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

const buildAvailableCategory = (entry: ScraperCategory): AvailableCategory => {
  const baseName = (entry.label_en_guess || entry.label_core || entry.label_raw || '').trim()
  const fallbackName = baseName || `Categoría ${entry.category_id}`
  const slug = sanitizeCategorySlug(baseName) || `cat_${entry.category_id}`

  return {
    slug,
    name: fallbackName,
    nameEs: entry.label_es_guess?.trim() || null,
    emoji: entry.label_emoji || null,
    sourceId: entry.category_id
  }
}

const resolveCategoriesFilePath = async (): Promise<string | null> => {
  if (resolvedCategoriesPath) {
    return resolvedCategoriesPath
  }

  for (const candidate of CANDIDATE_CATEGORY_PATHS) {
    try {
      await fs.access(candidate)
      resolvedCategoriesPath = candidate
      cachedPathSignature = candidate
      return candidate
    } catch {
      // continue
    }
  }

  return null
}

export const loadAvailableCategories = async (): Promise<AvailableCategory[]> => {
  try {
    const filePath = await resolveCategoriesFilePath()
    if (!filePath) {
      console.warn('Unable to resolve scraper categories file path')
      cachedCategories = []
      cachedTimestamp = Date.now()
      cachedPathSignature = null
      return cachedCategories
    }

    const stats = await fs.stat(filePath)
    if (cachedCategories && cachedTimestamp === stats.mtimeMs && cachedPathSignature === filePath) {
      return cachedCategories
    }

    const content = await fs.readFile(filePath, 'utf-8')
    const rawData = JSON.parse(content) as ScraperCategory[]

    const uniqueCategories = new Map<string, AvailableCategory>()

    for (const entry of rawData) {
      const availableCategory = buildAvailableCategory(entry)
      if (!uniqueCategories.has(availableCategory.slug)) {
        uniqueCategories.set(availableCategory.slug, availableCategory)
      }
    }

    cachedCategories = Array.from(uniqueCategories.values())
    cachedTimestamp = stats.mtimeMs
    cachedPathSignature = filePath
    return cachedCategories
  } catch (error) {
    console.warn('Unable to load scraper categories:', error)
    cachedCategories = []
    cachedTimestamp = Date.now()
    return cachedCategories
  }
}

export const buildCategoryLabel = (category: AvailableCategory): string => {
  const parts: string[] = []

  if (category.emoji) {
    parts.push(category.emoji)
  }

  parts.push(category.name)

  if (category.nameEs && category.nameEs !== category.name) {
    parts.push(`(${category.nameEs})`)
  }

  return parts.join(' ').trim()
}
