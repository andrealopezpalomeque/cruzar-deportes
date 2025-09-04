<template>
  <div class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group">
    <!-- Product Link Wrapper -->
    <NuxtLink 
      :to="`/products/${product.slug}`"
      class="block"
    >
      <!-- Product Image -->
      <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-t-lg overflow-hidden relative">
        <!-- Image Content Wrapper -->
        <div v-if="product.images?.length > 0" class="aspect-content">
          <img 
            :src="product.images[0]" 
            :alt="product.name"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div v-else class="aspect-content flex items-center justify-center">
          <Icon name="mdi:tshirt-crew" class="h-16 w-16 text-gray-400" />
        </div>
        
        <!-- Remove all badges - user doesn't want them -->
        <!-- Image count indicator - hidden -->
        <!-- Discount badge - hidden -->
        <!-- Featured badge - hidden -->
      </div>
    </NuxtLink>
    
    <!-- Product Info -->
    <div class="p-4">
      <!-- Product Title and Category -->
      <NuxtLink 
        :to="`/products/${product.slug}`"
        class="block hover:text-primary-600 transition-colors"
      >
        <h3 class="text-lg font-medium text-gray-900 mb-1 line-clamp-2">{{ product.name }}</h3>
      </NuxtLink>
      
      <p class="text-sm text-gray-600 mb-3 capitalize">{{ categoryName }}</p>
      
      <!-- Price and Action -->
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
        
        <!-- Quick Add Button -->
        <button
          @click.stop="addToCart"
          :disabled="!product.inStock"
          class="px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          :title="product.inStock ? 'Agregar al carrito' : 'Agotado'"
        >
          <Icon v-if="!product.inStock" name="mdi:close" class="h-4 w-4" />
          <Icon v-else name="mdi:plus" class="h-4 w-4" />
        </button>
      </div>
      
      <!-- Stock Status -->
      <div class="mt-2 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon 
            :name="product.inStock ? 'mdi:check-circle' : 'mdi:alert-circle'" 
            :class="product.inStock ? 'text-green-600' : 'text-red-600'"
            class="h-4 w-4"
          />
          <span 
            :class="product.inStock ? 'text-green-600' : 'text-red-600'"
            class="text-sm font-medium"
          >
            {{ product.inStock ? 'En stock' : 'Agotado' }}
          </span>
        </div>
        
        <!-- View Details Link -->
        <NuxtLink 
          :to="`/products/${product.slug}`"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          Ver detalles
        </NuxtLink>
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
const productsStore = useProductsStore()

// Computed properties
const categoryName = computed(() => {
  const category = productsStore.categories.find(cat => cat.id === props.product.category)
  return category?.name || props.product.category
})

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