import type { ApiResponse, ProductVariant } from '~/types'
import type { SharedProduct, ProductDatabase } from '../../../shared/types'
import { promises as fs } from 'fs'
import { join } from 'path'

interface SyncRequest {
  albumPath: string
  variants: ProductVariant[]
}

export default defineEventHandler(async (event): Promise<ApiResponse<boolean>> => {
  try {
    // Validate session
    const sessionToken = getCookie(event, 'backoffice_session')
    if (!sessionToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get request body
    const body = await readBody(event) as SyncRequest
    const { albumPath, variants } = body

    if (!albumPath || !Array.isArray(variants) || variants.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body'
      })
    }

    // Determine category from album path
    const pathParts = albumPath.split('/')
    let category: string

    if (pathParts.length === 4 && pathParts[1] === 'products') {
      // New structure: cruzar-deportes/products/category/team
      category = pathParts[2]
    } else if (pathParts.length === 3) {
      // Legacy structure: cruzar-deportes/category/team
      category = pathParts[1]
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid album path structure'
      })
    }

    // Read existing products.json
    const productsPath = join(process.cwd(), '../shared/products.json')
    let productsData: ProductDatabase

    try {
      const fileContent = await fs.readFile(productsPath, 'utf8')
      productsData = JSON.parse(fileContent)
    } catch (error) {
      // If file doesn't exist, create initial structure
      productsData = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        products: {},
        categories: {} as any,
        metadata: {
          totalProducts: 0,
          totalImages: 0,
          lastSync: new Date().toISOString()
        }
      }
    }

    // Convert variants to SharedProduct format
    const newProducts: Record<string, SharedProduct> = {}

    variants.forEach((variant, index) => {
      const productId = `${variant.slug}-${Date.now()}-${index}`

      // Convert public_ids to full URLs if needed
      const selectedImages = variant.selectedImages.map(imageId => {
        // If it's already a URL, return as is
        if (imageId.startsWith('https://')) {
          return imageId
        }
        // Otherwise, convert public_id to Cloudinary URL
        return `https://res.cloudinary.com/dmb1vyveg/image/upload/${imageId}`
      })

      const product: SharedProduct = {
        id: productId,
        name: variant.name,
        slug: variant.slug,
        description: `${variant.name} - Camiseta deportiva oficial`,
        price: variant.price || 75,
        originalPrice: variant.originalPrice || 90,
        category: category as any,
        selectedImages,
        allAvailableImages: selectedImages, // For now, same as selected
        cloudinaryFolderPath: albumPath,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Home', 'Away'],
        inStock: true,
        stockStatus: 'in_stock',
        featured: false,
        lastModified: new Date().toISOString(),
        isProcessed: true, // Mark as processed since admin created it
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      }

      newProducts[productId] = product
    })

    // Merge with existing products
    productsData.products = {
      ...productsData.products,
      ...newProducts
    }

    // Update metadata
    productsData.lastUpdated = new Date().toISOString()
    productsData.metadata.totalProducts = Object.keys(productsData.products).length
    productsData.metadata.totalImages = Object.values(productsData.products)
      .reduce((total, product) => total + product.selectedImages.length, 0)
    productsData.metadata.lastSync = new Date().toISOString()

    // Write updated products.json
    await fs.writeFile(productsPath, JSON.stringify(productsData, null, 2))

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