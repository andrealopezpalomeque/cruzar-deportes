<template>
  <component
    :is="tag"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'md'
  },
  tag: {
    type: String,
    default: 'button'
  },
  class: {
    type: String,
    default: ''
  }
})

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    default: 'bg-black text-white hover:bg-gray-900 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    white: 'bg-white text-black hover:bg-gray-100 focus:ring-gray-500',
    whiteOutline: 'border-2 border-white text-white hover:bg-white hover:text-black bg-transparent focus:ring-white shadow-[0_0_0_2px_rgba(255,255,255,0.7)]'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm font-medium',
    md: 'px-4 py-2 text-base font-medium',
    lg: 'px-6 py-3 text-lg font-medium'
  }
  
  return `${base} ${variants[props.variant] || variants.default} ${sizes[props.size] || sizes.md} ${props.class}`
})
</script>