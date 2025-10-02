<template>
  <Icon
    :icon="iconName"
    :width="iconSize"
    :height="iconSize"
    :class="[
      'icon',
      sizeClass,
      props.class
    ]"
    :style="props.style"
  />
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = withDefaults(defineProps(), {
  size: '24px',
  class: '',
  style: undefined
})

// Icon component aliases
const iconAliases = {
  'user': 'mdi:account',
  'logout': 'mdi:logout',
  'dashboard': 'mdi:view-dashboard',
  'products': 'mdi:tshirt-crew',
  'images': 'mdi:image-multiple',
  'settings': 'mdi:cog',
  'save': 'mdi:content-save',
  'edit': 'mdi:pencil',
  'delete': 'mdi:delete',
  'add': 'mdi:plus',
  'search': 'mdi:magnify',
  'filter': 'mdi:filter',
  'sort': 'mdi:sort',
  'eye': 'mdi:eye',
  'eye-off': 'mdi:eye-off'
}

// Resolve icon name (check aliases first)
const iconName = computed(() => {
  return iconAliases[props.name] || props.name
})

// Icon size computation
const iconSize = computed(() => {
  if (typeof props.size === 'string') {
    // If it's already a valid CSS size like '24px', return as is
    if (props.size.includes('px') || props.size.includes('rem') || props.size.includes('em')) {
      return props.size
    }
    // If it's a number as string, add px
    if (!isNaN(Number(props.size))) {
      return `${props.size}px`
    }
  }
  
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  
  return '24px'
})

// Size class computation for Tailwind utilities
const sizeClass = computed(() => {
  const sizeMap = {
    'xs': 'w-3 h-3',
    'sm': 'w-4 h-4',
    'md': 'w-5 h-5',
    'lg': 'w-6 h-6',
    'xl': 'w-8 h-8',
    '16': 'w-4 h-4',
    '20': 'w-5 h-5',
    '24': 'w-6 h-6',
    '32': 'w-8 h-8'
  }

  return sizeMap[String(props.size)] || ''
})
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>