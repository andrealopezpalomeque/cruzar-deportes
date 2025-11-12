import type { CategoryType, SharedProduct, SharedCategory } from '../../shared/types'
import { teamCatalog } from '../../shared/catalog.ts'
import { getTeamCloudinaryUrls } from '../utils/cloudinaryUrlMapping.ts'

const loadProductSync = async () => {
  const moduleUrl = new URL('../../shared/utils/productSync.ts', import.meta.url)
  return await import(moduleUrl.href)
}

const FALLBACK_IMAGE = 'https://res.cloudinary.com/dmb1vyveg/image/upload/v1700000000/cruzar-deportes/fallback/jersey-placeholder.jpg'

const buildCloudinaryFolderPath = (teamKey: string, category: CategoryType): string => {
  return `cruzar-deportes/products/${category}/${teamKey}`
}

const fromTeamCatalog = (teamKey: string, teamInfo: typeof teamCatalog[string]): SharedProduct => {
  const now = new Date().toISOString()

  // Get real Cloudinary URLs from the url-mapping.json
  const allAvailableImages = getTeamCloudinaryUrls(teamKey, teamInfo.category)

  const selectedImages = allAvailableImages.slice(0, 5)

  return {
    id: `team-${teamKey}`,
    name: teamInfo.name,
    slug: teamKey.replace(/_/g, '-'),
    description: teamInfo.description,
    price: teamInfo.price,
    originalPrice: teamInfo.originalPrice,
    category: teamInfo.category,
    selectedImages: selectedImages.length > 0 ? selectedImages : [FALLBACK_IMAGE],
    allAvailableImages: allAvailableImages.length > 0 ? allAvailableImages : [FALLBACK_IMAGE],
    cloudinaryFolderPath: buildCloudinaryFolderPath(teamKey, teamInfo.category),
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Home', 'Away'],
    inStock: true,
    stockStatus: 'in_stock',
    featured: false,
    lastModified: now,
    createdAt: now,
    createdBy: 'system'
  }
}

const CATEGORY_LABELS: Record<CategoryType, SharedCategory> = {
  afc: { id: 'afc', name: 'Equipos AFC', slug: 'afc', productCount: 0, lastModified: new Date().toISOString() },
  caf: { id: 'caf', name: 'Equipos CAF', slug: 'caf', productCount: 0, lastModified: new Date().toISOString() },
  eredivisie: { id: 'eredivisie', name: 'Equipos Eredivisie', slug: 'eredivisie', productCount: 0, lastModified: new Date().toISOString() },
  lpf_afa: { id: 'lpf_afa', name: 'Liga Profesional Argentina', slug: 'lpf_afa', productCount: 0, lastModified: new Date().toISOString() },
  serie_a_enilive: { id: 'serie_a_enilive', name: 'Serie A Enilive', slug: 'serie_a_enilive', productCount: 0, lastModified: new Date().toISOString() },
  national_retro: { id: 'national_retro', name: 'Camisetas Retro Selecciones', slug: 'national_retro', productCount: 0, lastModified: new Date().toISOString() },
  basket: { id: 'basket', name: 'Basket', slug: 'basket', productCount: 0, lastModified: new Date().toISOString() }
}

const ensureSelectedImages = (product: SharedProduct): SharedProduct => {
  if (product.selectedImages && product.selectedImages.length > 0) {
    return product
  }

  const images = product.allAvailableImages?.slice(0, 5) ?? []

  if (images.length > 0) {
    return {
      ...product,
      selectedImages: images
    }
  }

  return {
    ...product,
    selectedImages: [FALLBACK_IMAGE],
    allAvailableImages: [FALLBACK_IMAGE]
  }
}

async function rebuildCatalog() {
  const { readProductsDatabase, writeProductsDatabase } = await loadProductSync()
  const database = await readProductsDatabase()
  database.products = database.products || {}
  database.categories = database.categories || {} as Record<CategoryType, SharedCategory>

  const generatedProducts = Object.entries(teamCatalog).map(([teamKey, teamInfo]) =>
    ensureSelectedImages(fromTeamCatalog(teamKey, teamInfo))
  )

  for (const categoryId of Object.keys(CATEGORY_LABELS) as CategoryType[]) {
    if (!database.categories[categoryId]) {
      database.categories[categoryId] = { ...CATEGORY_LABELS[categoryId] }
    }
  }

  for (const product of generatedProducts) {
    if (!database.products[product.id]) {
      // New product - use generated data as-is
      database.products[product.id] = {
        ...product,
        createdAt: product.createdAt ?? new Date().toISOString(),
        createdBy: product.createdBy ?? 'system'
      }
    } else {
      // Existing product - UPDATE image URLs with fresh ones from mapping
      // but preserve user-edited fields like price, featured status, etc.
      const existing = database.products[product.id]
      const hasCuratedSelection = Array.isArray(existing.selectedImages) && existing.selectedImages.length > 0
      const curatedSelection = hasCuratedSelection ? existing.selectedImages : product.selectedImages

      const existingAll = Array.isArray(existing.allAvailableImages) ? existing.allAvailableImages : []
      const generatedAll = Array.isArray(product.allAvailableImages) ? product.allAvailableImages : []

      const baseAll = existingAll.length > 0
        ? existingAll
        : generatedAll

      const mergedAll = Array.from(new Set([
        ...curatedSelection,
        ...baseAll
      ]))

      database.products[product.id] = {
        ...existing,
        selectedImages: curatedSelection,
        allAvailableImages: mergedAll,
        cloudinaryFolderPath: product.cloudinaryFolderPath || existing.cloudinaryFolderPath
      }
    }
  }

  await writeProductsDatabase(database)
  console.log(`Catalog now contains ${Object.keys(database.products).length} products (team catalog length ${Object.keys(teamCatalog).length})`)
}

rebuildCatalog().catch(error => {
  console.error('Failed to rebuild catalog:', error)
  process.exit(1)
})
