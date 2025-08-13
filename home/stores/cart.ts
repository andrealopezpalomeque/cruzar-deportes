import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  
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

  return {
    items: readonly(items),
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})