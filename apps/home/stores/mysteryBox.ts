import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { formatArs } from '~/utils/currency'

export interface SizeDistribution {
  XS: number
  S: number
  M: number
  L: number
  XL: number
  XXL: number
}

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
  paymentMethod: 'transfer' | 'cash' | 'card'
}

export type BoxType = 'individual' | 'basic' | 'premium' | 'deluxe'
export type EraPreference = 'retro' | 'current' | 'mixed'

export interface MysteryBoxOrderData {
  orderType: 'mystery_box'
  customer: CustomerInfo
  boxType: BoxType
  jerseyCount: number
  sizes: SizeDistribution
  excludedTeams: string[]
  eraPreference: EraPreference
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

export const BOX_CONFIG = {
  individual: {
    label: 'Individual',
    jerseyCount: 1,
    price: 56000,
    priceFormatted: '$56.000',
    pricePerItem: '$56.000'
  },
  basic: {
    label: 'Básica',
    jerseyCount: 3,
    price: 165000,
    priceFormatted: '$165.000',
    pricePerItem: '~$55.000'
  },
  premium: {
    label: 'Premium',
    jerseyCount: 5,
    price: 250000,
    priceFormatted: '$250.000',
    pricePerItem: '$50.000'
  },
  deluxe: {
    label: 'Deluxe',
    jerseyCount: 10,
    price: 450000,
    priceFormatted: '$450.000',
    pricePerItem: '$45.000'
  }
} as const

export const useMysteryBoxStore = defineStore('mysteryBox', () => {
  // Form state
  const boxType = ref<BoxType>('basic')
  const sizes = ref<SizeDistribution>({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 })
  const excludedTeams = ref<string[]>([])
  const eraPreference = ref<EraPreference>('mixed')
  const customerInfo = ref<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'transfer'
  })

  // Computed values
  const jerseyCount = computed(() => BOX_CONFIG[boxType.value].jerseyCount)
  const totalPrice = computed(() => BOX_CONFIG[boxType.value].price)
  const formattedPrice = computed(() => formatArs(totalPrice.value))
  const boxLabel = computed(() => BOX_CONFIG[boxType.value].label)

  const totalSizesSelected = computed(() => {
    return Object.values(sizes.value).reduce((sum, count) => sum + count, 0)
  })

  const isSizeDistributionValid = computed(() => {
    return totalSizesSelected.value === jerseyCount.value
  })

  // Actions
  function setBoxType(type: BoxType) {
    boxType.value = type
    // Reset sizes when box type changes
    sizes.value = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
  }

  function setSizes(newSizes: SizeDistribution) {
    sizes.value = { ...newSizes }
  }

  function setExcludedTeams(teams: string[]) {
    excludedTeams.value = [...teams]
  }

  function setEraPreference(era: EraPreference) {
    eraPreference.value = era
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
    } else if (!/^\+?[\d\s\-()]+$/.test(customerInfo.value.phone)) {
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

  function buildOrderData(): MysteryBoxOrderData {
    return {
      orderType: 'mystery_box',
      customer: { ...customerInfo.value },
      boxType: boxType.value,
      jerseyCount: jerseyCount.value,
      sizes: { ...sizes.value },
      excludedTeams: [...excludedTeams.value],
      eraPreference: eraPreference.value,
      totalAmount: totalPrice.value,
      paymentMethod: customerInfo.value.paymentMethod
    }
  }

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

      console.error('Mystery box order creation failed:', response.error)
      return null
    } catch (error) {
      console.error('Error submitting mystery box order:', error)
      return null
    }
  }

  function generateWhatsAppMessage(orderNumber?: string): string {
    const eraLabels: Record<EraPreference, string> = {
      retro: 'Solo Retro',
      current: 'Solo Actuales',
      mixed: 'Mezcla de Ambas'
    }

    const paymentMethodLabels: Record<string, string> = {
      transfer: 'Transferencia bancaria',
      cash: 'Efectivo',
      card: 'Tarjeta de crédito/débito'
    }

    // Format size distribution
    const sizesList = Object.entries(sizes.value)
      .filter(([_, count]) => count > 0)
      .map(([size, count]) => `${count}x ${size}`)
      .join(', ')

    let message = `*NUEVA ORDEN CAJA MISTERIOSA - CRUZAR DEPORTES*\n`
    if (orderNumber) {
      message += `*Orden #${orderNumber}*\n`
    }
    message += `\n`
    message += `*DATOS DEL CLIENTE:*\n`
    message += `- Nombre: ${customerInfo.value.name}\n`
    message += `- Teléfono: ${customerInfo.value.phone}\n`
    message += `- Email: ${customerInfo.value.email}\n`
    message += `- Dirección: ${customerInfo.value.address}\n\n`

    message += `*CONFIGURACIÓN DE LA CAJA:*\n`
    message += `- Tipo: Caja ${boxLabel.value}\n`
    message += `- Cantidad: ${jerseyCount.value} camiseta(s)\n`
    message += `- Talles: ${sizesList}\n`
    message += `- Equipos excluidos: ${excludedTeams.value.length > 0 ? excludedTeams.value.join(', ') : 'Ninguno'}\n`
    message += `- Preferencia de era: ${eraLabels[eraPreference.value]}\n\n`

    message += `*RESUMEN DE COMPRA:*\n`
    message += `- Método de pago: ${paymentMethodLabels[customerInfo.value.paymentMethod]}\n`
    message += `- *TOTAL: ${formattedPrice.value}*\n\n`

    message += `*PRÓXIMOS PASOS:*\n`
    message += `Por favor confirma la disponibilidad y los detalles de envío. ¡Gracias por elegir Cruzar Deportes!`

    return message
  }

  function generateWhatsAppURL(phoneNumber: string = '5493794000783', orderNumber?: string): string {
    const message = generateWhatsAppMessage(orderNumber)
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }

  async function sendOrderToWhatsApp(phoneNumber: string = '5493794000783'): Promise<string> {
    let orderNumber: string | undefined

    // Try to create the order first
    const orderResult = await submitOrder()
    if (orderResult) {
      orderNumber = orderResult.orderNumber
    }

    // Generate WhatsApp URL (with or without order number)
    return generateWhatsAppURL(phoneNumber, orderNumber)
  }

  function reset() {
    boxType.value = 'basic'
    sizes.value = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
    excludedTeams.value = []
    eraPreference.value = 'mixed'
    customerInfo.value = {
      name: '',
      phone: '',
      email: '',
      address: '',
      paymentMethod: 'transfer'
    }
  }

  return {
    // State
    boxType,
    sizes,
    excludedTeams,
    eraPreference,
    customerInfo,

    // Computed
    jerseyCount,
    totalPrice,
    formattedPrice,
    boxLabel,
    totalSizesSelected,
    isSizeDistributionValid,

    // Actions
    setBoxType,
    setSizes,
    setExcludedTeams,
    setEraPreference,
    setCustomerInfo,
    validateCustomerInfo,
    buildOrderData,
    submitOrder,
    generateWhatsAppMessage,
    generateWhatsAppURL,
    sendOrderToWhatsApp,
    reset
  }
})
