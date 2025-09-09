<template>
  <button
    @click="toggleItem"
    :class="`text-left hover:no-underline py-6 w-full flex items-center justify-between ${props.class}`"
    :aria-expanded="isOpen"
  >
    <div class="flex-1">
      <slot :isOpen="isOpen" />
    </div>
    <div class="ml-4 flex-shrink-0">
      <IconChevronDown 
        :class="`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`"
      />
    </div>
  </button>
</template>

<script setup>
import { ref, inject } from 'vue'
import IconChevronDown from '~icons/mdi/chevron-down'

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})

const accordionItemValue = inject('accordionItemValue')
const isOpen = ref(false)

function toggleItem() {
  isOpen.value = !isOpen.value
}

provide('accordionIsOpen', isOpen)
</script>