<template>
  <div class="group cursor-pointer">
    <!-- Product Link Wrapper -->
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="block"
      :aria-label="`Ver detalles de ${product.name}`"
    >
      <!-- Product Image -->
      <div class="aspect-w-1 aspect-h-1 bg-surface-warm overflow-hidden relative">
        <!-- Image -->
        <OptimizedImage
          v-if="product.images?.length"
          wrapper-class="aspect-content block"
          :src="getFirstImageUrl(product.images, 'thumbnail')"
          :alt="product.name"
          loading="lazy"
          fetchpriority="auto"
          img-class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div v-else class="aspect-content flex items-center justify-center">
          <IconTshirtCrew class="h-16 w-16 text-ink-subtle" />
        </div>

        <!-- Badges -->
        <div class="absolute inset-0 pointer-events-none z-10">
          <!-- Featured Badge -->
          <div
            v-if="product.featured"
            class="absolute top-3 left-3"
          >
            <span class="inline-flex items-center px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider bg-brand-orange-600 text-white pointer-events-auto">
              <IconStar class="h-3 w-3 mr-1" />
              Destacado
            </span>
          </div>

          <!-- Discount Badge -->
          <div
            v-if="product.originalPrice && product.originalPrice > product.price"
            :class="product.featured ? 'absolute top-12 left-3' : 'absolute top-3 right-3'"
          >
            <span class="inline-flex items-center px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider bg-ink text-white pointer-events-auto">
              -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
            </span>
          </div>

          <!-- Image count -->
          <div
            v-if="(product.totalImages || product.images?.length || 0) > 1"
            class="absolute bottom-3 right-3"
          >
            <span class="inline-flex items-center px-2 py-1 text-[10px] font-medium bg-ink/70 text-white backdrop-blur-sm pointer-events-auto">
              <IconImageMultiple class="h-3 w-3 mr-1" />
              {{ product.totalImages || product.images?.length || 0 }}
            </span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Product Info -->
    <div class="pt-3 pb-1">
      <!-- Product Title and League -->
      <NuxtLink
        :to="`/products/${product.slug}`"
        class="block group-hover:text-brand-orange-600 transition-colors"
        :aria-label="`Ver ${product.name} - ${leagueName}`"
      >
        <h3 class="text-base font-medium text-ink leading-snug line-clamp-2">{{ product.name }}</h3>
      </NuxtLink>

      <p class="text-ink-muted mt-0.5 capitalize cursor-default font-display text-xs uppercase tracking-wide">{{ leagueName }}</p>

      <!-- Price and Action -->
      <div class="flex items-center justify-between mt-2">
        <div class="flex items-center gap-2">
          <span class="text-lg font-semibold text-ink">{{ formatArs(product.price) }}</span>
          <span
            v-if="product.originalPrice && product.originalPrice > product.price"
            class="text-sm text-ink-subtle line-through"
          >
            {{ formatArs(product.originalPrice) }}
          </span>
        </div>

        <!-- Add Button -->
        <button
          @click.stop="viewProduct"
          class="flex h-8 w-8 items-center justify-center bg-ink text-surface-cream hover:bg-brand-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2"
          :aria-label="`Ver ${product.name}`"
        >
          <IconPlus class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconStar from '~icons/mdi/star'
import IconImageMultiple from '~icons/mdi/image-multiple'
import IconPlus from '~icons/mdi/plus'
import { formatArs } from '~/utils/currency'
import { getFirstImageUrl } from '~/utils/imageHelpers'

const props = defineProps(['product'])
const productsStore = useProductsStore()

const leagueName = computed(() => {
  const league = productsStore.leagues.find(l => l.slug === props.product.league)
  return league?.name || props.product.league || ''
})

function viewProduct() {
  navigateTo(`/products/${props.product.slug}`)
}
</script>
