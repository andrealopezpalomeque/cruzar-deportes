<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- Global Toast Container -->
  <ToastContainer />
</template>

<script setup>
// Global app configuration
useHead({
  titleTemplate: '%s | Cruzar Deportes Back Office',
  meta: [
    { name: 'description', content: 'Administrative panel for Cruzar Deportes sports jersey e-commerce' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>