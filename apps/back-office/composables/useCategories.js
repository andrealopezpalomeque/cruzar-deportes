/**
 * Composable for managing categories via external API
 *
 * Uses the external Cruzar API at https://cruzar-api.onrender.com
 * - GET requests: No authentication required
 * - POST/PUT/DELETE requests: Require x-api-key header
 */
export const useCategories = () => {
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

  // Load all categories from external API
  const loadCategories = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/categories`)

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to load categories')
      }
    } catch (err) {
      error.value = err.message || 'Failed to load categories'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Load single category by ID
  const loadCategory = async (categoryId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/categories/${categoryId}`)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err) {
      error.value = err.message || 'Failed to load category'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new category
  const createCategory = async (category) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: category
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to create category')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to create category'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update category
  const updateCategory = async (categoryId, categoryData) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: categoryData
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update category')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete category
  const deleteCategory = async (categoryId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete category')
      }

      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete category'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get categories as options for select dropdowns
  const getCategoryOptions = async () => {
    try {
      const categories = await loadCategories()
      return categories.map(cat => ({
        value: cat.id,
        label: cat.name,
        slug: cat.slug
      }))
    } catch {
      return []
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),

    loadCategories,
    loadCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryOptions
  }
}
