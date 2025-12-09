<template>
  <div class="product-info space-y-6">
    <!-- Product Header -->
    <div>
      <div class="flex items-center space-x-2 text-sm text-gray-800 mb-2">
        <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium shadow-sm">
          {{ categoryName }}
        </span>
        <span v-if="product.featured" class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium shadow-sm">
          <IconStar class="h-3 w-3 inline mr-1" />
          Destacado
        </span>
      </div>
      
      <h1 class="text-3xl font-light text-gray-900 mb-4">{{ product.name }}</h1>
      
      <div class="flex items-baseline space-x-3 mb-4">
        <span class="text-3xl font-medium text-gray-900">{{ formatArs(product.price) }}</span>
        <span 
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-xl text-gray-700 line-through"
        >
          {{ formatArs(product.originalPrice) }}
        </span>
        <span 
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-sm font-medium text-white bg-black px-2 py-1 rounded-md shadow-sm"
        >
          {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% OFF
        </span>
      </div>
      
      <p v-if="product.description" class="text-gray-800 text-lg leading-relaxed mb-6">
        {{ product.description }}
      </p>
    </div>

    <!-- Product Options -->
    <div class="space-y-6">
      <!-- Size Selection -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-900">
            Talla <span class="text-red-500">*</span>
          </label>
          <button class="text-sm text-gray-500 underline hover:text-gray-900 transition-colors">
            Guía de talles
          </button>
        </div>

        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="size in sizes"
            :key="size.id"
            @click="selectedSize = size.id"
            class="relative flex h-12 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200 ease-out hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
            :class="{
              'border-gray-900 bg-gray-900 text-white shadow-md scale-[1.02]': selectedSize === size.id,
              'border-gray-200 bg-white text-gray-900': selectedSize !== size.id
            }"
          >
            {{ size.label }}

            <!-- Selected Indicator -->
            <span
              v-if="selectedSize === size.id"
              class="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
            >
              <IconCheck class="h-2.5 w-2.5" />
            </span>
          </button>
        </div>

        <p
          v-if="selectedSize"
          class="text-sm text-gray-500 animate-in fade-in slide-in-from-top-1 duration-300"
        >
          Has seleccionado: <span class="font-medium text-gray-900">{{ sizes.find(s => s.id === selectedSize)?.label }}</span>
        </p>
      </div>

      <!-- Color Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-3">
          Color/Modelo
          <span class="text-red-700">*</span>
        </label>
        <input
          v-model="selectedColor"
          type="text"
          placeholder="Ej: Azul local como en foto #1, Rojo visitante como en foto #3"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
        />
        <p class="text-sm text-gray-700 mt-2">
          Describe el color/modelo que deseas y referencia el número de foto donde lo ves
        </p>
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
            class="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconMinus class="h-4 w-4" />
          </button>
          
          <input
            v-model.number="quantity"
            type="number"
            min="1"
            max="99"
            class="w-16 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
          
          <button
            @click="increaseQuantity"
            :disabled="quantity >= 99"
            class="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconPlus class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add to Cart Button -->
    <div class="space-y-4">
      <button
        @click="addToCart"
        :disabled="!canAddToCart"
        class="w-full bg-black text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        :class="{
          'animate-pulse': isAddingToCart
        }"
      >
        <IconLoading v-if="isAddingToCart" class="h-5 w-5 inline mr-2 animate-spin" />
        <IconClockOutline v-else-if="!product.inStock" class="h-5 w-5 inline mr-2" />
        <IconCartPlus v-else class="h-5 w-5 inline mr-2" />
        
        <span v-if="isAddingToCart">Agregando...</span>
        <span v-else-if="!product.inStock">Encargar ahora - {{ formattedTotalPrice }}</span>
        <span v-else>Agregar al Carrito - {{ formattedTotalPrice }}</span>
      </button>

      <!-- Validation Messages -->
      <div v-if="validationMessages.length > 0" class="space-y-1">
        <div 
          v-for="message in validationMessages"
          :key="message"
          class="flex items-center space-x-2 text-sm text-red-700"
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
      <IconCheckCircle class="h-5 w-5 text-green-700 flex-shrink-0" />
      <div>
        <p class="text-sm font-medium text-green-800">¡Producto agregado al carrito!</p>
        <p class="text-sm text-green-700">{{ product.name }} - Talla: {{ selectedSize }}, Color/Modelo: {{ selectedColor }}</p>
      </div>
    </div>

    <!-- Payment Promotions -->
    <div class="bg-amber-50/80 border-l-4 border-amber-400 rounded-r-lg p-3">
      <div class="flex items-center gap-2">
        <IconBuildingBank class="h-5 w-5 text-amber-600 flex-shrink-0" />
        <p class="text-sm text-amber-900">
          <span class="font-semibold">10% OFF</span> con transferencia bancaria
        </p>
      </div>
    </div>

    <!-- Product Features -->
    <div class="border-t pt-6 space-y-4">
      <h3 class="text-lg font-medium text-gray-900">Características del producto</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <IconShieldCheck class="h-4 w-4 text-gray-800" />
          <span class="text-gray-800">Producto de calidad premium</span>
        </div>
        <div class="flex items-center space-x-2">
          <IconTruck class="h-4 w-4 text-gray-800" />
          <span class="text-gray-800">Envío gratuito en compras +$120.000</span>
        </div>
        <div class="flex items-center space-x-2">
          <IconRefresh class="h-4 w-4 text-gray-800" />
          <span class="text-gray-800">30 días de devolución</span>
        </div>
        <div class="flex items-center space-x-2">
          <IconMedal class="h-4 w-4 text-gray-800" />
          <span class="text-gray-800">Materiales certificados</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconStar from '~icons/mdi/star'
