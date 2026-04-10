<template>
  <div class="min-h-screen bg-surface-cream">
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
</script>
