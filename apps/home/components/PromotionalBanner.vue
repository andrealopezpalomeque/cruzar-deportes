<template>
  <div ref="bannerRef" class="w-full bg-black text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div
        class="flex items-center justify-center py-3 cursor-pointer group"
        @click="isExpanded = !isExpanded"
      >
        <span class="text-sm font-normal tracking-wide text-center">{{
          currentMessage
        }}</span>
        <IconChevronDown
          class="ml-2 h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
        />
      </div>

      <div
        v-if="isExpanded"
        class="border-t border-gray-600 py-6 transition-all duration-300 cursor-default"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="text-center">
            <div
              class="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <IconCreditCard class="h-6 w-6 text-blue-400" />
            </div>
            <h3 class="font-medium mb-2">Lunes</h3>
            <p class="text-sm text-gray-300 mb-1">
              Banco de Corrientes vía MODO
            </p>
            <p class="text-sm">3 cuotas sin interés + 30% de reintegro</p>
            <p class="text-xs text-gray-400 mt-1">
              Tope de $20.000 con Visa BanCo
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <IconCreditCard class="h-6 w-6 text-green-400" />
            </div>
            <h3 class="font-medium mb-2">Miércoles y Sábados</h3>
            <p class="text-sm text-gray-300 mb-1">Visa o Mastercard</p>
            <p class="text-sm">3 cuotas sin interés con cualquier banco</p>
          </div>

          <div class="text-center">
            <div
              class="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <IconBuildingBank class="h-6 w-6 text-amber-400" />
            </div>
            <h3 class="font-medium mb-2">Efectivo o Transferencia</h3>
            <p class="text-sm text-gray-300 mb-1">Todos los días</p>
            <p class="text-sm">
              10% de descuento abonando en efectivo o transferencia
            </p>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-600">
          <p class="text-xs text-gray-400 text-center">
            Promociones válidas según términos y condiciones. Consulte
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
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

  if (today === 1) {
    // Monday - Banco Corrientes via MODO
    return [
      "Lunes: 3 cuotas sin interés + 30% de reintegro (tope $20.000)",
      "Pagá con Visa BanCo a través de MODO",
      "10% OFF abonando en efectivo o transferencia",
      "Envío gratis en compras superiores a $120.000",
    ];
  } else if (today === 3 || today === 6) {
    // Wednesday or Saturday - all banks Visa/Mastercard
    return [
      "Miércoles y Sábados: 3 cuotas sin interés con Visa o Mastercard",
      "10% OFF abonando en efectivo o transferencia",
      "Envío gratis en compras superiores a $120.000",
    ];
  }

  return [
    "10% OFF abonando en efectivo o transferencia",
    "Envío gratis en compras superiores a $120.000",
    "Consultá nuestras promos vigentes",
  ];
});

const currentMessage = computed(() => {
  return messages.value[currentMessageIndex.value];
});

let rotationInterval = null;

onMounted(() => {
  // Auto-rotate messages every 5 seconds
  rotationInterval = setInterval(() => {
    currentMessageIndex.value =
      (currentMessageIndex.value + 1) % messages.value.length;
  }, 5000);

  // Listen for clicks outside to collapse the banner
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  if (rotationInterval) {
    clearInterval(rotationInterval);
  }
  document.removeEventListener("click", handleClickOutside);
});
</script>
