<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/40" @click="handleClose" />

      <div class="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p class="text-sm uppercase tracking-widest text-gray-400 font-semibold">Nuevo producto</p>
            <h2 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <IconImageMultiple class="w-6 h-6 text-blue-500" />
              Completa los detalles del artículo
            </h2>
          </div>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors"
            :disabled="isSaving"
            @click="handleClose"
          >
            <IconClose class="w-6 h-6" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-8 bg-gray-50/60">
          <!-- General info -->
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase font-semibold text-gray-400">Identidad</p>
                <h3 class="text-lg font-semibold text-gray-900">Nombre y descripción</h3>
              </div>
              <span class="text-xs text-gray-500">Los campos básicos del producto</span>
            </div>

            <div class="grid gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  v-model.trim="form.name"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Ej. Club Atlético Example 2025"
                  :disabled="isSaving"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Slug
                  <span class="text-xs text-gray-400"> URL del producto </span>
                </label>
                <input
                  v-model="form.slug"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="club-example-2025"
                  :disabled="isSaving"
                  @input="markSlugEdited"
                  @blur="handleSlugBlur"
                />
                <p class="text-xs text-gray-500 mt-1">Se usará en el storefront para el enlace del producto.</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  v-model="form.description"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  rows="3"
                  placeholder="Agrega información relevante: torneo, año, detalles de tela..."
                  :disabled="isSaving"
                />
              </div>
            </div>
          </section>

          <!-- Pricing and classification -->
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase font-semibold text-gray-400">Clasificación</p>
                <h3 class="text-lg font-semibold text-gray-900">Precios y categoría</h3>
              </div>
              <span class="text-xs text-gray-500">Controla cómo se mostrará en la tienda</span>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    v-model="form.price"
                    type="number"
                    min="0"
                    step="50"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 pl-7 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="0"
                    :disabled="isSaving"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio original (opcional)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    v-model="form.originalPrice"
                    type="number"
                    min="0"
                    step="50"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 pl-7 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="0"
                    :disabled="isSaving"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                v-model="form.category"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                :disabled="isSaving"
              >
                <option disabled value="">Selecciona una categoría</option>
                <option
                  v-for="option in categoryOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </section>

          <!-- Inventory -->
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase font-semibold text-gray-400">Disponibilidad</p>
                <h3 class="text-lg font-semibold text-gray-900">Inventario y estados</h3>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 bg-gray-50">
                <div>
                  <p class="text-sm font-semibold text-gray-900">En stock</p>
                  <p class="text-xs text-gray-500">Si está apagado, se mostrará "Encargar ahora"</p>
                </div>
                <button
                  type="button"
                  class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors"
                  :class="form.inStock ? 'bg-green-500' : 'bg-gray-300'"
                  @click="form.inStock = !form.inStock"
                >
                  <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    :class="form.inStock ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 bg-gray-50">
                <div>
                  <p class="text-sm font-semibold text-gray-900">Destacado</p>
                  <p class="text-xs text-gray-500">Mostrar en la home</p>
                </div>
                <button
                  type="button"
                  class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors"
                  :class="form.featured ? 'bg-yellow-500' : 'bg-gray-300'"
                  @click="form.featured = !form.featured"
                >
                  <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    :class="form.featured ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
            </div>
          </section>

          <!-- Cloudinary -->
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
            <div>
              <p class="text-xs uppercase font-semibold text-gray-400">Imágenes</p>
              <h3 class="text-lg font-semibold text-gray-900">La carpeta se generará automáticamente</h3>
              <p class="text-sm text-gray-500 mt-1">
                Usamos la categoría seleccionada y el nombre del producto para crear una nueva carpeta en Cloudinary.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ruta generada</label>
              <input
                ref="fileInputRef"
                type="file"
                class="hidden"
                accept="image/*"
                multiple
                @change="handleFilesSelected"
              />
              <input
                :value="generatedFolderPath"
                type="text"
                readonly
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none"
              />
              <p class="text-xs text-gray-500 mt-1">
                Se creará automáticamente en Cloudinary al guardar.
              </p>
            </div>

            <div class="space-y-3 rounded-xl border border-dashed border-gray-200 bg-white/60 p-4">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-semibold text-gray-900">Subí imágenes desde tu computadora</p>
                  <p class="text-xs text-gray-500">
                    Las enviaremos a <span class="font-mono text-[11px]">{{ generatedFolderPath || 'la carpeta del producto' }}</span>
                  </p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!generatedFolderPath || uploadState.isUploading || isSaving"
                  @click="triggerFilePicker"
                >
                  <IconCloudUpload class="w-4 h-4" />
                  {{ uploadState.isUploading ? 'Subiendo...' : 'Seleccionar archivos' }}
                </button>
              </div>
              <p v-if="uploadState.isUploading" class="text-xs text-gray-500">
                Subiendo {{ uploadState.uploaded }} de {{ uploadState.total }} archivos...
              </p>
              <p class="text-xs text-gray-500">
                Podés seleccionar varias imágenes a la vez. Se agregarán automáticamente a la galería de este producto.
              </p>
            </div>

            <!--
            <div class="space-y-3 rounded-xl border border-dashed border-gray-200 bg-white/60 p-4">
              <div>
                <p class="text-sm font-semibold text-gray-900">Agregar imágenes manualmente</p>
                <p class="text-xs text-gray-500">
                  Si ya tenés URLs (por ejemplo, de un producto existente), pegá el enlace y usá los botones de abajo.
                  <strong>Agregar URL</strong> incorpora una sola imagen y
                  <strong>Agregar lista de URLs</strong> acepta múltiples enlaces, uno por línea.
                </p>
              </div>
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  v-model="manualImageUrl"
                  type="text"
                  class="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="https://res.cloudinary.com/.../imagen.jpg"
                  :disabled="isSaving"
                />
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  @click="addManualImage"
                >
                  <IconPlus class="w-4 h-4" />
                  Agregar URL
                </button>
              </div>
              <div class="space-y-2">
                <textarea
                  v-model="bulkImagesInput"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Pega varias URLs separadas por saltos de línea"
                  :disabled="isSaving"
                />
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  @click="addBulkImages"
                >
                  <IconPlus class="w-4 h-4" />
                  Agregar lista de URLs
                </button>
              </div>
            </div>
            -->

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900">Imágenes disponibles</p>
                <span class="text-xs text-gray-500">{{ availableImages.length }} encontradas</span>
              </div>

              <div
                v-if="availableImages.length === 0"
                class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center text-gray-500"
              >
                <IconImageOff class="w-10 h-10 mb-2 text-gray-400" />
                Aún no agregaste imágenes. Subilas desde tu computadora usando el botón superior.
              </div>

              <div
                v-else
                class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
              >
                <button
                  v-for="image in availableImages"
                  :key="image"
                  type="button"
                  class="relative group aspect-square rounded-xl overflow-hidden border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="isImageSelected(image) ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'"
                  @click="toggleImageSelection(image)"
                >
                  <img :src="image" :alt="'Imagen disponible'" class="w-full h-full object-cover" />
                  <div
                    v-if="isImageSelected(image)"
                    class="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow"
                  >
                    <IconCheck class="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>

            <div v-if="form.selectedImages.length" class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900">Orden de las imágenes</p>
                <span class="text-xs text-gray-500">Arrastra con los controles para priorizar</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(image, index) in form.selectedImages"
                  :key="image"
                  class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <span class="w-6 text-xs font-semibold text-gray-500">#{{ index + 1 }}</span>
                  <img :src="image" alt="Seleccionada" class="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                  <div class="flex-1 truncate text-sm text-gray-600">
                    {{ image }}
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      class="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                      :disabled="index === 0"
                      @click="moveSelectedImage(index, -1)"
                    >
                      <IconChevronUp class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                      :disabled="index === form.selectedImages.length - 1"
                      @click="moveSelectedImage(index, 1)"
                    >
                      <IconChevronDown class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      @click="removeSelectedImage(index)"
                    >
                      <IconClose class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 bg-white flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-sm text-gray-500">
            Se crearán {{ form.selectedImages.length }} imágenes destacadas al publicar este producto.
          </p>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
              :disabled="isSaving"
              @click="handleClose"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
              :disabled="isSaving"
              @click="handleSubmit"
            >
              <IconLoading
                v-if="isSaving"
                class="w-4 h-4 animate-spin text-white"
              />
              {{ isSaving ? 'Guardando...' : 'Crear producto' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import IconClose from '~icons/mdi/close'
import IconImageMultiple from '~icons/mdi/image-multiple'
import IconImageOff from '~icons/mdi/image-off'
import IconCheck from '~icons/mdi/check'
import IconChevronUp from '~icons/mdi/chevron-up'
import IconChevronDown from '~icons/mdi/chevron-down'
import IconPlus from '~icons/mdi/plus'
import IconCloudUpload from '~icons/mdi/cloud-upload'
import IconLoading from '~icons/eos-icons/loading'
import { slugify, buildProductIdFromSlug } from '~/utils/slugify'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  existingSlugs: {
    type: Array,
    default: () => []
  },
  existingIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'created'])

