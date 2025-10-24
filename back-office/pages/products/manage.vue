<template>
  <div class="p-6 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <select
          v-model="selectedCategory"
          class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las categorías</option>
          <option value="afc">AFC</option>
          <option value="caf">CAF</option>
          <option value="eredivisie">Eredivisie</option>
          <option value="lpf_afa">LPF AFA</option>
          <option value="serie_a_enilive">Serie A Enilive</option>
          <option value="national_retro">Retro Nacional</option>
        </select>

        <select
          v-model="selectedProcessedFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los productos</option>
          <option value="processed">Solo productos gestionados</option>
          <option value="unprocessed">Solo productos sin gestionar</option>
        </select>

        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar productos..."
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Product Stats and Bulk Actions -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
          <span class="font-medium">Mostrando {{ currentRangeStart }}-{{ currentRangeEnd }} de {{ filteredProducts.length }} productos</span>
          <span>Gestionados: {{ filteredProducts.filter(p => p.isProcessed).length }}</span>
          <span>Sin gestionar: {{ filteredProducts.filter(p => !p.isProcessed).length }}</span>
        </div>

        <!-- Bulk Actions -->
        <!-- TODO: Bulk selection feature - to be implemented in the future
        <div v-if="selectedProducts.length > 0" class="flex gap-2">
          <span class="text-sm text-gray-600">{{ selectedProducts.length }} seleccionados:</span>
          <button
            @click="bulkProcessProducts"
            :disabled="processingProducts.bulk"
            :class="[
              'px-3 py-1 bg-green-600 text-white rounded text-sm transition-colors flex items-center gap-2',
              processingProducts.bulk ? 'opacity-70 cursor-wait' : 'hover:bg-green-700'
            ]"
          >
            <IconCheckCircle class="w-4 h-4" />
            <span>Marcar como Gestionados</span>
            <IconLoading
              v-if="processingProducts.bulk"
              class="w-4 h-4 animate-spin text-white"
            />
          </button>
          <button
            @click="clearSelection"
            class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Limpiar
          </button>
        </div>
        -->
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <IconLoading class="w-10 h-10 text-blue-500 animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-3">
        <IconAlertCircle class="w-6 h-6 text-red-500" />
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-else class="relative">
      <!-- Loading Overlay -->
      <Transition name="fade">
        <div
          v-if="isTransitioning"
          class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg"
        >
          <div class="flex flex-col items-center gap-3">
            <IconLoading class="w-10 h-10 text-blue-500 animate-spin" />
            <p class="text-sm text-gray-600 font-medium">Cargando productos...</p>
          </div>
        </div>
      </Transition>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
        <!-- Product Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <!-- Checkbox for bulk selection -->
              <!-- TODO: Bulk selection feature - to be implemented in the future
              <input
                v-if="!product.isProcessed"
                type="checkbox"
                :checked="selectedProducts.includes(product.id)"
                @change="toggleProductSelection(product.id)"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              -->
              <div>
                <h3 class="text-xl font-semibold text-gray-900">{{ product.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ getCategoryName(product.category) }}</p>
              </div>
            </div>

            <!-- Status Badges -->
            <div class="flex flex-col gap-2">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  product.isProcessed ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                ]"
              >
                {{ product.isProcessed ? 'Gestionado' : 'Sin Gestionar' }}
              </span>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  product.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ product.featured ? 'Destacado' : 'Normal' }}
              </span>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ product.inStock ? 'En Stock' : 'A pedido' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Product Content -->
        <div class="p-6 space-y-6">
          <!-- Images Management -->
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-4">Imágenes Seleccionadas</h4>

            <!-- Selected Images Grid -->
            <div v-if="product.selectedImages.length > 0" class="grid grid-cols-4 gap-2 mb-4">
              <div
                v-for="(image, index) in product.selectedImages"
                :key="index"
                class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  :src="optimizeUrl(image, 150)"
                  :alt="`${product.name} ${index + 1}`"
                  class="w-full h-full object-cover"
                />
                <button
                  @click="removeSelectedImage(product.id, index)"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <IconClose class="w-3 h-3" />
                </button>
              </div>
            </div>

            <!-- No Images State -->
            <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
              <IconImageOff class="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500">No hay imágenes seleccionadas</p>
            </div>

            <!-- Browse Images Button -->
            <button
              @click="openImageBrowser(product)"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <IconImageMultiple class="inline w-5 h-5 mr-2" />
              Seleccionar Imágenes
            </button>

            <!-- Process Toggle Button -->
            <button
              @click="processProduct(product)"
              :disabled="processingProducts.single[product.id] || processingProducts.globalSingleActive"
              :class="[
                'w-full px-4 py-2 text-white rounded-lg transition-colors font-medium mt-2 flex items-center justify-center gap-2',
                product.isProcessed ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700',
                processingProducts.single[product.id] || processingProducts.globalSingleActive ? 'opacity-70 cursor-wait' : ''
              ]"
            >
              <component
                :is="product.isProcessed ? IconRestore : IconCheckCircle"
                class="w-5 h-5"
              />
              <span>
                {{ product.isProcessed ? 'Marcar como sin gestionar' : 'Marcar como gestionado' }}
              </span>
              <IconLoading
                v-if="processingProducts.single[product.id]"
                class="w-4 h-4 animate-spin text-white"
              />
            </button>
          </div>

          <!-- Pricing Management -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Precio (ARS)</label>
              <input
                v-model.number="product.price"
                @blur="updateProductPricing(product)"
                type="number"
                step="100"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Precio Original (ARS)</label>
              <input
                v-model.number="product.originalPrice"
                @blur="updateProductPricing(product)"
                type="number"
                step="100"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Status Toggles -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Producto Destacado</span>
              <div class="flex items-center gap-2">
                <button
                  @click="toggleProductStatus(product, 'featured')"
                  :disabled="isStatusLoading(product.id, 'featured')"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    product.featured ? 'bg-blue-600' : 'bg-gray-200',
                    isStatusLoading(product.id, 'featured') ? 'opacity-60 cursor-wait' : ''
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      product.featured ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
                <IconLoading
                  v-if="isStatusLoading(product.id, 'featured')"
                  class="w-4 h-4 text-blue-500 animate-spin"
                />
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">En Stock</span>
              <div class="flex items-center gap-2">
                <button
                  @click="toggleProductStatus(product, 'inStock')"
                  :disabled="isStatusLoading(product.id, 'inStock')"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500',
                    product.inStock ? 'bg-green-600' : 'bg-gray-200',
                    isStatusLoading(product.id, 'inStock') ? 'opacity-60 cursor-wait' : ''
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      product.inStock ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
                <IconLoading
                  v-if="isStatusLoading(product.id, 'inStock')"
                  class="w-4 h-4 text-green-600 animate-spin"
                />
              </div>
            </div>
          </div>

          <!-- Last Modified -->
          <div class="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Última modificación: {{ formatDate(product.lastModified) }}
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="!loading && !error && filteredProducts.length > 0" class="flex justify-center items-center gap-2 mt-8">
      <!-- Previous Button -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        Anterior
      </button>

      <!-- Page Numbers -->
      <div class="flex gap-1">
        <button
          v-for="(page, index) in pageNumbers"
          :key="index"
          @click="page !== '...' && goToPage(page)"
          :disabled="page === '...'"
          :class="[
            'min-w-[2.5rem] h-10 rounded-lg font-medium transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : page === '...'
              ? 'bg-transparent text-gray-400 cursor-default'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        Siguiente
      </button>
    </div>

    <!-- Image Browser Modal -->
    <Teleport to="body">
      <div
        v-if="showImageBrowser"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeImageBrowser"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          <div class="relative bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                Seleccionar Imágenes - {{ selectedProduct?.name }}
              </h3>
              <button
                @click="closeImageBrowser"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IconClose class="w-6 h-6" />
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto">
              <!-- Selected Images (reorderable) -->
              <div v-if="tempSelectedImages.length" class="px-4 sm:px-6 pt-4 sm:pt-6">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-medium text-gray-900">Imágenes seleccionadas</h4>
                  <span class="text-xs text-gray-500 hidden sm:inline">Arrastra para cambiar el orden</span>
                </div>

                <div
                  class="flex flex-wrap gap-2 sm:gap-3"
                  @dragover.prevent="allowSelectedDrop"
                  @drop.prevent="handleSelectedListDrop"
                >
                  <div
                    v-for="(image, index) in tempSelectedImages"
                    :key="image"
                    class="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    draggable="true"
                    :class="draggingSelectedIndex === index ? 'ring-2 ring-blue-400 ring-offset-2' : ''"
                    @dragstart="handleSelectedDragStart(index, $event)"
                    @dragover.prevent="allowSelectedDrop"
                    @drop.prevent="handleSelectedItemDrop(index, $event)"
                    @dragend="handleSelectedDragEnd"
                  >
                    <img
                      :src="optimizeUrl(image, 180)"
                      :alt="`Selected image ${index + 1}`"
                      class="w-full h-full object-cover pointer-events-none"
                    />

                    <span class="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-full">
                      {{ index + 1 }}
                    </span>

                    <button
                      type="button"
                      @click.stop="removeFromSelection(image)"
                      class="absolute top-1 right-1 bg-white/90 text-gray-700 hover:text-red-600 hover:bg-white rounded-full p-1 shadow transition-colors"
                    >
                      <IconClose class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Available Images -->
              <div class="p-4 sm:p-6">
                <div v-if="loadingImages" class="flex justify-center py-8">
                  <IconLoading class="w-8 h-8 text-blue-500 animate-spin" />
                </div>

                <div v-else-if="availableImages.length > 0" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
                  <div
                    v-for="(image, index) in availableImages"
                    :key="index"
                    class="relative group aspect-square"
                  >
                    <img
                      :src="optimizeUrl(image, 150)"
                      :alt="`Available image ${index + 1}`"
                      class="w-full h-full object-cover rounded-lg border-2 cursor-pointer transition-all"
                      :class="[
                        isImageSelected(image) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                      ]"
                      @click="toggleImageSelection(image)"
                    />

                    <!-- Selection Indicator -->
                    <div
                      v-if="isImageSelected(image)"
                      class="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1"
                    >
                      <IconCheck class="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-8">
                  <IconImageOff class="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p class="text-gray-500">No se encontraron imágenes disponibles</p>
                </div>
              </div>
            </div>

            <!-- Modal Footer - Fixed at bottom -->
            <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <p class="text-sm text-gray-600 text-center sm:text-left">
                {{ tempSelectedImages.length }} imágenes seleccionadas
              </p>

              <div class="flex gap-3">
                <button
                  @click="closeImageBrowser"
                  class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="saveImageSelection"
                  class="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar Selección
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import IconLoading from '~icons/eos-icons/loading'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconClose from '~icons/mdi/close'
import IconImageOff from '~icons/mdi/image-off'
import IconImageMultiple from '~icons/mdi/image-multiple'
import IconCheckCircle from '~icons/mdi/check-circle'
import IconCheck from '~icons/mdi/check'
import IconRestore from '~icons/mdi/restore'

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const {
  loadProducts,
  saveProduct,
  updateProductImages,
  updateProductPricing: updateProductPricingAPI,
  updateProductStatus
} = useSharedProducts()
// Removed useCloudinary - now using efficient manifest approach
const toast = useToast()

