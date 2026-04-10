<template>
  <div ref="pageRef" class="bg-surface-cream">
    <!-- Hero Section — Full-bleed photography -->
    <section class="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      <!-- Background: session photo at high visibility -->
      <div class="absolute inset-0">
        <img
          src="/images/session/hero-group-couch.jpg"
          alt=""
          class="w-full h-full object-cover object-[70%_25%] md:object-[center_30%]"
          fetchpriority="high"
          loading="eager"
        />
        <!-- Warm overlay: vertical on mobile, horizontal on desktop -->
        <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/70 to-ink/40 md:bg-gradient-to-r md:from-ink/80 md:via-ink/50 md:to-transparent"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-2xl py-24 md:py-32">
          <!-- Badge -->
          <div class="opacity-0 animate-fade-up">
            <span class="inline-flex items-center px-3 py-1 font-display text-xs font-bold uppercase tracking-widest bg-brand-orange-600 text-white mb-6">
              <IconSoccer class="w-3 h-3 mr-1.5" />
              Nueva Colección 2026
            </span>
          </div>

          <!-- Headline — massive, condensed, athletic -->
          <h1 class="font-display text-display-xl text-white uppercase mb-6 opacity-0 animate-fade-up-delay-1">
            Vestí tu Pasión<br/>por el Deporte
          </h1>

          <p class="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed opacity-0 animate-fade-up-delay-2">
            Descubrí la colección más completa de camisetas deportivas de equipos de todo el mundo. Calidad premium, diseños auténticos.
          </p>

          <div class="flex flex-wrap gap-4 opacity-0 animate-fade-up-delay-3">
            <NuxtLink
              to="/products"
              class="inline-flex items-center px-8 py-3.5 bg-brand-orange-600 text-white font-display text-sm font-bold uppercase tracking-wider hover:bg-brand-orange-700 transition-colors"
            >
              Explorar Colección
            </NuxtLink>
            <NuxtLink
              to="/categories"
              class="inline-flex items-center px-8 py-3.5 border-2 border-white text-white font-display text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-ink transition-colors"
            >
              Ver Categorías
            </NuxtLink>
          </div>

          <!-- League pills -->
          <div class="flex flex-wrap items-center gap-2 pt-10 opacity-0 animate-fade-up-delay-4">
            <NuxtLink
              v-for="league in jerseyLeagues"
              :key="league.id"
              :to="`/products?type=camisetas&league=${league.slug}`"
              class="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white font-display text-xs font-semibold uppercase tracking-wider hover:bg-brand-orange-600/80 transition-all duration-200"
            >
              {{ league.name }}
            </NuxtLink>
            <NuxtLink
              to="/products?type=otros-productos"
              class="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white font-display text-xs font-semibold uppercase tracking-wider hover:bg-brand-orange-600/80 transition-all duration-200"
            >
              Otros Productos
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Strip -->
    <section class="py-10 bg-white border-b border-surface-muted">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 reveal-stagger">
          <div class="reveal flex items-center gap-3 cursor-default">
            <div class="flex-shrink-0 w-10 h-10 bg-brand-orange-50 flex items-center justify-center">
              <IconTruck class="w-5 h-5 text-brand-orange-600" />
            </div>
            <div>
              <h3 class="font-display text-sm font-bold uppercase tracking-wider text-ink">Envío Gratis</h3>
              <p class="text-sm text-ink-muted mt-0.5">Compras +$120.000</p>
            </div>
          </div>

          <div class="reveal flex items-center gap-3 cursor-default">
            <div class="flex-shrink-0 w-10 h-10 bg-brand-sage-50 flex items-center justify-center">
              <IconShieldCheck class="w-5 h-5 text-brand-sage-600" />
            </div>
            <div>
              <h3 class="font-display text-sm font-bold uppercase tracking-wider text-ink">Calidad Premium</h3>
              <p class="text-sm text-ink-muted mt-0.5">Garantizada</p>
            </div>
          </div>

          <div class="reveal flex items-center gap-3 cursor-default">
            <div class="flex-shrink-0 w-10 h-10 bg-brand-coral-50 flex items-center justify-center">
              <IconUserGroup class="w-5 h-5 text-brand-coral-600" />
            </div>
            <div>
              <h3 class="font-display text-sm font-bold uppercase tracking-wider text-ink">Atención 24/7</h3>
              <p class="text-sm text-ink-muted mt-0.5">Soporte personalizado</p>
            </div>
          </div>

          <div class="reveal flex items-center gap-3 cursor-default">
            <div class="flex-shrink-0 w-10 h-10 bg-brand-olive-50 flex items-center justify-center">
              <IconMagnifyingGlass class="w-5 h-5 text-brand-olive-600" />
            </div>
            <div>
              <h3 class="font-display text-sm font-bold uppercase tracking-wider text-ink">A Pedido</h3>
              <p class="text-sm text-ink-muted mt-0.5">Te conseguimos todo</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Editorial Photo Break -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 reveal-stagger">
          <div class="reveal col-span-2 md:col-span-1 md:row-span-2 overflow-hidden h-[28rem] md:h-auto">
            <img
              src="/images/session/hero-model-argentina.jpg"
              alt="Camiseta Argentina retro"
              class="w-full h-full object-cover object-[center_35%] md:object-top hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
          <div class="reveal overflow-hidden h-64 md:h-auto">
            <img
              src="/images/session/detail-sevilla-closeup.jpg"
              alt="Detalle camiseta Sevilla"
              class="w-full h-full object-cover object-[center_40%] md:object-[center_30%] hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
          <div class="reveal overflow-hidden h-64 md:h-auto">
            <img
              src="/images/session/hero-beckham-back.jpg"
              alt="Camiseta Beckham Manchester United"
              class="w-full h-full object-cover object-[center_35%] md:object-[center_20%] hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
          <div class="reveal overflow-hidden col-span-2 h-56 md:h-96">
            <img
              src="/images/session/detail-realmadrid-teka.jpg"
              alt="Camiseta Real Madrid retro Teka"
              class="w-full h-full object-cover object-[center_40%] md:object-[center_20%] hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div class="reveal">
            <span class="font-display text-xs font-bold uppercase tracking-widest text-brand-orange-600 mb-2 block">Selección Curada</span>
            <h2 class="font-display text-display-lg text-ink uppercase">Productos Destacados</h2>
          </div>
          <div class="reveal">
            <NuxtLink
              to="/products"
              class="inline-flex items-center font-display text-sm font-bold uppercase tracking-wider text-ink hover:text-brand-orange-600 transition-colors"
            >
              Ver Todos
              <IconArrowRight class="w-4 h-4 ml-2" />
            </NuxtLink>
          </div>
        </div>

        <GridSkeleton
          v-if="productsStore.loading"
          type="product"
          :count="8"
          :cols="4"
        />

        <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 reveal-stagger">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            class="reveal"
          />
        </div>

        <div v-if="featuredProducts.length === 0 && !productsStore.loading" class="text-center py-16 cursor-default">
          <IconTshirtCrew class="h-16 w-16 text-ink-subtle mx-auto mb-4" />
          <h3 class="font-display text-display-sm text-ink uppercase mb-2">Aún no hay productos</h3>
          <p class="text-ink-muted">Estamos trabajando en agregar productos. Volvé pronto!</p>
        </div>
      </div>
    </section>

    <!-- Special Deals Section -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <span class="reveal font-display text-xs font-bold uppercase tracking-widest text-brand-orange-600 mb-2 block">Ofertas Exclusivas</span>
          <h2 class="reveal font-display text-display-lg text-ink uppercase">Nuestras Promociones</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto reveal-stagger">
          <MysteryBoxCard class="reveal" />
          <TeamOrdersCard class="reveal" />
        </div>
      </div>
    </section>

    <!-- Custom Jersey CTA — Session photo hero -->
    <section class="relative py-24 md:py-32 overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="/images/session/hero-model-sevilla.jpg"
          alt=""
          class="w-full h-full object-cover object-[center_15%] md:object-[30%_22%]"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/70 to-ink/40 md:bg-gradient-to-l md:from-ink/85 md:via-ink/60 md:to-transparent"></div>
      </div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-xl md:ml-auto text-left md:text-right reveal">
          <h2 class="font-display text-display-lg text-white uppercase mb-6">
            ¿No encontrás la camiseta que buscás?
          </h2>
          <p class="text-lg text-white/80 mb-8 leading-relaxed">
            Envianos las especificaciones de la camiseta que necesitás y nosotros la conseguimos para vos.
          </p>

          <button
            @click="openCustomJerseyWhatsApp"
            class="inline-flex items-center px-8 py-3.5 bg-brand-orange-600 text-white font-display text-sm font-bold uppercase tracking-wider hover:bg-brand-orange-700 transition-colors"
          >
            <IconWhatsapp class="w-5 h-5 mr-2" />
            Solicitar Camiseta
          </button>

          <p class="text-white/50 mt-4 cursor-default font-display text-sm uppercase tracking-wider">
            Respuesta en menos de 24 horas
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import { useReveal } from '~/composables/useReveal'
import IconSoccer from '~icons/mdi/soccer'
import IconTruck from '~icons/heroicons/truck'
import IconShieldCheck from '~icons/heroicons/shield-check'
import IconUserGroup from '~icons/heroicons/user-group'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconMagnifyingGlass from '~icons/heroicons/magnifying-glass'
import IconWhatsapp from '~icons/mdi/whatsapp'
import IconArrowRight from '~icons/mdi/arrow-right'
import MysteryBoxCard from '~/components/deals/MysteryBoxCard.vue'
import TeamOrdersCard from '~/components/deals/TeamOrdersCard.vue'

const productsStore = useProductsStore()
const pageRef = ref(null)

useReveal(pageRef)

const jerseyLeagues = computed(() => {
  return productsStore.leagues.filter(l =>
    l.applicableTypes?.includes('camisetas') && l.isActive !== false
  )
})
const featuredProducts = computed(() => productsStore.getFeaturedProducts)

const openCustomJerseyWhatsApp = () => {
  const phoneNumber = '5493794000783'
  const message = encodeURIComponent('Hola, estoy buscando una camiseta específica y me gustaría consultar si pueden conseguirla.')
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}

onMounted(() => {
  productsStore.fetchProducts()
})

useHead({
  title: 'Cruzar Deportes - Camisetas Deportivas',
  meta: [
    { name: 'description', content: 'Comprá camisetas deportivas de equipos de todo el mundo. Encontrá la mercadería de calidad premium de tu equipo favorito.' },
    { property: 'og:title', content: 'Cruzar Deportes - Camisetas Deportivas' },
    { property: 'og:description', content: 'Comprá camisetas deportivas de equipos de todo el mundo. Encontrá la mercadería de calidad premium de tu equipo favorito.' },
    { property: 'og:image', content: 'https://cruzardeportes.com/images/og-image.png' },
  ]
})
</script>
