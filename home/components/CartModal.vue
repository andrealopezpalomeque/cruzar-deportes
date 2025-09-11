<template>
  <div
    v-if="cartStore.isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="cartStore.closeCart"
  >
    <div class="flex min-h-screen items-start justify-center p-2 sm:p-4 pt-4 sm:pt-8">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity"></div>
      
      <!-- Modal -->
      <div
        class="relative w-full max-w-6xl transform rounded-lg bg-white shadow-xl transition-all"
        @click.stop
      >
        <!-- Header -->
        <div class="border-b border-gray-200 px-4 sm:px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <IconShopping class="h-6 w-6 text-primary-600 mr-2" />
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Carrito de Compras</h2>
              <span 
                v-if="cartStore.totalItems > 0"
                class="ml-2 sm:ml-3 bg-primary-100 text-primary-800 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-0.5 rounded-full"
              >
                {{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'producto' : 'productos' }}
              </span>
            </div>
            <button
              type="button"
              @click="cartStore.closeCart"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <IconClose class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="max-h-[80vh] overflow-y-auto">
          <!-- Empty Cart State -->
          <div v-if="cartItems.length === 0" class="text-center py-16 px-6">
            <IconCartOff class="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
            <p class="text-gray-500 mb-6">Agrega algunos productos para comenzar tu compra</p>
            <button
              @click="goToProducts"
              class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              <IconArrowRight class="mr-2 h-4 w-4" />
              Ver Productos
            </button>
          </div>

          <!-- Cart Items and Checkout Form -->
          <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
            <!-- Cart Items -->
            <div class="space-y-4 order-1 xl:order-1">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Productos en tu carrito</h3>
              
              <div class="space-y-3">
                <div
                  v-for="item in cartItems"
                  :key="`${item.productId}-${item.size}-${item.color}`"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <!-- Mobile Layout (default) -->
                  <div class="block sm:hidden">
                    <!-- Top row: Image and Remove button -->
                    <div class="flex items-start justify-between mb-3">
                      <img
                        :src="item.product.images[0]"
                        :alt="item.product.name"
                        class="h-20 w-20 object-cover rounded-md"
                      />
                      <button
                        @click="removeItem(item)"
                        class="text-red-500 hover:text-red-700 transition-colors p-2 -m-2"
                        title="Eliminar producto"
                      >
                        <IconTrash class="h-5 w-5" />
                      </button>
                    </div>
                    
                    <!-- Product Info -->
                    <div class="mb-3">
                      <h4 class="font-medium text-gray-900 mb-1">{{ item.product.name }}</h4>
                      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>Talla: {{ item.size }}</span>
                        <span>Color: {{ item.color }}</span>
                      </div>
                      <p class="text-lg font-semibold text-primary-600 mt-1">${{ item.product.price }} c/u</p>
                    </div>
                    
                    <!-- Quantity Controls -->
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700">Cantidad:</span>
                      <div class="flex items-center space-x-3">
                        <button
                          @click="updateQuantity(item, item.quantity - 1)"
                          :disabled="item.quantity <= 1"
                          class="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <IconMinus class="h-4 w-4" />
                        </button>
                        
                        <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                        
                        <button
                          @click="updateQuantity(item, item.quantity + 1)"
                          :disabled="item.quantity >= 99"
                          class="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <IconPlus class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Layout (sm and up) -->
                  <div class="hidden sm:flex items-center space-x-4">
                    <!-- Product Image -->
                    <img
                      :src="item.product.images[0]"
                      :alt="item.product.name"
                      class="h-16 w-16 object-cover rounded-md flex-shrink-0"
                    />
                    
                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-gray-900 truncate">{{ item.product.name }}</h4>
                      <p class="text-sm text-gray-500">Talla: {{ item.size }}</p>
                      <p class="text-sm text-gray-500">Color: {{ item.color }}</p>
                      <p class="text-sm font-medium text-primary-600">${{ item.product.price }} c/u</p>
                    </div>
                    
                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2">
                      <button
                        @click="updateQuantity(item, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IconMinus class="h-3 w-3" />
                      </button>
                      
                      <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
                      
                      <button
                        @click="updateQuantity(item, item.quantity + 1)"
                        :disabled="item.quantity >= 99"
                        class="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IconPlus class="h-3 w-3" />
                      </button>
                    </div>
                    
                    <!-- Remove Button -->
                    <button
                      @click="removeItem(item)"
                      class="text-red-500 hover:text-red-700 transition-colors"
                      title="Eliminar producto"
                    >
                      <IconTrash class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Cart Summary -->
              <div class="border-t pt-4 mt-6">
                <div class="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total:</span>
                  <span class="text-primary-600">{{ cartStore.formattedTotalPrice }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Form -->
            <div class="bg-gray-50 rounded-lg p-4 sm:p-6 order-2 xl:order-2">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información de contacto</h3>
              
              <form @submit.prevent="handleCheckout" class="space-y-4">
                <!-- Name -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="localCustomerInfo.name"
                    type="text"
                    placeholder="Tu nombre completo"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :class="{ 'border-red-300': validationErrors.includes('El nombre es requerido') }"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    v-model="localCustomerInfo.phone"
                    type="tel"
                    placeholder="+54 9 11 1234-5678"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :class="{ 'border-red-300': validationErrors.some(error => error.includes('teléfono')) }"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="localCustomerInfo.email"
                    type="email"
                    placeholder="tu@email.com"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :class="{ 'border-red-300': validationErrors.some(error => error.includes('email')) }"
                  />
                </div>

                <!-- Address -->
                <div>
                  <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de envío <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    v-model="localCustomerInfo.address"
                    rows="3"
                    placeholder="Calle, número, ciudad, provincia"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :class="{ 'border-red-300': validationErrors.includes('La dirección es requerida') }"
                  ></textarea>
                </div>

                <!-- Payment Method -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Método de pago preferido <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <input
                        id="transfer"
                        v-model="localCustomerInfo.paymentMethod"
                        type="radio"
                        value="transfer"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label for="transfer" class="ml-3 text-sm text-gray-700">
                        Transferencia bancaria (recomendado)
                      </label>
                    </div>
                    <div class="flex items-center">
                      <input
                        id="cash"
                        v-model="localCustomerInfo.paymentMethod"
                        type="radio"
                        value="cash"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label for="cash" class="ml-3 text-sm text-gray-700">
                        Efectivo (contra entrega)
                      </label>
                    </div>
                    <div class="flex items-center">
                      <input
                        id="card"
                        v-model="localCustomerInfo.paymentMethod"
                        type="radio"
                        value="card"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label for="card" class="ml-3 text-sm text-gray-700">
                        Tarjeta de crédito/débito
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Validation Errors -->
                <div v-if="validationErrors.length > 0" class="space-y-1">
                  <div 
                    v-for="error in validationErrors"
                    :key="error"
                    class="flex items-center space-x-2 text-sm text-red-600"
                  >
                    <IconAlertCircle class="h-4 w-4 flex-shrink-0" />
                    <span>{{ error }}</span>
                  </div>
                </div>

                <!-- WhatsApp Notice -->
                <div class="bg-green-50 border border-green-200 rounded-md p-4">
                  <div class="flex items-start space-x-3">
                    <IconWhatsapp class="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="text-sm font-medium text-green-800">Finalización via WhatsApp</p>
                      <p class="text-sm text-green-700 mt-1">
                        Al continuar, serás redirigido a WhatsApp con todos los detalles de tu pedido pre-escritos. 
                        <span class="font-medium">Solo presiona "Enviar" o Enter</span> para completar tu pedido.
                      </p>
                      <div class="mt-2 flex items-center text-xs text-green-600">
                        <IconInformationCircle class="h-3 w-3 mr-1" />
                        <span>El mensaje estará listo - solo necesitas enviarlo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Checkout Button -->
                <button
                  type="submit"
                  :disabled="isProcessing"
                  class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  :class="{ 'animate-pulse': isProcessing }"
                >
                  <IconWhatsapp v-if="!isProcessing" class="h-5 w-5 mr-2" />
                  <IconLoading v-else class="h-5 w-5 mr-2 animate-spin" />
                  <span v-if="isProcessing">Procesando...</span>
                  <span v-else>Finalizar Compra via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCartStore } from '~/stores/cart'
