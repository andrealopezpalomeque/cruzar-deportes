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
    <div v-else-if="categoryProducts.length > 0">
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
const currentPage = ref(1)
const itemsPerPage = 20

const categoryProducts = computed(() => 
  productsStore.getProductsByCategory(categorySlug.value)
)

const category = computed(() => 
  productsStore.categories.find(cat => cat.slug === categorySlug.value)
)

const categoryName = computed(() => category.value?.name || 'Category')
const categoryDescription = computed(() => category.value?.description || '')

const totalPages = computed(() => Math.ceil(categoryProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return categoryProducts.value.slice(start, end)
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
watch(categorySlug, () => {
  currentPage.value = 1
})

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