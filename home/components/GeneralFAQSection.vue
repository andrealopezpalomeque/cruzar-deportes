<template>
  <div class="space-y-4">
    <!-- Enhanced FAQ Accordion with modern styling -->
    <div 
      v-for="faq in faqData" 
      :key="faq.id"
    >
      <UiAccordionItem :value="faq.id">
        <template #trigger>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="getIconBgClass(faq.icon)">
              <component :is="getIconComponent(faq.icon)" class="w-5 h-5" :class="getIconColorClass(faq.icon)" />
            </div>
            <span class="font-semibold text-gray-900">{{ faq.question }}</span>
          </div>
        </template>
        <template #content>
          <div class="ml-14">
            <p class="text-gray-700 leading-relaxed mb-4">{{ faq.answer }}</p>
            <div v-if="faq.tip" :class="getTipBgClass(faq.icon)" class="border-l-4 p-4 rounded-r-lg">
              <div class="flex items-start gap-3">
                <IconInformationCircle class="w-5 h-5 mt-0.5 flex-shrink-0" :class="getTipIconColorClass(faq.icon)" />
                <div>
                  <p class="font-medium mb-1" :class="getTipTextColorClass(faq.icon)">Consejo Pro:</p>
                  <p class="text-sm" :class="getTipDescColorClass(faq.icon)">{{ faq.tip }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UiAccordionItem>
    </div>

    <!-- Contact Support Card -->
    <UiCard class="p-6" variant="gradient">
      <div class="text-center space-y-4">
        <h2 class="text-2xl font-bold text-gray-900">¿No encontrás lo que buscás?</h2>
        <p class="text-gray-600">
          Nuestro equipo está disponible para ayudarte con cualquier consulta adicional que puedas tener.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Contactanos
          </NuxtLink>
          <NuxtLink
            to="/cuidado-camisetas"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cuidado de Camisetas
          </NuxtLink>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import IconTruckDelivery from '~icons/mdi/truck-delivery'
import IconCreditCard from '~icons/mdi/credit-card'
import IconKeyboardReturn from '~icons/mdi/keyboard-return'
import IconCheckCircle from '~icons/mdi/check-circle'
import IconRuler from '~icons/mdi/ruler'
import IconPackageVariant from '~icons/mdi/package-variant'
import IconPalette from '~icons/mdi/palette'
import IconEarth from '~icons/mdi/earth'
import IconInformationCircle from '~icons/heroicons/information-circle'

// Icon component mapping for dynamic icons
const iconComponents = {
  'mdi:truck-delivery': IconTruckDelivery,
  'mdi:credit-card': IconCreditCard,
  'mdi:keyboard-return': IconKeyboardReturn,
  'mdi:check-circle': IconCheckCircle,
  'mdi:ruler': IconRuler,
  'mdi:package-variant': IconPackageVariant,
  'mdi:palette': IconPalette,
  'mdi:earth': IconEarth,
}

function getIconComponent(iconName) {
  return iconComponents[iconName] || IconTruckDelivery // fallback
}

// Color schemes for different FAQ categories
const colorSchemes = {
  'mdi:truck-delivery': 'blue',
  'mdi:credit-card': 'green',
  'mdi:keyboard-return': 'red',
  'mdi:check-circle': 'emerald',
  'mdi:ruler': 'purple',
  'mdi:package-variant': 'indigo',
  'mdi:palette': 'pink',
  'mdi:earth': 'cyan',
}

function getIconBgClass(iconName) {
  const color = colorSchemes[iconName] || 'blue'
  return `bg-${color}-100`
}

function getIconColorClass(iconName) {
  const color = colorSchemes[iconName] || 'blue'
  return `text-${color}-600`
}

function getTipBgClass(iconName) {
  const color = colorSchemes[iconName] || 'blue'
  return `bg-${color}-50 border-${color}-400`
}

function getTipIconColorClass(iconName) {
  const color = colorSchemes[iconName] || 'blue'
  return `text-${color}-600`
}

function getTipTextColorClass(iconName) {
  const color = colorSchemes[iconName] || 'blue'
  return `text-${color}-900`
}

function getTipDescColorClass(iconName) {
  const color = colorSchemes[iconName] || 'blue'
  return `text-${color}-800`
}

const faqData = [
  {
    id: "shipping-info",
    question: "¿Cuáles son los tiempos y costos de envío?",
    answer: "Realizamos envíos a todo el país. El envío es gratuito en compras superiores a $50.000. Para montos menores, el costo varía según la ubicación. Los tiempos de entrega son de 3 a 7 días hábiles para CABA y GBA, y de 5 a 10 días hábiles para el interior del país.",
    tip: "Aprovechá el envío gratuito agregando más productos a tu carrito para alcanzar el mínimo.",
    icon: "mdi:truck-delivery"
  },
  {
    id: "payment-methods",
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos todas las tarjetas de débito y crédito (Visa, Mastercard, American Express), transferencias bancarias, y MercadoPago. También ofrecemos la posibilidad de pagar en cuotas sin interés con tarjetas de crédito seleccionadas.",
    tip: "Consultá con tu banco sobre promociones especiales en compras deportivas.",
    icon: "mdi:credit-card"
  },
  {
    id: "returns-exchanges",
    question: "¿Puedo devolver o cambiar un producto?",
    answer: "Sí, tenés 30 días desde la recepción del producto para devolverlo o cambiarlo. El artículo debe estar sin usar, con las etiquetas originales y en su empaque original. Los gastos de envío para devoluciones corren por cuenta del cliente, excepto en casos de productos defectuosos.",
    icon: "mdi:keyboard-return"
  },
  {
    id: "product-authenticity",
    question: "¿Los productos son originales y oficiales?",
    answer: "Todos nuestros productos son 100% auténticos y oficiales. Trabajamos directamente con proveedores autorizados y cada camiseta viene con sus etiquetas y certificados de autenticidad correspondientes.",
    tip: "Buscá siempre las etiquetas holográficas y códigos de autenticidad en tus camisetas.",
    icon: "mdi:check-circle"
  },
  {
    id: "sizing-guide",
    question: "¿Cómo elijo la talla correcta?",
    answer: "Cada producto cuenta con una tabla de talles detallada. Te recomendamos revisar las medidas específicas ya que los talles pueden variar entre marcas y países. Si tenés dudas, podés contactarnos y te ayudaremos a elegir la talla ideal.",
    tip: "Medite el contorno del pecho y comparalo con nuestras tablas para mayor precisión.",
    icon: "mdi:ruler"
  },
  {
    id: "order-tracking",
    question: "¿Cómo puedo rastrear mi pedido?",
    answer: "Una vez despachado tu pedido, te enviaremos un código de seguimiento por email. Podés rastrearlo en tiempo real a través del sitio web de la empresa de transporte. También podés contactarnos si necesitás ayuda con el seguimiento.",
    icon: "mdi:package-variant"
  },
  {
    id: "customization",
    question: "¿Ofrecen personalización de camisetas?",
    answer: "Actualmente no ofrecemos servicios de personalización como estampado de nombres o números. Todas nuestras camisetas vienen en su versión oficial tal como las usan los equipos profesionales.",
    icon: "mdi:palette"
  },
  {
    id: "international-shipping",
    question: "¿Realizan envíos internacionales?",
    answer: "Por el momento solo realizamos envíos dentro de Argentina. Estamos trabajando para expandir nuestro servicio a otros países de Latinoamérica próximamente.",
    icon: "mdi:earth"
  }
]
</script>