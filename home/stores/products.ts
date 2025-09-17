import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Category } from '~/types'
import type { SearchResult } from './search'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const productsLoading = ref(false)
  const categoriesLoading = ref(false)

  const getProductsByCategory = computed(() => (categorySlug: string) =>
    products.value.filter(product => product.category === categorySlug)
  )

  const getFeaturedProducts = computed(() => {
    // Filter and prioritize products
    const availableProducts = products.value
      .filter(product => product.inStock) // Only show in-stock products
    
    // Sort by priority: discounted items first, then featured items
    const sortedProducts = availableProducts.sort((a, b) => {
      // First priority: products with originalPrice (discounted)
      const aHasDiscount = !!a.originalPrice
      const bHasDiscount = !!b.originalPrice
      if (aHasDiscount && !bHasDiscount) return -1
      if (!aHasDiscount && bHasDiscount) return 1
      
      // Second priority: featured products
      const aIsFeatured = !!a.featured
      const bIsFeatured = !!b.featured
      if (aIsFeatured && !bIsFeatured) return -1
      if (!aIsFeatured && bIsFeatured) return 1
      
      // Third priority: by price (higher price products first for quality perception)
      return b.price - a.price
    })
    
    // Limit to maximum 8 products
    return sortedProducts.slice(0, 8)
  })

  const getProductBySlug = computed(() => (slug: string) =>
    products.value.find(product => product.slug === slug)
  )

  const getPopularProducts = computed(() => {
    return products.value
      .filter(product => product.inStock)
      .sort((a, b) => {
        // Prioritize featured products
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        
        // Then by price (higher first for quality perception)
        return b.price - a.price
      })
      .slice(0, 20)
  })

  async function searchProducts(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return []
    
    try {
      const { searchInProducts } = await import('~/utils/search')
      return searchInProducts(query, products.value)
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  async function getSearchSuggestions(query: string): Promise<string[]> {
    if (!query.trim() || query.length < 2) return []
    
    try {
      const { getSearchSuggestions } = await import('~/utils/search')
      return getSearchSuggestions(query, products.value)
    } catch (error) {
      console.error('Error getting search suggestions:', error)
      return []
    }
  }

  async function fetchProducts() {
    productsLoading.value = true
    loading.value = productsLoading.value || categoriesLoading.value
    
    const startTime = Date.now()
    const minLoadingTime = 800 // Minimum 800ms loading time
    
    try {
      // Generate products from scraped data
      const { generateProducts } = await import('~/utils/productGenerator')
      products.value = await generateProducts()
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      // Ensure minimum loading time for better UX
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }
      
      productsLoading.value = false
      loading.value = productsLoading.value || categoriesLoading.value
    }
  }

  async function fetchCategories() {
    categoriesLoading.value = true
    loading.value = productsLoading.value || categoriesLoading.value
    
    const startTime = Date.now()
    const minLoadingTime = 600 // Minimum 600ms loading time (shorter for categories)
    
    try {
      // Generate categories from scraped data
      const { generateCategories } = await import('~/utils/productGenerator')
      categories.value = generateCategories()
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      // Ensure minimum loading time for better UX
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }
      
      categoriesLoading.value = false
      loading.value = productsLoading.value || categoriesLoading.value
    }
  }

  return {
    products,
    categories,
    loading,
    productsLoading,
    categoriesLoading,
    getProductsByCategory,
    getFeaturedProducts,
    getProductBySlug,
    getPopularProducts,
    fetchProducts,
    fetchCategories,
    searchProducts,
    getSearchSuggestions
  }
})