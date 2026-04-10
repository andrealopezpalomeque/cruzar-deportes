<template>
  <div ref="bannerRef" class="w-full bg-ink text-surface-cream">
    <div class="max-w-7xl mx-auto px-4">
      <div
        class="flex items-center justify-center py-2.5 cursor-pointer group"
        @click="isExpanded = !isExpanded"
      >
        <span class="font-display text-sm font-medium uppercase tracking-wider text-center">{{
          currentMessage
        }}</span>
        <IconChevronDown
          class="ml-2 h-4 w-4 transition-transform duration-300"
          :class="{ 'rotate-180': isExpanded }"
        />
      </div>

      <div
        v-if="isExpanded"
        class="border-t border-ink-light py-6 transition-all duration-300 cursor-default"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="text-center">
            <div
              class="w-12 h-12 bg-brand-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <IconCreditCard class="h-5 w-5 text-brand-orange-400" />
            </div>
            <h3 class="font-display font-semibold uppercase tracking-wide text-sm mb-2">Lunes</h3>
            <p class="text-sm text-surface-muted mb-1">
              Banco de Corrientes via MODO
            </p>
            <p class="text-sm font-medium">3 cuotas sin interes + 30% de reintegro</p>
            <p class="text-xs text-ink-subtle mt-1">
              Tope de $20.000 con Visa BanCo
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-12 h-12 bg-brand-sage-500/20 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <IconCreditCard class="h-5 w-5 text-brand-sage-300" />
            </div>
            <h3 class="font-display font-semibold uppercase tracking-wide text-sm mb-2">Miercoles y Sabados</h3>
            <p class="text-sm text-surface-muted mb-1">Visa o Mastercard</p>
            <p class="text-sm font-medium">3 cuotas sin interes con cualquier banco</p>
          </div>

          <div class="text-center">
            <div
              class="w-12 h-12 bg-brand-olive-500/20 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <IconBuildingBank class="h-5 w-5 text-brand-olive-300" />
            </div>
            <h3 class="font-display font-semibold uppercase tracking-wide text-sm mb-2">Efectivo o Transferencia</h3>
            <p class="text-sm text-surface-muted mb-1">Todos los dias</p>
            <p class="text-sm font-medium">
              10% de descuento abonando en efectivo o transferencia
            </p>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-ink-light">
          <p class="text-xs text-ink-subtle text-center">
            Promociones validas segun terminos y condiciones. Consulte
            disponibilidad.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import IconChevronDown from "~icons/mdi/chevron-down";
import IconBuildingBank from "~icons/heroicons/building-library";
import IconCreditCard from "~icons/heroicons/credit-card";

const isExpanded = ref(false);
const currentMessageIndex = ref(0);
const bannerRef = ref(null);

const handleClickOutside = (event) => {
  if (isExpanded.value && bannerRef.value && !bannerRef.value.contains(event.target)) {
    isExpanded.value = false;
  }
};

const messages = computed(() => {
  const today = new Date().getDay();

  if (today === 1) {
    return [
      "Lunes: 3 cuotas sin interes + 30% de reintegro (tope $20.000)",
      "Paga con Visa BanCo a traves de MODO",
      "10% OFF abonando en efectivo o transferencia",
      "Envio gratis en compras superiores a $120.000",
    ];
  } else if (today === 3 || today === 6) {
    return [
      "Miercoles y Sabados: 3 cuotas sin interes con Visa o Mastercard",
      "10% OFF abonando en efectivo o transferencia",
      "Envio gratis en compras superiores a $120.000",
    ];
  }

  return [
    "10% OFF abonando en efectivo o transferencia",
    "Envio gratis en compras superiores a $120.000",
    "Consulta nuestras promos vigentes",
  ];
});

const currentMessage = computed(() => {
  return messages.value[currentMessageIndex.value];
});

let rotationInterval = null;

onMounted(() => {
  rotationInterval = setInterval(() => {
    currentMessageIndex.value =
      (currentMessageIndex.value + 1) % messages.value.length;
  }, 5000);

  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  if (rotationInterval) {
    clearInterval(rotationInterval);
  }
  document.removeEventListener("click", handleClickOutside);
});
</script>
