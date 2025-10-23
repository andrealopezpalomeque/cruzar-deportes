<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="card max-w-2xl w-full">
      <div class="card-body text-center py-12">
        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <IconHammerWrench class="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Operaciones en Lote
        </h1>

        <!-- Message -->
        <p class="text-lg text-gray-600 mb-8">
          Esta funcionalidad estará disponible próximamente.
        </p>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p class="text-sm text-gray-700">
            Las operaciones en lote permitirán realizar cambios masivos en múltiples productos simultáneamente,
            facilitando la gestión del catálogo de manera más eficiente.
          </p>
        </div>

        <!-- Back button -->
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <IconArrowLeft class="w-5 h-5" />
          {{ buttonText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import IconHammerWrench from '~icons/mdi/hammer-wrench'
import IconArrowLeft from '~icons/mdi/arrow-left'

const route = useRoute()

// Check if coming from dashboard via query parameter
const buttonText = computed(() => {
  return route.query.from === 'dashboard' ? 'Volver al Dashboard' : 'Ir al Dashboard'
})

definePageMeta({
  layout: 'default'
})
</script>
