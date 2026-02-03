<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-hidden"
        @click="close"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity"></div>

        <!-- Drawer Panel -->
        <div class="fixed inset-y-0 right-0 flex max-w-full">
          <Transition name="slide">
            <div
              v-if="isOpen"
              class="w-screen max-w-md transform bg-white shadow-xl"
              @click.stop
            >
              <!-- Header -->
              <div class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-xl font-medium text-gray-900">Guía de Talles</h2>
                    <p class="text-sm text-gray-500 mt-1">Medidas en centímetros</p>
                  </div>
                  <button
                    type="button"
                    @click="close"
                    class="text-gray-400 hover:text-gray-900 transition-colors p-2 -mr-2 rounded-lg hover:bg-gray-100"
                    aria-label="Cerrar guía de talles"
                  >
                    <IconClose class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="h-full overflow-y-auto pb-24">
                <!-- Tab Navigation -->
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6">
                  <div class="flex space-x-1">
                    <button
                      v-for="tab in tabs"
                      :key="tab.id"
                      @click="activeTab = tab.id"
                      class="flex-1 py-3 px-4 text-sm font-medium transition-colors relative"
                      :class="{
                        'text-gray-900': activeTab === tab.id,
                        'text-gray-500 hover:text-gray-700': activeTab !== tab.id
                      }"
                    >
                      {{ tab.label }}
                      <span
                        v-if="activeTab === tab.id"
                        class="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                      ></span>
                    </button>
                  </div>
                </div>

                <!-- Tab Content -->
                <div class="px-6 py-6">
                  <!-- Retro/Fan Version -->
                  <div v-if="activeTab === 'retro'" class="space-y-6">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 mb-4">Camisetas Versión Retro/Fan</h3>

                      <!-- Size Table -->
                      <div class="overflow-x-auto rounded-lg border border-gray-200">
                        <table class="w-full text-sm">
                          <thead>
                            <tr class="bg-gray-900 text-white">
                              <th class="px-4 py-3 text-left font-medium">Talle</th>
                              <th class="px-4 py-3 text-center font-medium">Largo (cm)</th>
                              <th class="px-4 py-3 text-center font-medium">Ancho (cm)</th>
                              <th class="px-4 py-3 text-center font-medium">Altura</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200">
                            <tr v-for="(row, index) in retroSizes" :key="row.size" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                              <td class="px-4 py-3 font-medium text-gray-900">{{ row.size }}</td>
                              <td class="px-4 py-3 text-center text-gray-700">{{ row.largo }}</td>
                              <td class="px-4 py-3 text-center text-gray-700">{{ row.ancho }}</td>
                              <td class="px-4 py-3 text-center text-gray-700">{{ row.altura }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Recommendation Note -->
                      <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="flex items-start space-x-3">
                          <IconInformation class="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <p class="text-sm text-gray-700">
                            Se recomienda pedir el mismo o un talle más al que usás habitualmente.
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- How to Measure -->
                    <div class="border-t border-gray-200 pt-6">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">¿Cómo medir?</h4>
                      <ul class="space-y-2 text-sm text-gray-700">
                        <li class="flex items-start space-x-2">
                          <span class="font-medium text-gray-900">Largo:</span>
                          <span>Medida desde el hombro hasta el borde inferior</span>
                        </li>
                        <li class="flex items-start space-x-2">
                          <span class="font-medium text-gray-900">Ancho:</span>
                          <span>Medida de axila a axila</span>
                        </li>
                        <li class="flex items-start space-x-2">
                          <span class="font-medium text-gray-900">Altura:</span>
                          <span>Estatura recomendada de la persona</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Player Version -->
                  <div v-if="activeTab === 'jugador'" class="space-y-6">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 mb-4">Camisetas Versión Jugador</h3>

                      <!-- Size Table -->
                      <div class="overflow-x-auto rounded-lg border border-gray-200">
                        <table class="w-full text-sm">
                          <thead>
                            <tr class="bg-gray-900 text-white">
                              <th class="px-4 py-3 text-left font-medium">Talle</th>
                              <th class="px-4 py-3 text-center font-medium">Largo (cm)</th>
                              <th class="px-4 py-3 text-center font-medium">Ancho (cm)</th>
                              <th class="px-4 py-3 text-center font-medium">Altura</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200">
                            <tr v-for="(row, index) in jugadorSizes" :key="row.size" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                              <td class="px-4 py-3 font-medium text-gray-900">{{ row.size }}</td>
                              <td class="px-4 py-3 text-center text-gray-700">{{ row.largo }}</td>
                              <td class="px-4 py-3 text-center text-gray-700">{{ row.ancho }}</td>
                              <td class="px-4 py-3 text-center text-gray-700">{{ row.altura }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Recommendation Note -->
                      <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="flex items-start space-x-3">
                          <IconInformation class="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <p class="text-sm text-gray-700">
                            Se recomienda pedir uno o dos talles más al que usás habitualmente.
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Difference Note -->
                    <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div class="flex items-start space-x-3">
                        <IconAlertCircle class="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p class="text-sm font-medium text-amber-800">Versión Jugador</p>
                          <p class="text-sm text-amber-700 mt-1">
                            Las camisetas versión jugador tienen un corte más ajustado y deportivo, similar al que usan los jugadores profesionales.
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- How to Measure -->
                    <div class="border-t border-gray-200 pt-6">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">¿Cómo medir?</h4>
                      <ul class="space-y-2 text-sm text-gray-700">
                        <li class="flex items-start space-x-2">
                          <span class="font-medium text-gray-900">Largo:</span>
                          <span>Medida desde el hombro hasta el borde inferior</span>
                        </li>
                        <li class="flex items-start space-x-2">
                          <span class="font-medium text-gray-900">Ancho:</span>
                          <span>Medida de axila a axila</span>
                        </li>
                        <li class="flex items-start space-x-2">
                          <span class="font-medium text-gray-900">Altura:</span>
                          <span>Estatura recomendada de la persona</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import IconClose from '~icons/mdi/close'
import IconInformation from '~icons/mdi/information'
import IconAlertCircle from '~icons/mdi/alert-circle'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const activeTab = ref('retro')

const tabs = [
  { id: 'retro', label: 'Retro / Fan' },
  { id: 'jugador', label: 'Jugador' }
]

// Size data for Retro/Fan version
const retroSizes = [
  { size: 'S', largo: '69-71', ancho: '49-51', altura: '162-170' },
  { size: 'M', largo: '71-73', ancho: '51-53', altura: '170-176' },
  { size: 'L', largo: '73-75', ancho: '53-55', altura: '176-182' },
  { size: 'XL', largo: '75-78', ancho: '55-57', altura: '182-190' },
  { size: 'XXL', largo: '78-81', ancho: '57-59', altura: '190-195' },
  { size: 'XXXL', largo: '81-83', ancho: '59-62', altura: '195-200' },
  { size: 'XXXXL', largo: '83-86', ancho: '62-65', altura: '200-203' }
]

// Size data for Player version
const jugadorSizes = [
  { size: 'S', largo: '68-70', ancho: '43-45', altura: '160-167' },
  { size: 'M', largo: '70-72', ancho: '45-47', altura: '167-172' },
  { size: 'L', largo: '72-74', ancho: '47-49', altura: '172-177' },
  { size: 'XL', largo: '74-76', ancho: '49-51', altura: '177-182' },
  { size: 'XXL', largo: '76-78', ancho: '51-53', altura: '182-187' },
  { size: 'XXXL', largo: '78-80', ancho: '53-56', altura: '187-192' },
  { size: 'XXXXL', largo: '80-83', ancho: '56-59', altura: '192-195' }
]

function close() {
  emit('close')
}

// Handle escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      close()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Prevent body scroll when drawer is open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Drawer enter/leave transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

/* Slide panel enter/leave transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
