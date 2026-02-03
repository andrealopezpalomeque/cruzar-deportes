<template>
  <Card class="p-8">
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Step Indicator -->
      <div class="flex items-center justify-between mb-8 overflow-x-auto">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <div class="flex items-center">
            <div
              :class="[
                'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors text-sm sm:text-base flex-shrink-0',
                currentStep >= index + 1
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>
            <span
              class="ml-2 sm:ml-3 text-sm font-medium hidden md:block"
              :class="currentStep >= index + 1 ? 'text-black' : 'text-gray-500'"
            >
              {{ step }}
            </span>
          </div>
          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-0.5 mx-2 sm:mx-4 min-w-[16px]"
            :class="currentStep > index + 1 ? 'bg-black' : 'bg-gray-200'"
          ></div>
        </div>
      </div>

      <!-- Step 1: Box Type Selection -->
      <div v-show="currentStep === 1" class="space-y-4">
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconGift class="w-5 h-5 inline mr-2" />
            Tipo de Caja
          </label>
          <BoxTypeSelector v-model="formData.boxType" :error="errors.boxType" />
        </div>
      </div>

      <!-- Step 2: Size Distribution -->
      <div v-show="currentStep === 2" class="space-y-4">
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconTshirt class="w-5 h-5 inline mr-2" />
            Distribución de Talles
          </label>
          <p class="text-sm text-gray-600 mb-4">
            Distribuí los {{ jerseyCount }} talles para tu caja {{ boxLabel }}
          </p>
          <MultiSizeSelector
            ref="multiSizeSelector"
            v-model="formData.sizes"
            :jersey-count="jerseyCount"
            :error="errors.sizes"
          />
        </div>
      </div>

      <!-- Step 3: Team Exclusions -->
      <div v-show="currentStep === 3" class="space-y-4">
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconShieldOff class="w-5 h-5 inline mr-2" />
            Excluí Equipos (Opcional)
          </label>
          <TeamExclusionPicker v-model="formData.excludedTeams" />
          <p class="text-sm text-gray-600 mt-2">Seleccioná hasta 5 equipos que no querés recibir</p>
        </div>
      </div>

      <!-- Step 4: Era Preference -->
      <div v-show="currentStep === 4" class="space-y-4">
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconCalendar class="w-5 h-5 inline mr-2" />
            Preferencia de Era
          </label>
          <EraPreferenceSelector v-model="formData.eraPreference" :error="errors.eraPreference" />
          <p class="text-sm text-gray-600 mt-2">Elegí qué tipo de camisetas preferís recibir</p>
        </div>
      </div>

      <!-- Step 5: Customer Info + Summary -->
      <div v-show="currentStep === 5" class="space-y-6">
        <!-- Customer Form -->
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconUser class="w-5 h-5 inline mr-2" />
            Datos de Contacto
          </label>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <input
                type="text"
                v-model="formData.customer.name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Tu nombre"
              />
              <p v-if="errors.customerName" class="text-sm text-red-600 mt-1">{{ errors.customerName }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
              <input
                type="tel"
                v-model="formData.customer.phone"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="+54 9 11 1234-5678"
              />
              <p v-if="errors.customerPhone" class="text-sm text-red-600 mt-1">{{ errors.customerPhone }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                v-model="formData.customer.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="tu@email.com"
              />
              <p v-if="errors.customerEmail" class="text-sm text-red-600 mt-1">{{ errors.customerEmail }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección de envío *</label>
              <textarea
                v-model="formData.customer.address"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Calle, número, ciudad, código postal"
              ></textarea>
              <p v-if="errors.customerAddress" class="text-sm text-red-600 mt-1">{{ errors.customerAddress }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Método de pago *</label>
              <div class="space-y-2">
                <label
                  v-for="method in paymentMethods"
                  :key="method.value"
                  class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
                  :class="formData.customer.paymentMethod === method.value ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'"
                >
                  <input
                    type="radio"
                    :value="method.value"
                    v-model="formData.customer.paymentMethod"
                    class="sr-only"
                  />
                  <div
                    :class="[
                      'w-4 h-4 min-w-[16px] min-h-[16px] rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0',
                      formData.customer.paymentMethod === method.value ? 'border-black' : 'border-gray-300'
                    ]"
                  >
                    <div
                      v-if="formData.customer.paymentMethod === method.value"
                      class="w-2 h-2 min-w-[8px] min-h-[8px] rounded-full bg-black"
                    ></div>
                  </div>
                  <span>{{ method.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="p-6 bg-gray-50 rounded-lg">
          <h3 class="font-medium text-gray-900 mb-4">Resumen de tu Configuración</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-700">Tipo de Caja:</span>
              <span class="font-medium">{{ boxLabel }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Cantidad:</span>
              <span class="font-medium">{{ jerseyCount }} camiseta(s)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Talles:</span>
              <span class="font-medium">{{ formattedSizes || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Equipos excluidos:</span>
              <span class="font-medium">{{ formData.excludedTeams.length || 'Ninguno' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Preferencia:</span>
              <span class="font-medium">{{ getEraLabel(formData.eraPreference) }}</span>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-200">
              <span class="text-gray-900 font-medium">Total:</span>
              <span class="text-2xl font-medium">{{ formattedPrice }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-200">
        <Button
          v-if="currentStep > 1"
          type="button"
          variant="outline"
          @click="previousStep"
          class="order-2 sm:order-1"
        >
          <IconArrowLeft class="w-5 h-5 mr-2" />
          Anterior
        </Button>
        <div v-else class="hidden sm:block"></div>

        <Button
          v-if="currentStep < 5"
          type="button"
          variant="default"
          @click="nextStep"
          class="order-1 sm:order-2"
        >
          Siguiente
          <IconArrowRight class="w-5 h-5 ml-2" />
        </Button>
        <Button
          v-else
          type="submit"
          variant="default"
          :disabled="isSubmitting"
          class="order-1 sm:order-2"
        >
          <IconWhatsapp class="w-5 h-5 mr-2" />
          {{ isSubmitting ? 'Preparando...' : 'Solicitar por WhatsApp' }}
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import IconTshirt from '~icons/mdi/tshirt-crew'
import IconShieldOff from '~icons/mdi/shield-off-outline'
import IconCalendar from '~icons/mdi/calendar-range'
import IconGift from '~icons/mdi/gift-outline'
import IconUser from '~icons/mdi/account-outline'
import IconArrowLeft from '~icons/mdi/arrow-left'
import IconArrowRight from '~icons/mdi/arrow-right'
import IconWhatsapp from '~icons/mdi/whatsapp'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import TeamExclusionPicker from '~/components/deals/TeamExclusionPicker.vue'
import EraPreferenceSelector from '~/components/deals/EraPreferenceSelector.vue'
import BoxTypeSelector from '~/components/deals/BoxTypeSelector.vue'
import MultiSizeSelector from '~/components/deals/MultiSizeSelector.vue'
import { BOX_CONFIG } from '~/stores/mysteryBox'

const steps = ['Tipo de Caja', 'Talles', 'Exclusiones', 'Era', 'Datos']
const currentStep = ref(1)
const isSubmitting = ref(false)
const multiSizeSelector = ref(null)

const formData = reactive({
  boxType: 'basic',
  sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  excludedTeams: [],
  eraPreference: 'mixed',
  customer: {
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'transfer'
  }
})

const errors = reactive({
  boxType: '',
  sizes: '',
  eraPreference: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  customerAddress: ''
})

const paymentMethods = [
  { value: 'transfer', label: 'Transferencia bancaria' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta de crédito/débito' }
]

// Computed values based on box type
const jerseyCount = computed(() => BOX_CONFIG[formData.boxType]?.jerseyCount || 3)
const boxLabel = computed(() => BOX_CONFIG[formData.boxType]?.label || 'Básica')
const formattedPrice = computed(() => BOX_CONFIG[formData.boxType]?.priceFormatted || '$165.000')

const formattedSizes = computed(() => {
  const entries = Object.entries(formData.sizes)
    .filter(([_, count]) => count > 0)
    .map(([size, count]) => `${count}x ${size}`)
  return entries.length > 0 ? entries.join(', ') : null
})

const totalSizesSelected = computed(() => {
  return Object.values(formData.sizes).reduce((sum, count) => sum + count, 0)
})

// Reset sizes when box type changes
watch(() => formData.boxType, () => {
  formData.sizes = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
})

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const previousStep = () => {
  currentStep.value--
}

const validateStep = (step) => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  if (step === 1 && !formData.boxType) {
    errors.boxType = 'Por favor seleccioná un tipo de caja'
    return false
  }

  if (step === 2) {
    if (totalSizesSelected.value !== jerseyCount.value) {
      errors.sizes = `Seleccioná exactamente ${jerseyCount.value} talle(s)`
      return false
    }
  }

  if (step === 4 && !formData.eraPreference) {
    errors.eraPreference = 'Por favor seleccioná una preferencia'
    return false
  }

  if (step === 5) {
    return validateCustomerInfo()
  }

  return true
}

const validateCustomerInfo = () => {
  let isValid = true

  if (!formData.customer.name.trim()) {
    errors.customerName = 'El nombre es requerido'
    isValid = false
  }

  if (!formData.customer.phone.trim()) {
    errors.customerPhone = 'El teléfono es requerido'
    isValid = false
  } else if (!/^\+?[\d\s\-()]+$/.test(formData.customer.phone)) {
    errors.customerPhone = 'El teléfono no tiene un formato válido'
    isValid = false
  }

  if (!formData.customer.email.trim()) {
    errors.customerEmail = 'El email es requerido'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
    errors.customerEmail = 'El email no tiene un formato válido'
    isValid = false
  }

  if (!formData.customer.address.trim()) {
    errors.customerAddress = 'La dirección es requerida'
    isValid = false
  }

  return isValid
}

const getEraLabel = (era) => {
  const labels = {
    retro: 'Solo Retro',
    current: 'Solo Actuales',
    mixed: 'Mezcla de Ambas'
  }
  return labels[era] || '-'
}

const handleSubmit = async () => {
  if (!validateCustomerInfo()) return

  isSubmitting.value = true

  try {
    // Build WhatsApp message directly from form data
    const eraLabels = {
      retro: 'Solo Retro',
      current: 'Solo Actuales',
      mixed: 'Mezcla de Ambas'
    }

    const paymentMethodLabels = {
      transfer: 'Transferencia bancaria',
      cash: 'Efectivo',
      card: 'Tarjeta de crédito/débito'
    }

    // Format size distribution
    const sizesList = Object.entries(formData.sizes)
      .filter(([_, count]) => count > 0)
      .map(([size, count]) => `${count}x ${size}`)
      .join(', ')

    // Try to submit order to API first
    let orderNumber = ''
    try {
      const config = useRuntimeConfig()
      const apiUrl = config.public.apiUrl

      const orderData = {
        orderType: 'mystery_box',
        customer: { ...formData.customer },
        boxType: formData.boxType,
        jerseyCount: jerseyCount.value,
        sizes: { ...formData.sizes },
        excludedTeams: [...formData.excludedTeams],
        eraPreference: formData.eraPreference,
        totalAmount: BOX_CONFIG[formData.boxType]?.price || 0,
        paymentMethod: formData.customer.paymentMethod
      }

      const response = await $fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        body: orderData
      })

      if (response?.success && response?.data?.orderNumber) {
        orderNumber = response.data.orderNumber
      }
    } catch (apiError) {
      console.warn('Could not create order in API, continuing with WhatsApp:', apiError)
    }

    // Build WhatsApp message
    let message = `*NUEVA ORDEN CAJA MISTERIOSA - CRUZAR DEPORTES*\n`
    if (orderNumber) {
      message += `*Orden #${orderNumber}*\n`
    }
    message += `\n`
    message += `*DATOS DEL CLIENTE:*\n`
    message += `- Nombre: ${formData.customer.name}\n`
    message += `- Teléfono: ${formData.customer.phone}\n`
    message += `- Email: ${formData.customer.email}\n`
    message += `- Dirección: ${formData.customer.address}\n\n`

    message += `*CONFIGURACIÓN DE LA CAJA:*\n`
    message += `- Tipo: Caja ${boxLabel.value}\n`
    message += `- Cantidad: ${jerseyCount.value} camiseta(s)\n`
    message += `- Talles: ${sizesList || 'No especificado'}\n`
    message += `- Equipos excluidos: ${formData.excludedTeams.length > 0 ? formData.excludedTeams.join(', ') : 'Ninguno'}\n`
    message += `- Preferencia de era: ${eraLabels[formData.eraPreference] || 'Mezcla de Ambas'}\n\n`

    message += `*RESUMEN DE COMPRA:*\n`
    message += `- Método de pago: ${paymentMethodLabels[formData.customer.paymentMethod] || 'Transferencia bancaria'}\n`
    message += `- *TOTAL: ${formattedPrice.value}*\n\n`

    message += `*PRÓXIMOS PASOS:*\n`
    message += `Por favor confirma la disponibilidad y los detalles de envío. ¡Gracias por elegir Cruzar Deportes!`

    const phoneNumber = '5493794000783'
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
  } catch (error) {
    console.error('Error submitting order:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
