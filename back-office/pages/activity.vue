<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="card">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <NuxtLink
              to="/"
              class="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              title="Volver al dashboard"
            >
              <IconArrowLeft class="w-6 h-6" />
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                Actividad Reciente
              </h1>
              <p class="text-gray-600 mt-1">
                Historial completo de cambios en el catálogo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity List -->
    <div class="card">
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-500 mt-4">
            Cargando actividad...
          </p>
        </div>

        <!-- Empty State -->
        <div v-else-if="activities.length === 0" class="text-center py-12">
          <IconClockOutline class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 text-lg">
            No hay actividad reciente
          </p>
          <p class="text-gray-400 text-sm mt-2">
            Los cambios en tu catálogo aparecerán aquí
          </p>
        </div>

        <!-- Activity Items -->
        <div v-else class="space-y-4">
          <div
            v-for="activity in paginatedActivities"
            :key="activity.id"
            class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <!-- Icon -->
            <div class="flex-shrink-0 pt-1">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="getActivityIconClass(activity.type)"
              >
                <component
                  :is="getActivityIcon(activity.type)"
                  class="w-5 h-5 text-white"
                />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-base text-gray-900 font-medium">
                {{ activity.description }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatDate(activity.timestamp) }}
              </p>
            </div>

            <!-- Action Type Badge -->
            <div class="flex-shrink-0">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                :class="getActivityBadgeClass(activity.type)"
              >
                {{ getActivityTypeLabel(activity.type) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && totalPages > 1" class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{{ startItem }}</span> a
              <span class="font-medium">{{ endItem }}</span> de
              <span class="font-medium">{{ activities.length }}</span> actividades
            </div>
            <div class="flex gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconArrowLeft from '~icons/mdi/arrow-left'
import IconClockOutline from '~icons/mdi/clock-outline'
import IconPlus from '~icons/mdi/plus'
import IconPencil from '~icons/mdi/pencil'
import IconDelete from '~icons/mdi/delete'
import IconInformation from '~icons/mdi/information'

// Define page meta
definePageMeta({
  middleware: 'auth'
})

// State
const activities = ref([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const totalPages = computed(() => {
  return Math.ceil(activities.value.length / itemsPerPage)
})

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return activities.value.slice(start, end)
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, activities.value.length)
})

// Methods
const loadActivity = async () => {
  try {
    loading.value = true

    const response = await $fetch('/api/dashboard/activity')

    if (response.success && response.data) {
      activities.value = response.data
    }
  } catch (error) {
    console.error('Error loading activity:', error)
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

const getActivityBadgeClass = (type) => {
  const classMap = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800'
  }
  return classMap[type] || 'bg-gray-100 text-gray-800'
}

const getActivityTypeLabel = (type) => {
  const labelMap = {
    create: 'Creado',
    update: 'Actualizado',
    delete: 'Eliminado'
  }
  return labelMap[type] || 'Cambio'
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
        year: 'numeric',
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
  loadActivity()
})
</script>
