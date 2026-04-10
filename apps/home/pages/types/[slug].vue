<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="mb-6">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <NuxtLink to="/" class="text-ink-muted hover:text-ink-muted">Inicio</NuxtLink>
        </li>
        <li class="text-ink-subtle">/</li>
        <li>
          <NuxtLink to="/types" class="text-ink-muted hover:text-ink-muted">Tipos</NuxtLink>
        </li>
        <li class="text-ink-subtle">/</li>
        <li class="text-ink font-medium">{{ productType?.name || 'Cargando...' }}</li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-display text-display-xl uppercase text-ink mb-4">{{ productType?.name || 'Cargando...' }}</h1>
      <p class="text-lg text-ink">{{ filteredProducts.length }} productos disponibles</p>
    </div>

    <!-- League Filter -->
    <div v-if="filteredLeagues.length > 0" class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedLeague = ''"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-sm transition-colors',
            selectedLeague === ''
              ? 'bg-gray-700 text-white'
              : 'bg-surface-muted text-ink hover:bg-surface-muted'
          ]"
        >
          Todas las Ligas
        </button>
        <button
          v-for="league in filteredLeagues"
          :key="league.id"
          @click="selectedLeague = league.slug"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-sm transition-colors',
            selectedLeague === league.slug
              ? 'bg-gray-700 text-white'
              : 'bg-surface-muted text-ink hover:bg-surface-muted'
          ]"
        >
          {{ league.name }}
        </button>
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
          class="px-3 py-2 text-sm font-medium text-ink-muted bg-white border border-surface-muted rounded-sm hover:bg-surface-warm disabled:bg-surface-muted disabled:text-ink-subtle disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <div class="flex space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-sm',
              currentPage === page
                ? 'bg-ink text-white'
                : 'text-ink bg-white border border-surface-muted hover:bg-surface-warm'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-ink-muted bg-white border border-surface-muted rounded-sm hover:bg-surface-warm disabled:bg-surface-muted disabled:text-ink-subtle disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <IconTshirtCrew class="h-16 w-16 text-ink-subtle mx-auto mb-4" />
      <h3 class="text-lg font-medium text-ink mb-2">No se encontraron productos</h3>
      <p class="text-ink mb-6">
        {{ selectedLeague ? 'No se encontraron productos en esta liga.' : 'No hay productos disponibles en este tipo.' }}
      </p>
      <button
        v-if="selectedLeague"
        @click="selectedLeague = ''"
        class="inline-flex items-center px-4 py-2 bg-ink text-white font-display font-semibold uppercase tracking-wide rounded-sm hover:bg-ink-light transition-colors"
      >
        <IconRefresh class="mr-2 h-4 w-4" />
        Mostrar Todos
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconRefresh from '~icons/mdi/refresh'

const route = useRoute()
const productsStore = useProductsStore()

const selectedLeague = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

const slug = computed(() => route.params.slug)

const productType = computed(() =>
  productsStore.productTypes.find(t => t.slug === slug.value)
)

const filteredLeagues = computed(() =>
  productsStore.getLeaguesByType(slug.value)
)

const filteredProducts = computed(() => {
  let products = productsStore.getProductsByType(slug.value)

  if (selectedLeague.value) {
    products = products.filter(p => p.league === selectedLeague.value)
  }

  return products
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

// Reset page when league changes
watch(selectedLeague, () => {
  currentPage.value = 1
})

onMounted(() => {
  productsStore.fetchProducts()
})

useHead(() => ({
  title: `${productType.value?.name || 'Tipo'} - Cruzar Deportes`,
  meta: [
    { name: 'description', content: `Explorá nuestra colección de ${productType.value?.name?.toLowerCase() || 'productos'}.` },
    { property: 'og:title', content: `${productType.value?.name || 'Tipo'} - Cruzar Deportes` },
    { property: 'og:description', content: `Explorá nuestra colección de ${productType.value?.name?.toLowerCase() || 'productos'}.` },
    { property: 'og:image', content: 'https://cruzardeportes.com/images/og-image.png' },
  ]
}))
</script>
