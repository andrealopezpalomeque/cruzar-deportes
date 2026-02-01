<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <div
        v-for="stat in statusStats"
        :key="stat.status"
        class="card cursor-pointer transition-all hover:shadow-md"
        :class="{
          'ring-2 ring-blue-500': selectedStatus === stat.status,
          'opacity-60': selectedStatus && selectedStatus !== stat.status
        }"
        @click="filterByStatus(stat.status)"
      >
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <span
              class="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
              :class="getStatusBadgeClass(stat.status)"
            >
              {{ stat.count }}
            </span>
            <button
              v-if="selectedStatus === stat.status"
              @click.stop="clearFilter"
              class="text-gray-400 hover:text-gray-600"
            >
              <IconClose class="w-4 h-4" />
            </button>
          </div>
          <p class="text-xs text-gray-600 mt-2 truncate">
            {{ getStatusLabel(stat.status) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ selectedStatus ? `Ordenes: ${getStatusLabel(selectedStatus)}` : 'Todas las Ordenes' }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ filteredOrders.length }} orden{{ filteredOrders.length !== 1 ? 'es' : '' }}
            </p>
          </div>
          <button
            @click="refreshOrders"
            class="btn btn-secondary"
            :disabled="loading"
          >
            <IconRefresh class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
            Actualizar
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <!-- Loading State -->
        <div v-if="loading && orders.length === 0" class="p-8 text-center">
          <div class="spinner w-8 h-8 text-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Cargando ordenes...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredOrders.length === 0" class="p-8 text-center">
          <IconPackageVariantClosed class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">
            {{ selectedStatus ? 'No hay ordenes con este estado' : 'No hay ordenes todavia' }}
          </p>
        </div>

        <!-- Orders Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="openOrder(order.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-900">
                      {{ order.orderNumber }}
                    </span>
                    <IconWhatsapp
                      v-if="order.whatsappSent"
                      class="w-4 h-4 text-green-500 ml-2"
                      title="WhatsApp enviado"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ order.customer?.name || '-' }}</div>
                  <div class="text-xs text-gray-500">{{ order.customer?.phone || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">
                    {{ order.totalItems }} producto{{ order.totalItems !== 1 ? 's' : '' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    ${{ formatNumber(order.adjustedAmount || order.totalAmount) }}
                  </div>
                  <div
                    v-if="order.adjustedAmount && order.adjustedAmount !== order.totalAmount"
                    class="text-xs text-gray-400 line-through"
                  >
                    ${{ formatNumber(order.totalAmount) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(order.status)"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click.stop="openOrder(order.id)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconClose from '~icons/mdi/close'
import IconRefresh from '~icons/mdi/refresh'
import IconPackageVariantClosed from '~icons/mdi/package-variant-closed'
import IconWhatsapp from '~icons/mdi/whatsapp'

// Define page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const router = useRouter()
const { loading, loadOrders, getStatusLabel, getStatusColor, ORDER_STATUSES } = useOrders()

// State
const orders = ref([])
const selectedStatus = ref(null)

// Computed
const filteredOrders = computed(() => {
  if (!selectedStatus.value) return orders.value
  return orders.value.filter(o => o.status === selectedStatus.value)
})

const statusStats = computed(() => {
  return ORDER_STATUSES.map(s => ({
    status: s.value,
    label: s.label,
    color: s.color,
    count: orders.value.filter(o => o.status === s.value).length
  }))
})

// Methods
const getStatusBadgeClass = (status) => {
  const color = getStatusColor(status)
  const colorMap = {
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  }
  return colorMap[color] || colorMap.gray
}

const filterByStatus = (status) => {
  if (selectedStatus.value === status) {
    selectedStatus.value = null
  } else {
    selectedStatus.value = status
  }
}

const clearFilter = () => {
  selectedStatus.value = null
}

const openOrder = (orderId) => {
  router.push(`/orders/${orderId}`)
}

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('es-AR')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const refreshOrders = async () => {
  try {
    const result = await loadOrders()
    orders.value = result.orders
  } catch (err) {
    console.error('Error loading orders:', err)
  }
}

// Load orders on mount
onMounted(() => {
  refreshOrders()
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-secondary {
  @apply border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500;
}

.spinner {
  @apply animate-spin rounded-full border-2 border-gray-200 border-t-current;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.card-body {
  @apply px-6 py-4;
}
</style>
