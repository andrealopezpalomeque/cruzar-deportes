<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Camisetas Deportivas
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-primary-100">
            Descubre camisetas de equipos de todo el mundo
          </p>
          <NuxtLink 
            to="/products" 
            class="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Comprar Ahora
            <Icon name="mdi:arrow-right" class="ml-2 h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Comprar por Liga</h2>
          <p class="text-lg text-gray-600">Explora nuestra colección de camisetas deportivas</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="relative group cursor-pointer"
            @click="navigateToCategory(category.slug)"
          >
            <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
              <div class="absolute inset-0 flex items-center justify-center z-20">
                <div class="text-center text-white">
                  <h3 class="text-2xl font-bold mb-2">{{ category.name }}</h3>
                  <p class="text-lg">{{ category.description }}</p>
                </div>
              </div>
              <div class="absolute inset-0 bg-primary-600/20 group-hover:bg-primary-600/30 transition-colors z-5"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p class="text-lg text-gray-600">Selecciones especiales de nuestro catálogo</p>
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
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const productsStore = useProductsStore()

const categories = computed(() => productsStore.categories)
const featuredProducts = computed(() => productsStore.getFeaturedProducts)

function navigateToCategory(slug: string) {
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