<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Search Header -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Resultados de búsqueda
            </h1>
            <p v-if="searchQuery" class="text-gray-600 mt-1">
              Mostrando resultados para: <span class="font-medium">"{{ searchQuery }}"</span>
            </p>
          </div>
          
          <!-- Search Input -->
          <div class="relative max-w-md w-full">
            <input
              v-model="localQuery"
              type="text"
              placeholder="Buscar productos..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              @keyup.enter="performSearch"
            />
            <IconMagnify class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <button
              v-if="localQuery"
              @click="clearLocalQuery"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <IconClose class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <div class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h3 class="font-medium text-gray-900 mb-4">Filtrar por</h3>
            
            <!-- Category Filter -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Categoría</h4>
              <div class="space-y-2">
                <label
                  v-for="category in availableCategories"
                  :key="category.slug"
                  class="flex items-center"
                >
                  <input
                    v-model="selectedCategories"
                    :value="category.slug"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    @change="applyFilters"
                  />
                  <span class="ml-3 text-sm text-gray-700">{{ category.name }}</span>
                </label>
              </div>
            </div>
            
            <!-- Price Range Filter -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Rango de precio</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="priceRange"
                    value="0-50000"
                    type="radio"
                    name="price"
                    class="text-primary-600 focus:ring-primary-500"
                    @change="applyFilters"
                  />
                  <span class="ml-3 text-sm text-gray-700">Hasta $50.000</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="priceRange"
                    value="50000-100000"
                    type="radio"
                    name="price"
                    class="text-primary-600 focus:ring-primary-500"
                    @change="applyFilters"
                  />
                  <span class="ml-3 text-sm text-gray-700">$50.000 - $100.000</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="priceRange"
                    value="100000+"
                    type="radio"
                    name="price"
                    class="text-primary-600 focus:ring-primary-500"
                    @change="applyFilters"
                  />
                  <span class="ml-3 text-sm text-gray-700">Más de $100.000</span>
                </label>
              </div>
            </div>
            
            <!-- Stock Filter -->
            <div class="mb-6">
              <label class="flex items-center">
                <input
                  v-model="onlyInStock"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  @change="applyFilters"
                />
                <span class="ml-3 text-sm text-gray-700">Solo en stock</span>
              </label>
            </div>
            
            <!-- Clear Filters -->
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="flex-1">
          <!-- Results Count and Sort -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <p class="text-gray-600">
              {{ filteredResults.length }} producto{{ filteredResults.length !== 1 ? 's' : '' }} encontrado{{ filteredResults.length !== 1 ? 's' : '' }}
            </p>
            
            <div class="flex items-center gap-2 mt-4 sm:mt-0">
              <label class="text-sm text-gray-700">Ordenar por:</label>
              <select
                v-model="sortBy"
                @change="applySorting"
                class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 9" :key="i" class="animate-pulse">
              <div class="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          
          <!-- Results Grid -->
          <div v-else-if="sortedResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in paginatedResults"
              :key="product.id"
              :product="product"
            />
          </div>
          
          <!-- No Results -->
          <div v-else-if="searchQuery" class="text-center py-12">
            <IconSearchOff class="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-xl font-medium text-gray-900 mb-2">
              No encontramos productos
            </h3>
            <p class="text-gray-500 mb-6">
              Tu búsqueda "{{ searchQuery }}" no arrojó resultados. 
              Intenta con términos diferentes o explora nuestras categorías.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                @click="clearSearch"
                class="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Limpiar búsqueda
              </button>
              <NuxtLink
                to="/categories"
                class="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ver categorías
              </NuxtLink>
            </div>
          </div>
          
          <!-- Empty State (no search query) -->
          <div v-else class="text-center py-12">
            <IconMagnify class="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-xl font-medium text-gray-900 mb-2">
              Busca tu camiseta favorita
            </h3>
            <p class="text-gray-500 mb-6">
              Encuentra camisetas de tus equipos favoritos de diferentes ligas
            </p>
            <NuxtLink
              to="/products"
              class="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-block"
            >
              Ver todos los productos
            </NuxtLink>
          </div>
          
          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-12">
            <nav class="flex items-center space-x-2">
              <button
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
                :class="[
                  'px-3 py-2 text-sm rounded-md',
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                Anterior
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 text-sm rounded-md',
                  page === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
                :class="[
                  'px-3 py-2 text-sm rounded-md',
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '~/stores/products'
import { useSearchStore } from '~/stores/search'
import { formatPrice } from '~/utils/search'
import ProductCard from '~/components/ProductCard.vue'
import IconMagnify from '~icons/mdi/magnify'
import IconClose from '~icons/mdi/close'
import IconSearchOff from '~icons/mdi/magnify-close'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const searchStore = useSearchStore()

