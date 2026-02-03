/**
 * Composable for managing product types via external API
 *
 * Uses the external Cruzar API
 * - GET requests: No authentication required
 * - POST/PUT/DELETE requests: Require x-api-key header
 */
export const useProductTypes = () => {
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

  // Load all product types from external API
  const loadProductTypes = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/product-types`)

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to load product types')
      }
    } catch (err) {
      error.value = err.message || 'Failed to load product types'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Load single product type by ID
  const loadProductType = async (productTypeId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/product-types/${productTypeId}`)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err) {
      error.value = err.message || 'Failed to load product type'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new product type
  const createProductType = async (productType) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/product-types`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: productType
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to create product type')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to create product type'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update product type
  const updateProductType = async (productTypeId, productTypeData) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/product-types/${productTypeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: productTypeData
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update product type')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update product type'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete product type
  const deleteProductType = async (productTypeId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/product-types/${productTypeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete product type')
      }

      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete product type'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get product types as options for select dropdowns
  const getProductTypeOptions = async () => {
    try {
      const productTypes = await loadProductTypes()
      return productTypes.map(type => ({
        value: type.slug,
        label: type.name,
        id: type.id
      }))
    } catch {
      return []
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),

    loadProductTypes,
    loadProductType,
    createProductType,
    updateProductType,
    deleteProductType,
    getProductTypeOptions
  }
}
