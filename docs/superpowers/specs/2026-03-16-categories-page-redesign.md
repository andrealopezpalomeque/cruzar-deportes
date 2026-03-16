# Categories Page Redesign

## Problem

The `/categories` page currently shows all leagues as identical flat cards under the title "Comprar por Liga". This has several issues:

1. The title "Comprar por Liga" excludes non-league categories (Basquet, Selecciones, accessories)
2. All 15 categories shown as identical dark cards with CZ logo placeholder — no visual hierarchy
3. Accessories (Botines, Guantes, Pelotas, Abrigos, Ropa de Entrenamiento) are completely missing from the page
4. No grouping — football leagues, other sports, and gear all mixed or absent

## Solution

### 1. Data Model: Add `group` field to League

Add a required `group` field to the League type.

**Files to update:**

**`apps/home/types/index.ts`** — Add `group` to the `League` interface:
```typescript
export interface League {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
  applicableTypes: string[]
  group: 'ligas' | 'deportes' | 'accesorios'  // NEW
}
```

**`apps/back-office/types/index.ts`** — Add `group` to the back-office `League` interface:
```typescript
export interface League {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
  applicableTypes: string[]
  group: 'ligas' | 'deportes' | 'accesorios'  // NEW
  createdAt?: string
  updatedAt?: string
}
```

**`apps/home/utils/catalogLoader.ts`** — Update both `ApiLeague` interface and `transformLeague` function:
```typescript
interface ApiLeague {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
  applicableTypes: string[]
  group: 'ligas' | 'deportes' | 'accesorios'  // NEW
}

const transformLeague = (apiLeague: ApiLeague): League => {
  return {
    id: apiLeague.id,
    name: apiLeague.name,
    slug: apiLeague.slug,
    order: apiLeague.order,
    isActive: apiLeague.isActive,
    applicableTypes: apiLeague.applicableTypes || [],
    group: apiLeague.group || 'ligas'  // NEW — fallback for unmigrated data
  }
}
```

**`services/api/src/controllers/leagueController.js`** — Add `group` to the `createLeague` allowlist:
```javascript
const newLeague = {
  name: leagueData.name || '',
  slug: leagueData.slug || '',
  order: leagueData.order ?? 0,
  isActive: leagueData.isActive ?? true,
  applicableTypes: leagueData.applicableTypes || [],
  group: leagueData.group || 'ligas',  // NEW
  createdAt: now,
  updatedAt: now
};
```

Note: The `updateLeague` controller already uses `...updateData` spread, so it will persist `group` on updates without changes.

Group values and their display:
- `ligas` — "Ligas de Futbol" (icon: `mdi:soccer`)
- `deportes` — "Mas Deportes" (icon: `mdi:trophy-outline`)
- `accesorios` — "Indumentaria y Accesorios" (icon: `mdi:tshirt-crew`)

### 2. Data Migration

Existing 15 leagues in Firebase lack the `group` field. Strategy:

- The `transformLeague` function defaults to `group: 'ligas'` for unmigrated documents, so the page won't break on deploy
- After deploying the back-office changes, manually set the correct group for each league via the edit modal:
  - `ligas`: Futbol Argentino, Premier League, La Liga, Serie A, Bundesliga, Brasileirao, Resto del Mundo
  - `deportes`: Selecciones, Basquet, Otros Deportes
  - `accesorios`: Pelotas, Guantes, Botines, Abrigos, Ropa de Entrenamiento

This avoids needing a migration script — the fallback default keeps things safe during the transition.

### 3. Categories Page Redesign (`apps/home/pages/categories/index.vue`)

**Header:**
- Title: "Explora por Categoria"
- Subtitle: "Toda nuestra coleccion organizada para vos"

**`useHead` update:**
- Title: "Categorias - Cruzar Deportes"
- Meta description updated to reflect all categories, not just leagues

**Layout: Grouped sections with icon + divider header (style A2)**

Each section has:
- Section header: small icon box (28x28px, bg-gray-100, rounded-md) + section label (font-semibold) + horizontal divider line (flex-1, h-px, bg-gray-200)
- 3-column responsive grid of category cards (1-col on mobile, 2-col md, 3-col lg)

**Section rendering order:** ligas first, deportes second, accesorios third.
Within each group, leagues sorted by their existing `order` field.
Empty groups (no active leagues in that group) are hidden.

**Section icons (imports):**
```typescript
import IconSoccer from '~icons/mdi/soccer'
import IconTrophyOutline from '~icons/mdi/trophy-outline'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
```

**Section config (defined in component):**
```typescript
const sectionConfig = [
  { group: 'ligas', label: 'Ligas de Futbol', icon: IconSoccer },
  { group: 'deportes', label: 'Mas Deportes', icon: IconTrophyOutline },
  { group: 'accesorios', label: 'Indumentaria y Accesorios', icon: IconTshirtCrew },
]
```

**Category cards (simplified from current):**
- Dark gradient background (from-gray-800 to-black), no CZ logo placeholder
- League name (text-base font-medium, white)
- Product count (text-sm, white/50 opacity)
- "Comprar ahora" + arrow icon on hover
- Each card links to `/categories/${league.slug}`

**Section icons:** All from existing MDI icon library (unplugin-icons). No emojis anywhere.

### 4. Back-Office Changes (`apps/back-office/pages/leagues/index.vue`)

**Table:**
- Add "Grupo" column between "Tipos Aplicables" and "Orden"
- Display as a colored badge with the group's display name

**Create/Edit Modal (`formData` and functions):**
- Add `group` to `formData` initialization (default: `'ligas'`)
- Add `group` to `openCreateModal` default values
- Add `group` to `openEditModal` destructuring
- Add a "Grupo" `<select>` dropdown in the form (required), placed before the "Orden" field
- Options: "Ligas de Futbol" (`ligas`), "Mas Deportes" (`deportes`), "Indumentaria y Accesorios" (`accesorios`)

### 5. Breadcrumb Consistency (`apps/home/pages/categories/[slug].vue`)

Update the breadcrumb text on line 11 from "Ligas" to "Categorias" to match the renamed parent page.

### What is NOT changing

- Hero section pills on the home page (jersey leagues only, no "Otros Productos" pills)
- `/products` page filtering
- `/categories/[slug].vue` detail page logic (only the breadcrumb text changes)
- AppHeader navigation links
- GridSkeleton component (the existing `type="category"` skeleton is adequate for the grouped layout)
- Any other pages or components

## Technical Notes

- Framework: Nuxt 3 (Vue 3) with Pinia stores
- Styling: Tailwind CSS with Poppins font
- Icons: unplugin-icons with MDI and Heroicons sets (no emojis — they render inconsistently across browsers/OS)
- Backend: Express API with Firebase (Firestore)
- The `catalogLoader` utility and products store already handle leagues — the `group` field is added to the transform pipeline
- The `order` field remains global (not per-group); non-contiguous numbers within a group are acceptable
