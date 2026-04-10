<template>
  <div class="min-h-screen bg-surface-cream">
    <!-- Hero Section -->
    <section class="relative py-12 md:py-16 bg-gradient-to-br from-ink via-ink-light to-ink text-white overflow-hidden">
      <div class="container mx-auto px-4 relative">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-ink-subtle mb-8">
          <NuxtLink to="/" class="hover:text-white transition-colors">Inicio</NuxtLink>
          <IconChevronRight class="h-4 w-4" />
          <span class="text-white font-medium">Caja Misteriosa</span>
        </nav>

        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-normal bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6">
            <IconSparkles class="w-4 h-4 mr-2" />
            Oferta Exclusiva
          </div>

          <h1 class="font-display text-display-xl uppercase mb-6 cursor-default">
            Caja <span class="font-medium">Misteriosa</span>
          </h1>

          <p class="text-xl text-ink-subtle mb-8 leading-relaxed cursor-default">
            Una experiencia única para coleccionistas. Recibí una selección exclusiva de camisetas
            sorpresa basada en tus preferencias.
          </p>

          <!-- Scroll to configurator -->
          <button
            @click="scrollToConfigurator"
            class="inline-flex items-center px-8 py-3 bg-white text-ink text-base font-display font-semibold uppercase tracking-wide rounded-sm hover:bg-surface-warm transition-colors"
          >
            <IconGift class="w-5 h-5 mr-2" />
            Configurar Mi Caja Ahora
          </button>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-display text-display-lg uppercase text-center mb-12 cursor-default">¿Cómo Funciona?</h2>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center cursor-default">
              <div class="w-16 h-16 bg-surface-cream border border-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-light text-ink">1</span>
              </div>
              <h3 class="font-medium mb-2">Elegí tu Caja</h3>
              <p class="text-sm text-ink">Individual (1), Básica (3), Premium (5) o Deluxe (10)</p>
            </div>

            <div class="text-center cursor-default">
              <div class="w-16 h-16 bg-surface-cream border border-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-light text-ink">2</span>
              </div>
              <h3 class="font-medium mb-2">Distribuí Talles</h3>
              <p class="text-sm text-ink">Elegí los talles para cada camiseta de tu caja</p>
            </div>

            <div class="text-center cursor-default">
              <div class="w-16 h-16 bg-surface-cream border border-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-light text-ink">3</span>
              </div>
              <h3 class="font-medium mb-2">Configurá Preferencias</h3>
              <p class="text-sm text-ink">Excluí equipos y elegí la era de las camisetas</p>
            </div>

            <div class="text-center cursor-default">
              <div class="w-16 h-16 bg-surface-cream border border-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-light text-ink">4</span>
              </div>
              <h3 class="font-medium mb-2">Recibí tu Sorpresa</h3>
              <p class="text-sm text-ink">Nosotros seleccionamos y enviamos tu colección</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Box Types & Pricing Section -->
    <section class="py-16 bg-surface-cream">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="font-display text-display-lg uppercase text-center mb-12 cursor-default">Tipos de Cajas</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Individual Box -->
            <Card class="p-6 text-center cursor-default">
              <div class="w-12 h-12 bg-surface-muted rounded-sm flex items-center justify-center mx-auto mb-4">
                <IconTshirt class="w-6 h-6 text-ink" />
              </div>
              <h3 class="text-2xl font-light mb-2">Individual</h3>
              <div class="text-4xl font-light mb-4">$56.000</div>
              <p class="text-sm text-ink mb-6">$56.000 por camiseta</p>
              <ul class="space-y-2 text-left mb-6">
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>1 camiseta sorpresa</span>
                </li>
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>Ideal para probar</span>
                </li>
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>Calidad garantizada</span>
                </li>
              </ul>
            </Card>

            <!-- Basic Box -->
            <Card class="p-6 text-center cursor-default">
              <div class="w-12 h-12 bg-surface-muted rounded-sm flex items-center justify-center mx-auto mb-4">
                <IconTshirt class="w-6 h-6 text-ink" />
              </div>
              <h3 class="text-2xl font-light mb-2">Básica</h3>
              <div class="text-4xl font-light mb-4">$165.000</div>
              <p class="text-sm text-ink mb-6">~$55.000 por camiseta</p>
              <ul class="space-y-2 text-left mb-6">
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>3 camisetas sorpresa</span>
                </li>
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>Mezcla de retro y actuales</span>
                </li>
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>Calidad garantizada</span>
                </li>
              </ul>
            </Card>

            <!-- Premium Box -->
            <Card class="p-6 text-center border-2 border-ink relative cursor-default">
              <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-ink text-white">
                  Más Popular
                </span>
              </div>
              <div class="w-12 h-12 bg-ink rounded-sm flex items-center justify-center mx-auto mb-4">
                <IconTshirt class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-2xl font-light mb-2">Premium</h3>
              <div class="text-4xl font-light mb-4">$250.000</div>
              <p class="text-sm text-ink mb-6">$50.000 por camiseta</p>
              <ul class="space-y-2 text-left mb-6">
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>5 camisetas sorpresa</span>
                </li>
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>Mayor variedad de equipos</span>
                </li>
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>Mejor precio por camiseta</span>
                </li>
              </ul>
            </Card>

            <!-- Deluxe Box -->
            <Card class="p-6 text-center cursor-default">
              <div class="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm flex items-center justify-center mx-auto mb-4">
                <IconTshirt class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-2xl font-light mb-2">Deluxe</h3>
              <div class="text-4xl font-light mb-4">$450.000</div>
              <p class="text-sm text-ink mb-6">$45.000 por camiseta</p>
              <ul class="space-y-2 text-left mb-6">
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>10 camisetas sorpresa</span>
                </li>
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>Incluye camisetas exclusivas</span>
                </li>
                <li class="flex items-start text-sm text-ink-muted">
                  <IconCheck class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-ink" />
                  <span>Máximo ahorro por camiseta</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Configurator Section -->
    <section id="configurator" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="font-display text-display-lg uppercase mb-4 cursor-default">Configurá tu Caja</h2>
            <p class="text-lg text-ink cursor-default">Personalizá tu experiencia según tus preferencias</p>
          </div>

          <MysteryBoxConfigurator />
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
              <h3 class="font-medium text-lg mb-2">¿Puedo elegir equipos específicos?</h3>
              <p class="text-ink">No, el concepto de la caja misteriosa es la sorpresa. Sin embargo, podés excluir equipos que no querés recibir.</p>
            </div>

            <div class="bg-white rounded-sm p-6 border border-surface-muted cursor-default">
              <h3 class="font-medium text-lg mb-2">¿Puedo devolver la caja si no me gusta?</h3>
              <p class="text-ink">Por la naturaleza sorpresa del producto, no aceptamos devoluciones. Sin embargo, si hay algún problema con la calidad, contactanos.</p>
            </div>

            <div class="bg-white rounded-sm p-6 border border-surface-muted cursor-default">
              <h3 class="font-medium text-lg mb-2">¿Cuánto tarda en llegar?</h3>
              <p class="text-ink">Depende de tu ubicación, y puede tomar hasta 3-7 días hábiles.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import IconGift from '~icons/mdi/gift-outline'
import IconSparkles from '~icons/heroicons/sparkles'
import IconChevronRight from '~icons/mdi/chevron-right'
import IconTshirt from '~icons/mdi/tshirt-crew'
import IconCheck from '~icons/mdi/check-circle'
import MysteryBoxConfigurator from '~/components/deals/MysteryBoxConfigurator.vue'

const scrollToConfigurator = () => {
  const element = document.getElementById('configurator')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

useHead({
  title: 'Caja Misteriosa - Ofertas Especiales - Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Recibí una selección sorpresa de camisetas deportivas. Configurá tu caja según tus preferencias y descubrí camisetas únicas.' },
    { property: 'og:title', content: 'Caja Misteriosa - Ofertas Especiales - Cruzar Deportes' },
    { property: 'og:description', content: 'Recibí una selección sorpresa de camisetas deportivas. Configurá tu caja según tus preferencias y descubrí camisetas únicas.' },
    { property: 'og:image', content: 'https://cruzardeportes.com/images/og-image.jpg' },
  ]
})
</script>
