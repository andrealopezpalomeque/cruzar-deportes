<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-light text-gray-900 mb-4">Todos los Productos</h1>
      <p class="text-lg text-gray-800">Navega nuestra colección completa de camisetas deportivas</p>
    </div>

    <!-- Filters -->
    <div class="mb-8 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = ''"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            selectedCategory === ''
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          ]"
        >
          Todas las Categorías
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.slug"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            selectedCategory === category.slug
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          ]"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="text-sm text-gray-800">
        {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'producto' : 'productos' }}
      </div>
    </div>

    <!-- Loading State -->
    <GridSkeleton 
      v-if="productsStore.loading" 
      type="product" 
      :count="20" 
      :cols="4" 
    />

    <!-- Products Grid -->
    <div v-else-if="paginatedProducts.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <ProductCard 
          v-for="product in paginatedProducts" 
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        
        <div class="flex space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md',
              currentPage === page
                ? 'bg-black text-white'
                : 'text-gray-800 bg-white border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <IconTshirtCrew class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
      <p class="text-gray-800 mb-6">
        {{ selectedCategory ? 'No se encontraron productos en esta categoría.' : 'No hay productos disponibles en este momento.' }}
      </p>
      <button
        v-if="selectedCategory"
        @click="selectedCategory = ''"
        class="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
      >
        <IconRefresh class="mr-2 h-4 w-4" />
        Mostrar Todos los Productos
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconRefresh from '~icons/mdi/refresh'

const productsStore = useProductsStore()

const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

const categories = computed(() => productsStore.categories)
const allProducts = computed(() => productsStore.products)

const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return allProducts.value
  }
  return productsStore.getProductsByCategory(selectedCategory.value)
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Reset to page 1 when category changes
watch(selectedCategory, () => {
  currentPage.value = 1
})

onMounted(() => {
  productsStore.fetchCategories()
  productsStore.fetchProducts()
})

useHead({
  title: 'Todos los Productos - Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Navega nuestra colección completa de camisetas deportivas de equipos de todo el mundo.' }
  ]
})
</script>