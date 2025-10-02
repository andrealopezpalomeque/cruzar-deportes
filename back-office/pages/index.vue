<template>
  <div class="space-y-6">
    <!-- Welcome Message -->
    <div class="card">
      <div class="card-body">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="dashboard" size="24" class="text-white" />
            </div>
          </div>
          <div class="ml-4">
            <h2 class="text-xl font-semibold text-gray-900">
              ¡Bienvenido, {{ authStore.currentUser?.username }}!
            </h2>
            <p class="text-gray-600">
              Administra tu catálogo de camisetas deportivas desde aquí
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="products" size="20" class="text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">
                Total Productos
              </p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.totalProducts }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="mdi:star" size="20" class="text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">
                Destacados
              </p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.featuredProducts }}
              </p>
            </div>
          </div>
        </div>
      </div>


      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="mdi:package-variant-closed" size="20" class="text-yellow-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">
                En Stock
              </p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.inStockProducts }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">
          Acciones Rápidas
        </h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink
            to="/products/manage"
            class="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Icon name="products" size="20" class="text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  Ver Productos
                </p>
                <p class="text-sm text-gray-500">
                  Gestiona tu catálogo
                </p>
              </div>
            </div>
          </NuxtLink>


          <NuxtLink
            to="/bulk-operations"
            class="p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200 group"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Icon name="mdi:format-list-bulleted" size="20" class="text-green-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  Operaciones en Lote
                </p>
                <p class="text-sm text-gray-500">
                  Cambios masivos
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            Actividad Reciente
          </h3>
          <button class="text-sm text-blue-600 hover:text-blue-700">
            Ver todo
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="recentActivity.length === 0" class="text-center py-8">
          <Icon name="mdi:clock-outline" size="48" class="text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">
            No hay actividad reciente
          </p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start space-x-3"
          >
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                   :class="getActivityIconClass(activity.type)"
              >
                <Icon :name="getActivityIcon(activity.type)" size="16" class="text-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatDate(activity.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const authStore = useAuthStore()

// State
const stats = ref({
  totalProducts: 0,
  totalCategories: 6, // Based on your categories
  featuredProducts: 0,
  inStockProducts: 0,
  availableOnOrderProducts: 0,
  recentlyModified: 0
})

const recentActivity = ref([])

const loading = ref(true)

// Methods
const loadDashboardData = async () => {
  try {
    loading.value = true

    // Fetch dashboard stats from API
    const response = await $fetch('/api/dashboard/stats')

    if (response.success && response.data) {
      stats.value = response.data
    }

    // Fetch recent activity
    const activityResponse = await $fetch('/api/dashboard/activity')

    if (activityResponse.success && activityResponse.data) {
      recentActivity.value = activityResponse.data.slice(0, 5) // Show only last 5 activities
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Use mock data for now
    stats.value = {
      totalProducts: 125,
      totalCategories: 6,
      featuredProducts: 18,
      inStockProducts: 98,
      availableOnOrderProducts: 27,
      recentlyModified: 3
    }
  } finally {
    loading.value = false
  }
}

const getActivityIcon = (type) => {
  const iconMap = {
    create: 'mdi:plus',
    update: 'edit',
    delete: 'delete'
  }
  return iconMap[type] || 'mdi:information'
}

const getActivityIconClass = (type) => {
  const classMap = {
    create: 'bg-green-500',
    update: 'bg-blue-500',
    delete: 'bg-red-500'
  }
  return classMap[type] || 'bg-gray-500'
}

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Hace unos segundos'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  } catch (error) {
    return dateString
  }
}

// Load data on mount
onMounted(() => {
  loadDashboardData()
})
</script>