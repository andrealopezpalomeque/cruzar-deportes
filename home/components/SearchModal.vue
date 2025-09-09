<template>
  <div
    v-if="searchStore.isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="searchStore.closeSearch"
  >
    <div class="flex min-h-screen items-start justify-center p-4 pt-16">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity"></div>
      
      <!-- Modal -->
      <div
        class="relative w-full max-w-2xl transform rounded-lg bg-white shadow-xl transition-all"
        @click.stop
      >
        <!-- Search Input -->
        <div class="border-b border-gray-200 px-4 py-3">
          <div class="flex items-center">
            <IconMagnify class="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref="searchInput"
              v-model="localQuery"
              type="text"
              placeholder="Buscar camisetas, equipos, ligas..."
              class="w-full border-none outline-none text-lg placeholder-gray-500"
              @keydown="handleKeydown"
              @input="handleInput"
            />
            <button
              v-if="localQuery"
              type="button"
              @click="clearSearch"
              class="ml-2 p-1 text-gray-400 hover:text-gray-600"
            >
              <IconClose class="h-5 w-5" />
            </button>
            <button
              type="button"
              @click="searchStore.closeSearch"
              class="ml-2 p-1 text-gray-400 hover:text-gray-600"
            >
              <IconClose class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <!-- Search Results -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Loading -->
          <div v-if="searchStore.loading" class="p-4">
            <div class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span class="ml-3 text-gray-600">Buscando...</span>
            </div>
          </div>
          
          <!-- Search Results -->
          <div v-else-if="searchStore.results.length > 0" class="p-2">
            <div class="mb-2 px-2 py-1 text-sm text-gray-500">
              {{ searchStore.results.length }} resultado{{ searchStore.results.length > 1 ? 's' : '' }}
            </div>
            <div class="space-y-1">
              <div
                v-for="(product, index) in searchStore.results.slice(0, 10)"
                :key="product.id"
                :class="[
                  'flex items-center p-3 rounded-lg cursor-pointer transition-colors',
                  selectedIndex === index ? 'bg-primary-50' : 'hover:bg-gray-50'
                ]"
                @click="goToProduct(product)"
                @mouseenter="selectedIndex = index"
              >
                <img
                  :src="product.images[0]"
                  :alt="product.name"
                  class="h-12 w-12 object-cover rounded-md mr-3"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 truncate" v-html="highlightText(product.name, localQuery)"></h3>
                  <p class="text-sm text-gray-500 capitalize">{{ getCategoryName(product.category) }}</p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="font-bold text-primary-600">{{ formatPrice(product.price) }}</span>
                    <span
                      v-if="product.originalPrice"
                      class="text-sm text-gray-500 line-through"
                    >
                      {{ formatPrice(product.originalPrice) }}
                    </span>
                    <span
                      v-if="!product.inStock"
                      class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                    >
                      Sin stock
                    </span>
                  </div>
                </div>
                <IconArrowRight class="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <!-- View all results link -->
            <div v-if="searchStore.results.length > 10" class="p-3 border-t">
              <NuxtLink
                :to="`/search?q=${encodeURIComponent(localQuery)}`"
                class="block text-center text-primary-600 hover:text-primary-700 font-medium"
                @click="searchStore.closeSearch"
              >
                Ver todos los {{ searchStore.results.length }} resultados
              </NuxtLink>
            </div>
          </div>
          
          <!-- No Results -->
          <div v-else-if="localQuery && !searchStore.loading" class="p-6 text-center">
            <IconSearchOff class="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              No encontramos resultados
            </h3>
            <p class="text-gray-500 mb-4">
              Intenta con otros términos de búsqueda o explora nuestras categorías
            </p>
            <div class="space-y-2">
              <NuxtLink
                to="/categories"
                class="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                @click="searchStore.closeSearch"
              >
                Ver Categorías
              </NuxtLink>
            </div>
          </div>
          
          <!-- Default State - Recent Searches & Suggestions -->
          <div v-else-if="!localQuery" class="p-4">
            <!-- Recent Searches -->
            <div v-if="searchStore.recentSearches.length > 0" class="mb-6">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-gray-900">Búsquedas recientes</h3>
                <button
                  type="button"
                  @click="searchStore.clearRecentSearches"
                  class="text-xs text-gray-500 hover:text-gray-700"
                >
                  Limpiar
                </button>
              </div>
              <div class="space-y-1">
                <button
                  v-for="search in searchStore.recentSearches.slice(0, 5)"
                  :key="search"
                  type="button"
                  @click="setSearchQuery(search)"
                  class="flex items-center w-full p-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <IconHistory class="h-4 w-4 text-gray-400 mr-3" />
                  <span class="text-gray-700">{{ search }}</span>
                </button>
              </div>
            </div>
            
            <!-- Popular Categories -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-3">Categorías populares</h3>
              <div class="grid grid-cols-2 gap-2">
                <NuxtLink
                  v-for="category in popularCategories"
                  :key="category.slug"
                  :to="`/categories/${category.slug}`"
                  class="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                  @click="searchStore.closeSearch"
                >
                  <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useSearchStore } from '~/stores/search'
