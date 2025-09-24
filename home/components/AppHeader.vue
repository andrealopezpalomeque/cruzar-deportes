<template>
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <OptimizedImage
              src="/images/cruzar-logo-no-bg.png"
              alt="Cruzar Deportes Logo"
              type="logo"
              loading="eager"
              fetchpriority="high"
              img-class="h-20 w-auto"
            />
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink 
            to="/" 
            class="text-gray-800 hover:text-black transition-colors"
          >
            Inicio
          </NuxtLink>
          <NuxtLink 
            to="/categories" 
            class="text-gray-800 hover:text-black transition-colors"
          >
            Categorías
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="text-gray-800 hover:text-black transition-colors"
          >
            Todos los Productos
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <button
            type="button"
            @click="openSearch"
            class="p-2 text-black hover:text-gray-600 transition-colors"
            title="Buscar (Ctrl+K)"
            aria-label="Abrir búsqueda de productos"
          >
            <IconMagnify class="h-6 w-6" />
            <span class="sr-only">Buscar productos</span>
          </button>
          
          <button
            type="button"
            @click="openCart"
            class="relative p-2 text-black hover:text-gray-600 transition-colors"
            :aria-label="cartStore.totalItems > 0 ? `Abrir carrito (${cartStore.totalItems} productos)` : 'Abrir carrito'"
          >
            <IconShopping class="h-6 w-6" />
            <span class="sr-only">
              {{ cartStore.totalItems > 0 ? `Carrito con ${cartStore.totalItems} productos` : 'Carrito vacío' }}
            </span>
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              aria-hidden="true"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>

          <!-- Mobile menu button -->
          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-black hover:text-gray-600 transition-colors"
            :aria-label="mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
            :aria-expanded="mobileMenuOpen"
          >
            <IconMenu class="h-6 w-6" />
            <span class="sr-only">{{ mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NuxtLink 
            to="/" 
            class="block px-3 py-2 text-gray-800 hover:text-black"
            @click="mobileMenuOpen = false"
          >
            Inicio
          </NuxtLink>
          <NuxtLink 
            to="/categories" 
            class="block px-3 py-2 text-gray-800 hover:text-black"
            @click="mobileMenuOpen = false"
          >
            Categorías
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="block px-3 py-2 text-gray-800 hover:text-black"
            @click="mobileMenuOpen = false"
          >
            Todos los Productos
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- Search Modal -->
    <SearchModal />
    
    <!-- Cart Modal -->
    <CartModal />
  </header>
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