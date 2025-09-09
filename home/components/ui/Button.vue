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
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    white: 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    whiteOutline: 'border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent focus:ring-white shadow-[0_0_0_2px_rgba(255,255,255,0.7)]'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return `${base} ${variants[props.variant] || variants.default} ${sizes[props.size] || sizes.md} ${props.class}`
})
</script>