const { saveProduct } = useSharedProducts()
const { uploadImage } = useCloudinary()
const toast = useToast()

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const DEFAULT_COLORS = ['Home', 'Away']

const form = reactive({
  name: '',
  slug: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  inStock: true,
  featured: false,
  selectedImages: [],
  allAvailableImages: []
})

const availableImages = ref([])
const isSaving = ref(false)
const slugEdited = ref(false)
const manualImageUrl = ref('')
const bulkImagesInput = ref('')
const fileInputRef = ref(null)
const uploadState = reactive({
  isUploading: false,
  uploaded: 0,
  total: 0
})

const categoryOptions = computed(() => props.categories.filter(option => option.value))
const firstCategoryValue = computed(() => categoryOptions.value[0]?.value || '')

const normalizedExistingSlugs = computed(() => props.existingSlugs.map(slug => (slug || '').toString().toLowerCase()).filter(Boolean))
const existingIdsSet = computed(() => new Set(props.existingIds || []))
const generatedFolderPath = computed(() => {
  if (!form.category) {
    return ''
  }

  const normalizedSlug = slugify(form.slug || form.name)
  const fallbackSlug = normalizedSlug || slugify(form.name) || 'nuevo-producto'
  const folderSegment = fallbackSlug.replace(/-/g, '_')

  return `cruzar-deportes/products/${form.category}/${folderSegment}`
})

