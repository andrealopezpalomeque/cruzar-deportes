<template>
  <Card class="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer" @click="navigateToDeal">
    <!-- Visual Header with Gradient -->
    <div class="relative h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <div class="relative h-full flex items-center justify-center">
        <div class="text-center">
          <div class="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <IconGift class="w-10 h-10 text-white" />
          </div>
          <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
            <IconSparkles class="w-3 h-3 mr-1" />
            Sorpresa Garantizada
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <h3 class="text-2xl font-light text-gray-900 mb-3">Caja Misteriosa</h3>
      <p class="text-gray-800 mb-4 leading-relaxed">
        Recibí una selección sorpresa de camisetas retro y actuales. Vos elegís el tamaño,
        nosotros curamos la colección perfecta para tu guardarropa deportivo.
      </p>

      <!-- Features List -->
      <div class="space-y-2 mb-6">
        <div class="flex items-center text-sm text-gray-700">
          <IconCheck class="w-4 h-4 mr-2 text-black flex-shrink-0" />
          <span>Seleccioná tu talle</span>
        </div>
        <div class="flex items-center text-sm text-gray-700">
          <IconCheck class="w-4 h-4 mr-2 text-black flex-shrink-0" />
          <span>Excluí equipos que no te gusten</span>
        </div>
        <div class="flex items-center text-sm text-gray-700">
          <IconCheck class="w-4 h-4 mr-2 text-black flex-shrink-0" />
          <span>Elegí entre retro o actuales</span>
        </div>
        <div class="flex items-center text-sm text-gray-700">
          <IconCheck class="w-4 h-4 mr-2 text-black flex-shrink-0" />
          <span>Precio especial por caja</span>
        </div>
      </div>

      <!-- CTA Button -->
      <Button class="w-full" variant="default">
        <IconGift class="w-5 h-5 mr-2" />
        Configurar Mi Caja
      </Button>
    </div>
  </Card>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import IconGift from '~icons/mdi/gift-outline'
import IconSparkles from '~icons/heroicons/sparkles'
import IconCheck from '~icons/mdi/check-circle'

const navigateToDeal = () => {
  navigateTo('/ofertas/caja-misteriosa')
}
</script>
