import { defineStore } from 'pinia'
import type { Product, Category } from '~/types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

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

  async function fetchProducts() {
    loading.value = true
    try {
      // Generate products from scraped data
      const { generateProducts } = await import('~/utils/productGenerator')
      products.value = await generateProducts()
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    loading.value = true
    try {
      // Generate categories from scraped data
      const { generateCategories } = await import('~/utils/productGenerator')
      categories.value = generateCategories()
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    products: readonly(products),
    categories: readonly(categories),
    loading: readonly(loading),
    getProductsByCategory,
    getFeaturedProducts,
    getProductBySlug,
    fetchProducts,
    fetchCategories
  }
})