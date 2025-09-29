
import type { Product, Category } from '~/types'
import type { ProductDatabase, SharedProduct } from '~/shared/types'
import { getTeamCloudinaryUrls } from '~/utils/cloudinaryUrlMapping'

interface CatalogPayload {
  products: Product[]
  categories: Category[]
}

let cachedCatalog: CatalogPayload | null = null

const FALLBACK_IMAGE = '/images/cruzar-logo-1.png'

const IMAGE_EXTENSION_REGEX = /\.(jpe?g|png|webp|avif|gif|bmp|tiff)(\?|$)/i

const isUsableImageUrl = (url: string): boolean => {
  if (!url) return false

  if (url.startsWith('http')) {
    const parsedHasExtension = IMAGE_EXTENSION_REGEX.test(url)

    // Many older entries pointed to Cloudinary folders that were removed
    // Discard those lacking extensions so we can fall back to the migrated mapping
    if (url.includes('cloudinary.com') && !parsedHasExtension) {
      return false
    }

    return true
  }

  if (url.startsWith('/')) {
    return IMAGE_EXTENSION_REGEX.test(url)
  }

  return true
}

const buildImageGallery = (shared: SharedProduct): { images: string[]; total: number } => {
  const curatedImages = (shared.selectedImages ?? []).filter(isUsableImageUrl)
  const galleryImages = (shared.allAvailableImages ?? []).filter(isUsableImageUrl)

  const teamKey = shared.slug.replace(/-/g, '_')
  const mappedImages = getTeamCloudinaryUrls(teamKey, shared.category).filter(isUsableImageUrl)

  const uniqueImages = [...curatedImages, ...galleryImages, ...mappedImages]
    .reduce<string[]>((acc, imageUrl) => {
      if (imageUrl && !acc.includes(imageUrl)) {
        acc.push(imageUrl)
      }
      return acc
    }, [])

  const images = uniqueImages.slice(0, 5)
  const total = shared.totalImages
    || galleryImages.length
    || mappedImages.length
    || uniqueImages.length

  return {
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    total: total || 1
  }
}

const toProduct = (shared: SharedProduct): Product => {
  const { images, total } = buildImageGallery(shared)

  return {
    id: shared.id,
    name: shared.name,
    slug: shared.slug,
    description: shared.description,
    price: shared.price,
    originalPrice: shared.originalPrice,
    category: shared.category,
    subcategory: shared.subcategory,
    images,
    totalImages: total,
    sizes: shared.sizes,
    colors: shared.colors,
    inStock: shared.inStock,
    featured: shared.featured
  }
}

const toCategory = (database: ProductDatabase): Category[] => {
  return Object.values(database.categories).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description
  }))
}

export const loadCatalog = async (): Promise<CatalogPayload> => {
  if (cachedCatalog) {
    return cachedCatalog
  }

  const module = await import('~/shared/products.json')
  const database = (module.default || module) as ProductDatabase

  const products = Object.values(database.products)
    .map(toProduct)
    .sort((a, b) => a.name.localeCompare(b.name))

  const categories = toCategory(database)
    .sort((a, b) => a.name.localeCompare(b.name))

  cachedCatalog = { products, categories }
  return cachedCatalog
}

export const clearCatalogCache = () => {
  cachedCatalog = null
}
