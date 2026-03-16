# Categories Card Colors + Products Mobile Filters Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add color-coded gradients and per-card icons to the categories page, and make the products page filter pills horizontally scrollable on mobile.

**Architecture:** Two independent UI enhancements. Task 1 rewrites the categories page template and script to add group-tinted gradients, corner glow accents, and per-league icons. Task 2 wraps the products page filter rows in scrollable containers with fade overlays for mobile.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS (with arbitrary values), unplugin-icons (MDI)

**Spec:** `docs/superpowers/specs/2026-03-16-categories-cards-and-products-filters.md`

**Note:** No test framework in this project. Verification is manual via dev server.

---

## Chunk 1: Both tasks

### Task 1: Enhance categories page with group colors and per-card icons

**Files:**
- Modify: `apps/home/pages/categories/index.vue` (full rewrite)

- [ ] **Step 1: Replace the entire file**

Replace the full content of `apps/home/pages/categories/index.vue` with:

```vue
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-light text-gray-900 mb-4">Explora por Categoria</h1>
      <p class="text-lg text-gray-800">Toda nuestra coleccion organizada para vos</p>
    </div>

    <GridSkeleton
      v-if="productsStore.loading"
      type="category"
      :count="6"
      :cols="3"
    />

    <div v-else class="space-y-12">
      <section
        v-for="section in visibleSections"
        :key="section.group"
      >
        <!-- Section Header: tinted icon box + label + divider line -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
               :class="[section.headerBg]">
            <component :is="section.icon" class="w-4 h-4" :class="[section.headerIconColor]" />
          </div>
          <h2 class="text-base font-semibold text-gray-900 whitespace-nowrap">{{ section.label }}</h2>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Category Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="league in section.leagues"
            :key="league.id"
            :to="`/categories/${league.slug}`"
            class="group"
          >
            <div class="bg-gradient-to-br rounded-lg p-6 relative overflow-hidden transition-all duration-300 hover:brightness-110"
                 :class="[section.gradient]">
              <!-- Corner glow -->
              <div class="absolute top-0 right-0 w-10 h-10 rounded-bl-full"
                   :class="[section.glow]"></div>

              <!-- Card icon -->
              <component :is="getLeagueIcon(league.slug)"
                         class="w-5 h-5 mb-3"
                         :class="[section.iconColor]" />

              <h3 class="text-base font-medium text-white mb-1 group-hover:text-gray-100 transition-colors">
                {{ league.name }}
              </h3>
              <p class="text-sm text-white/50">
                {{ getProductCount(league.slug) }} productos disponibles
              </p>
              <div class="mt-4 flex items-center text-white/60 group-hover:text-white/80 transition-colors">
                <span class="text-sm font-medium">Comprar ahora</span>
                <IconArrowRight class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-if="!productsStore.loading && visibleSections.length === 0" class="text-center py-12">
      <IconTshirtCrew class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay categorias disponibles</h3>
      <p class="text-gray-800">No hay categorias disponibles en este momento.</p>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import IconArrowRight from '~icons/mdi/arrow-right'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconSoccer from '~icons/mdi/soccer'
import IconTrophyOutline from '~icons/mdi/trophy-outline'
import IconFlagVariant from '~icons/mdi/flag-variant'
import IconBasketball from '~icons/mdi/basketball'
import IconShoeCleat from '~icons/mdi/shoe-cleat'
import IconHandBackRight from '~icons/mdi/hand-back-right'
import IconCoatRack from '~icons/mdi/coat-rack'
import IconRun from '~icons/mdi/run'
import IconTagOutline from '~icons/mdi/tag-outline'

const productsStore = useProductsStore()

const sectionConfig = [
  {
    group: 'ligas',
    label: 'Ligas de Futbol',
    icon: IconSoccer,
    gradient: 'from-[#0f172a] to-[#1e3a5f]',
    glow: 'bg-blue-500/15',
    iconColor: 'text-blue-400/50',
    headerBg: 'bg-blue-50',
    headerIconColor: 'text-blue-600',
  },
  {
    group: 'deportes',
    label: 'Mas Deportes',
    icon: IconTrophyOutline,
    gradient: 'from-[#1a0a2e] to-[#3b1d6e]',
    glow: 'bg-violet-500/15',
    iconColor: 'text-violet-400/50',
    headerBg: 'bg-violet-50',
    headerIconColor: 'text-violet-600',
  },
  {
    group: 'accesorios',
    label: 'Indumentaria y Accesorios',
    icon: IconTshirtCrew,
    gradient: 'from-[#2a1a0a] to-[#5c3a1a]',
    glow: 'bg-amber-500/15',
    iconColor: 'text-amber-400/50',
    headerBg: 'bg-amber-50',
    headerIconColor: 'text-amber-600',
  },
]

const iconMap = {
  'futbol-argentino': IconSoccer,
  'premier-league': IconSoccer,
  'la-liga': IconSoccer,
  'serie-a': IconSoccer,
  'bundesliga': IconSoccer,
  'brasileirao': IconSoccer,
  'resto-del-mundo': IconSoccer,
  'selecciones': IconFlagVariant,
  'basquet': IconBasketball,
  'otros-deportes': IconTrophyOutline,
  'botines': IconShoeCleat,
  'guantes': IconHandBackRight,
  'pelotas': IconSoccer,
  'abrigos': IconCoatRack,
  'ropa-de-entrenamiento': IconRun,
}

const getLeagueIcon = (slug) => iconMap[slug] || IconTagOutline

const activeLeagues = computed(() =>
  productsStore.leagues.filter(l => l.isActive !== false)
)

const visibleSections = computed(() => {
  return sectionConfig
    .map(section => ({
      ...section,
      leagues: activeLeagues.value
        .filter(l => l.group === section.group)
        .sort((a, b) => a.order - b.order)
    }))
    .filter(section => section.leagues.length > 0)
})

const getProductCount = (leagueSlug) => {
  return productsStore.getProductsByLeague(leagueSlug).length
}

onMounted(() => {
  productsStore.fetchProducts()
})

useHead({
  title: 'Categorias - Cruzar Deportes',
  meta: [
    { name: 'description', content: 'Explora nuestra coleccion de camisetas deportivas, indumentaria y accesorios organizados por categoria.' }
  ]
})
</script>
```