import IconMinus from '~icons/mdi/minus'
import IconPlus from '~icons/mdi/plus'
import IconCheck from '~icons/mdi/check'
import IconCheckCircle from '~icons/mdi/check-circle'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconLoading from '~icons/mdi/loading'
import IconClockOutline from '~icons/mdi/clock-outline'
import IconCartPlus from '~icons/mdi/cart-plus'
import IconShieldCheck from '~icons/mdi/shield-check'
import IconTruck from '~icons/mdi/truck'
import IconRefresh from '~icons/mdi/refresh'
import IconMedal from '~icons/mdi/medal'
import IconChevronDown from '~icons/mdi/chevron-down'
import IconBuildingBank from '~icons/heroicons/building-library'
import { formatArs } from '@cruzar/shared/utils/currency'

const props = defineProps(['product'])

const cartStore = useCartStore()
const productsStore = useProductsStore()

// Size options
const sizes = [
  { id: 'S', label: 'S' },
  { id: 'M', label: 'M' },
  { id: 'L', label: 'L' },
  { id: 'XL', label: 'XL' },
  { id: '2XL', label: '2XL' },
  { id: '3XL', label: '3XL' },
  { id: '4XL', label: '4XL' }
]

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
  return props.product.price * quantity.value
})

const formattedTotalPrice = computed(() => formatArs(totalPrice.value))

const canAddToCart = computed(() => {
  return selectedSize.value && selectedSize.value.trim() !== '' &&
         selectedColor.value && selectedColor.value.trim() !== '' &&
         quantity.value > 0 &&
         !isAddingToCart.value
})

const validationMessages = computed(() => {
  const messages = []
  
  if (!selectedSize.value || selectedSize.value.trim() === '') {
    messages.push('Por favor especifica una talla')
  }
  
  if (!selectedColor.value || selectedColor.value.trim() === '') {
    messages.push('Por favor especifica el color/modelo')
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

// Watch for product changes (if user navigates to different product)
watch(() => props.product, () => {
  // Reset selections to empty state
  selectedSize.value = ''
  selectedColor.value = ''
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
