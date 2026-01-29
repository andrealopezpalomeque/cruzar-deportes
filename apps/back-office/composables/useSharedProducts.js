/**
 * Composable for managing products via external API
 *
 * Uses the external Cruzar API at https://cruzar-api.onrender.com
 * - GET requests: No authentication required
 * - POST/PUT/DELETE requests: Require x-api-key header
 */
export const useSharedProducts = () => {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref(null)

  // Base URL for the external API
  const apiUrl = config.public.apiUrl

  // Helper to get headers for authenticated requests
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (config.public.apiKey) {
      headers['x-api-key'] = config.public.apiKey
    }
    return headers
  }

  // Load products from external API
  const loadProducts = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null

      // Build query string from filters
      const queryParams = new URLSearchParams()
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.featured !== undefined) queryParams.append('featured', filters.featured)
      if (filters.inStock !== undefined) queryParams.append('inStock', filters.inStock)

      const queryString = queryParams.toString()
      const url = `${apiUrl}/api/products${queryString ? `?${queryString}` : ''}`

      const response = await $fetch(url)

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
              } catch (err) {
                console.warn(`Failed to load images for product ${product.id}:`, err)
              }
            }
            return product
          })
        )

        return processedProducts
      } else {
        throw new Error(response.error || 'Failed to load products')
      }
    } catch (err) {
      error.value = err.message || 'Failed to load products'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Load single product
  const loadProduct = async (productId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/products/${productId}`)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err) {
      error.value = err.message || 'Failed to load product'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Save/create product
  const saveProduct = async (product) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: product
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to save product')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to save product'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update product (full update)
  const updateProduct = async (productId, productData) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: productData
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update product')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update product'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update product images
  const updateProductImages = async (productId, selectedImages, allAvailableImages) => {
    try {
      loading.value = true
      error.value = null

      // Use PUT to update the product with new images
      const response = await $fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: {
          selectedImages,
          allAvailableImages
        }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update images')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update images'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update product pricing
  const updateProductPricing = async (productId, price, originalPrice) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: {
          price,
          originalPrice
        }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update pricing')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update pricing'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update product status (featured, inStock, etc.)
  const updateProductStatus = async (productId, updates) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: updates
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update status')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Bulk update products
  const bulkUpdateProducts = async (productIds, updates) => {
    try {
      loading.value = true
      error.value = null

      // Update each product individually since the external API may not support bulk
      const results = await Promise.all(
        productIds.map(async (id) => {
          const response = await $fetch(`${apiUrl}/api/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: updates
          })
          return response
        })
      )

      const failed = results.filter(r => !r.success)
      if (failed.length > 0) {
        throw new Error(`Failed to update ${failed.length} products`)
      }

      return results
    } catch (err) {
      error.value = err.message || 'Failed to bulk update products'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete product')
      }

      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete product'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get database stats
  const getDatabaseStats = async () => {
    try {
      // Try to get stats from the API, fall back to computing from products list
      try {
        const response = await $fetch(`${apiUrl}/api/products/stats`)
        if (response.success && response.data) {
          return response.data
        }
      } catch {
        // Stats endpoint may not exist, compute from products
      }

      // Fallback: compute stats from products list
      const products = await loadProducts()
      return {
        totalProducts: products.length,
        totalImages: products.reduce((acc, p) => acc + (p.selectedImages?.length || 0), 0),
        categories: [...new Set(products.map(p => p.category || p.categoryId))].length
      }
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
    updateProduct,
    updateProductImages,
    updateProductPricing,
    updateProductStatus,
    bulkUpdateProducts,
    deleteProduct,
    getDatabaseStats
  }
}
