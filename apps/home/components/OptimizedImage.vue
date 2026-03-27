<template>
  <div :class="['optimized-image', 'block', wrapperClass]">
    <img
      :src="resolvedSrc"
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
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
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
  wrapperClass: {
    type: [String, Array, Object],
    default: ''
  }
})

const emit = defineEmits(['load', 'error'])

const resolvedSrc = computed(() => props.src || '')

function handleLoad(event) {
  emit('load', event)
}

function handleError(event) {
  console.warn('OptimizedImage: Failed to load image:', props.src)
  emit('error', event)
  const img = event.target
  if (img && !img.src.includes('/images/cruzar-logo-1.png')) {
    img.src = '/images/cruzar-logo-1.png'
  }
}
</script>
