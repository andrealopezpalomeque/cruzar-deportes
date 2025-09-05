<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative py-20 md:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-50"></div>
      <div class="container mx-auto px-4 relative">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-6">
            ⚽ Nueva Colección 2025
          </div>

          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Vestí tu Pasión por el <span class="text-primary-600">Deporte</span>
          </h1>

          <p class="text-lg md:text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Descubrí la colección más completa de camisetas deportivas de equipos de todo el mundo. Calidad premium,
            diseños auténticos.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/products" 
              class="inline-flex items-center px-8 py-3 bg-primary-600 text-white text-base font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Explorar Colección
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="inline-flex items-center px-8 py-3 bg-transparent border border-gray-300 text-gray-700 text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver Ofertas
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
              <Icon name="mdi:truck-fast" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-semibold mb-2">Envío Gratis</h3>
            <p class="text-sm text-gray-600">En compras superiores a $50.000</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:shield-check" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-semibold mb-2">Calidad Garantizada</h3>
            <p class="text-sm text-gray-600">Productos oficiales y auténticos</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:account-group" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-semibold mb-2">Atención 24/7</h3>
            <p class="text-sm text-gray-600">Soporte personalizado siempre</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Comprar por Categoría</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorá nuestra colección organizada por confederaciones de fútbol
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="group cursor-pointer hover:shadow-md transition-all duration-300 bg-white rounded-lg shadow-sm border"
            @click="navigateToCategory(category.slug)"
          >
            <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-t-lg relative overflow-hidden aspect-[4/3]">
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <img 
                  src="/images/cruzar-logo-no-bg.png" 
                  alt="Cruzar Deportes" 
                  class="h-20 w-auto brightness-0 invert opacity-90"
                />
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-gray-600">{{ category.description }}</p>
              
              <div class="mt-4 flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
                <span class="text-sm font-medium">Comprar ahora</span>
                <Icon name="mdi:arrow-right" class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
          <p class="text-lg text-gray-600">Las camisetas más populares de la temporada</p>
        </div>

        <div v-if="productsStore.loading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-if="featuredProducts.length === 0 && !productsStore.loading" class="text-center py-12">
          <Icon name="mdi:tshirt-crew" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
    <section class="py-20">
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
    { name: 'description', content: 'Compra camisetas deportivas de equipos de todo el mundo. Encuentra la mercadería oficial de tu equipo favorito.' }
  ]
})
</script>