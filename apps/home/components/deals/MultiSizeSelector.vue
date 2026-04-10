<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <div
        v-for="size in sizes"
        :key="size"
        class="flex items-center justify-between p-3 bg-surface-warm rounded-sm"
      >
        <span class="font-medium text-ink w-12">{{ size }}</span>
        <div class="flex items-center space-x-3">
          <button
            type="button"
            @click="decrement(size)"
            :disabled="sizeDistribution[size] === 0"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              sizeDistribution[size] === 0
                ? 'bg-surface-muted text-ink-subtle cursor-not-allowed'
                : 'bg-surface-muted text-ink-muted hover:bg-surface-muted'
            ]"
          >
            <IconMinus class="w-4 h-4" />
          </button>
          <span class="w-8 text-center font-medium text-lg">{{ sizeDistribution[size] }}</span>
          <button
            type="button"
            @click="increment(size)"
            :disabled="totalSelected >= jerseyCount"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              totalSelected >= jerseyCount
                ? 'bg-surface-muted text-ink-subtle cursor-not-allowed'
                : 'bg-ink text-white hover:bg-ink-light'
            ]"
          >
            <IconPlus class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Total indicator -->
    <div
      :class="[
        'p-4 rounded-sm border-2 transition-colors',
        isValid
          ? 'bg-green-50 border-green-500'
          : 'bg-surface-warm border-surface-muted'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="font-medium text-ink-muted">Total:</span>
        <span
          :class="[
            'text-lg font-medium',
            isValid ? 'text-green-600' : 'text-ink'
          ]"
        >
          {{ totalSelected }}/{{ jerseyCount }} camisetas
        </span>
      </div>
      <p v-if="!isValid" class="text-sm text-ink-muted mt-1">
        Seleccioná {{ jerseyCount - totalSelected }} talle(s) más
      </p>
      <p v-else class="text-sm text-green-600 mt-1">
        <IconCheck class="w-4 h-4 inline mr-1" />
        Distribución completa
      </p>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import IconMinus from '~icons/mdi/minus'
import IconPlus from '~icons/mdi/plus'
import IconCheck from '~icons/mdi/check'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 })
  },
  jerseyCount: {
    type: Number,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const sizeDistribution = ref({ ...props.modelValue })

// Reset when jerseyCount changes
watch(() => props.jerseyCount, () => {
  sizeDistribution.value = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
  emit('update:modelValue', { ...sizeDistribution.value })
})

// Sync with parent when modelValue changes externally
watch(() => props.modelValue, (newVal) => {
  sizeDistribution.value = { ...newVal }
}, { deep: true })

const totalSelected = computed(() => {
  return Object.values(sizeDistribution.value).reduce((sum, count) => sum + count, 0)
})

const isValid = computed(() => {
  return totalSelected.value === props.jerseyCount
})

const increment = (size) => {
  if (totalSelected.value < props.jerseyCount) {
    sizeDistribution.value[size]++
    emit('update:modelValue', { ...sizeDistribution.value })
  }
}

const decrement = (size) => {
  if (sizeDistribution.value[size] > 0) {
    sizeDistribution.value[size]--
    emit('update:modelValue', { ...sizeDistribution.value })
  }
}

defineExpose({ isValid })
</script>
