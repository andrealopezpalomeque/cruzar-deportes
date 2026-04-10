<template>
  <div class="min-h-screen bg-surface-cream">
    <!-- Hero Section -->
    <section class="relative py-12 md:py-16 bg-gradient-to-br from-ink via-ink-light to-ink text-white overflow-hidden">
      <div class="container mx-auto px-4 relative">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-ink-subtle mb-8">
          <NuxtLink to="/" class="hover:text-white transition-colors">Inicio</NuxtLink>
          <IconChevronRight class="h-4 w-4" />
          <span class="text-white font-medium">Pedidos de Equipos</span>
        </nav>

        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-normal bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6">
            <IconTag class="w-4 h-4 mr-2" />
            Precios Especiales para Grupos
          </div>

          <h1 class="font-display text-display-xl uppercase mb-6 cursor-default">
            Pedidos de <span class="font-medium">Equipos</span>
          </h1>

          <p class="text-xl text-ink-subtle mb-8 leading-relaxed cursor-default">
            Equipá a todo tu equipo con camisetas personalizadas. Obtené descuentos por cantidad
            y personalización incluida en pedidos grupales.
          </p>

          <button
            @click="openWhatsApp"
            class="inline-flex items-center px-8 py-3 bg-white text-ink text-base font-display font-semibold uppercase tracking-wide rounded-sm hover:bg-surface-warm transition-colors"
          >
            <IconWhatsapp class="w-5 h-5 mr-2" />
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-display text-display-lg uppercase text-center mb-12 cursor-default">Beneficios del Pedido Grupal</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-surface-cream border border-surface-muted rounded-sm flex items-center justify-center">
                  <IconPercent class="w-6 h-6 text-ink" />
                </div>
              </div>
              <div class="ml-4 cursor-default">
                <h3 class="text-lg font-medium mb-2">Descuentos por Cantidad</h3>
                <p class="text-ink">Mientras más camisetas pidas, mayor es el descuento. Hasta 25% off en pedidos grandes.</p>
              </div>
            </div>

            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-surface-cream border border-surface-muted rounded-sm flex items-center justify-center">
                  <IconPencil class="w-6 h-6 text-ink" />
                </div>
              </div>
              <div class="ml-4 cursor-default">
                <h3 class="text-lg font-medium mb-2">Personalización Incluida</h3>
                <p class="text-ink">Nombre y número estampados sin costo adicional en pedidos de 10+ unidades.</p>
              </div>
            </div>

            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-surface-cream border border-surface-muted rounded-sm flex items-center justify-center">
                  <IconResize class="w-6 h-6 text-ink" />
                </div>
              </div>
              <div class="ml-4 cursor-default">
                <h3 class="text-lg font-medium mb-2">Múltiples Talles</h3>
                <p class="text-ink">Pedí la cantidad que necesites de cada talle. Ideal para equipos con jugadores de todas las edades.</p>
              </div>
            </div>

            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-surface-cream border border-surface-muted rounded-sm flex items-center justify-center">
                  <IconHeadset class="w-6 h-6 text-ink" />
                </div>
              </div>
              <div class="ml-4 cursor-default">
                <h3 class="text-lg font-medium mb-2">Asesoramiento Personalizado</h3>
                <p class="text-ink">Te ayudamos a elegir el modelo perfecto y coordinar los detalles del pedido.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Tiers Section -->
    <section class="py-16 bg-surface-cream">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto">
          <h2 class="font-display text-display-lg uppercase text-center mb-12 cursor-default">Descuentos por Cantidad</h2>

          <div class="bg-white rounded-sm border border-surface-muted overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-4">
              <div class="p-6 border-b md:border-b-0 md:border-r border-surface-muted text-center cursor-default">
                <div class="text-4xl font-light text-ink mb-2">10+</div>
                <div class="text-sm text-ink-muted mb-3">unidades</div>
                <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-orange-50 border border-brand-orange-200 text-brand-orange-700">
                  10% OFF
                </div>
              </div>

              <div class="p-6 border-b md:border-b-0 md:border-r border-surface-muted text-center cursor-default">
                <div class="text-4xl font-light text-ink mb-2">20+</div>
                <div class="text-sm text-ink-muted mb-3">unidades</div>
                <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-surface-muted text-ink">
                  15% OFF
                </div>
              </div>

              <div class="p-6 border-b md:border-b-0 md:border-r border-surface-muted text-center cursor-default">
                <div class="text-4xl font-light text-ink mb-2">30+</div>
                <div class="text-sm text-ink-muted mb-3">unidades</div>
                <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                  20% OFF
                </div>
              </div>

              <div class="p-6 text-center cursor-default">
                <div class="text-4xl font-light text-ink mb-2">50+</div>
                <div class="text-sm text-ink-muted mb-3">unidades</div>
                <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-ink text-white">
                  25% OFF
                </div>
              </div>
            </div>
          </div>

          <p class="text-center text-sm text-ink-muted mt-6 cursor-default">
            * Descuentos aplican sobre el precio de lista. Personalización incluida en pedidos de 10+ unidades.
          </p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-display text-display-lg uppercase text-center mb-12 cursor-default">¿Cómo Hacer tu Pedido?</h2>

          <div class="space-y-8">
            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-medium">
                  1
                </div>
              </div>
              <div class="ml-6 cursor-default">
                <h3 class="text-xl font-medium mb-2">Contactános por WhatsApp</h3>
                <p class="text-ink leading-relaxed">
                  Envianos un mensaje con la cantidad aproximada de camisetas que necesitás,
                  el equipo o modelo que te interesa, y cualquier preferencia especial.
                </p>
              </div>
            </div>

            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-medium">
                  2
                </div>
              </div>
              <div class="ml-6 cursor-default">
                <h3 class="text-xl font-medium mb-2">Recibí tu Cotización</h3>
                <p class="text-ink leading-relaxed">
                  Te enviamos una cotización detallada con precios, opciones de personalización,
                  y tiempos de entrega. Podés hacer ajustes hasta que esté perfecto.
                </p>
              </div>
            </div>

            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-medium">
                  3
                </div>
              </div>
              <div class="ml-6 cursor-default">
                <h3 class="text-xl font-medium mb-2">Confirmá y Personalizá</h3>
                <p class="text-ink leading-relaxed">
                  Una vez que aprobás la cotización, te enviamos un formulario simple para recopilar
                  la información de personalización (nombres, números, talles).
                </p>
              </div>
            </div>

            <div class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-medium">
                  4
                </div>
              </div>
              <div class="ml-6 cursor-default">
                <h3 class="text-xl font-medium mb-2">Recibí tu Pedido</h3>
                <p class="text-ink leading-relaxed">
                  Producimos tu pedido con la máxima calidad y lo enviamos directamente.
                  Tiempo de producción: 7-14 días hábiles según cantidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="relative bg-gradient-to-br from-ink via-ink-light to-ink rounded-sm max-w-4xl mx-auto overflow-hidden">
          <!-- Background Image with Overlay -->
          <div class="absolute inset-0 opacity-15">
            <img
              src="/images/football-team-1.webp"
              alt=""
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="p-8 md:p-12 text-center relative z-10">
            <div class="max-w-3xl mx-auto">
              <div class="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <IconAccountGroup class="w-8 h-8 text-white" />
              </div>
              <h2 class="font-display text-display-lg uppercase text-white mb-6 cursor-default">
                ¿Listo para Equipar a tu Equipo?
              </h2>
              <p class="text-lg text-ink-subtle mb-8 leading-relaxed cursor-default">
                Contactanos ahora y recibí una cotización personalizada en menos de 24 horas.
                Sin compromiso.
              </p>

              <button
                @click="openWhatsApp"
                class="inline-flex items-center px-8 py-3 bg-white text-ink text-base font-display font-semibold uppercase tracking-wide rounded-sm hover:bg-surface-warm transition-colors"
              >
                <IconWhatsapp class="w-5 h-5 mr-2" />
                Iniciar Consulta por WhatsApp
              </button>

              <p class="text-sm text-ink-subtle mt-4 cursor-default">
                Respuesta en menos de 2 horas en horario comercial
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-surface-cream">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <h2 class="font-display text-display-lg uppercase text-center mb-12 cursor-default">Preguntas Frecuentes</h2>

          <div class="space-y-4">
            <div class="bg-white rounded-sm p-6 border border-surface-muted cursor-default">
              <h3 class="font-medium text-lg mb-2">¿Cuál es la cantidad mínima de pedido?</h3>
              <p class="text-ink">La cantidad mínima es de 10 camisetas para calificar como pedido de equipo y acceder a los descuentos.</p>
            </div>

            <div class="bg-white rounded-sm p-6 border border-surface-muted cursor-default">
              <h3 class="font-medium text-lg mb-2">¿Cuánto tiempo tarda la producción?</h3>
              <p class="text-ink">El tiempo de producción varía según la cantidad: 7-10 días para pedidos de 10-20 unidades, 10-14 días para pedidos mayores.</p>
            </div>

            <div class="bg-white rounded-sm p-6 border border-surface-muted cursor-default">
              <h3 class="font-medium text-lg mb-2">¿Puedo pedir diferentes talles en el mismo pedido?</h3>
              <p class="text-ink">Sí, podés combinar todos los talles que necesites sin costo adicional. Es ideal para equipos con jugadores de diferentes edades.</p>
            </div>

            <div class="bg-white rounded-sm p-6 border border-surface-muted cursor-default">
              <h3 class="font-medium text-lg mb-2">¿La personalización tiene costo adicional?</h3>
              <p class="text-ink">La personalización básica (nombre y número) está incluida sin cargo en pedidos de 10+ unidades. Personalizaciones especiales pueden tener un costo adicional.</p>
            </div>

            <div class="bg-white rounded-sm p-6 border border-surface-muted cursor-default">
              <h3 class="font-medium text-lg mb-2">¿Qué formas de pago aceptan para pedidos grandes?</h3>
              <p class="text-ink">Aceptamos transferencia bancaria, efectivo y tarjetas en cuotas. Para pedidos grandes, podés abonar con seña del 50% y el resto contra entrega.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import IconWhatsapp from '~icons/mdi/whatsapp'