// Helper to optimize URLs using cloudinaryImageLoader
const optimizeUrl = (url, size = 300) => {
  if (!url.includes('cloudinary.com')) {
    return url
  }
  // Use same optimization logic as home project
  return url.replace('/upload/', `/upload/c_thumb,w_${size},h_${size},g_face/`)
}

// Reactive state
const loading = ref(false)
const error = ref(null)
const products = ref([])
const selectedCategory = ref('')
const selectedProcessedFilter = ref('')
const searchTerm = ref('')
// TODO: Bulk selection feature - to be implemented in the future
// const selectedProducts = ref([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(20)
const isTransitioning = ref(false)

// Image browser state
const showImageBrowser = ref(false)
const selectedProduct = ref(null)
const availableImages = ref([])
const tempSelectedImages = ref([])
const loadingImages = ref(false)
const draggingSelectedIndex = ref(null)
const statusLoading = reactive({})
const processingProducts = reactive({
  single: {},
  bulk: false,
  globalSingleActive: false
})

const allowSelectedDrop = (event) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const moveSelectedImage = (from, to) => {
  if (from === to) return

  const updated = [...tempSelectedImages.value]

  if (from < 0 || from >= updated.length) {
    return
  }

  const [moved] = updated.splice(from, 1)
  const targetIndex = Math.max(0, Math.min(to, updated.length))
  updated.splice(targetIndex, 0, moved)

  tempSelectedImages.value = updated
}

