<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Gestión de Imágenes</h3>
      <button
        @click="openFileInput"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Icon name="mdi:upload" class="w-4 h-4 mr-2 inline" />
        Subir Imágenes
      </button>
    </div>

    <!-- File Input -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    >

    <!-- Upload Progress -->
    <div v-if="uploading" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center mb-2">
        <Icon name="mdi:loading" class="w-4 h-4 mr-2 animate-spin text-blue-600" />
        <span class="text-sm font-medium">Subiendo imágenes...</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
      <p class="text-xs text-gray-600 mt-1">
        {{ currentFile }} ({{ completedUploads }}/{{ totalFiles }})
      </p>
    </div>

    <!-- Image Gallery -->
    <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative group"
      >
        <img
          :src="image"
          :alt="`Imagen ${index + 1}`"
          class="w-full h-32 object-cover rounded-lg border"
        >
        <button
          @click="removeImage(index)"
          class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Icon name="mdi:close" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
      <Icon name="mdi:image-multiple" class="w-12 h-12 mx-auto text-gray-400 mb-2" />
      <p class="text-gray-500">No hay imágenes subidas</p>
      <button
        @click="openFileInput"
        class="mt-2 text-blue-600 hover:text-blue-700"
      >
        Haz clic para subir imágenes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify'

interface Props {
  modelValue: string[]
  productSlug?: string
  category?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  productSlug: '',
  category: ''
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const uploadProgress = ref(0)
const currentFile = ref('')
const completedUploads = ref(0)
const totalFiles = ref(0)

const images = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { uploadProductImages, uploadImages } = useCloudinary()

const openFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (files.length === 0) return

  await uploadFiles(files)

  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadFiles = async (files: File[]) => {
  uploading.value = true
  uploadProgress.value = 0
  completedUploads.value = 0
  totalFiles.value = files.length

  try {
    let uploadedUrls: string[]

    if (props.productSlug && props.category) {
      // Upload to product-specific folder
      uploadedUrls = await uploadProductImages(files, props.productSlug, props.category)
    } else {
      // Upload to general images folder
      const basePath = `images/${Date.now()}`
      uploadedUrls = await uploadImages(files, basePath)
    }

    // Add new URLs to existing images
    images.value = [...images.value, ...uploadedUrls]

    toast.success(`${files.length} imágenes subidas correctamente`)
  } catch (error) {
    console.error('Error uploading images:', error)
    toast.error('Error al subir las imágenes')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const removeImage = (index: number) => {
  const newImages = [...images.value]
  newImages.splice(index, 1)
  images.value = newImages
  toast.success('Imagen eliminada')
}

// Watch for upload progress (simplified - in real implementation you'd track individual file progress)
watch([completedUploads, totalFiles], () => {
  if (totalFiles.value > 0) {
    uploadProgress.value = (completedUploads.value / totalFiles.value) * 100
  }
})
</script>