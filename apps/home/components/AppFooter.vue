<template>
  <footer class="bg-ink text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div class="col-span-1 md:col-span-2 lg:col-span-1">
          <div class="flex items-center mb-6">
            <OptimizedImage
              src="/images/cruzar-logo-no-bg.png"
              alt="Cruzar Deportes Logo"
              type="logo"
              loading="lazy"
              img-class="h-20 md:h-24 w-auto brightness-0 invert"
            />
          </div>
          <p class="text-white/70 mb-6 leading-relaxed cursor-default max-w-xs">
            Porque cada hincha merece vestir los colores de su pasión. Camisetas deportivas del mundo entero.
          </p>
          <div class="flex">
            <a
              href="https://www.instagram.com/cruzardeportes/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/60 hover:text-brand-orange-400 transition-colors"
            >
              <IconInstagram class="h-6 w-6" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="font-display text-sm font-bold uppercase tracking-widest text-white mb-6 cursor-default">Enlaces Rápidos</h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/" class="text-white/70 hover:text-brand-orange-400 transition-colors text-sm">Inicio</NuxtLink></li>
            <li><NuxtLink to="/categories" class="text-white/70 hover:text-brand-orange-400 transition-colors text-sm">Categorías</NuxtLink></li>
            <li><NuxtLink to="/products" class="text-white/70 hover:text-brand-orange-400 transition-colors text-sm">Todos los Productos</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-display text-sm font-bold uppercase tracking-widest text-white mb-6 cursor-default">Ofertas Especiales</h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/ofertas/caja-misteriosa" class="text-white/70 hover:text-brand-orange-400 transition-colors text-sm">Caja Misteriosa</NuxtLink></li>
            <li><NuxtLink to="/ofertas/pedidos-equipos" class="text-white/70 hover:text-brand-orange-400 transition-colors text-sm">Pedidos de Equipos</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-display text-sm font-bold uppercase tracking-widest text-white mb-6 cursor-default">Atención al Cliente</h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/cuidado-camisetas" class="text-white/70 hover:text-brand-orange-400 transition-colors text-sm">Cuidado de Camisetas</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-white/70 hover:text-brand-orange-400 transition-colors text-sm">Preguntas Frecuentes</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p class="text-white/40 text-sm cursor-default">
          &copy; {{ currentYear }} Cruzar Deportes. Todos los derechos reservados.
        </p>
        <p class="text-white/40 text-sm cursor-default">
          Desarrollado por
          <a
            href="https://wiseutils.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-display font-semibold uppercase tracking-wider text-white/60 underline underline-offset-4 decoration-white/30 hover:text-brand-orange-400 hover:decoration-brand-orange-400 transition-colors"
          >
            Wise Utils
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import IconInstagram from '~icons/mdi/instagram'

const currentYear = new Date().getFullYear()
</script>
