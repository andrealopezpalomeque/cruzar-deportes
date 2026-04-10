<template>
  <section class="relative py-16 md:py-28 bg-ink overflow-hidden">
    <!-- Decorative color blobs -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-brand-orange-600/20 blur-3xl rounded-full"></div>
      <div class="absolute -bottom-32 -right-24 w-[30rem] h-[30rem] bg-brand-coral-600/15 blur-3xl rounded-full"></div>
    </div>

    <!-- Top accent stripe -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange-600 via-brand-coral-500 to-brand-sage-500"></div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
        <span class="reveal inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest text-brand-orange-400 mb-3">
          <span class="w-8 h-px bg-brand-orange-400"></span>
          Testimonios Reales
          <span class="w-8 h-px bg-brand-orange-400"></span>
        </span>
        <h2 class="reveal font-display text-display-lg text-white uppercase mb-3">
          La Voz de la Hinchada
        </h2>
        <p class="reveal text-white/60 text-base md:text-lg leading-relaxed">
          Lo que dicen los que ya vistieron sus colores.
        </p>
      </div>

      <!-- Reviews: carousel on mobile, grid on md+ -->
      <div
        class="reviews-scroller flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0 pb-6 md:pb-0 reveal-stagger"
      >
        <article
          v-for="(review, index) in reviews"
          :key="review.name"
          class="reveal relative group snap-center shrink-0 w-[85%] sm:w-[70%] md:w-auto"
          :class="offsetClass(index)"
        >
          <div
            class="relative h-full p-7 md:p-8 transition-transform duration-500 group-hover:-translate-y-1"
            :class="cardClass(index)"
            :style="{ clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))' }"
          >
            <!-- Stars -->
            <div class="flex items-center gap-0.5 mb-4">
              <IconStar v-for="n in 5" :key="n" class="w-4 h-4" :class="starClass(index)" />
            </div>

            <!-- Quote -->
            <p
              class="font-display font-bold uppercase leading-[1.15] tracking-tight text-[1.05rem] md:text-[1.15rem] mb-7"
              :class="textClass(index)"
            >
              &ldquo;{{ review.text }}&rdquo;
            </p>

            <!-- Author -->
            <div class="flex items-center gap-3 pt-5 border-t" :class="borderClass(index)">
              <div class="relative flex-shrink-0">
                <img
                  :src="review.photo"
                  :alt="`Cliente ${review.name}`"
                  width="44"
                  height="44"
                  class="w-11 h-11 rounded-full object-cover ring-2"
                  :class="ringClass(index)"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <h3 class="font-display text-sm font-bold uppercase tracking-wider truncate" :class="textClass(index)">
                    {{ review.name }}
                  </h3>
                  <IconCheckBadge class="w-4 h-4 flex-shrink-0" :class="textClass(index)" />
                </div>
                <span class="font-display text-[10px] font-semibold uppercase tracking-widest" :class="subTextClass(index)">
                  {{ review.role }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Mobile swipe hint -->
      <div class="md:hidden flex items-center justify-center gap-2 mt-2 text-white/40 font-display text-[10px] font-semibold uppercase tracking-widest">
        <IconArrowLeft class="w-3 h-3" />
        Desliza para ver más
        <IconArrowRight class="w-3 h-3" />
      </div>

      <!-- Footer CTA -->
      <div class="reveal text-center mt-10 md:mt-16">
        <NuxtLink
          to="/products"
          class="inline-flex items-center font-display text-sm font-bold uppercase tracking-wider text-white hover:text-brand-orange-400 transition-colors"
        >
          Sumate a la comunidad
          <IconArrowRight class="w-4 h-4 ml-2" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconStar from '~icons/mdi/star'
import IconArrowRight from '~icons/mdi/arrow-right'
import IconArrowLeft from '~icons/mdi/arrow-left'
import IconCheckBadge from '~icons/heroicons/check-badge-solid'

const reviews = [
  {
    name: 'Jerónimo',
    role: 'Mystery Box',
    photo: '/images/reviews/jeronimo.jpeg',
    text: 'Muy buena la calidad de las camisetas y la presentación de las mistery box. Sinceramente te sorprende, es genial la experiencia. Nos esperábamos solo las camisetas y llegaron otras cosas aparte. Para el día del amigo volvemos a comprar sí o sí.',
  },
  {
    name: 'Manuel',
    role: 'Cliente recurrente',
    photo: '/images/reviews/manuel.jpeg',
    text: 'Excelente producto, como siempre, y una gran atención antes, durante y post venta. Voy a volver a contactarme para futuros pedidos.',
  },
  {
    name: 'Marcelo',
    role: 'Coleccionista',
    photo: '/images/reviews/marcelo.jpeg',
    text: 'Una bomba las casacas!! Me asusta estar a un mensaje de la camiseta que quiera jajaja. Mil gracias por todo.',
  },
  {
    name: 'Constanza',
    role: 'Camisetas',
    photo: '/images/reviews/constanza.jpeg',
    text: 'Muchas gracias por las camisetas! Muy buena la calidad y la atención. Más adelante les voy a estar pidiendo más seguro.',
  },
  {
    name: 'Vittorio',
    role: 'Cliente verificado',
    photo: '/images/reviews/vittorio.jpeg',
    text: 'Espectaculares los productos. Muy buena atención, excelente precio y los tiempos de espera fueron los acordados. Totalmente recomendable.',
  },
  {
    name: 'Agostina',
    role: 'Regalo',
    photo: '/images/reviews/agostina.jpeg',
    text: 'Gracias por las camisetas y sobre todo por la buena onda! Mi sobrino quedó encantado con su regalo y yo feliz también con la mía. Están impecables. 10/10.',
  },
]

// Per-card visual theme: background, text color, border, ring, star
const themes = [
  {
    card: 'bg-brand-orange-400',
    text: 'text-ink',
    subText: 'text-ink/70',
    border: 'border-ink/15',
    ring: 'ring-ink/20',
    star: 'text-ink',
  },
  {
    card: 'bg-brand-sage-300',
    text: 'text-ink',
    subText: 'text-ink/70',
    border: 'border-ink/15',
    ring: 'ring-ink/20',
    star: 'text-ink',
  },
  {
    card: 'bg-brand-coral-400',
    text: 'text-ink',
    subText: 'text-ink/70',
    border: 'border-ink/15',
    ring: 'ring-ink/20',
    star: 'text-ink',
  },
  {
    card: 'bg-brand-olive-300',
    text: 'text-ink',
    subText: 'text-ink/70',
    border: 'border-ink/15',
    ring: 'ring-ink/20',
    star: 'text-ink',
  },
  {
    card: 'bg-brand-coral-300',
    text: 'text-ink',
    subText: 'text-ink/70',
    border: 'border-ink/20',
    ring: 'ring-ink/25',
    star: 'text-ink',
  },
  {
    card: 'bg-brand-orange-300',
    text: 'text-ink',
    subText: 'text-ink/70',
    border: 'border-ink/15',
    ring: 'ring-ink/20',
    star: 'text-ink',
  },
]

const theme = (i) => themes[i % themes.length]
const cardClass = (i) => theme(i).card
const textClass = (i) => theme(i).text
const subTextClass = (i) => theme(i).subText
const borderClass = (i) => theme(i).border
const ringClass = (i) => theme(i).ring
const starClass = (i) => theme(i).star

// Asymmetric vertical offsets for editorial feel on large screens
const offsetClass = (i) => {
  const pattern = ['lg:mt-0', 'lg:mt-10', 'lg:mt-4', 'lg:mt-6', 'lg:mt-0', 'lg:mt-8']
  return pattern[i % pattern.length]
}
</script>

<style scoped>
.reviews-scroller {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-padding-left: 1rem;
  scroll-padding-right: 1rem;
}
.reviews-scroller::-webkit-scrollbar {
  display: none;
}
</style>
