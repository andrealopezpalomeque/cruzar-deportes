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

            <div class="grid gap-4 md:grid-cols-2">
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subcategoría (opcional)</label>
                <input
                  v-model.trim="form.subcategory"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Kids, Player version, Retro..."
                  :disabled="isSaving"
                />
              </div>
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

            <div class="grid gap-4 md:grid-cols-3">
              <div class="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 bg-gray-50">
                <div>
                  <p class="text-sm font-semibold text-gray-900">En stock</p>
                  <p class="text-xs text-gray-500">Disponible inmediato</p>
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Modo de stock</label>
                <select
                  v-model="form.stockStatus"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  :disabled="isSaving"
                >
                  <option value="in_stock">Disponible ahora</option>
                  <option value="available_on_order">A pedido</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Attributes -->
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6">
            <div>
              <p class="text-xs uppercase font-semibold text-gray-400">Variantes</p>
              <h3 class="text-lg font-semibold text-gray-900">Talles y variantes de color</h3>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900">Talles disponibles</p>
                <span class="text-xs text-gray-500">{{ form.sizes.length }} seleccionados</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in sizeOptions"
                  :key="size"
                  type="button"
                  class="px-3 py-1.5 rounded-full border text-sm transition-colors"
                  :class="form.sizes.includes(size) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'"
                  @click="toggleSize(size)"
                >
                  {{ size }}
                </button>
              </div>
              <div class="flex items-center gap-2">
                <input
                  v-model="newSizeInput"
                  type="text"
                  placeholder="Agregar otro talle..."
                  class="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  :disabled="isSaving"
                />
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  @click="addCustomSize"
                >
                  <IconPlus class="w-4 h-4" />
                  Agregar
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900">Variantes de color</p>
                <span class="text-xs text-gray-500">{{ form.colors.length }} seleccionados</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in colorOptions"
                  :key="color"
                  type="button"
                  class="px-3 py-1.5 rounded-full border text-sm transition-colors"
                  :class="form.colors.includes(color) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'"
                  @click="toggleColor(color)"
                >
                  {{ color }}
                </button>
              </div>
              <div class="flex items-center gap-2">
                <input
                  v-model="newColorInput"
                  type="text"
                  placeholder="Agregar otra variante..."
                  class="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  :disabled="isSaving"
                />
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  @click="addCustomColor"
                >
                  <IconPlus class="w-4 h-4" />
                  Agregar
                </button>
              </div>
            </div>
          </section>

          <!-- Cloudinary -->
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase font-semibold text-gray-400">Imágenes</p>
                <h3 class="text-lg font-semibold text-gray-900">Seleccioná la carpeta y las fotos</h3>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                @click="refreshFolders"
                :disabled="loadingFolders"
              >
                <IconRefresh class="w-4 h-4" :class="loadingFolders ? 'animate-spin' : ''" />
                Actualizar
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Carpeta de Cloudinary</label>
              <div v-if="cloudinaryUnavailable" class="space-y-2">
                <input
                  v-model="form.cloudinaryFolderPath"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="cruzar-deportes/products/categoria/nuevo-equipo"
                  :disabled="isSaving"
                />
                <p class="text-xs text-amber-600">
                  {{ cloudinaryFoldersError || 'Cloudinary no está configurado en este entorno. Ingresa la ruta manualmente y pega las URLs de las imágenes.' }}
                </p>
              </div>
              <div v-else class="relative">
                <select
                  v-model="form.cloudinaryFolderPath"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  :disabled="loadingFolders || isSaving || folders.length === 0"
                  @change="handleFolderChange"
                >
                  <option value="" disabled>Selecciona una carpeta</option>
                  <optgroup
                    v-for="group in folderGroups"
                    :key="group.key"
                    :label="group.label"
                  >
                    <option
                      v-for="folder in group.folders"
                      :key="folder.path"
                      :value="folder.path"
                    >
                      {{ folder.label }}
                    </option>
                  </optgroup>
                </select>
                <div v-if="loadingFolders" class="absolute inset-y-0 right-3 flex items-center">
                  <IconLoading class="w-5 h-5 text-blue-500 animate-spin" />
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ cloudinaryUnavailable ? 'Ejemplo: cruzar-deportes/products/lpf_afa/boca' : 'Solo se listan carpetas bajo cruzar-deportes/' }}
              </p>
            </div>

            <div class="space-y-3 rounded-xl border border-dashed border-gray-200 bg-white/60 p-4">
              <div>
                <p class="text-sm font-semibold text-gray-900">Agregar imágenes manualmente</p>
                <p class="text-xs text-gray-500">Pega URLs completas de Cloudinary u otra CDN para construir la galería inicial.</p>
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
                  Agregar
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
                  Agregar lista
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900">Imágenes disponibles</p>
                <span class="text-xs text-gray-500">{{ availableImages.length }} encontradas</span>
              </div>

              <div v-if="folderImagesLoading" class="flex items-center justify-center rounded-xl border border-dashed border-gray-200 py-8">
                <IconLoading class="w-8 h-8 text-blue-500 animate-spin" />
              </div>

              <div
                v-else-if="!cloudinaryUnavailable && form.cloudinaryFolderPath && availableImages.length === 0"
                class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center text-gray-500"
              >
                <IconImageOff class="w-10 h-10 mb-2 text-gray-400" />
                No encontramos imágenes en esta carpeta.
              </div>

              <div
                v-else-if="availableImages.length"
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
import IconRefresh from '~icons/mdi/refresh'
import IconPlus from '~icons/mdi/plus'
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
const { getFolders, getFolderImages } = useCloudinary()
const toast = useToast()

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const colorOptions = ['Home', 'Away', 'Third', 'Goalkeeper', 'Alternate']

