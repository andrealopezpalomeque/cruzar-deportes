import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { Product } from '~/types'

export interface SearchResult extends Product {
  relevanceScore: number
}

export interface SearchState {
  query: string
  results: SearchResult[]
  loading: boolean
  isOpen: boolean
  recentSearches: string[]
  suggestions: string[]
}

export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const results = ref<SearchResult[]>([])
  const loading = ref(false)
  const isOpen = ref(false)
  const recentSearches = ref<string[]>([])
  const suggestions = ref<string[]>([])

  // Load recent searches from localStorage
  onMounted(() => {
    if (process.client) {
      const stored = localStorage.getItem('cruzar-recent-searches')
      if (stored) {
        recentSearches.value = JSON.parse(stored)
      }
    }
  })

  // Save recent searches to localStorage
  const saveRecentSearches = () => {
    if (process.client) {
      localStorage.setItem('cruzar-recent-searches', JSON.stringify(recentSearches.value))
    }
  }

  // Add search to recent searches
  const addToRecentSearches = (searchQuery: string) => {
    if (searchQuery.trim() === '') return
    
    // Remove if already exists
    const filtered = recentSearches.value.filter(item => item !== searchQuery)
    
    // Add to beginning and limit to 10
    recentSearches.value = [searchQuery, ...filtered].slice(0, 10)
    saveRecentSearches()
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    recentSearches.value = []
    saveRecentSearches()
  }

  // Search products with relevance scoring
  const searchProducts = async (searchQuery: string, productsData: Product[]) => {
    if (searchQuery.trim() === '') {
      results.value = []
      return
    }

    loading.value = true

    try {
      const { searchInProducts } = await import('~/utils/search')
      const searchResults = searchInProducts(searchQuery, productsData)
      results.value = searchResults
    } catch (error) {
      console.error('Search error:', error)
      results.value = []
    } finally {
      loading.value = false
    }
  }

  // Generate search suggestions
  const generateSuggestions = (productsData: Product[], categoriesData: any[]) => {
    const productNames = productsData
      .filter(p => p.inStock)
      .map(p => p.name)
      .slice(0, 20)
    
    const categoryNames = categoriesData.map(c => c.name)
    
    suggestions.value = [...new Set([...productNames, ...categoryNames])]
  }

  // Open search modal
  const openSearch = () => {
    isOpen.value = true
  }

  // Close search modal
  const closeSearch = () => {
    isOpen.value = false
    query.value = ''
    results.value = []
  }

  // Set search query
  const setQuery = (newQuery: string) => {
    query.value = newQuery
  }

  // Clear search
  const clearSearch = () => {
    query.value = ''
    results.value = []
  }

  return {
    // State
    query,
    results,
    loading,
    isOpen,
    recentSearches,
    suggestions,

    // Actions
    searchProducts,
    generateSuggestions,
    addToRecentSearches,
    clearRecentSearches,
    openSearch,
    closeSearch,
    setQuery,
    clearSearch
  }
})