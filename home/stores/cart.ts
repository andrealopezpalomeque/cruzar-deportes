import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types'

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
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(totalPrice.value)
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
    items: readonly(items),
    isOpen: readonly(isOpen),
    customerInfo: readonly(customerInfo),
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