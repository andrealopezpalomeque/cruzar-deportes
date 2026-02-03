/**
 * Composable for managing leagues via external API
 *
 * Uses the external Cruzar API
 * - GET requests: No authentication required
 * - POST/PUT/DELETE requests: Require x-api-key header
 */
export const useLeagues = () => {
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

  // Load all leagues from external API
  const loadLeagues = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/leagues`)

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to load leagues')
      }
    } catch (err) {
      error.value = err.message || 'Failed to load leagues'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Load single league by ID
  const loadLeague = async (leagueId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/leagues/${leagueId}`)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err) {
      error.value = err.message || 'Failed to load league'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Load leagues by product type slug
  const loadLeaguesByProductType = async (typeSlug) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/leagues/by-type/${typeSlug}`)

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to load leagues by product type')
      }
    } catch (err) {
      error.value = err.message || 'Failed to load leagues by product type'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new league
  const createLeague = async (league) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/leagues`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: league
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to create league')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to create league'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update league
  const updateLeague = async (leagueId, leagueData) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/leagues/${leagueId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: leagueData
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update league')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update league'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete league
  const deleteLeague = async (leagueId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/leagues/${leagueId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete league')
      }

      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete league'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get leagues as options for select dropdowns
  const getLeagueOptions = async (typeSlug = null) => {
    try {
      const leagues = typeSlug
        ? await loadLeaguesByProductType(typeSlug)
        : await loadLeagues()
      return leagues.map(league => ({
        value: league.slug,
        label: league.name,
        id: league.id,
        applicableTypes: league.applicableTypes
      }))
    } catch {
      return []
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),

    loadLeagues,
    loadLeague,
    loadLeaguesByProductType,
    createLeague,
    updateLeague,
    deleteLeague,
    getLeagueOptions
  }
}
