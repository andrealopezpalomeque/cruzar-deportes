<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
      <p class="text-lg text-gray-600">Browse our complete collection of authentic sports jerseys</p>
    </div>

    <!-- Filters -->
    <div class="mb-8 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = ''"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            selectedCategory === '' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          All Categories
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.slug"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            selectedCategory === category.slug 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="text-sm text-gray-600">
        {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Products Grid -->
    <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Icon name="mdi:tshirt-crew" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p class="text-gray-600 mb-6">
        {{ selectedCategory ? 'No products found in this category.' : 'No products available at the moment.' }}
      </p>
      <button
        v-if="selectedCategory"
        @click="selectedCategory = ''"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
      >
        <Icon name="mdi:refresh" class="mr-2 h-4 w-4" />
        Show All Products
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const productsStore = useProductsStore()

const selectedCategory = ref('')

const categories = computed(() => productsStore.categories)
const allProducts = computed(() => productsStore.products)

const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return allProducts.value
  }
  return productsStore.getProductsByCategory(selectedCategory.value)
})

onMounted(() => {
  productsStore.fetchCategories()
  productsStore.fetchProducts()
})

useHead({
  title: 'All Products - Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Browse our complete collection of authentic sports jerseys from teams around the world.' }
  ]
})
</script>