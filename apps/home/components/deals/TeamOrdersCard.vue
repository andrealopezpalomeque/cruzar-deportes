<template>
  <Card class="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer" @click="navigateToDeal">
    <!-- Visual Header with Gradient -->
    <div class="relative h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <div class="relative h-full flex items-center justify-center">
        <div class="text-center">
          <div class="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <IconAccountGroup class="w-10 h-10 text-white" />
          </div>
          <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
            <IconTag class="w-3 h-3 mr-1" />
            Precio Grupal
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <h3 class="text-2xl font-light text-gray-900 mb-3">Pedidos de Equipos</h3>
      <p class="text-gray-800 mb-4 leading-relaxed">
        Equipá a todo tu equipo con camisetas personalizadas. Precios especiales para grupos,
        con opción de estampado de nombre y número incluido.
      </p>

      <!-- Features List -->
      <div class="space-y-2 mb-6">
        <div class="flex items-center text-sm text-gray-700">
          <IconCheck class="w-4 h-4 mr-2 text-black flex-shrink-0" />
          <span>Descuento por cantidad</span>
        </div>
        <div class="flex items-center text-sm text-gray-700">
          <IconCheck class="w-4 h-4 mr-2 text-black flex-shrink-0" />
          <span>Personalización incluida</span>
        </div>
        <div class="flex items-center text-sm text-gray-700">
          <IconCheck class="w-4 h-4 mr-2 text-black flex-shrink-0" />
          <span>Múltiples talles disponibles</span>
        </div>
        <div class="flex items-center text-sm text-gray-700">
          <IconCheck class="w-4 h-4 mr-2 text-black flex-shrink-0" />
          <span>Asesoramiento personalizado</span>
        </div>
      </div>

      <!-- CTA Button -->
      <Button class="w-full" variant="default">
        <IconWhatsapp class="w-5 h-5 mr-2" />
        Consultar por WhatsApp
      </Button>
    </div>
  </Card>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import IconAccountGroup from '~icons/mdi/account-group-outline'
import IconTag from '~icons/heroicons/tag'
import IconCheck from '~icons/mdi/check-circle'
import IconWhatsapp from '~icons/mdi/whatsapp'

const navigateToDeal = () => {
  navigateTo('/ofertas/pedidos-equipos')
}
</script>