import IconTag from '~icons/heroicons/tag'
import IconChevronRight from '~icons/mdi/chevron-right'
import IconPercent from '~icons/heroicons/receipt-percent'
import IconPencil from '~icons/heroicons/pencil'
import IconResize from '~icons/mdi/resize'
import IconHeadset from '~icons/heroicons/phone'
import IconAccountGroup from '~icons/mdi/account-group-outline'

const openWhatsApp = () => {
  const phoneNumber = '5493794000783'
  const message = encodeURIComponent(
    'Hola! Estoy interesado en hacer un pedido grupal de camisetas para mi equipo. ¿Podrían enviarme información sobre precios y opciones de personalización?'
  )
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}

useHead({
  title: 'Pedidos de Equipos - Ofertas Especiales - Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Equipá a todo tu equipo con camisetas personalizadas. Descuentos por cantidad y personalización incluida. Consultá por WhatsApp.' },
    { property: 'og:title', content: 'Pedidos de Equipos - Ofertas Especiales - Cruzar Deportes' },
    { property: 'og:description', content: 'Equipá a todo tu equipo con camisetas personalizadas. Descuentos por cantidad y personalización incluida. Consultá por WhatsApp.' },
    { property: 'og:image', content: 'https://cruzardeportes.com/images/og-image.jpg' },
  ]
})
</script>
