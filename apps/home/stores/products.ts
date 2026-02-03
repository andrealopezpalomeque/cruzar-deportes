import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Category, ProductType, League } from '~/types'
import type { SearchResult } from './search'
import { loadCatalog } from '~/utils/catalogLoader'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const productTypes = ref<ProductType[]>([])
  const leagues = ref<League[]>([])
  const loading = ref(false)
  const productsLoading = ref(false)
  const categoriesLoading = ref(false)

  // Get products by category
  const getProductsByCategory = computed(() => (categorySlug: string) =>
    products.value.filter(product => product.category === categorySlug)
  )

  // Get products by product type
  const getProductsByType = computed(() => (typeSlug: string) =>
    products.value.filter(product => product.productType === typeSlug)
  )

  // Get products by league
  const getProductsByLeague = computed(() => (leagueSlug: string) =>
    products.value.filter(product => product.league === leagueSlug)
  )

  // Get products by both type and league
  const getProductsByTypeAndLeague = computed(() => (typeSlug: string, leagueSlug: string) =>
    products.value.filter(product =>
      product.productType === typeSlug && product.league === leagueSlug
    )
  )

  // Get leagues by product type (filtered by applicableTypes)
  const getLeaguesByType = computed(() => (typeSlug: string) =>
    leagues.value.filter(league => league.applicableTypes?.includes(typeSlug))
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

    try {
      const catalog = await loadCatalog()
      products.value = catalog.products

      if (catalog.categories.length > 0 && categories.value.length === 0) {
        categories.value = catalog.categories
      }

      if (catalog.productTypes.length > 0) {
        productTypes.value = catalog.productTypes
      }

      if (catalog.leagues.length > 0) {
        leagues.value = catalog.leagues
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
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

    try {
      const catalog = await loadCatalog()
      categories.value = catalog.categories

      if (catalog.products.length > 0 && products.value.length === 0) {
        products.value = catalog.products
      }

      if (catalog.productTypes.length > 0) {
        productTypes.value = catalog.productTypes
      }

      if (catalog.leagues.length > 0) {
        leagues.value = catalog.leagues
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      categoriesLoading.value = false
      loading.value = productsLoading.value || categoriesLoading.value
    }
  }

  return {
    products,
    categories,
    productTypes,
    leagues,
    loading,
    productsLoading,
    categoriesLoading,
    getProductsByCategory,
    getProductsByType,
    getProductsByLeague,
    getProductsByTypeAndLeague,
    getLeaguesByType,
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
