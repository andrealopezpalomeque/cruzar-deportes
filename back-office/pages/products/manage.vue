<template>
  <div class="p-6 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
        <p class="text-gray-600 mt-1">Administra imágenes, precios y estado de productos</p>
      </div>

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
          <option value="misc">Miscellaneous</option>
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
          <span>Total: {{ filteredProducts.length }} productos</span>
          <span>Gestionados: {{ filteredProducts.filter(p => p.isProcessed).length }}</span>
          <span>Sin gestionar: {{ filteredProducts.filter(p => !p.isProcessed).length }}</span>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedProducts.length > 0" class="flex gap-2">
          <span class="text-sm text-gray-600">{{ selectedProducts.length }} seleccionados:</span>
          <button
            @click="bulkProcessProducts"
            class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Marcar como Gestionados
          </button>
          <button
            @click="clearSelection"
            class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="eos-icons:loading" class="text-4xl text-blue-500 animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-3">
        <Icon name="mdi:alert-circle" class="text-red-500 text-xl" />
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <!-- Product Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <!-- Checkbox for bulk selection -->
              <input
                v-if="!product.isProcessed"
                type="checkbox"
                :checked="selectedProducts.includes(product.id)"
                @change="toggleProductSelection(product.id)"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
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
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
              >
                {{ product.inStock ? 'En Stock' : 'Agotado' }}
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
                  <Icon name="mdi:close" class="text-xs" />
                </button>
              </div>
            </div>

            <!-- No Images State -->
            <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
              <Icon name="mdi:image-off" class="text-4xl text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500">No hay imágenes seleccionadas</p>
            </div>

            <!-- Browse Images Button -->
            <button
              @click="openImageBrowser(product)"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Icon name="mdi:image-multiple" class="inline mr-2" />
              Seleccionar Imágenes
            </button>

            <!-- Process Product Button (for unmanaged products) -->
            <button
              v-if="!product.isProcessed"
              @click="processProduct(product)"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mt-2"
            >
              <Icon name="mdi:check-circle" class="inline mr-2" />
              Marcar como Gestionado
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
              <button
                @click="toggleProductStatus(product, 'featured')"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                  product.featured ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    product.featured ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">En Stock</span>
              <button
                @click="toggleProductStatus(product, 'inStock')"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500',
                  product.inStock ? 'bg-green-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    product.inStock ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>

          <!-- Last Modified -->
          <div class="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Última modificación: {{ formatDate(product.lastModified) }}
          </div>
        </div>
      </div>
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

          <div class="relative bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900">
                Seleccionar Imágenes - {{ selectedProduct?.name }}
              </h3>
              <button
                @click="closeImageBrowser"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="mdi:close" class="text-xl" />
              </button>
            </div>

            <!-- Available Images -->
            <div class="p-6 overflow-y-auto max-h-[60vh]">
              <div v-if="loadingImages" class="flex justify-center py-8">
                <Icon name="eos-icons:loading" class="text-2xl text-blue-500 animate-spin" />
              </div>

              <div v-else-if="availableImages.length > 0" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
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
                    <Icon name="mdi:check" class="text-xs" />
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <Icon name="mdi:image-off" class="text-4xl text-gray-400 mx-auto mb-2" />
                <p class="text-gray-500">No se encontraron imágenes disponibles</p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <p class="text-sm text-gray-600">
                {{ tempSelectedImages.length }} imágenes seleccionadas
              </p>

              <div class="flex gap-3">
                <button
                  @click="closeImageBrowser"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="saveImageSelection"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

<script setup lang="ts">
import type { SharedProduct } from '~/shared/types'

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
const optimizeUrl = (url: string, size: number = 300) => {
  if (!url.includes('cloudinary.com')) {
    return url
  }
  // Use same optimization logic as home project
  return url.replace('/upload/', `/upload/c_thumb,w_${size},h_${size},g_face/`)
}

// Reactive state
const loading = ref(false)
const error = ref<string | null>(null)
const products = ref<SharedProduct[]>([])
const selectedCategory = ref('')
const selectedProcessedFilter = ref('')
const searchTerm = ref('')
const selectedProducts = ref<string[]>([])

// Image browser state
const showImageBrowser = ref(false)
const selectedProduct = ref<SharedProduct | null>(null)
const availableImages = ref<string[]>([])
const tempSelectedImages = ref<string[]>([])
const loadingImages = ref(false)

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

// Methods
const loadAllProducts = async () => {
  try {
    loading.value = true
    error.value = null
    products.value = await loadProducts()
  } catch (err: any) {
    error.value = err.message
    toast.error('Error al cargar productos')
  } finally {
    loading.value = false
  }
}

const getCategoryName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    afc: 'AFC',
    caf: 'CAF',
    eredivisie: 'Eredivisie',
    lpf_afa: 'LPF AFA',
    serie_a_enilive: 'Serie A Enilive',
    national_retro: 'Retro Nacional',
    misc: 'Miscellaneous'
  }
  return categoryNames[category] || category
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const removeSelectedImage = async (productId: string, imageIndex: number) => {
  try {
    const product = products.value.find(p => p.id === productId)
    if (!product) return

    const updatedImages = [...product.selectedImages]
    updatedImages.splice(imageIndex, 1)

    await updateProductImages(productId, updatedImages, product.allAvailableImages)

    // Update local state
    product.selectedImages = updatedImages

    toast.success('Imagen eliminada')
  } catch (err: any) {
    toast.error('Error al eliminar imagen')
  }
}

const openImageBrowser = async (product: SharedProduct) => {
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

    availableImages.value = images

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
}

const isImageSelected = (imageUrl: string): boolean => {
  return tempSelectedImages.value.includes(imageUrl)
}

const toggleImageSelection = (imageUrl: string) => {
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
  } catch (err: any) {
    toast.error('Error al guardar selección de imágenes')
  }
}

const updateProductPricing = async (product: SharedProduct) => {
  try {
    await updateProductPricingAPI(product.id, product.price, product.originalPrice)
    toast.success('Precio actualizado')
  } catch (err: any) {
    toast.error('Error al actualizar precio')
  }
}

const toggleProductStatus = async (product: SharedProduct, field: 'featured' | 'inStock') => {
  try {
    const updates = {
      [field]: !product[field]
    }

    await updateProductStatus(product.id, updates)

    // Update local state
    product[field] = !product[field]

    const statusName = field === 'featured' ? 'destacado' : 'stock'
    toast.success(`Estado ${statusName} actualizado`)
  } catch (err: any) {
    toast.error(`Error al actualizar estado ${field}`)
  }
}

const processProduct = async (product: SharedProduct) => {
  try {
    // Create a managed version by saving the product
    await saveProduct(product)

    // Update local state
    product.isProcessed = true
    product.lastModified = new Date().toISOString()

    toast.success(`Producto "${product.name}" marcado como gestionado`)
  } catch (err: any) {
    toast.error('Error al procesar producto')
  }
}

const toggleProductSelection = (productId: string) => {
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

const bulkProcessProducts = async () => {
  if (selectedProducts.value.length === 0) return

  try {
    loading.value = true
    const productsToProcess = products.value.filter(p => selectedProducts.value.includes(p.id))

    // Process each product
    for (const product of productsToProcess) {
      await saveProduct(product)
      product.isProcessed = true
      product.lastModified = new Date().toISOString()
    }

    clearSelection()
    toast.success(`${productsToProcess.length} productos marcados como gestionados`)
  } catch (err: any) {
    toast.error('Error al procesar productos en lote')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadAllProducts()
})
</script>
