<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <div
        v-for="stat in statusStats"
        :key="stat.status"
        class="card cursor-pointer transition-all hover:shadow-md"
        :class="{
          'ring-2 ring-brand-orange-500/30': selectedStatus === stat.status,
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
              class="text-ink-subtle hover:text-ink-light"
            >
              <IconClose class="w-4 h-4" />
            </button>
          </div>
          <p class="text-xs text-ink-light mt-2 truncate">
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
            <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink">
              {{ selectedStatus ? `Ordenes: ${getStatusLabel(selectedStatus)}` : 'Todas las Ordenes' }}
            </h3>
            <p class="text-sm text-ink-muted mt-1">
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
          <div class="spinner w-8 h-8 text-ink mx-auto mb-4"></div>
          <p class="text-ink-muted">Cargando ordenes...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredOrders.length === 0" class="p-8 text-center">
          <IconPackageVariantClosed class="w-12 h-12 text-ink-subtle mx-auto mb-4" />
          <p class="text-ink-muted">
            {{ selectedStatus ? 'No hay ordenes con este estado' : 'No hay ordenes todavia' }}
          </p>
        </div>

        <!-- Orders Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-surface-muted">
            <thead class="bg-surface-warm/40">
              <tr>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Orden
                </th>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Productos
                </th>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Total
                </th>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Estado
                </th>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Fecha
                </th>
                <th class="px-6 py-3 text-right font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-surface-muted">
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-surface-warm/50 cursor-pointer"
                @click="openOrder(order.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-ink">
                      {{ order.orderNumber }}
                    </span>
                    <span
                      class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                      :class="order.contactado ? 'bg-brand-sage-100 text-brand-sage-700' : 'bg-brand-orange-100 text-brand-orange-700'"
                      :title="order.contactado ? 'Cliente contactado' : 'Pendiente de contacto'"
                    >
                      <IconCheck v-if="order.contactado" class="w-3 h-3" />
                      <IconClock v-else class="w-3 h-3" />
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-ink">{{ order.customer?.name || '-' }}</div>
                  <div class="text-xs text-ink-muted">{{ order.customer?.phone || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-ink">
                    {{ order.totalItems }} producto{{ order.totalItems !== 1 ? 's' : '' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-ink">
                    ${{ formatNumber(order.adjustedAmount || order.totalAmount) }}
                  </div>
                  <div
                    v-if="order.adjustedAmount && order.adjustedAmount !== order.totalAmount"
                    class="text-xs text-ink-subtle line-through"
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click.stop="openOrder(order.id)"
                    class="text-ink hover:text-ink underline underline-offset-2"
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
import IconCheck from '~icons/mdi/check'
import IconClock from '~icons/mdi/clock-outline'

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
    blue: 'bg-brand-olive-100 text-brand-olive-800',
    yellow: 'bg-brand-orange-100 text-brand-orange-800',
    green: 'bg-brand-sage-100 text-brand-sage-800',
    purple: 'bg-brand-coral-100 text-brand-coral-800',
    orange: 'bg-brand-orange-100 text-brand-orange-800',
    red: 'bg-brand-coral-100 text-brand-coral-800',
    gray: 'bg-surface-muted text-ink-light'
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
  @apply border-surface-muted text-ink-light bg-white hover:bg-surface-warm/50 focus:ring-brand-orange-500/30;
}

.spinner {
  @apply animate-spin rounded-full border-2 border-surface-muted border-t-current;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-surface-muted;
}

.card-header {
  @apply px-6 py-4 border-b border-surface-muted;
}

.card-body {
  @apply px-6 py-4;
}
</style>
