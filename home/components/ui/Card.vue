<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  class: {
    type: String,
    default: ''
  }
})

const cardClasses = computed(() => {
  const base = 'rounded-lg'
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    gradient: 'bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200 border shadow-sm',
    modern: 'border-0 shadow-lg bg-white/80 backdrop-blur-sm',
    modernCard: 'border-0 shadow-xl bg-white/90 backdrop-blur-sm',
    gradientBlue: 'border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    gradientPrimary: 'border-0 shadow-xl bg-gradient-to-r from-primary-600 to-blue-600 text-white'
  }
  
  return `${base} ${variants[props.variant] || variants.default} ${props.class}`
})
</script>