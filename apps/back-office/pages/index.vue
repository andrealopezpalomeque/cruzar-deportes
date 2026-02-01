<template>
  <div class="space-y-6">
    <!-- Welcome Message -->
    <div class="card">
      <div class="card-body">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <IconViewDashboard class="w-6 h-6 text-white" />
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
                <IconTshirtCrew class="w-5 h-5 text-green-600" />
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
                <IconStar class="w-5 h-5 text-blue-600" />
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
                <IconPackageVariantClosed class="w-5 h-5 text-yellow-600" />
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
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              Acciones Rápidas
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              Accede a las herramientas clave del back office en un solo clic.
            </p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.title"
            :to="action.to"
            class="p-5 border border-gray-200 rounded-xl transition-all duration-200 group bg-white/60 hover:bg-white hover:shadow-md"
            :class="action.borderClass"
          >
            <div class="flex items-start gap-4">
              <div>
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  :class="action.iconWrapperClass"
                >
                  <component :is="action.icon" class="w-5 h-5" :class="action.iconClass" />
                </div>
              </div>
              <div class="flex-1 space-y-1">
                <p class="text-base font-semibold text-gray-900 group-hover:text-gray-900">
                  {{ action.title }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ action.description }}
                </p>
                <span class="inline-flex items-center text-sm font-medium" :class="action.linkClass">
                  {{ action.cta }}
                  <IconChevronRight class="w-4 h-4 ml-1" />
                </span>
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
          <NuxtLink
            to="/activity"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            Ver todo
          </NuxtLink>
        </div>
      </div>
      <div class="card-body">
        <div v-if="recentActivity.length === 0" class="text-center py-8">
          <IconClockOutline class="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
                <component
                  :is="getActivityIcon(activity.type)"
                  class="w-4 h-4 text-white"
                />
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
import IconViewDashboard from '~icons/mdi/view-dashboard'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconStar from '~icons/mdi/star'
import IconPackageVariantClosed from '~icons/mdi/package-variant-closed'
import IconClockOutline from '~icons/mdi/clock-outline'
import IconCog from '~icons/mdi/cog'
import IconChevronRight from '~icons/mdi/chevron-right'
import IconPlus from '~icons/mdi/plus'
import IconPencil from '~icons/mdi/pencil'
import IconDelete from '~icons/mdi/delete'
import IconInformation from '~icons/mdi/information'

// Define page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const authStore = useAuthStore()
const { loadProducts } = useSharedProducts()

const quickActions = [
  {
    title: 'Ver productos',
    description: 'Gestiona tu catálogo, precios e imágenes',
    to: '/products/manage',
    icon: IconTshirtCrew,
    iconWrapperClass: 'bg-blue-100 group-hover:bg-blue-200',
    iconClass: 'text-blue-600',
    borderClass: 'hover:border-blue-300',
    linkClass: 'text-blue-600 group-hover:text-blue-700',
    cta: 'Ir a productos'
  },
  {
    title: 'Configuración general',
    description: 'Actualiza ajustes y accesos del back office',
    to: '/settings',
    icon: IconCog,
    iconWrapperClass: 'bg-purple-100 group-hover:bg-purple-200',
    iconClass: 'text-purple-600',
    borderClass: 'hover:border-purple-300',
    linkClass: 'text-purple-600 group-hover:text-purple-700',
    cta: 'Abrir configuración'
  },
  {
    title: 'Actividad reciente',
    description: 'Revisa los últimos cambios aplicados al catálogo',
    to: '/activity',
    icon: IconClockOutline,
    iconWrapperClass: 'bg-amber-100 group-hover:bg-amber-200',
    iconClass: 'text-amber-600',
    borderClass: 'hover:border-amber-300',
    linkClass: 'text-amber-600 group-hover:text-amber-700',
    cta: 'Ver historial'
  }
]

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

    // Fetch products from external API and compute stats
    const products = await loadProducts()

    if (products && products.length > 0) {
      stats.value = {
        totalProducts: products.length,
        totalCategories: new Set(products.map(p => p.category || p.categoryId)).size,
        featuredProducts: products.filter(p => p.featured).length,
        inStockProducts: products.filter(p => p.inStock).length,
        availableOnOrderProducts: products.filter(p => !p.inStock).length,
        recentlyModified: products.filter(p => {
          const lastMod = new Date(p.updatedAt || p.lastModified)
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          return lastMod > dayAgo
        }).length
      }
    }

    // Recent activity is not available from external API yet
    // Could be implemented later if needed
    recentActivity.value = []
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    stats.value = {
      totalProducts: 0,
      totalCategories: 0,
      featuredProducts: 0,
      inStockProducts: 0,
      availableOnOrderProducts: 0,
      recentlyModified: 0
    }
  } finally {
    loading.value = false
  }
}

const activityIconMap = {
  create: IconPlus,
  update: IconPencil,
  delete: IconDelete
}

const getActivityIcon = (type) => {
  return activityIconMap[type] || IconInformation
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