- [ ] **Step 2: Verify in browser**

Run the home app dev server and navigate to `/categories`. Check:
1. Each section has a tinted header icon box (blue, violet, amber)
2. Cards within each group have distinct gradient colors (navy-blue, deep purple, dark amber)
3. Each card shows an icon above the league name
4. Corner glow accent is visible in top-right of each card
5. Hover brightens the card
6. Cards still link correctly to `/categories/${slug}`
7. Mobile responsive: 1-col, 2-col md, 3-col lg

- [ ] **Step 3: Commit**

```bash
git add apps/home/pages/categories/index.vue
git commit -m "feat: add group-tinted gradients and per-card icons to categories page"
```

---

### Task 2: Add horizontal scroll to products page filter pills on mobile

**Files:**
- Modify: `apps/home/pages/products/index.vue:10-66` (filter section template + add scoped CSS)

- [ ] **Step 1: Update the product type filter row**

In `apps/home/pages/products/index.vue`, find the product type filter row (line 12):

```html
      <div class="flex flex-wrap gap-2">
```

Replace it with a wrapper + scrollable row + fade overlay:

```html
      <div class="relative">
        <div class="filter-scroll flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible">
```

The buttons inside this row each need `flex-shrink-0` added to their class list. Find both button class strings in the product type filter section.

The first button (line 16, the "Todos" button) has classes:
```
'px-4 py-2 text-sm font-medium rounded-md transition-colors',
```
Change to:
```
'px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0',
```

The second button (line 29, the v-for loop) has the same base classes. Add `flex-shrink-0` there too:
```
'px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0',
```

Close the wrapper after the existing closing `</div>` of the filter row (after line 37), adding the fade overlay:

```html
        </div>
        <div class="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white pointer-events-none md:hidden"></div>
      </div>
```

- [ ] **Step 2: Update the league filter row**

Find the league filter row (line 40):

```html
      <div v-if="filteredLeagues.length > 0" class="flex flex-wrap gap-2">
```

Replace with the same wrapper pattern:

```html
      <div v-if="filteredLeagues.length > 0" class="relative">
        <div class="filter-scroll flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible">
```

Add `flex-shrink-0` to both button class strings in the league filter section.

The first button (line 44, "Todas las Ligas"):
```
'px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-shrink-0',
```

The second button (line 57, the v-for loop):
```
'px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-shrink-0',
```

Close the wrapper after the existing closing `</div>` (after line 65), adding the fade overlay:

```html
        </div>
        <div class="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white pointer-events-none md:hidden"></div>
      </div>
```

- [ ] **Step 3: Add scoped CSS for scrollbar hiding**

Add a `<style scoped>` block at the end of the file (after the closing `</script>` tag):

```html
<style scoped>
.filter-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.filter-scroll::-webkit-scrollbar {
  display: none;
}
</style>
```

- [ ] **Step 4: Verify in browser**

Run the home app dev server and check `/products` on both mobile and desktop:
1. **Mobile (narrow viewport):** Pills scroll horizontally, no wrapping. Fade gradient visible on right edge. Scrollbar hidden.
2. **Desktop:** Pills wrap normally as before. No fade overlay visible. No horizontal scrollbar.
3. Select a product type — the league pills row also scrolls on mobile.
4. Filtering still works correctly (clicking pills updates products).
5. Query params still work (`/products?type=camisetas&league=selecciones`).

- [ ] **Step 5: Commit**

```bash
git add apps/home/pages/products/index.vue
git commit -m "feat: add horizontal scroll for filter pills on mobile"
```
