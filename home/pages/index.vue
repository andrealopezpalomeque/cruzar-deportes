<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative py-12 md:py-16 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-50"></div>
      <div class="container mx-auto px-4 relative">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-6">
            <IconSoccer class="w-4 h-4 mr-2" />
            Nueva Colección 2025
          </div>

          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Vestí tu Pasión por el <span class="text-primary-600">Deporte</span>
          </h1>

          <p class="text-lg md:text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Descubrí la colección más completa de camisetas deportivas de equipos de todo el mundo. Calidad premium,
            diseños auténticos.
          </p>

          <!-- Category Pills -->
          <div class="mb-8">
            <div class="flex items-center justify-center">
              <div class="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-3xl">
                <NuxtLink
                  v-for="category in categories"
                  :key="category.id"
                  :to="`/categories/${category.slug}`"
                  class="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {{ category.name }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <NuxtLink 
              to="/products" 
              class="inline-flex items-center px-8 py-3 bg-primary-600 text-white text-base font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Explorar Colección
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconTruckFast class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-semibold mb-2">Envío Gratis</h3>
            <p class="text-sm text-gray-600">En compras superiores a $99.999</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconShieldCheck class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-semibold mb-2">Calidad Garantizada</h3>
            <p class="text-sm text-gray-600">Productos de calidad premium</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconAccountGroup class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-semibold mb-2">Atención 24/7</h3>
            <p class="text-sm text-gray-600">Soporte personalizado siempre</p>
          </div>
        </div>
      </div>
    </section>


    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
          <p class="text-lg text-gray-600">Las camisetas más populares de la temporada</p>
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

        <div v-if="featuredProducts.length === 0 && !productsStore.loading" class="text-center py-12">
          <IconTshirtCrew class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aún no hay productos</h3>
          <p class="text-gray-600">¡Estamos trabajando en agregar productos. Vuelve pronto!</p>
        </div>

        <div v-if="featuredProducts.length > 0" class="text-center mt-12">
          <NuxtLink 
            to="/products"
            class="inline-flex items-center px-8 py-3 bg-transparent border border-gray-300 text-gray-700 text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver Todos los Productos
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="bg-gradient-to-r from-primary-600 to-blue-600 text-white overflow-hidden rounded-lg">
          <div class="p-8 md:p-12 text-center relative">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="relative">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">¿Listo para vestir tu pasión?</h2>
              <p class="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Unite a miles de fanáticos que ya visten con orgullo los colores de sus equipos favoritos
              </p>
              <NuxtLink 
                to="/products"
                class="inline-flex items-center px-8 py-3 bg-white text-primary-600 text-base font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Comenzar a Comprar
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import IconSoccer from '~icons/mdi/soccer'
import IconTruckFast from '~icons/mdi/truck-fast'
import IconShieldCheck from '~icons/mdi/shield-check'
import IconAccountGroup from '~icons/mdi/account-group'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'

const productsStore = useProductsStore()

const categories = computed(() => productsStore.categories)
const featuredProducts = computed(() => productsStore.getFeaturedProducts)

function navigateToCategory(slug) {
  navigateTo(`/categories/${slug}`)
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