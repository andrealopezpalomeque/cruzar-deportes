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
  const base = 'rounded-sm'
  const variants = {
    default: 'bg-white border border-surface-muted',
    warm: 'bg-surface-warm border border-surface-muted',
    elevated: 'bg-white shadow-lg shadow-ink/5',
    editorial: 'bg-surface-cream',
  }

  return `${base} ${variants[props.variant] || variants.default} ${props.class}`
})
</script>
