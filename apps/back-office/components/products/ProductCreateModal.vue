<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" @click="handleClose" />

      <div class="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-sm bg-white shadow-2xl shadow-ink/20 flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-surface-muted">
          <div>
            <p class="font-display text-xs font-semibold uppercase tracking-widest text-brand-orange-600">Nuevo producto</p>
            <h2 class="font-display text-2xl font-bold uppercase tracking-tight text-ink flex items-center gap-2 mt-1">
              <IconImageMultiple class="w-6 h-6 text-brand-orange-600" />
              Completa los detalles del artículo
            </h2>
          </div>
          <button
            class="text-ink-subtle hover:text-ink transition-colors"
            :disabled="isSaving"
            @click="handleClose"
          >
            <IconClose class="w-6 h-6" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-surface-cream">
          <!-- General info -->
          <section class="bg-white rounded-sm shadow-sm border border-surface-muted p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-display text-[11px] font-semibold uppercase tracking-widest text-brand-orange-600">Identidad</p>
                <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink">Nombre y descripción</h3>
              </div>
              <span class="text-xs text-ink-muted">Los campos básicos del producto</span>
            </div>

            <div class="grid gap-4">
              <div>
                <label class="form-label">Nombre</label>
                <input
                  v-model.trim="form.name"
                  type="text"
                  class="form-input"
                  placeholder="Ej. Club Atlético Example 2025"
                  :disabled="isSaving"
                />
              </div>

              <div>
                <label class="form-label flex items-center gap-2">
                  Slug
                  <span class="text-xs text-ink-subtle"> URL del producto </span>
                </label>
                <input
                  v-model="form.slug"
                  type="text"
                  class="form-input"
                  placeholder="club-example-2025"
                  :disabled="isSaving"
                  @input="markSlugEdited"
                  @blur="handleSlugBlur"
                />
                <p class="text-xs text-ink-muted mt-1">Se usará en el storefront para el enlace del producto.</p>
              </div>

              <div>
                <label class="form-label">Descripción</label>
                <textarea
                  v-model="form.description"
                  class="form-input"
                  rows="3"
                  placeholder="Agrega información relevante: torneo, año, detalles de tela..."
                  :disabled="isSaving"
                />
              </div>
            </div>
          </section>

          <!-- Pricing and classification -->
          <section class="bg-white rounded-sm shadow-sm border border-surface-muted p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-display text-[11px] font-semibold uppercase tracking-widest text-brand-orange-600">Clasificación</p>
                <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink">Precios y tipo de producto</h3>
              </div>
              <span class="text-xs text-ink-muted">Controla cómo se mostrará en la tienda</span>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="form-label">Precio</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted">$</span>
                  <input
                    v-model="form.price"
                    type="number"
                    min="0"
                    step="50"
                    class="form-input pl-7 pr-4"
                    placeholder="0"
                    :disabled="isSaving"
                  />
                </div>
              </div>
              <div>
                <label class="form-label">Precio original (opcional)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted">$</span>
                  <input
                    v-model="form.originalPrice"
                    type="number"
                    min="0"
                    step="50"
                    class="form-input pl-7 pr-4"
                    placeholder="0"
                    :disabled="isSaving"
                  />
                </div>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="form-label">Tipo de Producto</label>
                <select
                  v-model="form.productType"
                  class="form-input"
                  :disabled="isSaving"
                >
                  <option disabled value="">Selecciona un tipo</option>
                  <option
                    v-for="option in productTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="form-label">Liga / Categoría</label>
                <select
                  v-model="form.league"
                  class="form-input"
                  :disabled="isSaving || !form.productType"
                >
                  <option disabled value="">{{ form.productType ? 'Selecciona una liga' : 'Primero selecciona un tipo' }}</option>
                  <option
                    v-for="option in filteredLeagueOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </section>

          <!-- Inventory -->
          <section class="bg-white rounded-sm shadow-sm border border-surface-muted p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-display text-[11px] font-semibold uppercase tracking-widest text-brand-orange-600">Disponibilidad</p>
                <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink">Inventario y estados</h3>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="flex items-center justify-between rounded-sm border border-surface-muted px-4 py-3 bg-surface-warm/40">
                <div>
                  <p class="text-sm font-semibold text-ink">En stock</p>
                  <p class="text-xs text-ink-muted">Si está apagado, se mostrará "Encargar ahora"</p>
                </div>
                <button
                  type="button"
                  class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors"
                  :class="form.inStock ? 'bg-brand-sage-600' : 'bg-ink-subtle'"
                  @click="form.inStock = !form.inStock"
                >
                  <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    :class="form.inStock ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between rounded-sm border border-surface-muted px-4 py-3 bg-surface-warm/40">
                <div>
                  <p class="text-sm font-semibold text-ink">Destacado</p>
                  <p class="text-xs text-ink-muted">Mostrar en la home</p>
                </div>
                <button
                  type="button"
                  class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors"
                  :class="form.featured ? 'bg-brand-orange-600' : 'bg-ink-subtle'"
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
          <section class="bg-white rounded-sm shadow-sm border border-surface-muted p-5 space-y-5">
            <div>
              <p class="font-display text-[11px] font-semibold uppercase tracking-widest text-brand-orange-600">Imágenes</p>
              <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink">La carpeta se generará automáticamente</h3>
              <p class="text-sm text-ink-muted mt-1">
                Usamos el tipo de producto y el nombre para crear una nueva carpeta en Cloudinary.
              </p>
            </div>

            <div>
              <label class="form-label">Ruta generada</label>
              <input
                ref="fileInputRef"
                type="file"
                class="hidden"
                accept="image/jpeg,image/png,image/webp"
                multiple
                @change="handleFilesSelected"
              />
              <input
                :value="generatedFolderPath"
                type="text"
                readonly
                class="form-input bg-surface-warm/40"
              />
              <p class="text-xs text-ink-muted mt-1">
                Se creará automáticamente en Cloudinary al guardar.
              </p>
            </div>

            <div class="space-y-3 rounded-sm border border-dashed border-surface-muted bg-white/60 p-4">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-semibold text-ink">Subí imágenes desde tu computadora</p>
                  <p class="text-xs text-ink-muted">
                    Las enviaremos a <span class="font-mono text-[11px]">{{ generatedFolderPath || 'la carpeta del producto' }}</span>
                  </p>
                </div>
                <button
                  type="button"
                  class="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!generatedFolderPath || uploadState.isUploading || isSaving"
                  @click="triggerFilePicker"
                >
                  <IconCloudUpload class="w-4 h-4" />
                  {{ uploadState.isUploading ? 'Subiendo...' : 'Seleccionar archivos' }}
                </button>
              </div>
              <p v-if="uploadState.isUploading" class="text-xs text-ink-muted">
                Subiendo {{ uploadState.uploaded }} de {{ uploadState.total }} archivos...
              </p>
              <p class="text-xs text-ink-muted">
                Podés seleccionar varias imágenes a la vez. Se agregarán automáticamente a la galería de este producto.
              </p>
            </div>

            <!--
            <div class="space-y-3 rounded-sm border border-dashed border-surface-muted bg-white/60 p-4">
              <div>
                <p class="text-sm font-semibold text-ink">Agregar imágenes manualmente</p>
                <p class="text-xs text-ink-muted">
                  Si ya tenés URLs (por ejemplo, de un producto existente), pegá el enlace y usá los botones de abajo.
                  <strong>Agregar URL</strong> incorpora una sola imagen y
                  <strong>Agregar lista de URLs</strong> acepta múltiples enlaces, uno por línea.
                </p>
              </div>
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  v-model="manualImageUrl"
                  type="text"
                  class="form-input flex-1"
                  placeholder="https://res.cloudinary.com/.../imagen.jpg"
                  :disabled="isSaving"
                />
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
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
                  class="form-input"
                  placeholder="Pega varias URLs separadas por saltos de línea"
                  :disabled="isSaving"
                />
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
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
                <p class="text-sm font-semibold text-ink">Imágenes disponibles</p>
                <span class="text-xs text-ink-muted">{{ availableImages.length }} encontradas</span>
              </div>

              <div
                v-if="availableImages.length === 0"
                class="flex flex-col items-center justify-center rounded-sm border border-dashed border-surface-muted py-8 text-center text-ink-muted"
              >
                <IconImageOff class="w-10 h-10 mb-2 text-ink-subtle" />
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
                  class="relative group aspect-square rounded-sm overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-orange-500/40"
                  :class="isImageSelected(image) ? 'border-brand-orange-500 shadow-lg shadow-ink/10' : 'border-surface-muted hover:border-ink-subtle'"
                  @click="toggleImageSelection(image)"
                >
                  <img :src="image" :alt="'Imagen disponible'" class="w-full h-full object-cover" />
                  <div
                    v-if="isImageSelected(image)"
                    class="absolute top-2 right-2 bg-brand-orange-600 text-white rounded-full p-1 shadow"
                  >
                    <IconCheck class="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>

            <div v-if="form.selectedImages.length" class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-ink">Orden de las imágenes</p>
                <span class="text-xs text-ink-muted">Arrastra con los controles para priorizar</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(image, index) in form.selectedImages"
                  :key="image"
                  class="flex items-center gap-3 rounded-sm border border-surface-muted bg-surface-warm/40 px-3 py-2"
                >
                  <span class="w-6 font-display text-xs font-semibold text-ink-muted">#{{ index + 1 }}</span>
                  <img :src="image" alt="Seleccionada" class="w-16 h-16 rounded-sm object-cover border border-surface-muted" />
                  <div class="flex-1 truncate text-sm text-ink-light">
                    {{ image }}
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      class="p-1.5 rounded-full border border-surface-muted text-ink-light hover:bg-surface-warm disabled:opacity-40"
                      :disabled="index === 0"
                      @click="moveSelectedImage(index, -1)"
                    >
                      <IconChevronUp class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 rounded-full border border-surface-muted text-ink-light hover:bg-surface-warm disabled:opacity-40"
                      :disabled="index === form.selectedImages.length - 1"
                      @click="moveSelectedImage(index, 1)"
                    >
                      <IconChevronDown class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 rounded-full border border-surface-muted text-ink-light hover:bg-brand-coral-50 hover:text-brand-coral-700 hover:border-brand-coral-200"
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

        <div class="px-6 py-4 border-t border-surface-muted bg-white flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-sm text-ink-muted">
            Se crearán {{ form.selectedImages.length }} imágenes destacadas al publicar este producto.
          </p>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="isSaving"
              @click="handleClose"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-brand"
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
  productTypes: {
    type: Array,
    default: () => []
  },
  leagues: {
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
const { compressImage, uploadImage } = useUpload()
const toast = useToast()

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const DEFAULT_COLORS = ['Home', 'Away']

const form = reactive({
  name: '',
  slug: '',
  description: '',
  price: '',
  originalPrice: '',
  productType: '',
  league: '',
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

// Product type options
const productTypeOptions = computed(() =>
  props.productTypes.filter(t => t.isActive !== false).map(t => ({
    value: t.slug,
    label: t.name
  }))
)

// Filtered league options based on selected product type
const filteredLeagueOptions = computed(() => {
  if (!form.productType) return []
  return props.leagues
    .filter(l => l.isActive !== false && l.applicableTypes?.includes(form.productType))
    .map(l => ({
      value: l.slug,
      label: l.name
    }))
})

// Reset league when product type changes
watch(() => form.productType, () => {
  form.league = ''
})

const normalizedExistingSlugs = computed(() => props.existingSlugs.map(slug => (slug || '').toString().toLowerCase()).filter(Boolean))
const existingIdsSet = computed(() => new Set(props.existingIds || []))
const generatedFolderPath = computed(() => {
  if (!form.productType) {
    return ''
  }

  const normalizedSlug = slugify(form.slug || form.name)
  const fallbackSlug = normalizedSlug || slugify(form.name) || 'nuevo-producto'
  const folderSegment = fallbackSlug.replace(/-/g, '_')

  // Use productType and optionally league for folder structure
  const basePath = form.league
    ? `cruzar-deportes/products/${form.productType}/${form.league}`
    : `cruzar-deportes/products/${form.productType}`

  return `${basePath}/${folderSegment}`
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
  form.productType = ''
  form.league = ''
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
    toast.info('Definí nombre y tipo de producto antes de subir imágenes')
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
    toast.error('Seleccioná un tipo de producto y nombre antes de subir imágenes')
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
      const compressed = await compressImage(file)
      const uploadedAsset = await uploadImage(compressed, generatedFolderPath.value)
      const secureUrl = uploadedAsset?.secure_url || uploadedAsset
      appendImageUrl(secureUrl)
      uploadState.uploaded += 1
    } catch (error) {
      console.error('Error al subir imagen', error)
      const msg = error?.data?.error || error?.message || 'Error desconocido'
      toast.error(`No pudimos subir "${file.name}": ${msg}`)
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

  if (!form.productType) {
    return 'Seleccioná un tipo de producto'
  }

  if (!generatedFolderPath.value) {
    return 'No pudimos generar la carpeta, verificá el nombre y el tipo de producto'
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
    productType: form.productType,
    league: form.league,
    images: [...form.selectedImages],
    selectedImages: [...form.selectedImages],
    allAvailableImages: form.allAvailableImages.length > 0
      ? [...new Set(form.allAvailableImages)]
      : [...form.selectedImages],
    folderPath: generatedFolderPath.value,
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
