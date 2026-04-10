<template>
  <header class="bg-surface-cream/95 backdrop-blur-sm sticky top-0 z-50 border-b border-surface-muted">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <OptimizedImage
              src="/images/cruzar-logo-no-bg.png"
              alt="Cruzar Deportes Logo"
              type="logo"
              loading="eager"
              fetchpriority="high"
              img-class="h-20 md:h-24 w-auto -my-2"
            />
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink
            to="/"
            class="font-display text-sm font-semibold uppercase tracking-wider text-ink hover:text-brand-orange-600 transition-colors"
          >
            Inicio
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="font-display text-sm font-semibold uppercase tracking-wider text-ink hover:text-brand-orange-600 transition-colors"
          >
            Categorías
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="font-display text-sm font-semibold uppercase tracking-wider text-ink hover:text-brand-orange-600 transition-colors"
          >
            Todos los Productos
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="openSearch"
            class="p-2 text-ink hover:text-brand-orange-600 transition-colors"
            title="Buscar (Ctrl+K)"
            aria-label="Abrir búsqueda de productos"
          >
            <IconMagnify class="h-5 w-5" />
            <span class="sr-only">Buscar productos</span>
          </button>

          <button
            type="button"
            @click="openCart"
            class="relative p-2 text-ink hover:text-brand-orange-600 transition-colors"
            :aria-label="cartStore.totalItems > 0 ? `Abrir carrito (${cartStore.totalItems} productos)` : 'Abrir carrito'"
          >
            <IconShopping class="h-5 w-5" />
            <span class="sr-only">
              {{ cartStore.totalItems > 0 ? `Carrito con ${cartStore.totalItems} productos` : 'Carrito vacío' }}
            </span>
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-0.5 -right-0.5 bg-brand-orange-600 text-white text-xs font-display font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center"
              aria-hidden="true"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>

          <!-- Mobile menu button -->
          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-ink hover:text-brand-orange-600 transition-colors"
            :aria-label="mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
            :aria-expanded="mobileMenuOpen"
          >
            <IconMenu class="h-5 w-5" />
            <span class="sr-only">{{ mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-surface-muted">
        <div class="py-4 space-y-1">
          <NuxtLink
            to="/"
            class="block px-3 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-ink hover:text-brand-orange-600 hover:bg-surface-warm transition-colors"
            @click="mobileMenuOpen = false"
          >
            Inicio
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="block px-3 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-ink hover:text-brand-orange-600 hover:bg-surface-warm transition-colors"
            @click="mobileMenuOpen = false"
          >
            Categorías
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="block px-3 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-ink hover:text-brand-orange-600 hover:bg-surface-warm transition-colors"
            @click="mobileMenuOpen = false"
          >
            Todos los Productos
          </NuxtLink>
        </div>
      </div>
    </div>

  </header>

  <!-- Teleport modals outside header's stacking context -->
  <Teleport to="body">
    <SearchModal />
    <CartModal />
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useSearchStore } from '../stores/search'
import SearchModal from './SearchModal.vue'
import CartModal from './CartModal.vue'
import IconMagnify from '~icons/mdi/magnify'
import IconShopping from '~icons/mdi/shopping-outline'
import IconMenu from '~icons/mdi/menu'

const cartStore = useCartStore()
const searchStore = useSearchStore()
const mobileMenuOpen = ref(false)

function openCart() {
  cartStore.openCart()
}

function openSearch() {
  searchStore.openSearch()
}
</script>
