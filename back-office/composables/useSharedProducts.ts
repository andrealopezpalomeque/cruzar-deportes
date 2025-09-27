import type { SharedProduct, ProductDatabase, CategoryType } from '../shared/types'

interface ProductFilters {
  category?: CategoryType
  search?: string
  featured?: boolean
  inStock?: boolean
  isProcessed?: boolean
}

export const useSharedProducts = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load products from shared database
  const loadProducts = async (filters?: ProductFilters): Promise<SharedProduct[]> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        data?: SharedProduct[]
        error?: string
      }>('/api/products', {
        query: filters
      })

      if (response.success && response.data) {
        // Post-process products to ensure they have allAvailableImages populated
        const processedProducts = await Promise.all(
          response.data.map(async (product) => {
            // If product doesn't have allAvailableImages populated, try to load them from Cloudinary
            if (!product.allAvailableImages || product.allAvailableImages.length === 0) {
              try {
                const { getFolderImages } = useCloudinary()
                const folderPath = product.cloudinaryFolderPath
                if (folderPath) {
                  const images = await getFolderImages(folderPath)
                  product.allAvailableImages = images.map(img => img.secure_url)

                  // If selectedImages is empty, use first 5 images as default selection
                  if (!product.selectedImages || product.selectedImages.length === 0) {
                    product.selectedImages = product.allAvailableImages.slice(0, 5)
                  }
                }
              } catch (error) {
                console.warn(`Failed to load images for product ${product.id}:`, error)
              }
            }
            return product
          })
        )

        return processedProducts
      } else {
        throw new Error(response.error || 'Failed to load products')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load products'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Load single product
  const loadProduct = async (productId: string): Promise<SharedProduct | null> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        data?: SharedProduct
        error?: string
      }>(`/api/products/${productId}`)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err: any) {
      error.value = err.message || 'Failed to load product'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Save product
  const saveProduct = async (product: SharedProduct): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        error?: string
      }>('/api/products', {
        method: 'POST',
        body: product
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to save product')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to save product'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update product images
  const updateProductImages = async (
    productId: string,
    selectedImages: string[],
    allAvailableImages?: string[]
  ): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        error?: string
      }>(`/api/products/${productId}/images`, {
        method: 'PATCH',
        body: {
          selectedImages,
          allAvailableImages
        }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update images')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update images'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update product pricing
  const updateProductPricing = async (
    productId: string,
    price: number,
    originalPrice?: number
  ): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        error?: string
      }>(`/api/products/${productId}/pricing`, {
        method: 'PATCH',
        body: {
          price,
          originalPrice
        }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update pricing')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update pricing'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update product status
  const updateProductStatus = async (
    productId: string,
    updates: {
      featured?: boolean
      inStock?: boolean
      stockStatus?: 'in_stock' | 'available_on_order'
    }
  ): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        error?: string
      }>(`/api/products/${productId}/status`, {
        method: 'PATCH',
        body: updates
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update status')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Bulk operations
  const bulkUpdateProducts = async (
    productIds: string[],
    updates: Partial<SharedProduct>
  ): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        error?: string
      }>('/api/products/bulk', {
        method: 'PATCH',
        body: {
          productIds,
          updates
        }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to bulk update products')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to bulk update products'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete product
  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        error?: string
      }>(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete product')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete product'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get database stats
  const getDatabaseStats = async () => {
    try {
      const response = await $fetch<{
        success: boolean
        data?: {
          totalProducts: number
          totalImages: number
          categoryCounts: Record<CategoryType, number>
          lastUpdated: string
        }
        error?: string
      }>('/api/products/stats')

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Failed to get database stats:', err)
      return null
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),

    loadProducts,
    loadProduct,
    saveProduct,
    updateProductImages,
    updateProductPricing,
    updateProductStatus,
    bulkUpdateProducts,
    deleteProduct,
    getDatabaseStats
  }
}