const form = reactive({
  name: '',
  slug: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  subcategory: '',
  colors: [...colorOptions.slice(0, 2)],
  sizes: [...sizeOptions.slice(1)],
  inStock: true,
  stockStatus: 'in_stock',
  featured: false,
  cloudinaryFolderPath: '',
  selectedImages: [],
  allAvailableImages: []
})

const availableImages = ref([])
const folders = ref([])
const loadingFolders = ref(false)
const folderImagesLoading = ref(false)
const isSaving = ref(false)
const slugEdited = ref(false)
const foldersLoaded = ref(false)
const newSizeInput = ref('')
const newColorInput = ref('')
const manualImageUrl = ref('')
const bulkImagesInput = ref('')
const cloudinaryUnavailable = ref(false)
const cloudinaryFoldersError = ref('')

const categoryOptions = computed(() => props.categories.filter(option => option.value))
const categoryOrder = computed(() => {
  const orderMap = new Map()
  categoryOptions.value.forEach((option, index) => {
    orderMap.set(option.value, index)
  })
  return orderMap
})
const firstCategoryValue = computed(() => categoryOptions.value[0]?.value || '')

const normalizedExistingSlugs = computed(() => props.existingSlugs.map(slug => (slug || '').toString().toLowerCase()).filter(Boolean))
const existingIdsSet = computed(() => new Set(props.existingIds || []))

const folderMetaMap = computed(() => {
  const records = new Map()
  for (const folder of folders.value) {
    records.set(folder.path, parseFolderMeta(folder.path, folder.name))
  }
  return records
})

