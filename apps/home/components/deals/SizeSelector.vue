<template>
  <div>
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
      <button
        v-for="size in sizes"
        :key="size"
        type="button"
        @click="selectSize(size)"
        :class="[
          'py-3 px-4 text-center font-medium rounded-sm border-2 transition-all',
          modelValue === size
            ? 'border-ink bg-ink text-white'
            : 'border-surface-muted bg-white text-ink-muted hover:border-surface-muted'
        ]"
      >
        {{ size }}
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue', 'error'])
const emit = defineEmits(['update:modelValue'])

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const selectSize = (size) => {
  emit('update:modelValue', size)
}
</script>
