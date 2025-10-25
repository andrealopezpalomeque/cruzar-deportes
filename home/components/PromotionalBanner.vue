<template>
  <div class="w-full bg-black text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div
        class="flex items-center justify-center py-3 cursor-pointer group"
        @click="isExpanded = !isExpanded"
      >
        <span class="text-sm font-normal tracking-wide text-center">{{ currentMessage }}</span>
        <IconChevronDown
          class="ml-2 h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
        />
      </div>

      <div 
        v-if="isExpanded" 
        class="border-t border-gray-600 py-6 transition-all duration-300 cursor-default"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <IconCreditCard class="h-6 w-6 text-blue-400" />
            </div>
            <h3 class="font-medium mb-2">Lunes y Martes</h3>
            <p class="text-sm text-gray-300 mb-1">Banco de Corrientes</p>
            <p class="text-sm">30% de reintegro (sin tope)</p>
            <p class="text-sm">Hasta 6 cuotas sin interés</p>
          </div>

          <!-- COMMENTED: Future "Todas las Tarjetas" promo -->
          <!-- <div class="text-center">
            <h3 class="font-medium mb-2">Miércoles y Sábados</h3>
            <p class="text-sm text-gray-300 mb-1">Todas las tarjetas</p>
            <p class="text-sm">3 cuotas sin interés</p>
          </div> -->

          <div class="text-center">
            <div class="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <IconBuildingBank class="h-6 w-6 text-amber-400" />
            </div>
            <h3 class="font-medium mb-2">Transferencia Bancaria</h3>
            <p class="text-sm text-gray-300 mb-1">Todos los días</p>
            <p class="text-sm">10% de descuento directo</p>
            <p class="text-xs text-gray-400 mt-1">En todas tus compras</p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import IconChevronDown from '~icons/mdi/chevron-down'
import IconBuildingBank from '~icons/heroicons/building-library'
import IconCreditCard from '~icons/heroicons/credit-card'

const isExpanded = ref(false)
const currentMessageIndex = ref(0)

const messages = computed(() => {
  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.

  if (today === 1 || today === 2) {
    // Monday or Tuesday - Banco Corrientes days
    return [
      "30% reintegro Banco Corrientes + hasta 6 cuotas sin interés",
      "10% OFF con Transferencia Bancaria - Todos los días",
      "Envío gratis en compras superiores a $120.000",
      "Financiación disponible - Consulta promociones"
    ]
  } else {
    // Non-Banco days
    // COMMENTED: Future "Todas las Tarjetas" promo
    // } else if (today === 3 || today === 6) {
    //   // Wednesday or Saturday
    //   return [
    //     "3 cuotas sin interés - Todas las tarjetas",
    //     "10% OFF con Transferencia Bancaria - Todos los días",
    //     "Envío gratis en compras superiores a $120.000",
    //     "Financiación disponible - Consulta promociones"
    //   ]
    return [
      "Financiación disponible - Consulta promociones",
      "10% OFF con Transferencia Bancaria - Todos los días",
      "Envío gratis en compras superiores a $120.000"
    ]
  }
})

const currentMessage = computed(() => {
  return messages.value[currentMessageIndex.value]
})

let rotationInterval = null

onMounted(() => {
  // Auto-rotate messages every 5 seconds
  rotationInterval = setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % messages.value.length
  }, 5000)
})

onUnmounted(() => {
  if (rotationInterval) {
    clearInterval(rotationInterval)
  }
})
</script>