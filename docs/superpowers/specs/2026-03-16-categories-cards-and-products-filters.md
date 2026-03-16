# Categories Card Colors + Products Page Mobile Filters

## Problem

1. **Categories page cards** are all identical dark gradients — no visual distinction between leagues, sports, or accessories. Users cannot scan and differentiate at a glance.
2. **Products page on mobile** has two rows of wrapping filter pills (product type + league) that push the first product too far down the viewport.

## Solution

### 1. Categories Page Card Enhancement (`apps/home/pages/categories/index.vue`)

Each group gets a distinct tinted dark gradient, a subtle corner glow accent, and per-card icons.

**Group color themes (applied to sectionConfig):**

Each section in `sectionConfig` gains additional fields: `gradient`, `glow`, `iconColor`, `headerBg`, `headerIconColor`.

```typescript
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
```

**Icon imports to add:**

```typescript
import IconSoccer from '~icons/mdi/soccer'
import IconTrophyOutline from '~icons/mdi/trophy-outline'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconArrowRight from '~icons/mdi/arrow-right'
import IconFlagVariant from '~icons/mdi/flag-variant'
import IconBasketball from '~icons/mdi/basketball'
import IconShoeCleat from '~icons/mdi/shoe-cleat'
import IconHandBackRight from '~icons/mdi/hand-back-right'
import IconCoatRack from '~icons/mdi/coat-rack'
import IconRun from '~icons/mdi/run'
import IconTagOutline from '~icons/mdi/tag-outline'
```

**Complete iconMap (keyed by league slug):**

```typescript
const iconMap = {
  // Ligas de Futbol
  'futbol-argentino': IconSoccer,
  'premier-league': IconSoccer,
  'la-liga': IconSoccer,
  'serie-a': IconSoccer,
  'bundesliga': IconSoccer,
  'brasileirao': IconSoccer,
  'resto-del-mundo': IconSoccer,
  // Mas Deportes
  'selecciones': IconFlagVariant,
  'basquet': IconBasketball,
  'otros-deportes': IconTrophyOutline,
  // Indumentaria y Accesorios
  'botines': IconShoeCleat,
  'guantes': IconHandBackRight,
  'pelotas': IconSoccer,
  'abrigos': IconCoatRack,
  'ropa-de-entrenamiento': IconRun,
}

const getLeagueIcon = (slug) => iconMap[slug] || IconTagOutline
```

**Card template structure:**

```html
<div class="bg-gradient-to-br rounded-lg p-6 relative overflow-hidden transition-all duration-300"
     :class="[section.gradient]">
  <!-- Corner glow -->
  <div class="absolute top-0 right-0 w-10 h-10 rounded-bl-full"
       :class="[section.glow]"></div>

  <!-- Card icon -->
  <component :is="getLeagueIcon(league.slug)"
             class="w-5 h-5 mb-3"
             :class="[section.iconColor]" />

  <!-- League name -->
  <h3 class="text-base font-medium text-white mb-1">{{ league.name }}</h3>

  <!-- Product count -->
  <p class="text-sm text-white/50">
    {{ getProductCount(league.slug) }} productos disponibles
  </p>

  <!-- Comprar ahora -->
  <div class="mt-4 flex items-center text-white/60 group-hover:text-white/80 transition-colors">
    <span class="text-sm font-medium">Comprar ahora</span>
    <IconArrowRight class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
  </div>
</div>
```

**Section header template (updated):**

```html
<div class="flex items-center gap-3 mb-6">
  <div class="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
       :class="[section.headerBg]">
    <component :is="section.icon" class="w-4 h-4" :class="[section.headerIconColor]" />
  </div>
  <h2 class="text-base font-semibold text-gray-900 whitespace-nowrap">{{ section.label }}</h2>
  <div class="flex-1 h-px bg-gray-200"></div>
</div>
```

**Hover state:** Remove the existing `hover:from-gray-700 hover:to-gray-900` classes. The card gets a simple `hover:brightness-110` instead, which works with any gradient.

### 2. Products Page Mobile Filters (`apps/home/pages/products/index.vue`)

**Mobile horizontal scroll for filter pill rows:**

Both filter rows (product type pills and league pills) get horizontal scroll on mobile:

**Wrapper div classes for each filter row:**
```html
<div class="relative">
  <div class="filter-scroll flex flex-nowrap md:flex-wrap gap-2
              overflow-x-auto md:overflow-x-visible">
    <!-- pills here -->
  </div>
  <!-- Right fade overlay -->
  <div class="absolute right-0 top-0 h-full w-8
              bg-gradient-to-r from-transparent to-white
              pointer-events-none md:hidden"></div>
</div>
```

- Parent gets `relative` for overlay positioning
- Filter row gets `flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible gap-2`
- Fade overlay: `absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white pointer-events-none md:hidden`
- Pills get `flex-shrink-0` to prevent them from compressing

**Scoped CSS for hiding scrollbar:**
```css
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

**Desktop unchanged** — `md:flex-wrap` and `md:overflow-x-visible` restore the current wrapping behavior on medium screens and above. The fade overlay is hidden via `md:hidden`.

### What is NOT changing

- Categories page grouping logic, section ordering, data model
- Products page filtering logic, pagination, product cards
- Any other pages or components
- No emojis anywhere — all visual indicators use MDI icons

## Technical Notes

- Icons: unplugin-icons with MDI set (`~icons/mdi/...`)
- Tailwind arbitrary values for gradients: `from-[#hex]` and `to-[#hex]`
- Tailwind opacity modifiers: `bg-blue-500/15` for 15% opacity
- The icon map uses dynamic `<component :is>` rendering (same pattern already used for section icons)
- Corner glow element: `w-10 h-10` = 40x40px, `rounded-bl-full` creates a quarter-circle
- `hover:brightness-110` is a Tailwind filter utility, applies to the entire card gradient uniformly
