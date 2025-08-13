<template>
  <div class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
    <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-t-lg overflow-hidden">
      <img 
        v-if="product.images?.length > 0"
        :src="product.images[0]" 
        :alt="product.name"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
      />
      <div v-else class="flex items-center justify-center">
        <Icon name="mdi:tshirt-crew" class="h-16 w-16 text-gray-400" />
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-1">{{ product.name }}</h3>
      <p class="text-sm text-gray-600 mb-2">{{ product.category }}</p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-bold text-gray-900">${{ product.price }}</span>
          <span 
            v-if="product.originalPrice && product.originalPrice > product.price"
            class="text-sm text-gray-500 line-through"
          >
            ${{ product.originalPrice }}
          </span>
        </div>
        
        <button
          @click="addToCart"
          :disabled="!product.inStock"
          class="px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Icon v-if="!product.inStock" name="mdi:close" class="h-4 w-4" />
          <Icon v-else name="mdi:plus" class="h-4 w-4" />
        </button>
      </div>
      
      <div v-if="!product.inStock" class="mt-2">
        <span class="text-sm text-red-600 font-medium">Out of Stock</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const cartStore = useCartStore()

function addToCart() {
  if (!props.product.inStock) return
  
  // For now, add with default size and color
  const defaultSize = props.product.sizes?.[0] || 'M'
  const defaultColor = props.product.colors?.[0] || 'Default'
  
  cartStore.addItem(props.product.id, defaultSize, defaultColor, 1)
  
  // TODO: Show success toast
  console.log('Added to cart:', props.product.name)
}
</script>