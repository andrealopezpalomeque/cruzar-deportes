<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb Navigation -->
    <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <NuxtLink to="/" class="hover:text-primary-600 transition-colors">Inicio</NuxtLink>
      <IconChevronRight class="h-4 w-4" />
      <NuxtLink to="/products" class="hover:text-primary-600 transition-colors">Productos</NuxtLink>
      <IconChevronRight class="h-4 w-4" />
      <span class="text-gray-900 font-medium">{{ product?.name || 'Producto' }}</span>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="text-center py-20">
      <IconAlertCircle class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
      <p class="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
      <NuxtLink 
        to="/products" 
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
      >
        <IconArrowLeft class="mr-2 h-4 w-4" />
        Volver a Productos
      </NuxtLink>
    </div>

    <!-- Product Details -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Image Gallery -->
      <div class="space-y-4">
        <ImageGallery :images="productImages" :product-name="product.name" />
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <ProductInfo :product="product" />
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts.length > 0" class="mt-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="relatedProduct in relatedProducts.slice(0, 4)" 
          :key="relatedProduct.id"
          :product="relatedProduct"
        />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import IconChevronRight from '~icons/mdi/chevron-right'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconArrowLeft from '~icons/mdi/arrow-left'

const route = useRoute()
const productsStore = useProductsStore()

// Reactive state
const loading = ref(true)
const productImages = ref([])

// Get product slug from route
const productSlug = computed(() => route.params.slug)

// Find the product by slug
const product = computed(() => 
  productsStore.getProductBySlug(productSlug.value)
)

// Get related products (same category, excluding current product)
const relatedProducts = computed(() => {
  if (!product.value) return []
  return productsStore.getProductsByCategory(product.value.category)
    .filter(p => p.id !== product.value?.id)
    .slice(0, 8) // Get up to 8 related products
})

// Load product images
async function loadProductImages() {
  if (!product.value) return

  try {
    const { getTeamImages } = await import('~/utils/imageLoader')
    const teamKey = product.value.slug.replace(/-/g, '_') // Convert slug back to team key
    const images = await getTeamImages(teamKey, product.value.category)
    productImages.value = images
  } catch (error) {
    console.error('Error loading product images:', error)
    productImages.value = product.value.images || []
  }
}

// Initialize data
onMounted(async () => {
  loading.value = true
  
  // Ensure products are loaded
  await productsStore.fetchProducts()
  await productsStore.fetchCategories()
  
  // Load product images
  await loadProductImages()
  
  loading.value = false
})

// Watch for route changes (if user navigates to different product)
watch(() => route.params.slug, async () => {
  loading.value = true
  await loadProductImages()
  loading.value = false
})

// SEO and meta tags
const categoryName = computed(() => {
  const category = productsStore.categories.find(cat => cat.id === product.value?.category)
  return category?.name || ''
})

useHead({
  title: () => product.value ? `${product.value.name} - Cruzar Deportes` : 'Producto - Cruzar Deportes',
  meta: [
    { 
      name: 'description', 
      content: () => product.value?.description || `Compra ${product.value?.name || 'productos'} en Cruzar Deportes. ${categoryName.value} auténticos y de calidad.`
    },
    { 
      property: 'og:title', 
      content: () => product.value ? `${product.value.name} - Cruzar Deportes` : 'Producto - Cruzar Deportes'
    },
    { 
      property: 'og:description', 
      content: () => product.value?.description || `Compra ${product.value?.name || 'productos'} en Cruzar Deportes. ${categoryName.value} auténticos y de calidad.`
    },
    { 
      property: 'og:image', 
      content: () => productImages.value[0] || (product.value?.images?.[0] || '/images/cruzar-logo-1.png')
    },
    { 
      property: 'og:type', 
      content: 'product'
    },
    { 
      name: 'twitter:card', 
      content: 'summary_large_image'
    },
    { 
      name: 'twitter:title', 
      content: () => product.value ? `${product.value.name} - Cruzar Deportes` : 'Producto - Cruzar Deportes'
    },
    { 
      name: 'twitter:description', 
      content: () => product.value?.description || `Compra ${product.value?.name || 'productos'} en Cruzar Deportes. ${categoryName.value} auténticos y de calidad.`
    },
    { 
      name: 'twitter:image', 
      content: () => productImages.value[0] || (product.value?.images?.[0] || '/images/cruzar-logo-1.png')
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://cruzardeportes.com/products/${productSlug.value}`
    }
  ]
})

// Handle 404 if product not found after loading
watch(product, (newProduct) => {
  if (!loading.value && !newProduct) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Producto no encontrado'
    })
  }
})
</script>