const handleSelectedDragStart = (index, event) => {
  draggingSelectedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

const handleSelectedItemDrop = (index, event) => {
  event.preventDefault()
  if (draggingSelectedIndex.value === null) return

  const from = draggingSelectedIndex.value
  const target = from < index ? index - 1 : index

  moveSelectedImage(from, target)
  draggingSelectedIndex.value = null
}

const handleSelectedListDrop = (event) => {
  event.preventDefault()
  if (draggingSelectedIndex.value === null) return

  const from = draggingSelectedIndex.value
  moveSelectedImage(from, tempSelectedImages.value.length)
  draggingSelectedIndex.value = null
}

const handleSelectedDragEnd = () => {
  draggingSelectedIndex.value = null
}

const removeFromSelection = (imageUrl) => {
  tempSelectedImages.value = tempSelectedImages.value.filter(image => image !== imageUrl)
}

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  if (selectedProcessedFilter.value) {
    if (selectedProcessedFilter.value === 'processed') {
      filtered = filtered.filter(p => p.isProcessed === true)
    } else if (selectedProcessedFilter.value === 'unprocessed') {
      filtered = filtered.filter(p => p.isProcessed === false)
    }
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      (p.description && p.description.toLowerCase().includes(search))
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    // Show pages around current page
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
})

