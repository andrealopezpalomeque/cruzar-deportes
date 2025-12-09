<template>
  <div :class="`border border-gray-200 rounded-lg px-6 bg-white shadow-sm ${props.class}`">
    <div>
      <button
        @click="toggleItem"
        :class="`text-left hover:no-underline py-6 w-full flex items-center justify-between`"
        :aria-expanded="isOpen"
      >
        <div class="flex-1">
          <slot name="trigger" :isOpen="isOpen" />
        </div>
        <div class="ml-4 flex-shrink-0">
          <IconChevronDown 
            :class="`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`"
          />
        </div>
      </button>
      
      <div
        v-show="isOpen"
        :class="`pb-6 pt-2 transition-all duration-200 ease-in-out`"
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IconChevronDown from '~icons/mdi/chevron-down'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  class: {
    type: String,
    default: ''
  }
})

const isOpen = ref(false)

function toggleItem() {
  isOpen.value = !isOpen.value
}
</script>