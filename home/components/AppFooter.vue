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
              class="h-20 w-auto brightness-0 invert"
            />
          </div>
          <p class="text-gray-300 mb-4">
            Porque cada hincha merece vestir los colores de su pasión. Camisetas deportivas del mundo entero.
          </p>
            <div class="flex">
            <a href="https://www.instagram.com/cruzardeportes/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white">
              <IconInstagram class="h-6 w-6" />
            </a>
            </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="text-gray-300 hover:text-white">Inicio</NuxtLink></li>
            <li><NuxtLink to="/categories" class="text-gray-300 hover:text-white">Categorías</NuxtLink></li>
            <li><NuxtLink to="/products" class="text-gray-300 hover:text-white">Todos los Productos</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-300 hover:text-white">Acerca de</NuxtLink></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Atención al Cliente</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/contact" class="text-gray-300 hover:text-white">Contáctanos</NuxtLink></li>
            <li><NuxtLink to="/shipping" class="text-gray-300 hover:text-white">Información de Envío</NuxtLink></li>
            <li><NuxtLink to="/returns" class="text-gray-300 hover:text-white">Devoluciones</NuxtLink></li>
            <li><NuxtLink to="/cuidado-camisetas" class="text-gray-300 hover:text-white">Cuidado de Camisetas</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-gray-300 hover:text-white">Preguntas Frecuentes</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-gray-400">
          © {{ currentYear }} Cruzar Deportes. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import IconInstagram from '~icons/mdi/instagram'

const currentYear = new Date().getFullYear()
</script>