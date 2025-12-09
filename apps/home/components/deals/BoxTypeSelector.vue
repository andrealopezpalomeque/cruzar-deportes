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
    value: 'basic',
    label: 'Caja Básica',
    description: '3 camisetas sorpresa',
    price: '$85.000',
    pricePerItem: '~$28.300 c/u'
  },
  {
    value: 'premium',
    label: 'Caja Premium',
    description: '5 camisetas sorpresa + 1 premium',
    price: '$135.000',
    pricePerItem: '~$27.000 c/u'
  },
  {
    value: 'deluxe',
    label: 'Caja Deluxe',
    description: '10 camisetas + exclusivas',
    price: '$250.000',
    pricePerItem: '~$25.000 c/u'
  }
]

const selectBox = (value) => {
  emit('update:modelValue', value)
}
</script>
