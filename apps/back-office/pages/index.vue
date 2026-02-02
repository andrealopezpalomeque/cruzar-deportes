<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 md:p-8">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white"></div>
        <div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white"></div>
        <div class="absolute right-1/4 top-1/2 h-20 w-20 rounded-full bg-white"></div>
      </div>

      <!-- Content -->
      <div class="relative">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p class="text-gray-400 text-sm font-medium mb-1">{{ todayFormatted }}</p>
            <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
              {{ greeting }}, {{ displayName }}
            </h1>
            <p class="text-gray-400">
              Aqui tienes el resumen de tu tienda
            </p>
          </div>
          <div class="flex-shrink-0">
            <img
              v-if="authStore.currentUser?.username === 'tati_valesani'"
              src="/tati_valesani.png"
              alt="Profile"
              class="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-white/10 shadow-lg"
              style="object-position: center 10%;"
            />
            <div v-else class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center ring-4 ring-white/10">
              <IconAccount class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconPackageVariant class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Ordenes Nuevas</p>
              <p class="text-2xl font-bold text-gray-900">{{ orderStats.nuevo }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <IconClockOutline class="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pend. Contacto</p>
              <p class="text-2xl font-bold text-gray-900">{{ orderStats.pendingContact }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <IconProgressClock class="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En Proceso</p>
              <p class="text-2xl font-bold text-gray-900">{{ orderStats.inProcess }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <IconCashMultiple class="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Vendido</p>
              <p class="text-2xl font-bold text-gray-900">${{ formatNumber(orderStats.totalRevenue) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Needing Attention -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Ordenes que Requieren Atencion</h3>
            <p class="text-sm text-gray-500 mt-1">Ordenes nuevas o pendientes de contacto</p>
          </div>
          <NuxtLink
            to="/orders"
            class="text-sm text-gray-900 hover:text-black font-medium underline underline-offset-2"
          >
            Ver todas las ordenes
          </NuxtLink>
        </div>
      </div>
      <div class="card-body p-0">
        <!-- Loading -->
        <div v-if="loading" class="p-6 text-center">
          <div class="spinner w-6 h-6 text-gray-900 mx-auto"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="ordersNeedingAttention.length === 0" class="p-6 text-center">
          <IconCheckCircle class="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p class="text-gray-500">No hay ordenes pendientes de atencion</p>
        </div>

        <!-- Orders Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in ordersNeedingAttention"
                :key="order.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-900">{{ order.orderNumber }}</span>
                    <span
                      v-if="!order.contactado"
                      class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700"
                      title="Pendiente de contacto"
                    >
                      <IconClock class="w-3 h-3" />
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ order.customer?.name || '-' }}</div>
                  <div class="text-xs text-gray-500">{{ order.customer?.phone || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ formatNumber(order.totalAmount) }}
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
                  {{ formatRelativeDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <NuxtLink
                    :to="`/orders/${order.id}`"
                    class="text-gray-900 hover:text-black text-sm font-medium underline underline-offset-2"
                  >
                    Ver
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Product Stats (Secondary) -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Resumen de Productos</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-2xl font-bold text-gray-900">{{ productStats.totalProducts }}</p>
            <p class="text-sm text-gray-600">Total</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-2xl font-bold text-gray-900">{{ productStats.featuredProducts }}</p>
            <p class="text-sm text-gray-600">Destacados</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-2xl font-bold text-gray-900">{{ productStats.inStockProducts }}</p>
            <p class="text-sm text-gray-600">En Stock</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconPackageVariant from '~icons/mdi/package-variant'
import IconClockOutline from '~icons/mdi/clock-outline'
import IconClock from '~icons/mdi/clock-outline'
import IconProgressClock from '~icons/mdi/progress-clock'
import IconCashMultiple from '~icons/mdi/cash-multiple'
import IconCheckCircle from '~icons/mdi/check-circle'
import IconAccount from '~icons/mdi/account'

// Define page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const authStore = useAuthStore()
const { loadProducts } = useSharedProducts()
const { loadOrders, getStatusLabel, getStatusColor } = useOrders()

// Display name mapping
const userDisplayNames = {
  'tati_valesani': 'Tati Valesani'
}

// State
const loading = ref(true)
const orders = ref([])
const orderStats = ref({
  nuevo: 0,
  pendingContact: 0,
  inProcess: 0,
  totalRevenue: 0
})
const productStats = ref({
  totalProducts: 0,
  featuredProducts: 0,
  inStockProducts: 0
})

// Computed
const displayName = computed(() => {
  const username = authStore.currentUser?.username
  if (!username) return 'Admin'
  return userDisplayNames[username] || username.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos dias'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const todayFormatted = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const date = new Date().toLocaleDateString('es-AR', options)
  // Capitalize first letter
  return date.charAt(0).toUpperCase() + date.slice(1)
})

const ordersNeedingAttention = computed(() => {
  return orders.value
    .filter(o => o.status === 'nuevo' || !o.contactado)
    .slice(0, 5) // Show max 5
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

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('es-AR')
}

const formatRelativeDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Hace unos segundos'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Hace ${minutes} min`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Hace ${hours}h`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `Hace ${days}d`
    }
  } catch {
    return dateString
  }
}

const loadDashboardData = async () => {
  try {
    loading.value = true

    // Load orders and products in parallel
    const [ordersResult, products] = await Promise.all([
      loadOrders(),
      loadProducts()
    ])

    // Store orders
    orders.value = ordersResult.orders || []

    // Calculate order stats
    const allOrders = orders.value
    orderStats.value = {
      nuevo: allOrders.filter(o => o.status === 'nuevo').length,
      pendingContact: allOrders.filter(o => !o.contactado).length,
      inProcess: allOrders.filter(o =>
        ['en_conversacion', 'confirmado', 'pagado', 'enviado'].includes(o.status)
      ).length,
      totalRevenue: allOrders
        .filter(o => ['pagado', 'enviado', 'entregado'].includes(o.status))
        .reduce((sum, o) => sum + (o.adjustedAmount || o.totalAmount || 0), 0)
    }

    // Calculate product stats
    if (products && products.length > 0) {
      productStats.value = {
        totalProducts: products.length,
        featuredProducts: products.filter(p => p.featured).length,
        inStockProducts: products.filter(p => p.inStock).length
      }
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.card-body {
  @apply px-6 py-4;
}

.spinner {
  @apply animate-spin rounded-full border-2 border-gray-200 border-t-current;
}
</style>
