import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { formatArs } from '~/utils/currency'
import type { CartItem, Product } from '~/types'
import { useProductsStore } from './products'

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
  paymentMethod: 'transfer' | 'cash' | 'card'
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  const customerInfo = ref<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'transfer'
  })

  // Initialize cart from localStorage
  function initializeFromStorage() {
    if (process.client) {
      const savedCart = localStorage.getItem('cruzar-deportes-cart')
      const savedCustomerInfo = localStorage.getItem('cruzar-deportes-customer-info')

      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            items.value = parsedCart
          }
        } catch (error) {
          console.warn('Error loading cart from localStorage:', error)
        }
      }

      if (savedCustomerInfo) {
        try {
          const parsedCustomerInfo = JSON.parse(savedCustomerInfo)
          customerInfo.value = { ...customerInfo.value, ...parsedCustomerInfo }
        } catch (error) {
          console.warn('Error loading customer info from localStorage:', error)
        }
      }
    }
  }

  // Initialize on client side
  if (process.client) {
    initializeFromStorage()
  }

  // Save cart to localStorage whenever items change
  watch(items, (newItems) => {
    if (process.client) {
      localStorage.setItem('cruzar-deportes-cart', JSON.stringify(newItems))
    }
  }, { deep: true })

  // Save customer info to localStorage whenever it changes
  watch(customerInfo, (newCustomerInfo) => {
    if (process.client) {
      localStorage.setItem('cruzar-deportes-customer-info', JSON.stringify(newCustomerInfo))
    }
  }, { deep: true })
  
  const totalItems = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice = computed(() => {
    const productsStore = useProductsStore()
    return items.value.reduce((total, item) => {
      const product = productsStore.products.find(p => p.id === item.productId)
      return total + (product?.price || 0) * item.quantity
    }, 0)
  })

  const formattedTotalPrice = computed(() => {
    return formatArs(totalPrice.value)
  })

  function addItem(productId: string, size: string, color: string, quantity = 1) {
    const existingItem = items.value.find(
      item => item.productId === productId && 
               item.size === size && 
               item.color === color
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId,
        quantity,
        size,
        color
      })
    }
  }

  function removeItem(productId: string, size: string, color: string) {
    const index = items.value.findIndex(
      item => item.productId === productId && 
               item.size === size && 
               item.color === color
    )
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId: string, size: string, color: string, quantity: number) {
    const item = items.value.find(
      item => item.productId === productId && 
               item.size === size && 
               item.color === color
    )
    if (item) {
      if (quantity <= 0) {
        removeItem(productId, size, color)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
    if (process.client) {
      localStorage.removeItem('cruzar-deportes-cart')
      localStorage.removeItem('cruzar-deportes-customer-info')
    }
  }

  function openCart() {
    isOpen.value = true
  }

  function closeCart() {
    isOpen.value = false
  }

  function setCustomerInfo(info: Partial<CustomerInfo>) {
    customerInfo.value = { ...customerInfo.value, ...info }
  }

  function validateCustomerInfo(): string[] {
    const errors: string[] = []
    
    if (!customerInfo.value.name.trim()) {
      errors.push('El nombre es requerido')
    }
    
    if (!customerInfo.value.phone.trim()) {
      errors.push('El teléfono es requerido')
    } else if (!/^\+?[\d\s-()]+$/.test(customerInfo.value.phone)) {
      errors.push('El teléfono no tiene un formato válido')
    }
    
    if (!customerInfo.value.email.trim()) {
      errors.push('El email es requerido')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.value.email)) {
      errors.push('El email no tiene un formato válido')
    }
    
    if (!customerInfo.value.address.trim()) {
      errors.push('La dirección es requerida')
    }
    
    return errors
  }

  function generateWhatsAppMessage(): string {
    const productsStore = useProductsStore()
    
    let message = `*NUEVA ORDEN - CRUZAR DEPORTES*\n\n`
    message += `*DATOS DEL CLIENTE:*\n`
    message += `- Nombre: ${customerInfo.value.name}\n`
    message += `- Telefono: ${customerInfo.value.phone}\n`
    message += `- Email: ${customerInfo.value.email}\n`
    message += `- Direccion: ${customerInfo.value.address}\n\n`
    
    message += `*PRODUCTOS SOLICITADOS:*\n`
    items.value.forEach((item, index) => {
      const product = productsStore.products.find(p => p.id === item.productId)
      if (product) {
        message += `${index + 1}. *${product.name}*\n`
        message += `   - Talla: ${item.size}\n`
        message += `   - Color/Modelo: ${item.color}\n`
        message += `   - Cantidad: ${item.quantity}\n`
        message += `   - Precio unitario: $${product.price}\n`
        message += `   - Subtotal: $${(product.price * item.quantity)}\n\n`
      }
    })
    
    const paymentMethodNames = {
      transfer: 'Transferencia bancaria',
      cash: 'Efectivo',
      card: 'Tarjeta de credito/debito'
    }
    
    message += `*RESUMEN DE COMPRA:*\n`
    message += `- Total de productos: ${totalItems.value}\n`
    message += `- Metodo de pago: ${paymentMethodNames[customerInfo.value.paymentMethod]}\n`
    message += `- *TOTAL: ${formattedTotalPrice.value}*\n\n`
    
    message += `*PROXIMOS PASOS:*\n`
    message += `Por favor confirma la disponibilidad y los detalles de envio. Gracias por elegir Cruzar Deportes!`
    
    return message
  }

  function generateWhatsAppURL(phoneNumber: string = '5493794000783'): string {
    const message = generateWhatsAppMessage()
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }

  function getCartItemsWithProducts() {
    const productsStore = useProductsStore()
    return items.value.map(item => {
      const product = productsStore.products.find(p => p.id === item.productId)
      return {
        ...item,
        product
      }
    }).filter(item => item.product)
  }

  return {
    items,
    isOpen,
    customerInfo,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    setCustomerInfo,
    validateCustomerInfo,
    generateWhatsAppMessage,
    generateWhatsAppURL,
    getCartItemsWithProducts
  }
})