import { toast } from 'vue3-toastify'
import IconShopping from '~icons/mdi/shopping'
import IconClose from '~icons/mdi/close'
import IconCartOff from '~icons/mdi/cart-off'
import IconArrowRight from '~icons/mdi/arrow-right'
import IconMinus from '~icons/mdi/minus'
import IconPlus from '~icons/mdi/plus'
import IconTrash from '~icons/mdi/trash-can'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconWhatsapp from '~icons/mdi/whatsapp'
import IconLoading from '~icons/mdi/loading'
import IconInformationCircle from '~icons/mdi/information'

const router = useRouter()
const cartStore = useCartStore()

const isProcessing = ref(false)
const validationErrors = ref([])

// Local customer info for form binding
const localCustomerInfo = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  paymentMethod: 'transfer'
})

// Get cart items with product details
const cartItems = computed(() => cartStore.getCartItemsWithProducts())

// Update quantity of a cart item
function updateQuantity(item, newQuantity) {
  if (newQuantity <= 0) {
    removeItem(item)
  } else {
    cartStore.updateQuantity(item.productId, item.size, item.color, newQuantity)
    toast.success('Cantidad actualizada')
  }
}

// Remove item from cart
function removeItem(item) {
  cartStore.removeItem(item.productId, item.size, item.color)
  toast.success('Producto eliminado del carrito')
}

// Navigate to products page
function goToProducts() {
  cartStore.closeCart()
  router.push('/products')
}

// Handle checkout form submission
async function handleCheckout() {
  // Update store with local customer info
  cartStore.setCustomerInfo(localCustomerInfo.value)
  
  // Validate customer info
  validationErrors.value = cartStore.validateCustomerInfo()
  
  if (validationErrors.value.length > 0) {
    toast.error('Por favor completa todos los campos requeridos')
    return
  }
  
  if (cartItems.value.length === 0) {
    toast.error('Tu carrito está vacío')
    return
  }
  
  isProcessing.value = true
  
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate WhatsApp URL and redirect
    const whatsappURL = cartStore.generateWhatsAppURL('5493794000783')
    
    // Try to open WhatsApp
    const whatsappWindow = window.open(whatsappURL, '_blank')
    
    // Check if popup was blocked
    if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
      toast.error('Por favor permite ventanas emergentes para abrir WhatsApp')
      isProcessing.value = false
      return
    }
    
    // Clear cart and close modal
    cartStore.clearCart()
    cartStore.closeCart()
    
    // Reset form
    localCustomerInfo.value = {
      name: '',
      phone: '',
      email: '',
      address: '',
      paymentMethod: 'transfer'
    }
    
    toast.success('¡Pedido enviado! Se abrió WhatsApp con los detalles.')
    
  } catch (error) {
    console.error('Error processing checkout:', error)
    toast.error('Error al procesar el pedido. Por favor intenta de nuevo.')
  } finally {
    isProcessing.value = false
  }
}

// Watch for modal close to reset validation errors
watch(() => cartStore.isOpen, (isOpen) => {
  if (!isOpen) {
    validationErrors.value = []
  }
})
</script>