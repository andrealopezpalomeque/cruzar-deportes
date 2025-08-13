<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <img 
              src="/images/cruzar-logo-no-bg.png" 
              alt="Cruzar Deportes Logo" 
              class="h-12 w-auto brightness-0 invert"
            />
            <span class="text-xl font-bold">Cruzar Deportes</span>
          </div>
          <p class="text-gray-300 mb-4">
            Your premier destination for authentic sports jerseys and apparel from teams around the world.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <Icon name="mdi:facebook" class="h-6 w-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Icon name="mdi:twitter" class="h-6 w-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Icon name="mdi:instagram" class="h-6 w-6" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="text-gray-300 hover:text-white">Home</NuxtLink></li>
            <li><NuxtLink to="/categories" class="text-gray-300 hover:text-white">Categories</NuxtLink></li>
            <li><NuxtLink to="/products" class="text-gray-300 hover:text-white">All Products</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-300 hover:text-white">About</NuxtLink></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/contact" class="text-gray-300 hover:text-white">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/shipping" class="text-gray-300 hover:text-white">Shipping Info</NuxtLink></li>
            <li><NuxtLink to="/returns" class="text-gray-300 hover:text-white">Returns</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-gray-300 hover:text-white">FAQ</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-gray-400">
          © {{ currentYear }} Cruzar Deportes. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>