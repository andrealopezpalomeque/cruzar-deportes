<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Category Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-light text-gray-900 mb-4">{{ categoryName }}</h1>
      <p class="text-lg text-gray-800">{{ categoryDescription }}</p>
    </div>

    <!-- Loading State -->
    <GridSkeleton 
      v-if="productsStore.loading" 
      type="product" 
      :count="8" 
      :cols="4" 
    />

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
      <IconTshirtCrew class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p class="text-gray-800 mb-6">We couldn't find any products in this category.</p>
      <NuxtLink 
        to="/categories" 
        class="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
      >
        <IconArrowLeft class="mr-2 h-4 w-4" />
        Back to Categories
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconArrowLeft from '~icons/mdi/arrow-left'

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