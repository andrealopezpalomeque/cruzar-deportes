<template>
  <Card class="p-8">
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Step Indicator -->
      <div class="flex items-center justify-between mb-8">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <div class="flex items-center">
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                currentStep >= index + 1
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>
            <span
              class="ml-3 text-sm font-medium hidden sm:block"
              :class="currentStep >= index + 1 ? 'text-black' : 'text-gray-500'"
            >
              {{ step }}
            </span>
          </div>
          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-0.5 mx-4"
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
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3',
                      formData.customer.paymentMethod === method.value ? 'border-black' : 'border-gray-300'
                    ]"
                  >
                    <div
                      v-if="formData.customer.paymentMethod === method.value"
                      class="w-2 h-2 rounded-full bg-black"
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
      <div class="flex justify-between pt-6 border-t border-gray-200">
        <Button
          v-if="currentStep > 1"
          type="button"
          variant="outline"
          @click="previousStep"
        >
          <IconArrowLeft class="w-5 h-5 mr-2" />
          Anterior
        </Button>
        <div v-else></div>

        <Button
          v-if="currentStep < 5"
          type="button"
          variant="default"
          @click="nextStep"
        >
          Siguiente
          <IconArrowRight class="w-5 h-5 ml-2" />
        </Button>
        <Button
          v-else
          type="submit"
          variant="default"
          :disabled="isSubmitting"
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
import { useMysteryBoxStore, BOX_CONFIG } from '~/stores/mysteryBox'

const mysteryBoxStore = useMysteryBoxStore()

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

  // Update store with form data
  mysteryBoxStore.setBoxType(formData.boxType)
  mysteryBoxStore.setSizes(formData.sizes)
  mysteryBoxStore.setExcludedTeams(formData.excludedTeams)
  mysteryBoxStore.setEraPreference(formData.eraPreference)
  mysteryBoxStore.setCustomerInfo(formData.customer)

  try {
    // Submit order and get WhatsApp URL
    const whatsappUrl = await mysteryBoxStore.sendOrderToWhatsApp()
    window.open(whatsappUrl, '_blank')
  } catch (error) {
    console.error('Error submitting order:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
