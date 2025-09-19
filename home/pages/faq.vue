<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-white">
      <div class="absolute inset-0 bg-gray-50" />
      <div class="relative max-w-4xl mx-auto px-6 py-16 text-center">
        <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 mb-6">
          <IconInformationCircle class="w-4 h-4 mr-2" />
          Centro de Ayuda
        </div>
        <h1 class="text-4xl md:text-5xl font-light text-gray-900 mb-6 cursor-default">
          Preguntas
          <span class="text-black">
            Frecuentes
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed cursor-default">
          Encontrá respuestas a las preguntas más comunes sobre compras, envíos, devoluciones y más.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-6 py-12">
      <!-- Key Features Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <UiCard class="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div class="p-6 text-center cursor-default">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconCube class="w-6 h-6 text-gray-600" />
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Envío Gratis</h3>
            <p class="text-sm text-gray-600">En compras superiores a $99.999</p>
          </div>
        </UiCard>

        <UiCard class="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div class="p-6 text-center cursor-default">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconCreditCard class="w-6 h-6 text-gray-600" />
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Pago Seguro</h3>
            <p class="text-sm text-gray-600">Múltiples métodos de pago disponibles</p>
          </div>
        </UiCard>

        <UiCard class="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div class="p-6 text-center cursor-default">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconHeart class="w-6 h-6 text-gray-600" />
            </div>
            <h3 class="font-medium text-gray-900 mb-2">30 Días</h3>
            <p class="text-sm text-gray-600">Garantía de devolución sin preguntas</p>
          </div>
        </UiCard>
      </div>

      <!-- FAQ Section -->
      <div class="space-y-4">
        <!-- FAQ Item 1: Shipping -->
        <UiAccordionItem value="item-1" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconCube class="w-5 h-5 text-gray-600" />
              </div>
              <span class="font-medium text-gray-900">¿Cuáles son los tiempos y costos de envío?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-gray-700 leading-relaxed mb-4">
                  Realizamos envíos a todo el país. El envío es gratuito en compras superiores a $99.999. Para
                  montos menores, el costo varía según la ubicación.
                </p>
                <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg backdrop-blur-sm">
                  <div class="flex items-start gap-3">
                    <IconInformationCircle class="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="font-medium text-gray-900 mb-1">Seguimiento:</p>
                      <p class="text-gray-700 text-sm">
                        Recibirás un código de seguimiento por WhatsApp una vez que tu pedido sea despachado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <!-- FAQ Item 2: Payment -->
        <UiAccordionItem value="item-2" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconCreditCard class="w-5 h-5 text-gray-600" />
              </div>
              <span class="font-medium text-gray-900">¿Qué métodos de pago aceptan?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <div class="space-y-4">
                  <!-- Banco de Corrientes Promotion -->
                  <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg backdrop-blur-sm">
                    <div class="flex items-start gap-3">
                      <IconCreditCard class="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p class="font-semibold text-gray-900 mb-2">Banco de Corrientes - Lunes y Martes</p>
                        <p class="text-gray-700 text-sm mb-2">
                          Con tu tarjeta de crédito VISA del BanCo tenés todos los lunes y martes un 
                          <span class="font-semibold">30% de reintegro</span> y hasta 
                          <span class="font-semibold">6 cuotas sin interés</span>.
                        </p>
                        <p class="text-blue-700 text-xs italic">
                          Promo exclusiva con la app Más Banco.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- All Cards Promotion -->
                  <div class="bg-green-50/80 border-l-4 border-green-400 p-4 rounded-r-lg backdrop-blur-sm">
                    <div class="flex items-start gap-3">
                      <IconCreditCard class="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p class="font-semibold text-green-900 mb-2">Todas las Tarjetas - Miércoles y Sábados</p>
                        <p class="text-green-800 text-sm mb-2">
                          Los miércoles y sábados de agosto y septiembre podés aprovechar para comprar en 
                          <span class="font-semibold">3 cuotas sin interés</span>.
                        </p>
                        <p class="text-green-700 text-xs italic">
                          ¡Cualquier tarjeta es válida!
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- General Payment Methods -->
                  <div class="mt-4 pt-4 border-t border-gray-200">
                    <p class="text-gray-700 leading-relaxed text-sm">
                      También aceptamos todas las tarjetas de débito y crédito (Visa, Mastercard, American Express),
                      transferencias bancarias, y MercadoPago.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <!-- FAQ Item 3: Returns -->
        <UiAccordionItem value="item-3" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconArrowLeft class="w-5 h-5 text-gray-600" />
              </div>
              <span class="font-medium text-gray-900">¿Puedo devolver o cambiar un producto?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-gray-700 leading-relaxed mb-4">
                  Sí, tenés 30 días desde la recepción del producto para devolverlo o cambiarlo. El artículo debe
                  estar sin usar, con las etiquetas intactas y en su empaque inicial. Los gastos de envío para
                  devoluciones corren por cuenta del cliente, excepto en casos de productos defectuosos.
                </p>
                <div class="bg-gray-50/80 border-l-4 border-gray-400 p-4 rounded-r-lg backdrop-blur-sm">
                  <div class="flex items-start gap-3">
                    <IconInformationCircle class="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="font-medium text-gray-900 mb-1">Proceso simple:</p>
                      <p class="text-gray-800 text-sm">
                        Contactanos por WhatsApp para iniciar el proceso de devolución.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>


        <!-- FAQ Item 5: Tracking -->
        <UiAccordionItem value="item-5" class="border-0 rounded-xl px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
          <template #trigger>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconQuestionMarkCircle class="w-5 h-5 text-gray-600" />
              </div>
              <span class="font-medium text-gray-900">¿Cómo puedo rastrear mi pedido?</span>
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-gray-700 leading-relaxed">
                  Una vez que tu pedido sea despachado, recibirás un mensaje de WhatsApp con el número de seguimiento y un enlace
                  para rastrear tu envío en tiempo real.
                </p>
              </div>
            </div>
          </template>
        </UiAccordionItem>
      </div>

      <!-- Help Section -->
      <div class="bg-black rounded-lg max-w-4xl mx-auto mt-12">
        <div class="p-8 md:p-12 text-center">
          <div class="max-w-3xl mx-auto">
            <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconWhatsapp class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-3xl md:text-4xl font-light text-white mb-6 cursor-default">¿Necesitás más ayuda?</h3>
            <p class="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto cursor-default">
              Si tenés dudas específicas sobre tu compra o necesitás asistencia personalizada, no
              dudes en contactarnos.
            </p>

            <button
              @click="openWhatsApp"
              class="inline-flex items-center px-8 py-3 bg-white text-black text-base font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <IconWhatsapp class="w-5 h-5 mr-2" />
              Contactar Soporte
            </button>

            <p class="text-sm text-gray-400 mt-4 cursor-default">
              Respuesta en menos de 24 horas
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconInformationCircle from '~icons/heroicons/information-circle'
import IconCube from '~icons/heroicons/cube'
import IconCreditCard from '~icons/heroicons/credit-card'
import IconHeart from '~icons/heroicons/heart'
import IconArrowLeft from '~icons/heroicons/arrow-left'
import IconQuestionMarkCircle from '~icons/heroicons/question-mark-circle'
import IconWhatsapp from '~icons/mdi/whatsapp'

useHead({
  title: 'Preguntas Frecuentes | Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Respuestas a las preguntas más frecuentes sobre compras, envíos, devoluciones y atención al cliente en Cruzar Deportes.' }
  ]
})

const openWhatsApp = () => {
  const phoneNumber = '5493794000783'
  const message = encodeURIComponent('Hola, necesito ayuda con mi compra.')
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}
</script>