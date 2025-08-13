import { defineStore } from 'pinia'
import type { Product, Category } from '~/types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  const getProductsByCategory = computed(() => (categorySlug: string) =>
    products.value.filter(product => product.category === categorySlug)
  )

  const getFeaturedProducts = computed(() =>
    products.value.filter(product => product.featured)
  )

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