import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Category } from '~/types'
import type { SearchResult } from './search'
import { loadCatalog } from '~/utils/catalogLoader'

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
      const { products: catalogProducts, categories: catalogCategories } = await loadCatalog()
      products.value = catalogProducts

      if (catalogCategories.length > 0 && categories.value.length === 0) {
        categories.value = catalogCategories
      }
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

  const addProduct = (product: Product) => {
    products.value.push(product)
  }

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    const index = products.value.findIndex(p => p.id === productId)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updates }
    }
  }

  const deleteProduct = (productId: string) => {
    const index = products.value.findIndex(p => p.id === productId)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }

  const updateProductImages = (productId: string, imageUrls: string[]) => {
    updateProduct(productId, { images: imageUrls })
  }

  async function fetchCategories() {
    categoriesLoading.value = true
    loading.value = productsLoading.value || categoriesLoading.value
    
    const startTime = Date.now()
    const minLoadingTime = 600 // Minimum 600ms loading time (shorter for categories)
    
    try {
      const { categories: catalogCategories, products: catalogProducts } = await loadCatalog()
      categories.value = catalogCategories

      if (catalogProducts.length > 0 && products.value.length === 0) {
        products.value = catalogProducts
      }
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
    getSearchSuggestions,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductImages
  }
})
