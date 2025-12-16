<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-light text-gray-900 mb-4">Comprar por Categoría</h1>
      <p class="text-lg text-gray-800">Explora nuestra colección organizada por confederaciones de fútbol</p>
    </div>

    <GridSkeleton 
      v-if="productsStore.loading" 
      type="category" 
      :count="6" 
      :cols="3" 
    />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <NuxtLink 
        v-for="category in categories" 
        :key="category.id"
        :to="`/categories/${category.slug}`"
        class="group"
      >
        <div class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300">
          <div class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-800 to-black rounded-t-lg relative overflow-hidden">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <OptimizedImage
                src="/images/cruzar-logo-short-1.png"
                alt="Cruzar Deportes"
                type="logo"
                loading="lazy"
                img-class="h-24 w-auto brightness-0 invert opacity-90"
              />
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-medium text-gray-900 mb-2 group-hover:text-black transition-colors">
              {{ category.name }}
            </h3>
            <p class="text-gray-800">{{ category.description }}</p>
            
            <div class="mt-4 flex items-center text-gray-800 group-hover:text-black transition-colors">
              <span class="text-sm font-medium">Comprar ahora</span>
              <IconArrowRight class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconArrowRight from '~icons/mdi/arrow-right'

const productsStore = useProductsStore()

const categories = computed(() => productsStore.categories)

onMounted(() => {
  productsStore.fetchCategories()
})

useHead({
  title: 'Categorías - Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Navega por nuestras categorías de camisetas deportivas organizadas por confederaciones y ligas de fútbol.' }
  ]
})
</script>