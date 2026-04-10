<template>
  <div class="min-h-screen bg-surface-cream">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-surface-cream">
      <div class="absolute inset-0 bg-surface-cream" />
      <div class="relative max-w-4xl mx-auto px-6 py-16 text-center">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-orange-50 border border-brand-orange-200 text-brand-orange-700 mb-6"
        >
          <IconInformationCircle class="w-4 h-4 mr-2" />
          Centro de Ayuda
        </div>
        <h1
          class="font-display text-display-xl uppercase text-ink mb-6 cursor-default"
        >
          Preguntas
          <span class="text-ink"> Frecuentes </span>
        </h1>
        <p
          class="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed cursor-default"
        >
          Encontrá respuestas a las preguntas más comunes sobre compras, envíos,
          devoluciones y más.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-6 py-12">
      <!-- Key Features Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <UiCard class="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <div class="p-6 text-center cursor-default">
            <div
              class="w-12 h-12 bg-surface-muted rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <IconCube class="w-6 h-6 text-ink-muted" />
            </div>
            <h3 class="font-medium text-ink mb-2">Envío Gratis</h3>
            <p class="text-sm text-ink-muted">
              En compras superiores a $120.000
            </p>
          </div>
        </UiCard>

        <UiCard class="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <div class="p-6 text-center cursor-default">
            <div
              class="w-12 h-12 bg-surface-muted rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <IconCreditCard class="w-6 h-6 text-ink-muted" />
            </div>
            <h3 class="font-medium text-ink mb-2">Pago Seguro</h3>
            <p class="text-sm text-ink-muted">
              Múltiples métodos de pago disponibles
            </p>
          </div>
        </UiCard>

        <UiCard class="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <div class="p-6 text-center cursor-default">
            <div
              class="w-12 h-12 bg-surface-muted rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <IconHeart class="w-6 h-6 text-ink-muted" />
            </div>
            <h3 class="font-medium text-ink mb-2">30 Días</h3>
            <p class="text-sm text-ink-muted">
              Garantía de cambio o devolución por 30 días
            </p>
          </div>
        </UiCard>
      </div>

      <!-- FAQ Section -->
      <div class="space-y-4">
        <!-- FAQ Item 1: Shipping -->
        <UiAccordionItem
          value="item-1"
          class="border-0 rounded-sm px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200"
        >
          <template #trigger>
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 bg-surface-muted rounded-sm flex items-center justify-center flex-shrink-0"
              >
                <IconCube class="w-5 h-5 text-ink-muted" />
              </div>
              <span class="font-medium text-ink"
                >¿Cuáles son los tiempos y costos de envío?</span
              >
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-ink-muted leading-relaxed mb-4">
                  Realizamos envíos a todo el país. El envío es gratuito en
                  compras superiores a $120.000. Para montos menores, el costo
                  varía según la ubicación.
                </p>

                <div class="space-y-3 mb-4">
                  <!-- Delivery Time -->
                  <div
                    class="bg-blue-50/80 border-l-4 border-blue-400 p-4 rounded-r-lg backdrop-blur-sm"
                  >
                    <div class="flex items-start gap-3">
                      <IconCube
                        class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p class="font-medium text-blue-900 mb-1">
                          Tiempo de entrega:
                        </p>
                        <p class="text-blue-800 text-sm">
                          Los envíos dentro de Argentina demoran entre 2 y 5
                          días hábiles.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- In-Store Pickup -->
                  <div
                    class="bg-green-50/80 border-l-4 border-green-400 p-4 rounded-r-lg backdrop-blur-sm"
                  >
                    <div class="flex items-start gap-3">
                      <IconInformationCircle
                        class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p class="font-medium text-green-900 mb-1">
                          Retiro en tienda:
                        </p>
                        <p class="text-green-800 text-sm mb-1">
                          Podés retirar tu pedido personalmente en Corrientes
                          Capital.
                        </p>
                        <p class="text-green-700 text-xs italic">
                          Consultá la dirección por WhatsApp al realizar tu
                          pedido.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <!-- FAQ Item 2: Payment -->
        <UiAccordionItem
          value="item-2"
          class="border-0 rounded-sm px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200"
        >
          <template #trigger>
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 bg-surface-muted rounded-sm flex items-center justify-center flex-shrink-0"
              >
                <IconCreditCard class="w-5 h-5 text-ink-muted" />
              </div>
              <span class="font-medium text-ink"
                >¿Qué métodos de pago aceptan?</span
              >
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <div class="space-y-4">
                  <!-- Banco de Corrientes Promotion -->
                  <div
                    class="bg-blue-50/80 border-l-4 border-blue-400 p-4 rounded-r-lg backdrop-blur-sm"
                  >
                    <div class="flex items-start gap-3">
                      <IconCreditCard
                        class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p class="font-semibold text-blue-900 mb-2">
                          Banco de Corrientes - Lunes
                        </p>
                        <p class="text-blue-800 text-sm mb-2">
                          Abonando con tu tarjeta de crédito Visa del BanCo a
                          través de
                          <span class="font-semibold">MODO</span> accedés los
                          lunes a
                          <span class="font-semibold"
                            >3 cuotas sin interés</span
                          >
                          y un
                          <span class="font-semibold">30% de reintegro</span>
                          con tope de
                          <span class="font-semibold">$20.000</span>.
                        </p>
                        <p class="text-blue-700 text-xs italic">
                          Operación exclusiva con Visa Banco de Corrientes vía
                          MODO.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-green-50/80 border-l-4 border-green-400 p-4 rounded-r-lg backdrop-blur-sm"
                  >
                    <div class="flex items-start gap-3">
                      <IconCreditCard
                        class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p class="font-semibold text-green-900 mb-2">
                          Visa y Mastercard - Miércoles y Sábados
                        </p>
                        <p class="text-green-800 text-sm mb-2">
                          Los miércoles y Sábados disfrutá de
                          <span class="font-semibold"
                            >3 cuotas sin interés</span
                          >
                          pagando con tarjetas Visa o Mastercard de cualquier
                          banco.
                        </p>
                        <p class="text-green-700 text-xs italic">
                          Válido para tarjetas emitidas por cualquier entidad
                          bancaria.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Bank Transfer Promotion -->
                  <div
                    class="bg-amber-50/80 border-l-4 border-amber-400 p-4 rounded-r-lg backdrop-blur-sm"
                  >
                    <div class="flex items-start gap-3">
                      <IconBuildingBank
                        class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p class="font-semibold text-amber-900 mb-2">
                          Efectivo o Transferencia - Todos los días
                        </p>
                        <p class="text-amber-800 text-sm mb-2">
                          Pagando en efectivo o mediante transferencia obtenés
                          un
                          <span class="font-semibold"
                            >10% de descuento directo</span
                          >
                          en tu compra.
                        </p>
                        <p class="text-amber-700 text-xs italic">
                          Beneficio disponible todos los días de la semana.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- General Payment Methods -->
                  <div class="mt-4 pt-4 border-t border-surface-muted">
                    <p class="text-ink-muted leading-relaxed text-sm">
                      También aceptamos todas las tarjetas de débito y crédito
                      (Visa, Mastercard, American Express), transferencias
                      bancarias, y MercadoPago.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <!-- FAQ Item 3: Returns -->
        <UiAccordionItem
          value="item-3"
          class="border-0 rounded-sm px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200"
        >
          <template #trigger>
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 bg-surface-muted rounded-sm flex items-center justify-center flex-shrink-0"
              >
                <IconArrowLeft class="w-5 h-5 text-ink-muted" />
              </div>
              <span class="font-medium text-ink"
                >¿Puedo devolver o cambiar un producto?</span
              >
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-ink-muted leading-relaxed mb-4">
                  Sí, tenés 30 días desde la recepción del producto para
                  devolverlo o cambiarlo. El artículo debe estar sin usar, con
                  las etiquetas intactas y en su empaque inicial. Los gastos de
                  envío para devoluciones corren por cuenta del cliente, excepto
                  en casos de productos defectuosos.
                </p>
                <div
                  class="bg-blue-50/80 border-l-4 border-blue-400 p-4 rounded-r-lg backdrop-blur-sm"
                >
                  <div class="flex items-start gap-3">
                    <IconInformationCircle
                      class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p class="font-medium text-blue-900 mb-1">
                        Proceso simple:
                      </p>
                      <p class="text-blue-800 text-sm">
                        Contactanos por WhatsApp para iniciar el proceso de
                        devolución.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UiAccordionItem>

        <!-- FAQ Item 5: Tracking -->
        <UiAccordionItem
          value="item-5"
          class="border-0 rounded-sm px-6 py-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200"
        >
          <template #trigger>
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 bg-surface-muted rounded-sm flex items-center justify-center flex-shrink-0"
              >
                <IconQuestionMarkCircle class="w-5 h-5 text-ink-muted" />
              </div>
              <span class="font-medium text-ink"
                >¿Cómo puedo rastrear mi pedido?</span
              >
            </div>
          </template>
          <template #content>
            <div class="pb-6 pt-2">
              <div class="ml-4 sm:ml-8 md:ml-14">
                <p class="text-ink-muted leading-relaxed">
                  Una vez que tu pedido sea despachado, recibirás un mensaje de
                  WhatsApp con el número de seguimiento y un enlace para
                  rastrear tu envío en tiempo real.
                </p>
              </div>
            </div>
          </template>
        </UiAccordionItem>
      </div>

      <!-- Help Section -->
      <div class="relative bg-gradient-to-br from-ink via-ink-light to-ink rounded-sm max-w-4xl mx-auto mt-12 overflow-hidden">
        <!-- Background Image with Overlay -->
        <div class="absolute inset-0 opacity-15">
          <img
            src="/images/stadium-field.webp"
            alt=""
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="p-8 md:p-12 text-center relative z-10">
          <div class="max-w-3xl mx-auto">
            <div
              class="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <IconWhatsapp class="w-8 h-8 text-white" />
            </div>
            <h3
              class="font-display text-display-lg uppercase text-white mb-6 cursor-default"
            >
              ¿Necesitás más ayuda?
            </h3>
            <p
              class="text-lg text-ink-subtle mb-8 leading-relaxed max-w-2xl mx-auto cursor-default"
            >
              Si tenés dudas específicas sobre tu compra o necesitás asistencia
              personalizada, no dudes en contactarnos.
            </p>

            <button
              @click="openWhatsApp"
              class="inline-flex items-center px-8 py-3 bg-white text-ink text-base font-medium rounded-sm hover:bg-surface-warm transition-colors"
            >
              <IconWhatsapp class="w-5 h-5 mr-2" />
              Contactar Soporte
            </button>

            <p class="text-sm text-ink-subtle mt-4 cursor-default">
              Respuesta en menos de 24 horas
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconInformationCircle from "~icons/heroicons/information-circle";
import IconCube from "~icons/heroicons/cube";
import IconCreditCard from "~icons/heroicons/credit-card";
import IconHeart from "~icons/heroicons/heart";
import IconArrowLeft from "~icons/heroicons/arrow-left";
import IconQuestionMarkCircle from "~icons/heroicons/question-mark-circle";
import IconWhatsapp from "~icons/mdi/whatsapp";
import IconBuildingBank from "~icons/heroicons/building-library";

useHead({
  title: "Preguntas Frecuentes | Cruzar Deportes",
  meta: [
    {
      name: "description",
      content:
        "Respuestas a las preguntas más frecuentes sobre compras, envíos, devoluciones y atención al cliente en Cruzar Deportes.",
    },
    { property: 'og:title', content: 'Preguntas Frecuentes | Cruzar Deportes' },
    { property: 'og:description', content: 'Respuestas a las preguntas más frecuentes sobre compras, envíos, devoluciones y atención al cliente en Cruzar Deportes.' },
    { property: 'og:image', content: 'https://cruzardeportes.com/images/og-image.jpg' },
  ],
});

const openWhatsApp = () => {
  const phoneNumber = "5493794000783";
  const message = encodeURIComponent("Hola, necesito ayuda con mi compra.");
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
};
</script>
