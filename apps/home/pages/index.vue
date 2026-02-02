<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 opacity-20">
        <img
          src="/images/stadium-crowd.webp"
          alt=""
          class="w-full h-full object-cover"
          fetchpriority="high"
          loading="eager"
        />
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl mx-auto text-center space-y-6">
          <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
            <IconSoccer class="w-4 h-4" />
            Nueva Colección 2026
          </div>

          <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Vestí tu Pasión por el Deporte
          </h1>

          <p class="text-lg md:text-xl text-gray-100 text-balance max-w-2xl mx-auto">
            Descubrí la colección más completa de camisetas deportivas de equipos de todo el mundo. Calidad premium,
            diseños auténticos.
          </p>

          <div class="flex justify-center pt-4">
            <NuxtLink
              to="/products"
              class="inline-flex items-center px-8 py-3 bg-white text-black text-base font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Explorar Colección
            </NuxtLink>
          </div>

          <!-- Category Pills -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-8">
            <NuxtLink
              v-for="category in categories.slice(0, 5)"
              :key="category.id"
              :to="`/categories/${category.slug}`"
              class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-sm"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center cursor-default">
            <div class="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconTruck class="w-6 h-6 text-gray-800" />
            </div>
            <h3 class="font-medium mb-2">Envío Gratis</h3>
            <p class="text-sm text-gray-800">En compras superiores a $120.000</p>
          </div>

          <div class="text-center cursor-default">
            <div class="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconShieldCheck class="w-6 h-6 text-gray-800" />
            </div>
            <h3 class="font-medium mb-2">Calidad Garantizada</h3>
            <p class="text-sm text-gray-800">Productos de calidad premium</p>
          </div>

          <div class="text-center cursor-default">
            <div class="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconUserGroup class="w-6 h-6 text-gray-800" />
            </div>
            <h3 class="font-medium mb-2">Atención 24/7</h3>
            <p class="text-sm text-gray-800">Soporte personalizado siempre</p>
          </div>

          <div class="text-center cursor-default">
            <div class="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconMagnifyingGlass class="w-6 h-6 text-gray-800" />
            </div>
            <h3 class="font-medium mb-2">Camisetas a Pedido</h3>
            <p class="text-sm text-gray-800">Conseguimos la camiseta que necesites</p>
          </div>
        </div>
      </div>
    </section>


    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 cursor-default">
          <h2 class="text-3xl md:text-4xl font-light mb-4">Productos Destacados</h2>
          <p class="text-lg text-gray-800">Las camisetas más populares de la temporada</p>
        </div>

        <GridSkeleton 
          v-if="productsStore.loading" 
          type="product" 
          :count="8" 
          :cols="4" 
        />

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-if="featuredProducts.length === 0 && !productsStore.loading" class="text-center py-12 cursor-default">
          <IconTshirtCrew class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aún no hay productos</h3>
          <p class="text-gray-800">¡Estamos trabajando en agregar productos. Vuelve pronto!</p>
        </div>

        <div v-if="featuredProducts.length > 0" class="text-center mt-12">
          <NuxtLink 
            to="/products"
            class="inline-flex items-center px-8 py-3 bg-transparent border border-gray-300 text-gray-700 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver Todos los Productos
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Special Deals Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 cursor-default">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-normal bg-gray-100 border border-gray-200 text-gray-700 mb-4">
            <IconSparkles class="w-4 h-4 mr-2" />
            Ofertas Exclusivas
          </div>
          <h2 class="text-3xl md:text-4xl font-light mb-4">Descubrí Nuestras Promociones</h2>
          <p class="text-lg text-gray-800">Ofertas especiales pensadas para verdaderos fanáticos</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <MysteryBoxCard />
          <TeamOrdersCard />
        </div>
      </div>
    </section>

    <!-- Custom Jersey Request Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-lg max-w-4xl mx-auto overflow-hidden">
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
              <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconMagnifyingGlass class="w-8 h-8 text-white" />
              </div>
              <h2 class="text-3xl md:text-4xl font-light text-white mb-6 cursor-default">
                ¿No encontrás la camiseta que buscás?
              </h2>
              <p class="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto cursor-default">
                Envianos las especificaciones de la camiseta que necesitás y nosotros la conseguimos para vos.
              </p>

              <button
                @click="openCustomJerseyWhatsApp"
                class="inline-flex items-center px-8 py-3 bg-white text-black text-base font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <IconWhatsapp class="w-5 h-5 mr-2" />
                Solicitar Camiseta Personalizada
              </button>

              <p class="text-sm text-gray-400 mt-4 cursor-default">
                Respuesta en menos de 24 horas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconSoccer from '~icons/mdi/soccer'
import IconTruck from '~icons/heroicons/truck'
import IconShieldCheck from '~icons/heroicons/shield-check'
import IconUserGroup from '~icons/heroicons/user-group'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconMagnifyingGlass from '~icons/heroicons/magnifying-glass'
import IconWhatsapp from '~icons/mdi/whatsapp'
import IconSparkles from '~icons/heroicons/sparkles'
import MysteryBoxCard from '~/components/deals/MysteryBoxCard.vue'
import TeamOrdersCard from '~/components/deals/TeamOrdersCard.vue'

const productsStore = useProductsStore()

const categories = computed(() => productsStore.categories)
const featuredProducts = computed(() => productsStore.getFeaturedProducts)

function navigateToCategory(slug) {
  navigateTo(`/categories/${slug}`)
}

const openCustomJerseyWhatsApp = () => {
  const phoneNumber = '5493794000783'
  const message = encodeURIComponent('Hola, estoy buscando una camiseta específica y me gustaría consultar si pueden conseguirla.')
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}


onMounted(() => {
  productsStore.fetchCategories()
  productsStore.fetchProducts()
})

useHead({
  title: 'Cruzar Deportes - Camisetas Deportivas',
  meta: [
    { name: 'description', content: 'Compra camisetas deportivas de equipos de todo el mundo. Encuentra la mercadería de calidad premium de tu equipo favorito.' }
  ]
})
</script>