<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-white">
      <div class="absolute inset-0 bg-gray-50" />
      <div class="relative max-w-4xl mx-auto px-6 py-16 text-center">
        <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 mb-6">
          <IconCheckCircleFilled class="w-4 h-4 mr-2" />
          Guía Profesional
        </div>
        <h1 class="text-4xl md:text-5xl font-light text-gray-900 mb-6">
          Guía de Cuidado de
          <span class="text-black">
            Camisetas
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Mantené tus camisetas deportivas como nuevas y en perfecto estado con nuestra guía completa de cuidado
          profesional.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-6 py-12">
      <!-- Care Tips Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <UiCard variant="modern">
          <div class="p-6 text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconCheckCircle class="w-6 h-6 text-gray-600" />
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Protección Total</h3>
            <p class="text-sm text-gray-600">Preserva colores y estampados por más tiempo</p>
          </div>
        </UiCard>

        <UiCard variant="modern">
          <div class="p-6 text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconBolt class="w-6 h-6 text-gray-600" />
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Rendimiento</h3>
            <p class="text-sm text-gray-600">Mantiene las propiedades técnicas de la tela</p>
          </div>
        </UiCard>

        <UiCard variant="modern">
          <div class="p-6 text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconClock class="w-6 h-6 text-gray-600" />
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Durabilidad</h3>
            <p class="text-sm text-gray-600">Extiende significativamente la vida útil</p>
          </div>
        </UiCard>
      </div>

      <!-- FAQ Section -->
      <div class="space-y-4">
        <UiAccordionItem value="item-1" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconRefresh class="w-5 h-5 text-gray-600" />
              </div>
              <span class="font-medium text-gray-900">¿Debo dar vuelta mi camiseta antes de lavarla?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-gray-700 leading-relaxed mb-4">
                  Sí, siempre dale vuelta a tu camiseta antes de lavarla. Esto ayuda a proteger las estampas, logos
                  y escudos del daño durante el ciclo de lavado, manteniéndolos vibrantes e intactos por más tiempo.
                </p>
                <div class="bg-blue-50/80 border-l-4 border-blue-400 p-4 rounded-r-lg backdrop-blur-sm">
                  <div class="flex items-start gap-3">
                    <IconInformationCircle class="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="font-medium text-blue-900 mb-1">Consejo Pro:</p>
                      <p class="text-blue-800 text-sm">
                        Este simple paso puede extender significativamente la vida útil de los gráficos de tu
                        camiseta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <UiAccordionItem value="item-2" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconLightBulb class="w-5 h-5 text-cyan-600" />
              </div>
              <span class="font-medium text-gray-900">¿Qué temperatura de agua debo usar?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-gray-700 leading-relaxed mb-4">
                  Siempre lavá tus camisetas con agua fría. El agua fría previene que los colores se destiñan,
                  reduce el encogimiento de la tela y ayuda a mantener el calce y apariencia original de la
                  camiseta.
                </p>
                <div class="bg-cyan-50/80 border-l-4 border-cyan-400 p-4 rounded-r-lg backdrop-blur-sm">
                  <div class="flex items-start gap-3">
                    <IconInformationCircle class="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="font-medium text-cyan-900 mb-1">Consejo Pro:</p>
                      <p class="text-cyan-800 text-sm">
                        El agua fría es más suave con las telas técnicas y también ahorra energía.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <UiAccordionItem value="item-3" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconXMark class="w-5 h-5 text-red-600" />
              </div>
              <span class="font-medium text-gray-900">¿Puedo usar suavizante en mi camiseta?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-gray-700 leading-relaxed mb-4">
                  No recomendamos usar suavizante en camisetas deportivas. El suavizante puede obstruir las fibras y
                  reducir las propiedades de absorción de humedad de las telas técnicas.
                </p>
                <div class="bg-red-50/80 border-l-4 border-red-400 p-4 rounded-r-lg backdrop-blur-sm">
                  <div class="flex items-start gap-3">
                    <IconExclamationTriangle class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="font-medium text-red-900 mb-1">Importante:</p>
                      <p class="text-red-800 text-sm">
                        Evitá el suavizante para mantener el rendimiento técnico de tu camiseta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <UiAccordionItem value="item-4" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconCog class="w-5 h-5 text-indigo-600" />
              </div>
              <span class="font-medium text-gray-900">¿Qué ciclo de lavarropas debo usar?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-gray-700 leading-relaxed">
                  Usá el ciclo delicado o para ropa deportiva si tu lavarropas lo tiene. Estos ciclos son más suaves
                  y ayudan a preservar la forma y las propiedades técnicas de la tela.
                </p>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <UiAccordionItem value="item-5" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconSun class="w-5 h-5 text-amber-600" />
              </div>
              <span class="font-medium text-gray-900">¿Cómo debo secar mi camiseta?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-gray-700 leading-relaxed">
                  Lo ideal es secar al aire libre, colgada en un lugar con sombra. Evitá la exposición directa al
                  sol y el uso de secarropas cuando sea posible, ya que el calor excesivo puede dañar las fibras.
                </p>
              </div>
            </div>
          </template>
        </UiAccordionItem>
      </div>

      <!-- Help Section -->
      <UiCard variant="gradientPrimary" class="mt-12">
        <div class="p-8 text-center">
          <div class="max-w-2xl mx-auto">
            <h3 class="text-2xl font-medium mb-4">¿Necesitás más ayuda?</h3>
            <p class="text-blue-100 mb-8 leading-relaxed">
              Si tenés dudas específicas sobre el cuidado de tu camiseta o necesitás asistencia personalizada, no
              dudes en contactarnos.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UiButton size="lg" variant="white" @click="openWhatsApp">
                <IconWhatsapp class="w-5 h-5 mr-2" />
                Contactar Soporte
              </UiButton>
              <UiButton size="lg" variant="whiteOutline" @click="navigateTo('/faq')">
                <IconQuestionMark class="w-5 h-5 mr-2" />
                Preguntas Frecuentes
              </UiButton>
            </div>
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup>
import IconCheckCircleFilled from '~icons/heroicons/check-circle-solid'
import IconCheckCircle from '~icons/heroicons/check-circle'
import IconBolt from '~icons/heroicons/bolt'
import IconClock from '~icons/heroicons/clock'
import IconRefresh from '~icons/heroicons/arrow-path'
import IconInformationCircle from '~icons/heroicons/information-circle'
import IconLightBulb from '~icons/heroicons/light-bulb'
import IconXMark from '~icons/heroicons/x-mark'
import IconExclamationTriangle from '~icons/heroicons/exclamation-triangle'
import IconCog from '~icons/heroicons/cog-6-tooth'
import IconSun from '~icons/heroicons/sun'
import IconWhatsapp from '~icons/mdi/whatsapp'
import IconQuestionMark from '~icons/heroicons/question-mark-circle'

useHead({
  title: 'Cuidado de Camisetas - Guía Completa | Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Aprendé cómo cuidar adecuadamente tus camisetas deportivas para mantener su calidad y extender su vida útil.' }
  ]
})

const openWhatsApp = () => {
  const phoneNumber = '5493794000783'
  const message = encodeURIComponent('Hola, necesito ayuda con el cuidado de mi camiseta.')
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}
</script>