watch(() => props.show, (visible) => {
  if (visible) {
    resetForm()
  } else {
    availableImages.value = []
  }
})

watch(() => form.name, (value) => {
  if (!slugEdited.value) {
    form.slug = slugify(value)
  }
})

watch(() => form.slug, (value) => {
  if (!value) {
    slugEdited.value = false
  }
})

const resetForm = () => {
  form.name = ''
  form.slug = ''
  form.description = ''
  form.price = ''
  form.originalPrice = ''
  form.category = firstCategoryValue.value
  form.inStock = true
  form.featured = false
  form.selectedImages = []
  form.allAvailableImages = []
  availableImages.value = []
  slugEdited.value = false
  manualImageUrl.value = ''
  bulkImagesInput.value = ''
}

const markSlugEdited = () => {
  slugEdited.value = true
}

const handleSlugBlur = () => {
  if (!form.slug) {
    form.slug = slugify(form.name)
    slugEdited.value = false
  }
}

const appendImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return
  }

  if (!availableImages.value.includes(imageUrl)) {
    availableImages.value = [...availableImages.value, imageUrl]
  }

  if (!form.allAvailableImages.includes(imageUrl)) {
    form.allAvailableImages = [...form.allAvailableImages, imageUrl]
  }

  if (!form.selectedImages.includes(imageUrl)) {
    form.selectedImages = [...form.selectedImages, imageUrl]
  }
}

const isImageSelected = (imageUrl) => form.selectedImages.includes(imageUrl)

const toggleImageSelection = (imageUrl) => {
  if (!availableImages.value.includes(imageUrl)) return

  if (form.selectedImages.includes(imageUrl)) {
    form.selectedImages = form.selectedImages.filter(url => url !== imageUrl)
  } else {
    form.selectedImages = [...form.selectedImages, imageUrl]
  }
}

const addManualImage = () => {
  const normalized = manualImageUrl.value.trim()
  if (!normalized) return
  const ensureHttps = normalized.startsWith('http') ? normalized : `https://${normalized}`
  appendImageUrl(ensureHttps)
  manualImageUrl.value = ''
}

const addBulkImages = () => {
  const entries = bulkImagesInput.value
    .split(/\r?\n/)
    .map(url => url.trim())
    .filter(Boolean)
  if (entries.length === 0) return

  for (const entry of entries) {
    const normalized = entry.startsWith('http') ? entry : `https://${entry}`
    appendImageUrl(normalized)
  }
  bulkImagesInput.value = ''
}

