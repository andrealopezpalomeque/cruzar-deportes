<template>
  <div class="min-h-screen bg-gray-50">
    <PromotionalBanner />
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import PromotionalBanner from '~/components/PromotionalBanner.vue'
// Layout for the main ecommerce site
</script>