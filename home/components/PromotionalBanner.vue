<template>
  <div class="w-full bg-black text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div
        class="flex items-center justify-center py-3 cursor-pointer group"
        @click="isExpanded = !isExpanded"
      >
        <span class="text-sm font-normal tracking-wide text-center">{{ currentPromotion.text }}</span>
        <IconChevronDown 
          class="ml-2 h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
        />
      </div>

      <div 
        v-if="isExpanded" 
        class="border-t border-gray-600 py-6 transition-all duration-300"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="text-center">
            <h3 class="font-medium mb-2">Lunes y Martes</h3>
            <p class="text-sm text-gray-300 mb-1">Banco de Corrientes</p>
            <p class="text-sm">30% de reintegro (sin tope)</p>
            <p class="text-sm">Hasta 6 cuotas sin interés</p>
          </div>

          <div class="text-center">
            <h3 class="font-medium mb-2">Miércoles y Sábados</h3>
            <p class="text-sm text-gray-300 mb-1">Todas las tarjetas</p>
            <p class="text-sm">3 cuotas sin interés</p>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-600">
          <p class="text-xs text-gray-400 text-center">
            Promociones válidas según términos y condiciones. Consulte disponibilidad.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IconChevronDown from '~icons/mdi/chevron-down'

const isExpanded = ref(false)

const currentPromotion = computed(() => {
  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.

  if (today === 1 || today === 2) {
    // Monday or Tuesday
    return {
      text: "30% reintegro Banco Corrientes + hasta 6 cuotas sin interés",
      days: "Lunes y Martes",
      isActive: true,
    }
  } else if (today === 3 || today === 6) {
    // Wednesday or Saturday
    return {
      text: "3 cuotas sin interés - Todas las tarjetas",
      days: "Miércoles y Sábados",
      isActive: true,
    }
  } else {
    return {
      text: "Financiación disponible - Consulta promociones",
      days: "Próximas ofertas",
      isActive: false,
    }
  }
})
</script>