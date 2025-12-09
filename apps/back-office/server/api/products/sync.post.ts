import type { ApiResponse, ProductVariant } from '~/types'
import type { SharedProduct } from '@cruzar/shared/types'
import { requireSession } from '../../utils/session'
import { writeProductsDatabase } from '@cruzar/shared/utils/productSync'
import { saveProduct } from '@cruzar/shared/utils/productSync'

interface SyncRequest {
  albumPath: string
  variants: ProductVariant[]
}

const toSharedProduct = (variant: ProductVariant, albumPath: string, category: string, index: number): SharedProduct => {
  const timestamp = Date.now()
  const productId = `${variant.slug}-${timestamp}-${index}`

  const selectedImages = variant.selectedImages.map(imageId => {
    if (imageId.startsWith('https://')) {
      return imageId
    }
    return `https://res.cloudinary.com/dmb1vyveg/image/upload/${imageId}`
  })

  return {
    id: productId,
    name: variant.name,
    slug: variant.slug,
    description: `${variant.name} - Camiseta deportiva oficial`,
    price: variant.price || 75,
    originalPrice: variant.originalPrice || 90,
    category: category as any,
    selectedImages,
    allAvailableImages: selectedImages,
    cloudinaryFolderPath: albumPath,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Home', 'Away'],
    inStock: true,
    stockStatus: 'in_stock',
    featured: false,
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  }
}

export default defineEventHandler(async (event): Promise<ApiResponse<boolean>> => {
  try {
    requireSession(event)

    const body = await readBody<SyncRequest>(event)
    const { albumPath, variants } = body

    if (!albumPath || !Array.isArray(variants) || variants.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body'
      })
    }

    const pathParts = albumPath.split('/')
    let category: string

    if (pathParts.length === 4 && pathParts[1] === 'products') {
      category = pathParts[2]
    } else if (pathParts.length === 3) {
      category = pathParts[1]
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid album path structure'
      })
    }

    for (const [index, variant] of variants.entries()) {
      await saveProduct(toSharedProduct(variant, albumPath, category, index))
    }

    console.log(`Synced ${variants.length} products from album ${albumPath}`)

    return {
      success: true,
      data: true,
      message: `${variants.length} productos sincronizados correctamente`
    }
  } catch (error: any) {
    console.error('Sync products error:', error)

    return {
      success: false,
      error: error.message || 'Failed to sync products'
    }
  }
})
