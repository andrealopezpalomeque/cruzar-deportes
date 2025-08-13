<template>
  <IconifyIcon 
    :icon="name" 
    :class="customClass"
    :style="{ width: computedSize, height: computedSize }"
  />
</template>

<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'

interface Props {
  name: string
  class?: string
}

const props = defineProps<Props>()

const customClass = computed(() => props.class || '')

const computedSize = computed(() => {
  if (props.class?.includes('h-') || props.class?.includes('w-')) {
    // Extract Tailwind size classes
    const match = props.class.match(/[hw]-(\d+)/)
    if (match) {
      const size = parseInt(match[1]) * 4 // Tailwind uses 4px units
      return `${size}px`
    }
  }
  return '24px'
})
</script>