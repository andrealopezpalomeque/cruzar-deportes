<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-light text-gray-900 mb-4">Tipos de Producto</h1>
      <p class="text-lg text-gray-800">Explora nuestra colección por tipo de producto</p>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="animate-pulse">
        <div class="aspect-square bg-gray-200 rounded-lg"></div>
        <div class="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Product Types Grid -->
    <div v-else-if="productTypes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="type in productTypes"
        :key="type.id"
        :to="`/types/${type.slug}`"
        class="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
      >
        <div class="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <IconTshirtCrew v-if="type.slug === 'camisetas'" class="w-24 h-24 text-gray-400 group-hover:text-gray-600 transition-colors" />
          <IconTshirtCrew v-else-if="type.slug === 'shorts'" class="w-24 h-24 text-gray-400 group-hover:text-gray-600 transition-colors" />
          <IconHumanChild v-else-if="type.slug === 'kit-ninos'" class="w-24 h-24 text-gray-400 group-hover:text-gray-600 transition-colors" />
          <IconPackageVariant v-else class="w-24 h-24 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-black">{{ type.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ getProductCount(type.slug) }} productos</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <IconPackageVariant class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay tipos de producto</h3>
      <p class="text-gray-800">No hay tipos de producto disponibles en este momento.</p>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconHumanChild from '~icons/mdi/human-child'
import IconPackageVariant from '~icons/mdi/package-variant'

const productsStore = useProductsStore()

const productTypes = computed(() => productsStore.productTypes)

const getProductCount = (typeSlug) => {
  return productsStore.getProductsByType(typeSlug).length
}

onMounted(() => {
  productsStore.fetchProducts()
})

useHead({
  title: 'Tipos de Producto - Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Explora nuestra colección de camisetas, shorts, kits para niños y más.' }
  ]
})
</script>
