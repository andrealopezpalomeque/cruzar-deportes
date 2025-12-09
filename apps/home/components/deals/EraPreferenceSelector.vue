<template>
  <div class="space-y-3">
    <button
      v-for="era in eras"
      :key="era.value"
      type="button"
      @click="selectEra(era.value)"
      :class="[
        'w-full p-4 rounded-lg border-2 text-left transition-all',
        modelValue === era.value
          ? 'border-black bg-gray-50'
          : 'border-gray-200 hover:border-gray-300'
      ]"
    >
      <div class="flex items-center">
        <div
          :class="[
            'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4',
            modelValue === era.value
              ? 'border-black'
              : 'border-gray-300'
          ]"
        >
          <div
            v-if="modelValue === era.value"
            class="w-3 h-3 rounded-full bg-black"
          ></div>
        </div>
        <div>
          <h4 class="font-medium">{{ era.label }}</h4>
          <p class="text-sm text-gray-600">{{ era.description }}</p>
        </div>
      </div>
    </button>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue', 'error'])
const emit = defineEmits(['update:modelValue'])

const eras = [
  {
    value: 'retro',
    label: 'Solo Retro',
    description: 'Camisetas clásicas y vintage (temporadas anteriores)'
  },
  {
    value: 'current',
    label: 'Solo Actuales',
    description: 'Camisetas de la temporada actual'
  },
  {
    value: 'mixed',
    label: 'Mezcla de Ambas',
    description: 'Combinación de camisetas retro y actuales'
  }
]

const selectEra = (value) => {
  emit('update:modelValue', value)
}
</script>
