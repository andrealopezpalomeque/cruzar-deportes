<template>
  <div :class="`space-y-4 ${props.class}`">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'single'
  },
  collapsible: {
    type: Boolean,
    default: true
  },
  class: {
    type: String,
    default: ''
  }
})

provide('accordionType', props.type)
provide('accordionCollapsible', props.collapsible)
</script>