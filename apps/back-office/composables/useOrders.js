/**
 * Composable for managing orders via external API
 *
 * Uses the external Cruzar API at https://cruzar-api.onrender.com
 * - GET/PUT/PATCH/DELETE requests: Require x-api-key header
 * - POST (create): No authentication required (storefront)
 */
export const useOrders = () => {
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

  // Valid status values
  const ORDER_STATUSES = [
    { value: 'nuevo', label: 'Nuevo', color: 'blue' },
    { value: 'en_conversacion', label: 'En conversación', color: 'yellow' },
    { value: 'confirmado', label: 'Confirmado', color: 'green' },
    { value: 'pagado', label: 'Pagado', color: 'purple' },
    { value: 'enviado', label: 'Enviado', color: 'orange' },
    { value: 'entregado', label: 'Entregado', color: 'green' },
    { value: 'cancelado', label: 'Cancelado', color: 'red' }
  ]

  // Get status label
  const getStatusLabel = (status) => {
    const found = ORDER_STATUSES.find(s => s.value === status)
    return found ? found.label : status
  }

  // Get status color class
  const getStatusColor = (status) => {
    const found = ORDER_STATUSES.find(s => s.value === status)
    return found ? found.color : 'gray'
  }

  // Load all orders from external API
  const loadOrders = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null

      // Build query string from filters
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.limit) queryParams.append('limit', filters.limit)
      if (filters.offset) queryParams.append('offset', filters.offset)

      const queryString = queryParams.toString()
      const url = `${apiUrl}/api/orders${queryString ? `?${queryString}` : ''}`

      const response = await $fetch(url, {
        headers: getAuthHeaders()
      })

      if (response.success && response.data) {
        return {
          orders: response.data,
          total: response.total || response.data.length
        }
      } else {
        throw new Error(response.error || 'Failed to load orders')
      }
    } catch (err) {
      error.value = err.message || 'Failed to load orders'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Load single order
  const loadOrder = async (orderId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/orders/${orderId}`, {
        headers: getAuthHeaders()
      })

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err) {
      error.value = err.message || 'Failed to load order'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update order (full update)
  const updateOrder = async (orderId, orderData) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: orderData
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update order')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update order'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Quick status update
  const updateOrderStatus = async (orderId, status) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: { status }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update order status')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update order status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Toggle contactado (contacted) status
  const toggleContactado = async (orderId, contactado) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: { contactado }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update contact status')
      }

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update contact status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete order')
      }

      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete order'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get order stats
  const getOrderStats = async () => {
    try {
      const { orders } = await loadOrders()

      const stats = {
        total: orders.length,
        nuevo: orders.filter(o => o.status === 'nuevo').length,
        en_conversacion: orders.filter(o => o.status === 'en_conversacion').length,
        confirmado: orders.filter(o => o.status === 'confirmado').length,
        pagado: orders.filter(o => o.status === 'pagado').length,
        enviado: orders.filter(o => o.status === 'enviado').length,
        entregado: orders.filter(o => o.status === 'entregado').length,
        cancelado: orders.filter(o => o.status === 'cancelado').length,
        totalRevenue: orders
          .filter(o => ['pagado', 'enviado', 'entregado'].includes(o.status))
          .reduce((sum, o) => sum + (o.adjustedAmount || o.totalAmount || 0), 0)
      }

      return stats
    } catch (err) {
      console.error('Failed to get order stats:', err)
      return null
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),

    ORDER_STATUSES,
    getStatusLabel,
    getStatusColor,

    loadOrders,
    loadOrder,
    updateOrder,
    updateOrderStatus,
    toggleContactado,
    deleteOrder,
    getOrderStats
  }
}
