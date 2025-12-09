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

      <!-- Step 1: Size Selection -->
      <div v-show="currentStep === 1" class="space-y-4">
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconTshirt class="w-5 h-5 inline mr-2" />
            Seleccioná tu Talle
          </label>
          <SizeSelector v-model="formData.size" :error="errors.size" />
          <p class="text-sm text-gray-600 mt-2">Seleccioná tu talle habitual para camisetas deportivas</p>
        </div>
      </div>

      <!-- Step 2: Team Exclusions -->
      <div v-show="currentStep === 2" class="space-y-4">
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconShieldOff class="w-5 h-5 inline mr-2" />
            Excluí Equipos (Opcional)
          </label>
          <TeamExclusionPicker v-model="formData.excludedTeams" />
          <p class="text-sm text-gray-600 mt-2">Seleccioná hasta 5 equipos que no querés recibir</p>
        </div>
      </div>

      <!-- Step 3: Era Preference -->
      <div v-show="currentStep === 3" class="space-y-4">
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconCalendar class="w-5 h-5 inline mr-2" />
            Preferencia de Era
          </label>
          <EraPreferenceSelector v-model="formData.eraPreference" :error="errors.eraPreference" />
          <p class="text-sm text-gray-600 mt-2">Elegí qué tipo de camisetas preferís recibir</p>
        </div>
      </div>

      <!-- Step 4: Box Type Selection -->
      <div v-show="currentStep === 4" class="space-y-4">
        <div>
          <label class="block text-lg font-medium text-gray-900 mb-4">
            <IconGift class="w-5 h-5 inline mr-2" />
            Tipo de Caja
          </label>
          <BoxTypeSelector v-model="formData.boxType" :error="errors.boxType" />
        </div>

        <!-- Summary -->
        <div class="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 class="font-medium text-gray-900 mb-4">Resumen de tu Configuración</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-700">Talle:</span>
              <span class="font-medium">{{ formData.size || '-' }}</span>
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
              <span class="text-gray-900 font-medium">Caja {{ getBoxTypeLabel(formData.boxType) }}:</span>
              <span class="text-2xl font-medium">{{ getBoxPrice(formData.boxType) }}</span>
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
          v-if="currentStep < 4"
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
import { ref, reactive } from 'vue'
import IconTshirt from '~icons/mdi/tshirt-crew'
import IconShieldOff from '~icons/mdi/shield-off-outline'
import IconCalendar from '~icons/mdi/calendar-range'
import IconGift from '~icons/mdi/gift-outline'
import IconArrowLeft from '~icons/mdi/arrow-left'
import IconArrowRight from '~icons/mdi/arrow-right'
import IconWhatsapp from '~icons/mdi/whatsapp'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import SizeSelector from '~/components/deals/SizeSelector.vue'
import TeamExclusionPicker from '~/components/deals/TeamExclusionPicker.vue'
import EraPreferenceSelector from '~/components/deals/EraPreferenceSelector.vue'
import BoxTypeSelector from '~/components/deals/BoxTypeSelector.vue'

const steps = ['Talle', 'Exclusiones', 'Era', 'Tipo de Caja']
const currentStep = ref(1)
const isSubmitting = ref(false)

const formData = reactive({
  size: '',
  excludedTeams: [],
  eraPreference: 'mixed',
  boxType: 'premium'
})

const errors = reactive({
  size: '',
  eraPreference: '',
  boxType: ''
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

  if (step === 1 && !formData.size) {
    errors.size = 'Por favor seleccioná un talle'
    return false
  }

  if (step === 3 && !formData.eraPreference) {
    errors.eraPreference = 'Por favor seleccioná una preferencia'
    return false
  }

  if (step === 4 && !formData.boxType) {
    errors.boxType = 'Por favor seleccioná un tipo de caja'
    return false
  }

  return true
}

const getEraLabel = (era) => {
  const labels = {
    retro: 'Solo Retro',
    current: 'Solo Actuales',
    mixed: 'Mezcla de Ambas'
  }
  return labels[era] || '-'
}

const getBoxTypeLabel = (type) => {
  const labels = {
    basic: 'Básica',
    premium: 'Premium',
    deluxe: 'Deluxe'
  }
  return labels[type] || ''
}

const getBoxPrice = (type) => {
  const prices = {
    basic: '$85.000',
    premium: '$135.000',
    deluxe: '$250.000'
  }
  return prices[type] || ''
}

const handleSubmit = () => {
  if (!validateStep(4)) return

  isSubmitting.value = true

  // Build WhatsApp message
  const message = `
¡Hola! Quiero solicitar una Caja Misteriosa con la siguiente configuración:

📦 Tipo de Caja: ${getBoxTypeLabel(formData.boxType)}
👕 Talle: ${formData.size}
🚫 Equipos excluidos: ${formData.excludedTeams.length > 0 ? formData.excludedTeams.join(', ') : 'Ninguno'}
📅 Preferencia de Era: ${getEraLabel(formData.eraPreference)}

💰 Total: ${getBoxPrice(formData.boxType)}

¿Podrían confirmar disponibilidad y formas de pago?
  `.trim()

  const phoneNumber = '5493794000783'
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')

  // Reset form after slight delay
  setTimeout(() => {
    isSubmitting.value = false
  }, 1000)
}
</script>
