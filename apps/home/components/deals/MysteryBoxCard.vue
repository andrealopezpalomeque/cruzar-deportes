<template>
  <div
    class="group cursor-pointer relative overflow-hidden bg-ink text-white"
    @click="navigateToDeal"
  >
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22><rect width=%224%22 height=%224%22 fill=%22none%22/><rect width=%221%22 height=%221%22 fill=%22white%22/></svg>'); background-size: 4px 4px;"></div>
    </div>

    <div class="relative p-8 md:p-10">
      <div class="mb-6">
        <span class="inline-flex items-center px-3 py-1 font-display text-xs font-bold uppercase tracking-widest bg-brand-orange-600 text-white">
          <IconSparkles class="w-3 h-3 mr-1.5" />
          Sorpresa Garantizada
        </span>
      </div>

      <h3 class="font-display text-display-md text-white mb-4 uppercase">Caja Misteriosa</h3>

      <p class="text-white/80 mb-6 leading-relaxed max-w-md">
        Recibí una selección sorpresa de camisetas retro y actuales. Vos elegís el tamaño,
        nosotros curamos la colección perfecta para tu guardarropa deportivo.
      </p>

      <div class="space-y-2.5 mb-8">
        <div class="flex items-center text-sm text-white/90">
          <IconCheck class="w-4 h-4 mr-2.5 text-brand-orange-400 flex-shrink-0" />
          <span>Seleccioná tu talle</span>
        </div>
        <div class="flex items-center text-sm text-white/90">
          <IconCheck class="w-4 h-4 mr-2.5 text-brand-orange-400 flex-shrink-0" />
          <span>Excluí equipos que no te gusten</span>
        </div>
        <div class="flex items-center text-sm text-white/90">
          <IconCheck class="w-4 h-4 mr-2.5 text-brand-orange-400 flex-shrink-0" />
          <span>Elegí entre retro o actuales</span>
        </div>
        <div class="flex items-center text-sm text-white/90">
          <IconCheck class="w-4 h-4 mr-2.5 text-brand-orange-400 flex-shrink-0" />
          <span>Precio especial por caja</span>
        </div>
      </div>

      <button class="inline-flex items-center font-display text-sm font-bold uppercase tracking-wider text-brand-orange-400 group-hover:text-brand-orange-300 transition-colors">
        <IconGift class="w-5 h-5 mr-2" />
        Configurar Mi Caja
        <IconArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
</template>

<script setup>
import IconGift from '~icons/mdi/gift-outline'
import IconSparkles from '~icons/heroicons/sparkles'
import IconCheck from '~icons/mdi/check-circle'
import IconArrowRight from '~icons/mdi/arrow-right'

const navigateToDeal = () => {
  navigateTo('/ofertas/caja-misteriosa')
}
</script>
