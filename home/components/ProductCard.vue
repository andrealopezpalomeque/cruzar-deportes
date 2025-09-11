<template>
  <div class="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 group">
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
          <IconTshirtCrew class="h-16 w-16 text-gray-400" />
        </div>
        
        <!-- Badges Container with better positioning -->
        <div class="absolute inset-0 pointer-events-none z-10">
          <!-- Featured Badge - Top left corner -->
          <div 
            v-if="product.featured"
            class="absolute top-2 left-2"
          >
            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800 shadow-sm pointer-events-auto">
              <IconStar class="h-3 w-3 mr-1" />
              Destacado
            </span>
          </div>

          <!-- Discount Badge - Top right corner or below featured if both exist -->
          <div 
            v-if="product.originalPrice && product.originalPrice > product.price"
            :class="product.featured ? 'absolute top-12 left-2' : 'absolute top-2 right-2'"
          >
            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-800 shadow-sm pointer-events-auto">
              -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
            </span>
          </div>

          <!-- Image count indicator - Bottom right corner -->
          <div 
            v-if="(product.totalImages || product.images?.length || 0) > 1"
            class="absolute bottom-2 right-2"
          >
            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black bg-opacity-70 text-white shadow-sm pointer-events-auto">
              <IconImageMultiple class="h-3 w-3 mr-1" />
              {{ product.totalImages || product.images?.length || 0 }}
            </span>
          </div>
        </div>
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
          <IconClose v-if="!product.inStock" class="h-4 w-4" />
          <IconPlus v-else class="h-4 w-4" />
        </button>
      </div>
      
      <!-- Stock Status -->
      <div class="mt-2 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <IconCheckCircle 
            v-if="product.inStock"
            class="h-4 w-4 text-green-600"
          />
          <IconAlertCircle 
            v-else
            class="h-4 w-4 text-red-600"
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

<script setup>
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconStar from '~icons/mdi/star'
import IconImageMultiple from '~icons/mdi/image-multiple'
import IconClose from '~icons/mdi/close'
import IconPlus from '~icons/mdi/plus'
import IconCheckCircle from '~icons/mdi/check-circle'
import IconAlertCircle from '~icons/mdi/alert-circle'

const props = defineProps(['product'])
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