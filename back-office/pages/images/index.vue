<template>
  <div class="space-y-6">
    <!-- Desktop Header Actions -->
    <div class="hidden lg:flex justify-end mb-4">
      <button
        @click="refreshAlbums"
        class="btn btn-secondary"
        :disabled="loading"
      >
        <Icon name="mdi:refresh" size="16" />
        <span>Actualizar</span>
      </button>
    </div>

    <!-- Mobile Header Actions -->
    <div class="lg:hidden flex justify-end mb-4">
      <button
        @click="refreshAlbums"
        class="btn btn-secondary"
        :disabled="loading"
      >
        <Icon name="mdi:refresh" size="16" />
        <span>Actualizar</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="spinner w-12 h-12 text-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Cargando albums de Cloudinary...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card">
      <div class="card-body text-center py-12">
        <Icon name="mdi:alert-circle" size="48" class="text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Error al cargar albums
        </h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="loadAlbums" class="btn btn-primary">
          <Icon name="mdi:refresh" size="16" />
          Reintentar
        </button>
      </div>
    </div>

    <!-- Albums Content -->
    <div v-else class="space-y-8">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:folder-multiple-image" size="20" class="text-purple-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Albums</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalAlbums }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="images" size="20" class="text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Imágenes</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalImages }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:image-edit" size="20" class="text-yellow-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Sin Procesar</p>
                <p class="text-2xl font-bold text-gray-900">{{ unprocessedAlbums }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="card">
        <div class="card-body p-0">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="selectedCategory = category.id"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                :class="{
                  'border-blue-500 text-blue-600': selectedCategory === category.id,
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': selectedCategory !== category.id
                }"
              >
                {{ category.name }}
                <span
                  class="ml-2 py-0.5 px-2 text-xs rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-600': selectedCategory === category.id,
                    'bg-gray-100 text-gray-600': selectedCategory !== category.id
                  }"
                >
                  {{ getAlbumCountForCategory(category.id) }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Albums Grid -->
          <div class="p-6">
            <div v-if="currentCategoryAlbums.length === 0" class="text-center py-12">
              <Icon name="mdi:folder-open" size="48" class="text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                No hay albums en esta categoría
              </h3>
              <p class="text-gray-500">
                Los albums aparecerán aquí una vez que subas imágenes a Cloudinary
              </p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div
                v-for="album in currentCategoryAlbums"
                :key="album.path"
                class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                @click="openAlbum(album)"
              >
                <!-- Album Cover -->
                <div class="aspect-square relative bg-gray-100">
                  <img
                    v-if="album.images.length > 0 && album.images[0]"
                    :src="cloudinary.getThumbnailUrl(album.images[0].secure_url, 300)"
                    :alt="album.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  >
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Icon name="mdi:image-off" size="48" class="text-gray-300" />
                  </div>

                  <!-- Image Count Badge -->
                  <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {{ album.totalImages }} fotos
                  </div>

                  <!-- Status Badge -->
                  <div
                    class="absolute top-2 left-2 px-2 py-1 text-xs rounded font-medium"
                    :class="{
                      'bg-green-100 text-green-800': album.isProcessed,
                      'bg-yellow-100 text-yellow-800': !album.isProcessed
                    }"
                  >
                    {{ album.isProcessed ? 'Procesado' : 'Pendiente' }}
                  </div>

                  <!-- Hover Overlay -->
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Icon name="eye" size="32" class="text-white" />
                    </div>
                  </div>
                </div>

                <!-- Album Info -->
                <div class="p-4">
                  <h3 class="font-medium text-gray-900 truncate">
                    {{ formatAlbumName(album.name) }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ formatDate(album.lastModified) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Album, CategoryType } from '~/types'

// Define page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const { success: toastSuccess, error: toastError } = useToast()
const cloudinary = useCloudinary()
const router = useRouter()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const selectedCategory = ref<CategoryType>('lpf_afa')
const albumsByCategory = ref<Record<CategoryType, Album[]>>({
  afc: [],
  caf: [],
  eredivisie: [],
  lpf_afa: [],
  serie_a_enilive: [],
  national_retro: []
})

// Categories configuration
const categories = ref([
  { id: 'lpf_afa' as CategoryType, name: 'Liga Profesional Argentina' },
  { id: 'eredivisie' as CategoryType, name: 'Eredivisie' },
  { id: 'serie_a_enilive' as CategoryType, name: 'Serie A Enilive' },
  { id: 'national_retro' as CategoryType, name: 'Camisetas Retro' },
  { id: 'afc' as CategoryType, name: 'Equipos AFC' },
  { id: 'caf' as CategoryType, name: 'Equipos CAF' }
])

// Computed
const currentCategoryAlbums = computed(() => {
  return albumsByCategory.value[selectedCategory.value] || []
})

const totalAlbums = computed(() => {
  return Object.values(albumsByCategory.value).reduce((total, albums) => total + albums.length, 0)
})

const totalImages = computed(() => {
  return Object.values(albumsByCategory.value)
    .reduce((acc, albums) => acc.concat(albums), [])
    .reduce((total, album) => total + album.totalImages, 0)
})

const unprocessedAlbums = computed(() => {
  return Object.values(albumsByCategory.value)
    .reduce((acc, albums) => acc.concat(albums), [])
    .filter(album => !album.isProcessed).length
})

// Methods
const loadAlbums = async () => {
  try {
    loading.value = true
    error.value = null

    const albums = await cloudinary.getAlbumsByCategory()
    albumsByCategory.value = albums

    toastSuccess('Albums cargados correctamente')
  } catch (err: any) {
    error.value = err.message || 'Error al cargar los albums'
    toastError('Error al cargar albums')
  } finally {
    loading.value = false
  }
}

const refreshAlbums = async () => {
  await loadAlbums()
}

const getAlbumCountForCategory = (categoryId: CategoryType): number => {
  return albumsByCategory.value[categoryId]?.length || 0
}

const formatAlbumName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'Fecha desconocida'
  }
}

const openAlbum = (album: Album) => {
  // Navigate to album detail page
  router.push(`/images/${encodeURIComponent(album.path)}`)
}

// Initialize
onMounted(() => {
  loadAlbums()
})
</script>