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
  const base = 'inline-flex items-center justify-center font-display font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    default: 'bg-ink text-surface-cream hover:bg-ink-light focus:ring-ink rounded-sm',
    brand: 'bg-brand-orange-600 text-white hover:bg-brand-orange-700 focus:ring-brand-orange-500 rounded-sm',
    outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-surface-cream focus:ring-ink rounded-sm',
    ghost: 'text-ink hover:bg-surface-warm focus:ring-ink rounded-sm',
    white: 'bg-white text-ink hover:bg-surface-cream focus:ring-white rounded-sm',
    whiteOutline: 'border-2 border-white text-white hover:bg-white hover:text-ink bg-transparent focus:ring-white rounded-sm'
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base'
  }

  return `${base} ${variants[props.variant] || variants.default} ${sizes[props.size] || sizes.md} ${props.class}`
})
</script>
