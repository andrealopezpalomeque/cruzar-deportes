<template>
  <div class="space-y-4">
    <div
      v-for="box in boxTypes"
      :key="box.value"
      @click="selectBox(box.value)"
      :class="[
        'p-6 rounded-lg border-2 cursor-pointer transition-all',
        modelValue === box.value
          ? 'border-black bg-gray-50'
          : 'border-gray-200 hover:border-gray-300'
      ]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4',
              modelValue === box.value
                ? 'border-black'
                : 'border-gray-300'
            ]"
          >
            <div
              v-if="modelValue === box.value"
              class="w-3 h-3 rounded-full bg-black"
            ></div>
          </div>
          <div>
            <h4 class="font-medium text-lg">{{ box.label }}</h4>
            <p class="text-sm text-gray-600">{{ box.description }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-medium">{{ box.price }}</div>
          <div class="text-sm text-gray-600">{{ box.pricePerItem }}</div>
        </div>
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue', 'error'])
const emit = defineEmits(['update:modelValue'])

const boxTypes = [
  {
    value: 'individual',
    label: 'Individual',
    description: '1 camiseta sorpresa',
    price: '$56.000',
    pricePerItem: '$56.000 c/u',
    jerseyCount: 1,
    priceValue: 56000
  },
  {
    value: 'basic',
    label: 'Caja Básica',
    description: '3 camisetas sorpresa',
    price: '$165.000',
    pricePerItem: '~$55.000 c/u',
    jerseyCount: 3,
    priceValue: 165000
  },
  {
    value: 'premium',
    label: 'Caja Premium',
    description: '5 camisetas sorpresa',
    price: '$250.000',
    pricePerItem: '$50.000 c/u',
    jerseyCount: 5,
    priceValue: 250000
  },
  {
    value: 'deluxe',
    label: 'Caja Deluxe',
    description: '10 camisetas sorpresa',
    price: '$450.000',
    pricePerItem: '$45.000 c/u',
    jerseyCount: 10,
    priceValue: 450000
  }
]

const selectBox = (value) => {
  emit('update:modelValue', value)
}

// Expose box types data for parent components
defineExpose({ boxTypes })
</script>
