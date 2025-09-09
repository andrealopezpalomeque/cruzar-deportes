<template>
  <div class="product-info space-y-6">
    <!-- Product Header -->
    <div>
      <div class="flex items-center space-x-2 text-sm text-gray-600 mb-2">
        <span class="px-2 py-1 bg-primary-100 text-primary-800 rounded-md font-medium shadow-sm">
          {{ categoryName }}
        </span>
        <span v-if="product.featured" class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md font-medium shadow-sm">
          <IconStar class="h-3 w-3 inline mr-1" />
          Destacado
        </span>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
      
      <div class="flex items-baseline space-x-3 mb-4">
        <span class="text-3xl font-bold text-gray-900">${{ product.price }}</span>
        <span 
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-xl text-gray-500 line-through"
        >
          ${{ product.originalPrice }}
        </span>
        <span 
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-md shadow-sm"
        >
          {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% OFF
        </span>
      </div>
      
      <p v-if="product.description" class="text-gray-600 text-lg leading-relaxed mb-6">
        {{ product.description }}
      </p>
    </div>

    <!-- Product Options -->
    <div class="space-y-6">
      <!-- Size Selection -->
      <div v-if="product.sizes?.length > 0">
        <label class="block text-sm font-medium text-gray-900 mb-3">
          Talla
          <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="size in product.sizes"
            :key="size"
            @click="selectedSize = size"
            class="px-3 py-2 text-sm font-medium border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            :class="{
              'border-primary-600 bg-primary-50 text-primary-900': selectedSize === size,
              'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50': selectedSize !== size
            }"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Color Selection -->
      <div v-if="product.colors?.length > 1">
        <label class="block text-sm font-medium text-gray-900 mb-3">
          Color
          <span class="text-red-500">*</span>
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in product.colors"
            :key="color"
            @click="selectedColor = color"
            class="px-4 py-2 text-sm font-medium border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            :class="{
              'border-primary-600 bg-primary-50 text-primary-900': selectedColor === color,
              'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50': selectedColor !== color
            }"
          >
            {{ color }}
          </button>
        </div>
      </div>

      <!-- Quantity Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-3">
          Cantidad
        </label>
        <div class="flex items-center space-x-3">
          <button
            @click="decreaseQuantity"
            :disabled="quantity <= 1"
            class="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconMinus class="h-4 w-4" />
          </button>
          
          <input
            v-model.number="quantity"
            type="number"
            min="1"
            max="99"
            class="w-16 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          
          <button
            @click="increaseQuantity"
            :disabled="quantity >= 99"
            class="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconPlus class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Stock Status -->
    <div class="flex items-center space-x-2">
      <IconCheckCircle 
        v-if="product.inStock"
        class="h-5 w-5 text-green-600"
      />
      <IconAlertCircle 
        v-else
        class="h-5 w-5 text-red-600"
      />
      <span 
        :class="product.inStock ? 'text-green-600' : 'text-red-600'"
        class="text-sm font-medium"
      >
        {{ product.inStock ? 'En stock' : 'Agotado' }}
      </span>
    </div>

    <!-- Add to Cart Button -->
    <div class="space-y-4">
      <button
        @click="addToCart"
        :disabled="!canAddToCart"
        class="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        :class="{
          'animate-pulse': isAddingToCart
        }"
      >
        <IconLoading v-if="isAddingToCart" class="h-5 w-5 inline mr-2 animate-spin" />
        <IconAlertCircle v-else-if="!product.inStock" class="h-5 w-5 inline mr-2" />
        <IconCartPlus v-else class="h-5 w-5 inline mr-2" />
        
        <span v-if="isAddingToCart">Agregando...</span>
        <span v-else-if="!product.inStock">Agotado</span>
        <span v-else>Agregar al Carrito - ${{ totalPrice }}</span>
      </button>

      <!-- Validation Messages -->
      <div v-if="validationMessages.length > 0" class="space-y-1">
        <div 
          v-for="message in validationMessages"
          :key="message"
          class="flex items-center space-x-2 text-sm text-red-600"
        >
          <IconAlertCircle class="h-4 w-4 flex-shrink-0" />
          <span>{{ message }}</span>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div 
      v-if="showSuccessMessage" 
      class="bg-green-50 border border-green-200 rounded-md p-4 flex items-center space-x-3"
    >
      <IconCheckCircle class="h-5 w-5 text-green-600 flex-shrink-0" />
      <div>
        <p class="text-sm font-medium text-green-800">¡Producto agregado al carrito!</p>
        <p class="text-sm text-green-600">{{ product.name }} ({{ selectedSize }}, {{ selectedColor }})</p>
      </div>
    </div>

    <!-- Product Features -->
    <div class="border-t pt-6 space-y-4">
      <h3 class="text-lg font-semibold text-gray-900">Características del producto</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <IconShieldCheck class="h-4 w-4 text-green-600" />
          <span class="text-gray-600">Producto auténtico</span>
        </div>
        <div class="flex items-center space-x-2">
          <IconTruck class="h-4 w-4 text-blue-600" />
          <span class="text-gray-600">Envío gratuito</span>
        </div>
        <div class="flex items-center space-x-2">
          <IconRefresh class="h-4 w-4 text-purple-600" />
          <span class="text-gray-600">30 días de devolución</span>
        </div>
        <div class="flex items-center space-x-2">
          <IconMedal class="h-4 w-4 text-yellow-600" />
          <span class="text-gray-600">Calidad premium</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconStar from '~icons/mdi/star'
import IconMinus from '~icons/mdi/minus'
import IconPlus from '~icons/mdi/plus'
import IconCheckCircle from '~icons/mdi/check-circle'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconLoading from '~icons/mdi/loading'
import IconCartPlus from '~icons/mdi/cart-plus'
import IconShieldCheck from '~icons/mdi/shield-check'
import IconTruck from '~icons/mdi/truck'
import IconRefresh from '~icons/mdi/refresh'
import IconMedal from '~icons/mdi/medal'

const props = defineProps(['product'])

const cartStore = useCartStore()
const productsStore = useProductsStore()

// Reactive state
const selectedSize = ref('')
const selectedColor = ref('')
const quantity = ref(1)
const isAddingToCart = ref(false)
const showSuccessMessage = ref(false)

// Computed properties
const categoryName = computed(() => {
  const category = productsStore.categories.find(cat => cat.id === props.product.category)
  return category?.name || props.product.category
})

const totalPrice = computed(() => {
  return (props.product.price * quantity.value).toFixed(2)
})

const canAddToCart = computed(() => {
  return props.product.inStock && 
         selectedSize.value && 
         selectedColor.value && 
         quantity.value > 0 &&
         !isAddingToCart.value
})

const validationMessages = computed(() => {
  const messages = []
  
  if (!props.product.inStock) {
    messages.push('Este producto está agotado')
  }
  
  if (props.product.sizes?.length > 0 && !selectedSize.value) {
    messages.push('Por favor selecciona una talla')
  }
  
  if (props.product.colors?.length > 1 && !selectedColor.value) {
    messages.push('Por favor selecciona un color')
  }
  
  if (quantity.value < 1) {
    messages.push('La cantidad debe ser mayor a 0')
  }
  
  return messages
})

// Methods
function increaseQuantity() {
  if (quantity.value < 99) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

async function addToCart() {
  if (!canAddToCart.value) return
  
  isAddingToCart.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    cartStore.addItem(
      props.product.id,
      selectedSize.value,
      selectedColor.value,
      quantity.value
    )
    
    // Show success message
    showSuccessMessage.value = true
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    isAddingToCart.value = false
  }
}

// Initialize default selections
onMounted(() => {
  // Set default size
  if (props.product.sizes?.length > 0) {
    selectedSize.value = props.product.sizes[0]
  }
  
  // Set default color
  if (props.product.colors?.length > 0) {
    selectedColor.value = props.product.colors[0]
  }
})

// Watch for product changes (if user navigates to different product)
watch(() => props.product, () => {
  // Reset selections
  selectedSize.value = props.product.sizes?.[0] || ''
  selectedColor.value = props.product.colors?.[0] || ''
  quantity.value = 1
  showSuccessMessage.value = false
}, { immediate: true })
</script>

<style scoped>
/* Custom number input styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Smooth animations */
.transition-all {
  transition-property: all;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Success message slide in */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-green-50 {
  animation: slideIn 0.3s ease-out;
}
</style>