const folderGroups = computed(() => {
  if (folders.value.length === 0) {
    return []
  }

  const groups = new Map()
  for (const folder of folders.value) {
    const meta = folderMetaMap.value.get(folder.path) || { category: 'otros', teamName: folder.name }
    const categoryKey = categoryOrder.value.has(meta.category) ? meta.category : 'otros'
    const label = categoryKey === 'otros'
      ? 'Otros'
      : (categoryOptions.value.find(option => option.value === categoryKey)?.label || meta.category)

    if (!groups.has(categoryKey)) {
      groups.set(categoryKey, {
        key: categoryKey,
        label,
        folders: []
      })
    }

    groups.get(categoryKey).folders.push({
      path: folder.path,
      label: prettifyName(meta.teamName || folder.name)
    })
  }

  return Array.from(groups.values())
    .map(group => ({
      ...group,
      folders: group.folders.sort((a, b) => a.label.localeCompare(b.label))
    }))
    .sort((a, b) => {
      const orderA = categoryOrder.value.get(a.key) ?? Number.MAX_SAFE_INTEGER
      const orderB = categoryOrder.value.get(b.key) ?? Number.MAX_SAFE_INTEGER
      if (orderA === orderB) {
        return a.label.localeCompare(b.label)
      }
      return orderA - orderB
    })
})

