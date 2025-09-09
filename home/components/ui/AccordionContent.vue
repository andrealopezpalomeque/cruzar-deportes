<template>
  <div
    v-show="isOpen"
    :class="`pb-6 pt-2 transition-all duration-200 ease-in-out ${props.class}`"
  >
    <slot />
  </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})

const isOpen = inject('accordionIsOpen')
</script>