const currentRangeStart = computed(() => {
  return filteredProducts.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
})

const currentRangeEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length)
})

// Methods
const getStatusKey = (productId, field) => `${productId}-${field}`
const isStatusLoading = (productId, field) => Boolean(statusLoading[getStatusKey(productId, field)])

const loadAllProducts = async () => {
  try {
    loading.value = true
    error.value = null
    Object.keys(statusLoading).forEach(key => {
      delete statusLoading[key]
    })
    Object.keys(processingProducts.single).forEach(key => {
      delete processingProducts.single[key]
    })
    processingProducts.bulk = false
    products.value = await loadProducts()
  } catch (err) {
    error.value = err.message
    toast.error('Error al cargar productos')
  } finally {
    loading.value = false
  }
}

const getCategoryName = (category) => {
  const categoryNames = {
    afc: 'AFC',
    caf: 'CAF',
    eredivisie: 'Eredivisie',
    lpf_afa: 'LPF AFA',
    serie_a_enilive: 'Serie A Enilive',
    national_retro: 'Retro Nacional'
  }
  return categoryNames[category] || category
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const removeSelectedImage = async (productId, imageIndex) => {
  try {
    const product = products.value.find(p => p.id === productId)
    if (!product) return

    const updatedImages = [...product.selectedImages]
    updatedImages.splice(imageIndex, 1)

    await updateProductImages(productId, updatedImages, product.allAvailableImages)

    // Update local state
    product.selectedImages = updatedImages

    toast.success('Imagen eliminada')
  } catch (err) {
    toast.error('Error al eliminar imagen')
  }
}

const openImageBrowser = async (product) => {
  selectedProduct.value = product
  tempSelectedImages.value = [...product.selectedImages]
  showImageBrowser.value = true

  // Load available images using smart manifest approach (same as home project)
  try {
    loadingImages.value = true

    // Extract team key from product slug/id
    const teamKey = product.slug.replace(/-/g, '_') // Convert slug back to team key

    // Use the efficient image loader from home project
    const { getTeamImages } = await import('~/utils/cloudinaryImageLoader')
    const images = await getTeamImages(teamKey, product.category)
    const uniqueImages = Array.from(new Set([...images, ...tempSelectedImages.value]))

    availableImages.value = uniqueImages

    console.log(`Found ${availableImages.value.length} images in folder`)
  } catch (err) {
    console.error('Error loading images:', err)
    toast.error('Error al cargar imágenes disponibles')
    availableImages.value = []
  } finally {
    loadingImages.value = false
  }
}

const closeImageBrowser = () => {
  showImageBrowser.value = false
  selectedProduct.value = null
  availableImages.value = []
  tempSelectedImages.value = []
  draggingSelectedIndex.value = null
}

const isImageSelected = (imageUrl) => {
  return tempSelectedImages.value.includes(imageUrl)
}

const toggleImageSelection = (imageUrl) => {
  const index = tempSelectedImages.value.indexOf(imageUrl)
  if (index > -1) {
    tempSelectedImages.value.splice(index, 1)
  } else {
    tempSelectedImages.value.push(imageUrl)
  }
}

const saveImageSelection = async () => {
  if (!selectedProduct.value) return

  try {
    await updateProductImages(
      selectedProduct.value.id,
      tempSelectedImages.value,
      availableImages.value
    )

    // Update local state
    selectedProduct.value.selectedImages = [...tempSelectedImages.value]
    selectedProduct.value.allAvailableImages = [...availableImages.value]

    toast.success('Imágenes actualizadas correctamente')
    closeImageBrowser()
  } catch (err) {
    toast.error('Error al guardar selección de imágenes')
  }
}

const updateProductPricing = async (product) => {
  try {
    await updateProductPricingAPI(product.id, product.price, product.originalPrice)
    toast.success('Precio actualizado')
  } catch (err) {
    toast.error('Error al actualizar precio')
  }
}

const toggleProductStatus = async (product, field) => {
  try {
    const statusKey = getStatusKey(product.id, field)
    if (statusLoading[statusKey]) {
      return
    }
    statusLoading[statusKey] = true

    const updates = {
      [field]: !product[field]
    }

    await updateProductStatus(product.id, updates)

    // Update local state
    product[field] = !product[field]

    const statusName = field === 'featured' ? 'destacado' : 'stock'
    toast.success(`Estado ${statusName} actualizado`)
  } catch (err) {
    toast.error(`Error al actualizar estado ${field}`)
  } finally {
    const statusKey = getStatusKey(product.id, field)
    statusLoading[statusKey] = false
  }
}

const processProduct = async (product) => {
  try {
    if (processingProducts.globalSingleActive) {
      return
    }
    if (processingProducts.single[product.id]) {
      return
    }
    processingProducts.single[product.id] = true
    processingProducts.globalSingleActive = true
    const targetIsProcessed = !product.isProcessed
    const payload = {
      ...product,
      isProcessed: targetIsProcessed
    }
    await saveProduct(payload)

    // Update local state
    product.isProcessed = targetIsProcessed
    product.lastModified = new Date().toISOString()

    toast.success(
      targetIsProcessed
        ? `Producto "${product.name}" marcado como gestionado`
        : `Producto "${product.name}" marcado como sin gestionar`
    )
  } catch (err) {
    toast.error('Error al procesar producto')
  } finally {
    delete processingProducts.single[product.id]
    processingProducts.globalSingleActive = false
  }
}

// TODO: Bulk selection feature - to be implemented in the future
/*
const toggleProductSelection = (productId) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const clearSelection = () => {
  selectedProducts.value = []
}
*/

// TODO: Bulk selection feature - to be implemented in the future
/*
const bulkProcessProducts = async () => {
  if (selectedProducts.value.length === 0) return

  try {
    if (processingProducts.bulk) {
      return
    }
    processingProducts.bulk = true
    loading.value = true
    const productsToProcess = products.value.filter(p => selectedProducts.value.includes(p.id))

    // Process each product
    for (const product of productsToProcess) {
      const payload = {
        ...product,
        isProcessed: true
      }
      await saveProduct(payload)
      product.isProcessed = true
      product.lastModified = new Date().toISOString()
    }

    clearSelection()
    toast.success(`${productsToProcess.length} productos marcados como gestionados`)
  } catch (err) {
    toast.error('Error al procesar productos en lote')
  } finally {
    loading.value = false
    processingProducts.bulk = false
  }
}
*/

const goToPage = async (page) => {
  if (page < 1 || page > totalPages.value) return

  // Show loading state
  isTransitioning.value = true

  // Use nextTick to ensure the transition is visible
  await nextTick()

  // Brief delay for visual feedback
  await new Promise(resolve => setTimeout(resolve, 300))

  currentPage.value = page

  // Scroll to top of products grid
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // Hide loading state
  isTransitioning.value = false
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// Watchers - Reset pagination when filters change
watch([selectedCategory, selectedProcessedFilter, searchTerm], async () => {
  // Show loading state for filter changes
  isTransitioning.value = true

  await nextTick()

  // Brief delay for visual feedback
  await new Promise(resolve => setTimeout(resolve, 300))

  currentPage.value = 1

  // Hide loading state
  isTransitioning.value = false
})

// Lifecycle
onMounted(() => {
  loadAllProducts()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