watch(() => props.show, (visible) => {
  if (visible) {
    resetForm()
    ensureFoldersLoaded()
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

const ensureFoldersLoaded = async () => {
  if (foldersLoaded.value || loadingFolders.value || cloudinaryUnavailable.value) {
    return
  }

  try {
    loadingFolders.value = true
    const fetched = await getFolders()
    folders.value = Array.isArray(fetched) ? fetched : []
    foldersLoaded.value = true
    cloudinaryUnavailable.value = false
    cloudinaryFoldersError.value = ''
  } catch (error) {
    console.error('No se pudieron cargar las carpetas de Cloudinary:', error)
    toast.error('No pudimos listar las carpetas de Cloudinary')
    cloudinaryUnavailable.value = true
    cloudinaryFoldersError.value = error?.message || 'Verifica las variables CLOUDINARY_* en tu entorno.'
  } finally {
    loadingFolders.value = false
  }
}

const refreshFolders = async () => {
  cloudinaryUnavailable.value = false
  cloudinaryFoldersError.value = ''
  foldersLoaded.value = false
  await ensureFoldersLoaded()
}

const resetForm = () => {
  form.name = ''
  form.slug = ''
  form.description = ''
  form.price = ''
  form.originalPrice = ''
  form.category = firstCategoryValue.value
  form.subcategory = ''
  form.colors = [...colorOptions.slice(0, 2)]
  form.sizes = [...sizeOptions.slice(1)]
  form.inStock = true
  form.stockStatus = 'in_stock'
  form.featured = false
  form.cloudinaryFolderPath = ''
  form.selectedImages = []
  form.allAvailableImages = []
  availableImages.value = []
  slugEdited.value = false
  newSizeInput.value = ''
  newColorInput.value = ''
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

const parseFolderMeta = (path, fallbackName) => {
  const segments = path.split('/').filter(Boolean)

  if (segments.length >= 4 && segments[1] === 'products') {
    return {
      category: segments[2],
      teamName: segments[3],
      folderName: fallbackName
    }
  }

  if (segments.length >= 3) {
    return {
      category: segments[1],
      teamName: segments[2],
      folderName: fallbackName
    }
  }

  return {
    category: '',
    teamName: fallbackName,
    folderName: fallbackName
  }
}

const prettifyName = (value) => {
  if (!value) return ''
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const handleFolderChange = async () => {
  if (!form.cloudinaryFolderPath) {
    availableImages.value = []
    form.selectedImages = []
    form.allAvailableImages = []
    return
  }

  const meta = folderMetaMap.value.get(form.cloudinaryFolderPath)
  if (meta?.category) {
    form.category = meta.category
  }
  if (!form.name && meta?.teamName) {
    form.name = prettifyName(meta.teamName)
  }
  if (!slugEdited.value) {
    form.slug = slugify(form.name || meta?.teamName || '')
  }

  await loadImagesForFolder(form.cloudinaryFolderPath)
}

const loadImagesForFolder = async (folderPath) => {
  if (!folderPath) {
    return
  }
  if (cloudinaryUnavailable.value) {
    toast.info('Cloudinary no está disponible, agrega las imágenes manualmente')
    return
  }
  try {
    folderImagesLoading.value = true
    const response = await getFolderImages(folderPath)
    const urls = Array.isArray(response) ? response.map(asset => asset.secure_url) : []
    availableImages.value = urls
    form.allAvailableImages = [...urls]

    if (urls.length > 0) {
      const filteredSelection = form.selectedImages.filter(url => urls.includes(url))
      form.selectedImages = filteredSelection.length > 0
        ? filteredSelection
        : urls.slice(0, Math.min(urls.length, 5))
    } else {
      form.selectedImages = []
    }
  } catch (error) {
    console.error('Error al obtener imágenes de la carpeta', folderPath, error)
    toast.error('No pudimos cargar las imágenes de esa carpeta')
    availableImages.value = []
    form.selectedImages = []
    form.allAvailableImages = []
  } finally {
    folderImagesLoading.value = false
  }
}

const toggleSize = (sizeValue) => {
  const normalized = sizeValue.trim().toUpperCase()
  if (!normalized) return
  if (form.sizes.includes(normalized)) {
    form.sizes = form.sizes.filter(size => size !== normalized)
  } else {
    form.sizes = [...form.sizes, normalized]
  }
}

const addCustomSize = () => {
  const normalized = newSizeInput.value.trim().toUpperCase()
  if (normalized && !form.sizes.includes(normalized)) {
    form.sizes = [...form.sizes, normalized]
  }
  newSizeInput.value = ''
}

const toggleColor = (colorValue) => {
  const normalized = prettifyName(colorValue)
  if (!normalized) return
  if (form.colors.includes(normalized)) {
    form.colors = form.colors.filter(color => color !== normalized)
  } else {
    form.colors = [...form.colors, normalized]
  }
}

const addCustomColor = () => {
  const normalized = prettifyName(newColorInput.value)
  if (normalized && !form.colors.includes(normalized)) {
    form.colors = [...form.colors, normalized]
  }
  newColorInput.value = ''
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
  if (!availableImages.value.includes(ensureHttps)) {
    availableImages.value = [...availableImages.value, ensureHttps]
  }
  if (!form.selectedImages.includes(ensureHttps)) {
    form.selectedImages = [...form.selectedImages, ensureHttps]
  }
  manualImageUrl.value = ''
}

const addBulkImages = () => {
  const entries = bulkImagesInput.value
    .split(/\r?\n/)
    .map(url => url.trim())
    .filter(Boolean)
  if (entries.length === 0) return

  let updatedAvailable = [...availableImages.value]
  let updatedSelected = [...form.selectedImages]

  for (const entry of entries) {
    const normalized = entry.startsWith('http') ? entry : `https://${entry}`
    if (!updatedAvailable.includes(normalized)) {
      updatedAvailable.push(normalized)
    }
    if (!updatedSelected.includes(normalized)) {
      updatedSelected.push(normalized)
    }
  }

  availableImages.value = updatedAvailable
  form.selectedImages = updatedSelected
  bulkImagesInput.value = ''
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

  const price = parsePrice(form.price)
  if (price === null) {
    return 'Ingresá un precio válido'
  }

  if (!form.cloudinaryFolderPath) {
    return 'Seleccioná o ingresá una carpeta de Cloudinary'
  }

  if (form.selectedImages.length === 0) {
    return 'Seleccioná al menos una imagen para mostrar'
  }

  if (form.sizes.length === 0) {
    return 'El producto debe tener al menos un talle disponible'
  }

  if (form.colors.length === 0) {
    return 'Definí al menos un color o variante'
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
    category: form.category,
    subcategory: form.subcategory?.trim() || undefined,
    selectedImages: [...form.selectedImages],
    allAvailableImages: form.allAvailableImages.length > 0
      ? [...new Set(form.allAvailableImages)]
      : [...form.selectedImages],
    cloudinaryFolderPath: form.cloudinaryFolderPath,
    sizes: [...form.sizes],
    colors: [...form.colors],
    inStock: form.inStock,
    stockStatus: form.stockStatus,
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
