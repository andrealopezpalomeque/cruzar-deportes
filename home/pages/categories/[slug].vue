<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Category Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ categoryName }}</h1>
      <p class="text-lg text-gray-600">{{ categoryDescription }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Products Grid -->
    <div v-else-if="categoryProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in categoryProducts" 
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Icon name="mdi:tshirt-crew" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p class="text-gray-600 mb-6">We couldn't find any products in this category.</p>
      <NuxtLink 
        to="/categories" 
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
      >
        <Icon name="mdi:arrow-left" class="mr-2 h-4 w-4" />
        Back to Categories
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const productsStore = useProductsStore()

const categorySlug = computed(() => route.params.slug)

const categoryProducts = computed(() => 
  productsStore.getProductsByCategory(categorySlug.value)
)

const category = computed(() => 
  productsStore.categories.find(cat => cat.slug === categorySlug.value)
)

const categoryName = computed(() => category.value?.name || 'Category')
const categoryDescription = computed(() => category.value?.description || '')

onMounted(() => {
  productsStore.fetchCategories()
  productsStore.fetchProducts()
})

useHead({
  title: () => `${categoryName.value} - Cruzar Deportes`,
  meta: [
    { name: 'description', content: () => `Shop ${categoryName.value} jerseys and merchandise. ${categoryDescription.value}` }
  ]
})
</script>