const triggerFilePicker = () => {
  if (!generatedFolderPath.value) {
    toast.info('Definí nombre y categoría antes de subir imágenes')
    return
  }
  fileInputRef.value?.click()
}

const handleFilesSelected = async (event) => {
  const input = event.target
  const files = Array.from(input?.files || [])
  if (!files.length) {
    return
  }

  if (!generatedFolderPath.value) {
    toast.error('Seleccioná una categoría y nombre antes de subir imágenes')
    if (input) {
      input.value = ''
    }
    return
  }

  uploadState.isUploading = true
  uploadState.uploaded = 0
  uploadState.total = files.length

  for (const file of files) {
    try {
      const uploadedAsset = await uploadImage(file, generatedFolderPath.value)
      const secureUrl = uploadedAsset?.secure_url || uploadedAsset
      appendImageUrl(secureUrl)
      uploadState.uploaded += 1
    } catch (error) {
      console.error('Error al subir imagen', error)
      toast.error(`No pudimos subir "${file.name}"`)
    }
  }

  uploadState.isUploading = false
  uploadState.uploaded = 0
  uploadState.total = 0
  if (input) {
    input.value = ''
  }
}

const moveSelectedImage = (index, direction) => {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= form.selectedImages.length) {
    return
  }

  const updated = [...form.selectedImages]
  const [moved] = updated.splice(index, 1)
  updated.splice(targetIndex, 0, moved)
  form.selectedImages = updated
}

const removeSelectedImage = (index) => {
  const updated = [...form.selectedImages]
  updated.splice(index, 1)
  form.selectedImages = updated
}

const parsePrice = (value) => {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const parsed = Number(value)
  if (Number.isNaN(parsed) || parsed < 0) {
    return null
  }
  return Number(parsed.toFixed(2))
}

const validateForm = () => {
  if (!form.name.trim()) {
    return 'El nombre es obligatorio'
  }

  const normalizedSlug = slugify(form.slug || form.name)
  if (!normalizedSlug) {
    return 'El slug es obligatorio'
  }

  if (normalizedExistingSlugs.value.includes(normalizedSlug.toLowerCase())) {
    return 'Ya existe un producto con ese slug'
  }

  if (!form.category) {
    return 'Seleccioná una categoría'
  }

  if (!generatedFolderPath.value) {
    return 'No pudimos generar la carpeta, verificá el nombre y la categoría'
  }

  const price = parsePrice(form.price)
  if (price === null) {
    return 'Ingresá un precio válido'
  }

  if (form.selectedImages.length === 0) {
    return 'Seleccioná al menos una imagen para mostrar'
  }

  const generatedId = buildProductIdFromSlug(normalizedSlug)
  if (existingIdsSet.value.has(generatedId)) {
    return 'Ya existe un producto con ese identificador. Modificá el slug.'
  }

  return null
}

const handleSubmit = async () => {
  const validationError = validateForm()
  if (validationError) {
    toast.error(validationError)
    return
  }

  const normalizedSlug = slugify(form.slug || form.name)
  const now = new Date().toISOString()
  const price = parsePrice(form.price) ?? 0
  const originalPrice = parsePrice(form.originalPrice ?? null) ?? undefined
  const payload = {
    id: buildProductIdFromSlug(normalizedSlug),
    name: form.name.trim(),
    slug: normalizedSlug,
    description: form.description?.trim() || '',
    price,
    originalPrice,
    categoryId: form.category,  // API expects "categoryId", not "category"
    category: form.category,    // Also include "category" for front-end consistency
    images: [...form.selectedImages],  // API expects "images" field
    selectedImages: [...form.selectedImages],
    allAvailableImages: form.allAvailableImages.length > 0
      ? [...new Set(form.allAvailableImages)]
      : [...form.selectedImages],
    cloudinaryFolderPath: generatedFolderPath.value,
    sizes: [...DEFAULT_SIZES],
    inStock: form.inStock,
    featured: form.featured,
    lastModified: now,
    createdAt: now,
    createdBy: 'admin'
  }

  try {
    isSaving.value = true
    await saveProduct(payload)
    toast.success('Producto creado correctamente')
    emit('created', payload)
  } catch (error) {
    console.error('Error al crear el producto:', error)
    toast.error('No pudimos crear el producto')
  } finally {
    isSaving.value = false
  }
}

const handleClose = () => {
  if (isSaving.value) {
    return
  }
  emit('close')
}
</script>