import { useProductsStore } from '~/stores/products'
import { debounce, highlightText, formatPrice } from '~/utils/search'
import IconMagnify from '~icons/mdi/magnify'
import IconClose from '~icons/mdi/close'
import IconArrowRight from '~icons/mdi/arrow-right'
import IconSearchOff from '~icons/mdi/magnify-close'
import IconHistory from '~icons/mdi/history'

const router = useRouter()
const searchStore = useSearchStore()
const productsStore = useProductsStore()

const searchInput = ref(null)
const localQuery = ref('')
const selectedIndex = ref(-1)

// Popular categories for default state
const popularCategories = computed(() => [
  { name: 'Serie A', slug: 'serie_a_enilive' },
  { name: 'AFC', slug: 'afc' },
  { name: 'CAF', slug: 'caf' },
  { name: 'Eredivisie', slug: 'eredivisie' }
])

// Category name mapping
const getCategoryName = (categorySlug) => {
  const categoryMap = {
    'serie_a_enilive': 'Serie A',
    'afc': 'AFC',
    'caf': 'CAF',
    'eredivisie': 'Eredivisie',
    'lpf_afa': 'LPF AFA',
    'national_retro': 'Retro Nacional'
  }
  return categoryMap[categorySlug] || categorySlug
}

// Debounced search function
const debouncedSearch = debounce(async (query) => {
  if (query.trim()) {
    await searchStore.searchProducts(query, productsStore.products)
  } else {
    searchStore.clearSearch()
  }
}, 300)

// Handle input changes
const handleInput = () => {
  searchStore.setQuery(localQuery.value)
  debouncedSearch(localQuery.value)
  selectedIndex.value = -1
}

// Handle keyboard navigation
const handleKeydown = (event) => {
  const results = searchStore.results.slice(0, 10)
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, results.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && results[selectedIndex.value]) {
        goToProduct(results[selectedIndex.value])
      } else if (localQuery.value.trim()) {
        goToSearchResults()
      }
      break
    case 'Escape':
      searchStore.closeSearch()
      break
  }
}

// Navigate to product page
const goToProduct = (product) => {
  searchStore.addToRecentSearches(localQuery.value)
  searchStore.closeSearch()
  router.push(`/products/${product.slug}`)
}

// Navigate to search results page
const goToSearchResults = () => {
  if (localQuery.value.trim()) {
    searchStore.addToRecentSearches(localQuery.value)
    searchStore.closeSearch()
    router.push(`/search?q=${encodeURIComponent(localQuery.value)}`)
  }
}

// Set search query
const setSearchQuery = (query) => {
  localQuery.value = query
  searchStore.setQuery(query)
  debouncedSearch(query)
  nextTick(() => {
    searchInput.value?.focus()
  })
}

// Clear search
const clearSearch = () => {
  localQuery.value = ''
  searchStore.clearSearch()
  nextTick(() => {
    searchInput.value?.focus()
  })
}

// Focus input when modal opens
watch(() => searchStore.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    localQuery.value = ''
    selectedIndex.value = -1
  }
})

// Handle escape key globally
const handleGlobalKeydown = (event) => {
  if (event.key === 'Escape' && searchStore.isOpen) {
    searchStore.closeSearch()
  }
  
  // Cmd/Ctrl + K to open search
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    if (!searchStore.isOpen) {
      searchStore.openSearch()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>