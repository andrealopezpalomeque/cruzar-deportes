<template>
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <img 
              src="/images/cruzar-logo-no-bg.png" 
              alt="Cruzar Deportes Logo" 
              class="h-20 w-auto"
            />
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink 
            to="/" 
            class="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Inicio
          </NuxtLink>
          <NuxtLink 
            to="/categories" 
            class="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Categorías
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Todos los Productos
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <button 
            type="button"
            @click="openSearch"
            class="p-2 text-gray-400 hover:text-gray-500 transition-colors"
            title="Buscar (Ctrl+K)"
          >
            <IconMagnify class="h-6 w-6" />
          </button>
          
          <button 
            type="button"
            @click="openCart"
            class="relative p-2 text-gray-400 hover:text-gray-500"
          >
            <IconShopping class="h-6 w-6" />
            <span 
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>

          <!-- Mobile menu button -->
          <button 
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-400 hover:text-gray-500"
          >
            <IconMenu class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NuxtLink 
            to="/" 
            class="block px-3 py-2 text-gray-700 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            Inicio
          </NuxtLink>
          <NuxtLink 
            to="/categories" 
            class="block px-3 py-2 text-gray-700 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            Categorías
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="block px-3 py-2 text-gray-700 hover:text-primary-600"
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
import IconShopping from '~icons/mdi/shopping'
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