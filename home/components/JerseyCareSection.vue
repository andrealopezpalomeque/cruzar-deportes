<template>
  <div class="space-y-6">
    <!-- Jersey Care Accordion -->
    <div class="space-y-4">
      <div 
        v-for="tip in careData" 
        :key="tip.id"
        class="border-none"
      >
        <UiCard class="overflow-hidden">
          <button
            @click="toggleAccordion(tip.id)"
            class="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            :aria-expanded="openItems[tip.id]"
          >
            <div class="flex items-center gap-4">
              <div class="text-2xl flex-shrink-0">
                <component :is="getIconComponent(tip.icon)" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-lg text-gray-900">{{ tip.question }}</h3>
              </div>
              <div class="flex-shrink-0">
                <IconChevronUp 
                  v-if="openItems[tip.id]"
                  class="w-5 h-5 text-gray-500 transition-transform"
                />
                <IconChevronDown 
                  v-else
                  class="w-5 h-5 text-gray-500 transition-transform"
                />
              </div>
            </div>
          </button>
          
          <div 
            v-show="openItems[tip.id]"
            class="px-6 pb-6"
          >
            <div class="ml-12 space-y-3">
              <p class="text-gray-600 leading-relaxed">{{ tip.answer }}</p>
              <div class="bg-primary-50 border-l-4 border-primary-500 pl-4 py-2">
                <div class="flex items-start gap-2">
                  <IconLightbulb class="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p class="text-sm font-medium text-primary-700">Consejo Pro: {{ tip.tip }}</p>
                </div>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>

    <!-- Additional Resources Card -->
    <UiCard class="p-6" variant="gradient">
      <div class="text-center space-y-4">
        <h2 class="text-2xl font-bold text-gray-900">¿Necesitás más ayuda?</h2>
        <p class="text-gray-600">
          Si tenés dudas específicas sobre el cuidado de tu camiseta o necesitás asistencia personalizada, no dudes en contactarnos.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Contactar Soporte
          </NuxtLink>
          <NuxtLink
            to="/faq"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Preguntas Frecuentes
          </NuxtLink>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import IconChevronUp from '~icons/mdi/chevron-up'
import IconChevronDown from '~icons/mdi/chevron-down'
import IconLightbulb from '~icons/mdi/lightbulb'
import IconRotateRight from '~icons/mdi/rotate-right'
import IconThermometer from '~icons/mdi/thermometer'
import IconCancel from '~icons/mdi/cancel'
import IconWashingMachine from '~icons/mdi/washing-machine'
import IconWeatherWindy from '~icons/mdi/weather-windy'

const openItems = reactive({})

// Icon component mapping for dynamic icons
const iconComponents = {
  'mdi:rotate-right': IconRotateRight,
  'mdi:thermometer': IconThermometer,
  'mdi:cancel': IconCancel,
  'mdi:washing-machine': IconWashingMachine,
  'mdi:weather-windy': IconWeatherWindy,
}

function getIconComponent(iconName) {
  return iconComponents[iconName] || IconRotateRight // fallback
}

const careData = [
  {
    id: "turn-inside-out",
    question: "¿Debo dar vuelta mi camiseta antes de lavarla?",
    answer:
      "Sí, siempre dale vuelta a tu camiseta antes de lavarla. Esto ayuda a proteger las estampas, logos y escudos del daño durante el ciclo de lavado, manteniéndolos vibrantes e intactos por más tiempo.",
    icon: "mdi:rotate-right",
    tip: "Este simple paso puede extender significativamente la vida útil de los gráficos de tu camiseta.",
  },
  {
    id: "cold-water",
    question: "¿Qué temperatura de agua debo usar?",
    answer:
      "Siempre lavá tus camisetas con agua fría. El agua fría previene que los colores se destiñan, reduce el encogimiento de la tela y ayuda a mantener el calce y apariencia original de la camiseta.",
    icon: "mdi:thermometer",
    tip: "El agua fría es más suave con las telas técnicas y también ahorra energía.",
  },
  {
    id: "no-fabric-softener",
    question: "¿Puedo usar suavizante en mi camiseta?",
    answer:
      "No, evitá usar suavizantes en las camisetas deportivas. Estos productos pueden dañar la tela, reducir la transpirabilidad, obstruir las propiedades que absorben la humedad y reducir significativamente la vida útil de la camiseta.",
    icon: "mdi:cancel",
    tip: "Los suavizantes pueden recubrir las fibras técnicas y reducir su rendimiento.",
  },
  {
    id: "gentle-cycle",
    question: "¿Qué ciclo de lavarropas debo usar?",
    answer:
      "Usá un ciclo suave o delicado cuando laves tus camisetas en el lavarropas. Esto reduce la agitación y es mucho más seguro para la tela y cualquier elemento estampado o bordado.",
    icon: "mdi:washing-machine",
    tip: "Los ciclos suaves usan movimientos menos agresivos para proteger tu camiseta.",
  },
  {
    id: "air-dry",
    question: "¿Cómo debo secar mi camiseta?",
    answer:
      "Siempre secá tus camisetas al aire libre. Evitá usar el secarropas ya que el calor alto puede encoger la tela y dañar las estampas o logos. Colgá o poné la camiseta extendida para secar en un área bien ventilada, lejos de la luz solar directa.",
    icon: "mdi:weather-windy",
    tip: "El secado al aire preserva la forma de la camiseta y previene el daño por calor.",
  },
]

function toggleAccordion(id) {
  openItems[id] = !openItems[id]
}
</script>