<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="mb-6">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">Inicio</NuxtLink>
        </li>
        <li class="text-gray-400">/</li>
        <li>
          <NuxtLink to="/categories" class="text-gray-500 hover:text-gray-700">Ligas</NuxtLink>
        </li>
        <li class="text-gray-400">/</li>
        <li class="text-gray-900 font-medium">{{ displayName }}</li>
      </ol>
    </nav>

    <!-- Category Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-light text-gray-900 mb-4">{{ displayName }}</h1>
      <p v-if="displayDescription" class="text-lg text-gray-800">{{ displayDescription }}</p>
      <p class="text-sm text-gray-500 mt-2">{{ filteredProducts.length }} productos disponibles</p>
    </div>

    <!-- Product Type Filter (if this is a league) -->
    <div v-if="isLeague && productTypes.length > 0" class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedProductType = ''"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            selectedProductType === ''
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          ]"
        >
          Todos los Tipos
        </button>
        <button
          v-for="type in applicableProductTypes"
          :key="type.id"
          @click="selectedProductType = type.slug"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            selectedProductType === type.slug
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          ]"
        >
          {{ type.name }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <GridSkeleton
      v-if="productsStore.loading"
      type="product"
      :count="8"
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
      <p class="text-gray-800 mb-6">No hay productos disponibles en esta categoría.</p>
      <NuxtLink
        to="/categories"
        class="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
      >
        <IconArrowLeft class="mr-2 h-4 w-4" />
        Volver a Categorías
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconArrowLeft from '~icons/mdi/arrow-left'

const route = useRoute()
const productsStore = useProductsStore()

const categorySlug = computed(() => route.params.slug)
const currentPage = ref(1)
const selectedProductType = ref('')
const itemsPerPage = 20

// Check if this slug is a league
const league = computed(() =>
  productsStore.leagues.find(l => l.slug === categorySlug.value)
)

// Check if this slug is a category
const category = computed(() =>
  productsStore.categories.find(cat => cat.slug === categorySlug.value)
)

const isLeague = computed(() => !!league.value)

const displayName = computed(() => {
  if (league.value) return league.value.name
  if (category.value) return category.value.name
  return 'Categoría'
})

const displayDescription = computed(() => {
  if (category.value) return category.value.description
  return ''
})

const productTypes = computed(() => productsStore.productTypes)

// Get applicable product types for this league
const applicableProductTypes = computed(() => {
  if (!league.value) return []
  return productTypes.value.filter(t =>
    league.value.applicableTypes?.includes(t.slug)
  )
})

const filteredProducts = computed(() => {
  if (isLeague.value) {
    // Filter by league
    let products = productsStore.getProductsByLeague(categorySlug.value)
    if (selectedProductType.value) {
      products = products.filter(p => p.productType === selectedProductType.value)
    }
    return products
  } else {
    // Filter by category (legacy)
    return productsStore.getProductsByCategory(categorySlug.value)
  }
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

// Reset to page 1 when category or type changes
watch([categorySlug, selectedProductType], () => {
  currentPage.value = 1
})

onMounted(() => {
  productsStore.fetchProducts()
})

useHead(() => ({
  title: `${displayName.value} - Cruzar Deportes`,
  meta: [
    { name: 'description', content: `Explora nuestra colección de ${displayName.value.toLowerCase()}.` }
  ]
}))
</script>
