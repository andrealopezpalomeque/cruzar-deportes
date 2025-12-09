<template>
  <picture :class="['optimized-image', 'block', wrapperClass]">
    <!-- WebP format sources -->
    <source
      v-if="imageData.webp"
      type="image/webp"
      :srcset="imageData.webp.mobile"
      media="(max-width: 768px)"
    />
    <source
      v-if="imageData.webp"
      type="image/webp"
      :srcset="imageData.webp.desktop"
      media="(min-width: 769px)"
    />

    <!-- AVIF format sources (progressive enhancement) -->
    <source
      v-if="imageData.avif"
      type="image/avif"
      :srcset="imageData.avif.mobile"
      media="(max-width: 768px)"
    />
    <source
      v-if="imageData.avif"
      type="image/avif"
      :srcset="imageData.avif.desktop"
      media="(min-width: 769px)"
    />

    <!-- JPEG fallback sources -->
    <source
      v-if="imageData.jpeg"
      type="image/jpeg"
      :srcset="imageData.jpeg.mobile"
      media="(max-width: 768px)"
    />
    <source
      v-if="imageData.jpeg"
      type="image/jpeg"
      :srcset="imageData.jpeg.desktop"
      media="(min-width: 769px)"
    />

    <!-- Fallback img element -->
    <img
      :src="imageData.fallback || src"
      :alt="alt"
      :class="imgClass"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
      @load="handleLoad"
      @error="handleError"
    />
  </picture>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getImageLoader } from '~/utils/cloudinaryImageLoader'
import { getOptimalImageUrl, isCloudinaryUrl } from '~/utils/urlMapping'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'productCard',
    validator: (value) => ['productCard', 'gallery', 'thumbnail', 'logo'].includes(value)
  },
  imgClass: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  },
  loading: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  decoding: {
    type: String,
    default: 'async',
    validator: (value) => ['async', 'sync', 'auto'].includes(value)
  },
  fetchpriority: {
    type: String,
    default: 'auto',
    validator: (value) => ['high', 'low', 'auto'].includes(value)
  },
  quality: {
    type: [String, Number],
    default: 'auto'
  },
  crop: {
    type: String,
    default: 'limit',
    validator: (value) => ['fill', 'fit', 'limit', 'thumb'].includes(value)
  },
  formats: {
    type: Array,
    default: () => ['webp', 'jpeg'],
    validator: (value) => value.every(format => ['webp', 'avif', 'jpeg'].includes(format))
  },
  wrapperClass: {
    type: [String, Array, Object],
    default: ''
  }
})

const emit = defineEmits(['load', 'error'])

// Get image loader instance
const imageLoader = getImageLoader()

// Reactive reference for the mapped URL
const mappedSrc = ref('')
const isLoading = ref(true)

// Basic heuristic for detecting if a Cloudinary URL already points to a transformed asset
function hasFileExtension(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|bmp|tiff)(\?|$)/i.test(url)
}

// Generate responsive image data
const imageData = computed(() => {
  if (!mappedSrc.value) {
    return { fallback: props.src }
  }

  // Get breakpoints for the specified type
  const breakpoints = imageLoader.getBreakpoints()
  const typeBreakpoints = breakpoints[props.type] || breakpoints.productCard

  // Only apply Cloudinary optimizations if it's a Cloudinary URL
  if (isCloudinaryUrl(mappedSrc.value) && hasFileExtension(mappedSrc.value)) {
    return imageLoader.generateResponsiveImageData(mappedSrc.value, typeBreakpoints, {
      quality: props.quality,
      crop: props.crop,
      formats: props.formats
    })
  } else {
    // For non-Cloudinary URLs, return simple fallback
    return { fallback: mappedSrc.value }
  }
})

// Load the optimal URL on component mount
onMounted(async () => {
  try {
    mappedSrc.value = await getOptimalImageUrl(props.src)
    isLoading.value = false
  } catch (error) {
    console.warn('Error mapping URL:', error)
    mappedSrc.value = props.src
    isLoading.value = false
  }
})

// Watch for src changes
watch(() => props.src, async (newSrc) => {
  if (newSrc) {
    isLoading.value = true
    try {
      mappedSrc.value = await getOptimalImageUrl(newSrc)
    } catch (error) {
      console.warn('Error mapping URL:', error)
      mappedSrc.value = newSrc
    }
    isLoading.value = false
  }
})

// Handle image load event
function handleLoad(event) {
  emit('load', event)
}

// Handle image error event
function handleError(event) {
  console.warn('OptimizedImage: Failed to load image:', props.src)
  emit('error', event)

  // Try to load fallback image
  const img = event.target
  if (img && !img.src.includes('/images/cruzar-logo-1.png')) {
    img.src = '/images/cruzar-logo-1.png'
  }
}
</script>
