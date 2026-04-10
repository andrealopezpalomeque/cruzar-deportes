<template>
  <div
    class="group cursor-pointer relative overflow-hidden bg-surface-warm border border-surface-muted"
    @click="navigateToDeal"
  >
    <div class="relative p-8 md:p-10">
      <div class="mb-6">
        <span class="inline-flex items-center px-3 py-1 font-display text-xs font-bold uppercase tracking-widest bg-brand-sage-400 text-white">
          <IconTag class="w-3 h-3 mr-1.5" />
          Precio Grupal
        </span>
      </div>

      <h3 class="font-display text-display-md text-ink mb-4 uppercase">Pedidos de Equipos</h3>

      <p class="text-ink-muted mb-6 leading-relaxed max-w-md">
        Equipa a todo tu equipo con camisetas personalizadas. Precios especiales para grupos,
        con opcion de estampado de nombre y numero incluido.
      </p>

      <div class="space-y-2.5 mb-8">
        <div class="flex items-center text-sm text-ink-light">
          <IconCheck class="w-4 h-4 mr-2.5 text-brand-sage-500 flex-shrink-0" />
          <span>Descuento por cantidad</span>
        </div>
        <div class="flex items-center text-sm text-ink-light">
          <IconCheck class="w-4 h-4 mr-2.5 text-brand-sage-500 flex-shrink-0" />
          <span>Personalizacion incluida</span>
        </div>
        <div class="flex items-center text-sm text-ink-light">
          <IconCheck class="w-4 h-4 mr-2.5 text-brand-sage-500 flex-shrink-0" />
          <span>Multiples talles disponibles</span>
        </div>
        <div class="flex items-center text-sm text-ink-light">
          <IconCheck class="w-4 h-4 mr-2.5 text-brand-sage-500 flex-shrink-0" />
          <span>Asesoramiento personalizado</span>
        </div>
      </div>

      <button class="inline-flex items-center font-display text-sm font-bold uppercase tracking-wider text-ink group-hover:text-brand-sage-600 transition-colors">
        <IconWhatsapp class="w-5 h-5 mr-2" />
        Consultar por WhatsApp
        <IconArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
</template>

<script setup>
import IconTag from '~icons/heroicons/tag'
import IconCheck from '~icons/mdi/check-circle'
import IconWhatsapp from '~icons/mdi/whatsapp'
import IconArrowRight from '~icons/mdi/arrow-right'

const navigateToDeal = () => {
  navigateTo('/ofertas/pedidos-equipos')
}
</script>
