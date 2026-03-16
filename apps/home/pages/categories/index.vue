<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-light text-gray-900 mb-4">Explora por Categoria</h1>
      <p class="text-lg text-gray-800">Toda nuestra coleccion organizada para vos</p>
    </div>

    <GridSkeleton
      v-if="productsStore.loading"
      type="category"
      :count="6"
      :cols="3"
    />

    <div v-else class="space-y-12">
      <section
        v-for="section in visibleSections"
        :key="section.group"
      >
        <!-- Section Header: icon box + label + divider line -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
            <component :is="section.icon" class="w-4 h-4 text-gray-600" />
          </div>
          <h2 class="text-base font-semibold text-gray-900 whitespace-nowrap">{{ section.label }}</h2>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Category Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="league in section.leagues"
            :key="league.id"
            :to="`/categories/${league.slug}`"
            class="group"
          >
            <div class="bg-gradient-to-br from-gray-800 to-black rounded-lg p-6 hover:from-gray-700 hover:to-gray-900 transition-all duration-300">
              <h3 class="text-base font-medium text-white mb-1 group-hover:text-gray-100 transition-colors">
                {{ league.name }}
              </h3>
              <p class="text-sm text-white/50">
                {{ getProductCount(league.slug) }} productos disponibles
              </p>
              <div class="mt-4 flex items-center text-white/60 group-hover:text-white/80 transition-colors">
                <span class="text-sm font-medium">Comprar ahora</span>
                <IconArrowRight class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-if="!productsStore.loading && visibleSections.length === 0" class="text-center py-12">
      <IconTshirtCrew class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay categorias disponibles</h3>
      <p class="text-gray-800">No hay categorias disponibles en este momento.</p>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconArrowRight from '~icons/mdi/arrow-right'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconSoccer from '~icons/mdi/soccer'
import IconTrophyOutline from '~icons/mdi/trophy-outline'

const productsStore = useProductsStore()

const sectionConfig = [
  { group: 'ligas', label: 'Ligas de Futbol', icon: IconSoccer },
  { group: 'deportes', label: 'Mas Deportes', icon: IconTrophyOutline },
  { group: 'accesorios', label: 'Indumentaria y Accesorios', icon: IconTshirtCrew },
]

const activeLeagues = computed(() =>
  productsStore.leagues.filter(l => l.isActive !== false)
)

const visibleSections = computed(() => {
  return sectionConfig
    .map(section => ({
      ...section,
      leagues: activeLeagues.value
        .filter(l => l.group === section.group)
        .sort((a, b) => a.order - b.order)
    }))
    .filter(section => section.leagues.length > 0)
})

const getProductCount = (leagueSlug) => {
  return productsStore.getProductsByLeague(leagueSlug).length
}

onMounted(() => {
  productsStore.fetchProducts()
})

useHead({
  title: 'Categorias - Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Explora nuestra coleccion de camisetas deportivas, indumentaria y accesorios organizados por categoria.' }
  ]
})
</script>
