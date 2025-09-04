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
            class="p-2 text-gray-400 hover:text-gray-500"
          >
            <Icon name="mdi:magnify" class="h-6 w-6" />
          </button>
          
          <button 
            type="button"
            @click="openCart"
            class="relative p-2 text-gray-400 hover:text-gray-500"
          >
            <Icon name="mdi:shopping" class="h-6 w-6" />
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
            <Icon name="mdi:menu" class="h-6 w-6" />
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
  </header>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
const mobileMenuOpen = ref(false)

function openCart() {
  // TODO: Implement cart sidebar/modal
  console.log('Open cart')
}
</script>