<template>
  <div :class="gridClass">
    <component 
      :is="skeletonComponent" 
      v-for="i in count" 
      :key="i" 
    />
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['product', 'category'].includes(value)
  },
  count: {
    type: Number,
    default: 8
  },
  cols: {
    type: Number,
    default: 4,
    validator: (value) => [1, 2, 3, 4].includes(value)
  }
})

const skeletonComponent = computed(() => {
  return props.type === 'product' ? 'ProductCardSkeleton' : 'CategoryCardSkeleton'
})

const gridClass = computed(() => {
  const baseClass = 'grid gap-6'
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
  
  return `${baseClass} ${colsClass[props.cols]}`
})
</script>