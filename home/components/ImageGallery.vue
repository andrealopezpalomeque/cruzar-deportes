<template>
  <div class="image-gallery">
    <!-- Main Image Display - Simplified -->
    <div class="relative bg-white rounded-lg overflow-hidden mb-4 shadow-sm" style="aspect-ratio: 1 / 1;">
      <!-- Optimized Main Image -->
      <OptimizedImage
        v-if="currentImage"
        :src="currentImage"
        :alt="`${productName} - Imagen ${currentIndex + 1}`"
        type="gallery"
        loading="eager"
        fetchpriority="high"
        wrapper-class="w-full h-full"
        img-class="w-full h-full object-cover"
        @load="imageLoading = false"
        @error="handleImageError"
      />
      
      <!-- Simple Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center">
        <IconImage class="h-24 w-24 text-gray-400" />
      </div>
      
      <!-- Simple Navigation - only if multiple images -->
      <button
        v-if="images.length > 1 && currentIndex > 0"
        @click="previousImage"
        class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-800 rounded-full p-2 hover:bg-gray-50"
      >
        <IconChevronLeft class="h-5 w-5" />
      </button>
      
      <button
        v-if="images.length > 1 && currentIndex < images.length - 1"
        @click="nextImage"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-800 rounded-full p-2 hover:bg-gray-50"
      >
        <IconChevronRight class="h-5 w-5" />
      </button>
      
      <!-- Simple counter -->
      <div 
        v-if="images.length > 1" 
        class="absolute bottom-2 right-2 bg-white text-gray-800 text-sm px-2 py-1 rounded shadow-sm"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>
    
    <!-- Thumbnail Strip -->
    <div v-if="images.length > 1" class="relative">
      <!-- Thumbnail navigation buttons -->
      <button
        v-if="showThumbnailNav"
        @click="scrollThumbnails(-1)"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-1 z-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        :disabled="thumbnailScrollPosition <= 0"
        :class="{ 'opacity-50 cursor-not-allowed': thumbnailScrollPosition <= 0 }"
      >
        <IconChevronLeft class="h-4 w-4" />
      </button>
      
      <button
        v-if="showThumbnailNav"
        @click="scrollThumbnails(1)"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-1 z-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        :disabled="thumbnailScrollPosition >= maxThumbnailScroll"
        :class="{ 'opacity-50 cursor-not-allowed': thumbnailScrollPosition >= maxThumbnailScroll }"
      >
        <IconChevronRight class="h-4 w-4" />
      </button>
      
      <!-- Thumbnail container -->
      <div 
        ref="thumbnailContainer"
        class="flex space-x-2 overflow-x-auto scrollbar-hide"
        style="scroll-behavior: smooth;"
      >
        <button
          v-for="(image, index) in images"
          :key="index"
          @click="setCurrentImage(index)"
          class="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm hover:shadow-md"
          :class="{
            'border-primary-600 shadow-md': currentIndex === index,
            'border-gray-200 hover:border-gray-300': currentIndex !== index
          }"
        >
          <OptimizedImage
            :src="image"
            :alt="`${productName} thumbnail ${index + 1}`"
            type="thumbnail"
            loading="lazy"
            wrapper-class="w-full h-full"
            img-class="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconImage from '~icons/mdi/image'
import IconChevronLeft from '~icons/mdi/chevron-left'
import IconChevronRight from '~icons/mdi/chevron-right'

const props = defineProps(['images', 'productName'])

// Reactive state
const currentIndex = ref(0)
const imageLoading = ref(false)
const thumbnailContainer = ref(null)
const thumbnailScrollPosition = ref(0)

// Computed properties
const currentImage = computed(() => props.images[currentIndex.value])

const showThumbnailNav = computed(() => {
  if (!thumbnailContainer.value || props.images.length <= 4) return false
  return thumbnailContainer.value.scrollWidth > thumbnailContainer.value.clientWidth
})

const maxThumbnailScroll = computed(() => {
  if (!thumbnailContainer.value) return 0
  return Math.max(0, thumbnailContainer.value.scrollWidth - thumbnailContainer.value.clientWidth)
})

// Methods
function setCurrentImage(index) {
  if (index >= 0 && index < props.images.length) {
    imageLoading.value = true
    currentIndex.value = index
  }
}

function nextImage() {
  if (currentIndex.value < props.images.length - 1) {
    setCurrentImage(currentIndex.value + 1)
  }
}

function previousImage() {
  if (currentIndex.value > 0) {
    setCurrentImage(currentIndex.value - 1)
  }
}

function handleImageError(event) {
  const img = event.target
  if (img) {
    img.src = '/images/cruzar-logo-1.png' // Fallback image
  }
  imageLoading.value = false
}

function scrollThumbnails(direction) {
  if (!thumbnailContainer.value) return
  
  const scrollAmount = 200 // pixels to scroll
  const newPosition = thumbnailScrollPosition.value + (direction * scrollAmount)
  
  thumbnailScrollPosition.value = Math.max(0, Math.min(newPosition, maxThumbnailScroll.value))
  thumbnailContainer.value.scrollLeft = thumbnailScrollPosition.value
}

// Keyboard navigation
function handleKeydown(event) {
  if (!event) return
  
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      nextImage()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousImage()
      break
    case 'Escape':
      // Could be used for closing full-screen view in the future
      break
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  
  // Auto-scroll thumbnails to center current image
  nextTick(() => {
    if (thumbnailContainer.value && currentIndex.value > 3 && props.images?.length > currentIndex.value) {
      const thumbnail = thumbnailContainer.value.children[currentIndex.value]
      if (thumbnail && thumbnail.scrollIntoView) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for prop changes
watch(() => props.images, (newImages) => {
  if (newImages && newImages.length > 0) {
    currentIndex.value = 0
    imageLoading.value = false
  }
}, { immediate: true })

// Auto-scroll thumbnails when current image changes
watch(currentIndex, (newIndex) => {
  nextTick(() => {
    if (thumbnailContainer.value && newIndex >= 0 && props.images?.length > newIndex) {
      const thumbnail = thumbnailContainer.value.children[newIndex]
      if (thumbnail && thumbnail.getBoundingClientRect) {
        // Check if thumbnail is visible, if not scroll to it
        const containerRect = thumbnailContainer.value.getBoundingClientRect()
        const thumbnailRect = thumbnail.getBoundingClientRect()
        
        if (containerRect && thumbnailRect && 
            (thumbnailRect.left < containerRect.left || thumbnailRect.right > containerRect.right)) {
          thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
      }
    }
  })
})
</script>

<style scoped>
/* Hide scrollbar for thumbnail container */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Add some hover effects */
.image-gallery img:hover {
  cursor: zoom-in;
}

/* Smooth transitions */
.image-gallery button {
  transition: all 0.2s ease-in-out;
}

/* Focus styles for accessibility */
.image-gallery button:focus {
  outline: none;
}
</style>