const localQuery = ref('')
const searchResults = ref([])
const loading = ref(false)
const selectedCategories = ref([])
const priceRange = ref('')
const onlyInStock = ref(false)
const sortBy = ref('relevance')
const currentPage = ref(1)
const itemsPerPage = 12

// Get search query from URL
const searchQuery = computed(() => {
  return route.query.q || ''
})

// Category mapping
const categoryNames = {
  'serie_a_enilive': 'Serie A',
  'afc': 'AFC',
  'caf': 'CAF',
  'eredivisie': 'Eredivisie',
  'lpf_afa': 'LPF AFA',
  'national_retro': 'Retro Nacional'
}

// Available categories from search results
const availableCategories = computed(() => {
  const categories = new Set()
  searchResults.value.forEach(product => {
    categories.add(product.category)
  })
  
  return Array.from(categories).map(slug => ({
    slug,
    name: categoryNames[slug] || slug
  }))
})

// Check if filters are active
const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 || priceRange.value || onlyInStock.value
})

// Filter results based on selected filters
const filteredResults = computed(() => {
  let results = [...searchResults.value]
  
  // Filter by category
  if (selectedCategories.value.length > 0) {
    results = results.filter(product => 
      selectedCategories.value.includes(product.category)
    )
  }
  
  // Filter by price range
  if (priceRange.value) {
    results = results.filter(product => {
      switch (priceRange.value) {
        case '0-50000':
          return product.price <= 50000
        case '50000-100000':
          return product.price > 50000 && product.price <= 100000
        case '100000+':
          return product.price > 100000
        default:
          return true
      }
    })
  }
  
  // Filter by stock
  if (onlyInStock.value) {
    results = results.filter(product => product.inStock)
  }
  
  return results
})

// Sort results
const sortedResults = computed(() => {
  const results = [...filteredResults.value]
  
  switch (sortBy.value) {
    case 'price-low':
      return results.sort((a, b) => a.price - b.price)
    case 'price-high':
      return results.sort((a, b) => b.price - a.price)
    case 'name':
      return results.sort((a, b) => a.name.localeCompare(b.name))
    case 'relevance':
    default:
      return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
  }
})

// Pagination
const totalPages = computed(() => Math.ceil(sortedResults.value.length / itemsPerPage))

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedResults.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Always show first page
  pages.push(1)
  
  // Show pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  
  // Always show last page if more than 1 page
  if (total > 1) {
    pages.push(total)
  }
  
  // Remove duplicates and sort
  return [...new Set(pages)].sort((a, b) => a - b)
})

// Perform search
const performSearch = async () => {
  if (!localQuery.value.trim()) return
  
  // Update URL
  router.push({ query: { q: localQuery.value } })
}

// Execute search
const executeSearch = async (query) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }
  
  loading.value = true
  try {
    const results = await productsStore.searchProducts(query)
    searchResults.value = results
    currentPage.value = 1
    
    // Add to recent searches
    searchStore.addToRecentSearches(query)
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// Clear local query
const clearLocalQuery = () => {
  localQuery.value = ''
}

// Clear search
const clearSearch = () => {
  localQuery.value = ''
  router.push({ query: {} })
}

// Apply filters
const applyFilters = () => {
  currentPage.value = 1
}

// Apply sorting
const applySorting = () => {
  currentPage.value = 1
}

// Clear all filters
const clearFilters = () => {
  selectedCategories.value = []
  priceRange.value = ''
  onlyInStock.value = false
  currentPage.value = 1
}

// Go to specific page
const goToPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for search query changes
watch(() => route.query.q, (newQuery) => {
  const query = newQuery || ''
  localQuery.value = query
  executeSearch(query)
}, { immediate: true })

// Load products on mount
onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
})

// SEO
useHead({
  title: computed(() => {
    if (searchQuery.value) {
      return `Resultados para "${searchQuery.value}" - Cruzar Deportes`
    }
    return 'Buscar productos - Cruzar Deportes'
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        if (searchQuery.value) {
          return `Encuentra ${searchQuery.value} y más productos en Cruzar Deportes. Camisetas deportivas de calidad.`
        }
        return 'Busca entre miles de camisetas deportivas y encuentra la de tu equipo favorito en Cruzar Deportes.'
      })
    }
  ]
})
</script>