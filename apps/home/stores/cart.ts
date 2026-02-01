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

export interface OrderItem {
  productId: string
  productName: string
  size: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface OrderData {
  customer: CustomerInfo
  items: OrderItem[]
  totalItems: number
  totalAmount: number
  paymentMethod: string
}

export interface OrderResponse {
  success: boolean
  data?: {
    id: string
    orderNumber: string
  }
  error?: string
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

  function addItem(productId: string, size: string, quantity = 1) {
    const existingItem = items.value.find(
      item => item.productId === productId && item.size === size
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId,
        quantity,
        size
      })
    }
  }

  function removeItem(productId: string, size: string) {
    const index = items.value.findIndex(
      item => item.productId === productId && item.size === size
    )
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId: string, size: string, quantity: number) {
    const item = items.value.find(
      item => item.productId === productId && item.size === size
    )
    if (item) {
      if (quantity <= 0) {
        removeItem(productId, size)
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

  function generateWhatsAppMessage(orderNumber?: string): string {
    const productsStore = useProductsStore()

    let message = `*NUEVA ORDEN - CRUZAR DEPORTES*\n`
    if (orderNumber) {
      message += `*Orden #${orderNumber}*\n`
    }
    message += `\n`
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

  function generateWhatsAppURL(phoneNumber: string = '5493794000783', orderNumber?: string): string {
    const message = generateWhatsAppMessage(orderNumber)
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }

  // Build order data for API submission
  function buildOrderData(): OrderData {
    const productsStore = useProductsStore()

    const orderItems: OrderItem[] = items.value
      .map(item => {
        const product = productsStore.products.find(p => p.id === item.productId)
        if (!product) return null
        return {
          productId: item.productId,
          productName: product.name,
          size: item.size,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal: product.price * item.quantity
        }
      })
      .filter((item): item is OrderItem => item !== null)

    return {
      customer: { ...customerInfo.value },
      items: orderItems,
      totalItems: totalItems.value,
      totalAmount: totalPrice.value,
      paymentMethod: customerInfo.value.paymentMethod
    }
  }

  // Submit order to API
  async function submitOrder(): Promise<{ orderId: string; orderNumber: string } | null> {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl

    try {
      const orderData = buildOrderData()

      const response = await $fetch<OrderResponse>(`${apiUrl}/api/orders`, {
        method: 'POST',
        body: orderData
      })

      if (response.success && response.data) {
        return {
          orderId: response.data.id,
          orderNumber: response.data.orderNumber
        }
      }

      console.error('Order creation failed:', response.error)
      return null
    } catch (error) {
      console.error('Error submitting order:', error)
      return null
    }
  }

  // Mark order as WhatsApp sent
  async function markWhatsAppSent(orderId: string): Promise<void> {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl

    try {
      await $fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: { whatsappSent: true }
      })
    } catch (error) {
      // Non-critical - just log and continue
      console.error('Error marking WhatsApp sent:', error)
    }
  }

  // Complete checkout flow: create order, redirect to WhatsApp
  async function sendOrderToWhatsApp(phoneNumber: string = '5493794000783'): Promise<string> {
    let orderNumber: string | undefined
    let orderId: string | undefined

    // Try to create the order first
    const orderResult = await submitOrder()
    if (orderResult) {
      orderId = orderResult.orderId
      orderNumber = orderResult.orderNumber
    }

    // Generate WhatsApp URL (with or without order number)
    const whatsappUrl = generateWhatsAppURL(phoneNumber, orderNumber)

    // Mark WhatsApp as sent (fire and forget - don't block redirect)
    if (orderId) {
      markWhatsAppSent(orderId)
    }

    return whatsappUrl
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
    getCartItemsWithProducts,
    buildOrderData,
    submitOrder,
    markWhatsAppSent,
    sendOrderToWhatsApp
  }
})
