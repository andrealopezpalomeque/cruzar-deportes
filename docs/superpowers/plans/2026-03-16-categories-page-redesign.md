# Categories Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `/categories` page from a flat "Comprar por Liga" card grid into a grouped sections layout showing all 15 leagues organized by group (Ligas de Futbol, Mas Deportes, Indumentaria y Accesorios).

**Architecture:** Add a `group` field to the League data model across all layers (API controller, catalog loader, types, store). Redesign the categories index page to render leagues in grouped sections with icon+divider headers. Update the back-office leagues page to manage the new group field.

**Tech Stack:** Nuxt 3, Vue 3, Pinia, Tailwind CSS, unplugin-icons (MDI), Express API, Firebase Firestore

**Spec:** `docs/superpowers/specs/2026-03-16-categories-page-redesign.md`

**Note:** This project has no test framework configured. Verification is done by running the dev server and checking the UI manually.

---

## Chunk 1: Data Model — Add `group` field across all layers

### Task 1: Add `group` to home app League type

**Files:**
- Modify: `apps/home/types/index.ts:29-36`

- [ ] **Step 1: Add `group` field to the League interface**

In `apps/home/types/index.ts`, add the `group` field to the `League` interface after `applicableTypes`:

```typescript
export interface League {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
  applicableTypes: string[]
  group: 'ligas' | 'deportes' | 'accesorios'
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/home/types/index.ts
git commit -m "feat: add group field to home League type"
```

---

### Task 2: Add `group` to back-office League type

**Files:**
- Modify: `apps/back-office/types/index.ts:35-44`

- [ ] **Step 1: Add `group` field to the back-office League interface**

In `apps/back-office/types/index.ts`, add the `group` field to the `League` interface after `applicableTypes`:

```typescript
export interface League {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
  applicableTypes: string[]
  group: 'ligas' | 'deportes' | 'accesorios'
  createdAt?: string
  updatedAt?: string
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/back-office/types/index.ts
git commit -m "feat: add group field to back-office League type"
```

---

### Task 3: Update catalogLoader to pass through `group`

**Files:**
- Modify: `apps/home/utils/catalogLoader.ts:49-56` (ApiLeague interface)
- Modify: `apps/home/utils/catalogLoader.ts:144-153` (transformLeague function)

- [ ] **Step 1: Add `group` to the `ApiLeague` interface**

In `apps/home/utils/catalogLoader.ts`, update the `ApiLeague` interface (around line 49):

```typescript
interface ApiLeague {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
  applicableTypes: string[]
  group: 'ligas' | 'deportes' | 'accesorios'
}
```

- [ ] **Step 2: Add `group` to the `transformLeague` function**

In the same file, update `transformLeague` (around line 144) to pass through the `group` field with a fallback:

```typescript
const transformLeague = (apiLeague: ApiLeague): League => {
  return {
    id: apiLeague.id,
    name: apiLeague.name,
    slug: apiLeague.slug,
    order: apiLeague.order,
    isActive: apiLeague.isActive,
    applicableTypes: apiLeague.applicableTypes || [],
    group: apiLeague.group || 'ligas'
  }
}
```

The `|| 'ligas'` fallback ensures existing leagues without the field don't break the app.

- [ ] **Step 3: Commit**

```bash
git add apps/home/utils/catalogLoader.ts
git commit -m "feat: pass group field through catalogLoader with fallback"
```

---

### Task 4: Add `group` to API createLeague controller

**Files:**
- Modify: `services/api/src/controllers/leagueController.js:89-97`

- [ ] **Step 1: Add `group` to the createLeague allowlist**

In `services/api/src/controllers/leagueController.js`, find the `newLeague` object inside `createLeague` (around line 89) and add the `group` field:

```javascript
    const newLeague = {
      name: leagueData.name || '',
      slug: leagueData.slug || '',
      order: leagueData.order ?? 0,
      isActive: leagueData.isActive ?? true,
      applicableTypes: leagueData.applicableTypes || [],
      group: leagueData.group || 'ligas',
      createdAt: now,
      updatedAt: now
    };
```

Note: `updateLeague` already uses `...updateData` spread, so it will persist `group` on updates without changes.

- [ ] **Step 2: Commit**

```bash
git add services/api/src/controllers/leagueController.js
git commit -m "feat: add group to createLeague API allowlist"
```

---

## Chunk 2: Back-Office — Manage `group` field

### Task 5: Add Grupo column and form field to back-office leagues page

**Files:**
- Modify: `apps/back-office/pages/leagues/index.vue`

This task modifies the leagues management page to display and edit the `group` field.

- [ ] **Step 1: Add a helper function for group display names**

Add this function in the `<script setup>` section, after the existing `getProductTypeName` function (around line 252):

```javascript
const groupLabels = {
  ligas: 'Ligas de Futbol',
  deportes: 'Mas Deportes',
  accesorios: 'Indumentaria y Accesorios'
}

const getGroupLabel = (group) => {
  return groupLabels[group] || group || 'Sin grupo'
}
```

- [ ] **Step 2: Add the "Grupo" column to the table header**

In the `<thead>` section, add a new `<th>` for "Grupo" between the "Tipos Aplicables" column (around line 40) and the "Orden" column (around line 43):

```html
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
```

- [ ] **Step 3: Add the "Grupo" cell to the table body**

In the `<tbody>` section, add a new `<td>` for the group badge between the "Tipos Aplicables" cell and the "Orden" cell. Insert after the closing `</td>` of the applicableTypes cell (around line 71):

```html
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800': league.group === 'ligas',
                      'bg-purple-100 text-purple-800': league.group === 'deportes',
                      'bg-amber-100 text-amber-800': league.group === 'accesorios',
                      'bg-gray-100 text-gray-800': !league.group
                    }"
                  >
                    {{ getGroupLabel(league.group) }}
                  </span>
                </td>
```

- [ ] **Step 4: Add `group` to `formData` initialization**

Update the `formData` ref (around line 244) to include `group`:

```javascript
const formData = ref({
  name: '',
  slug: '',
  order: 0,
  isActive: true,
  applicableTypes: [],
  group: 'ligas'
})
```

- [ ] **Step 5: Add `group` to `openCreateModal`**

Update `openCreateModal` (around line 268) to include `group` in the reset:

```javascript
const openCreateModal = () => {
  editingLeague.value = null
  formData.value = {
    name: '',
    slug: '',
    order: leagues.value.length + 1,
    isActive: true,
    applicableTypes: [],
    group: 'ligas'
  }
  showModal.value = true
}
```

- [ ] **Step 6: Add `group` to `openEditModal`**

Update `openEditModal` (around line 280) to include `group`:

```javascript
const openEditModal = (league) => {
  editingLeague.value = league
  formData.value = {
    name: league.name,
    slug: league.slug,
    order: league.order,
    isActive: league.isActive,
    applicableTypes: [...(league.applicableTypes || [])],
    group: league.group || 'ligas'
  }
  showModal.value = true
}
```

- [ ] **Step 7: Add the "Grupo" select dropdown to the modal form**

In the create/edit modal form, add the group dropdown BEFORE the "Orden" field (around line 163, before the `<div>` containing the Orden label). Insert this block:

```html
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
              <select
                v-model="formData.group"
                required
                class="input"
              >
                <option value="ligas">Ligas de Futbol</option>
                <option value="deportes">Mas Deportes</option>
                <option value="accesorios">Indumentaria y Accesorios</option>
              </select>
            </div>
```

- [ ] **Step 8: Verify in browser**

Run the back-office dev server and check:
1. The leagues table now shows a "Grupo" column with colored badges
2. Opening the create modal shows the "Grupo" dropdown defaulting to "Ligas de Futbol"
3. Editing an existing league shows its current group (or "Ligas de Futbol" for unmigrated ones)
4. Saving a league with a changed group persists correctly

- [ ] **Step 9: Commit**

```bash
git add apps/back-office/pages/leagues/index.vue
git commit -m "feat: add group column and form field to back-office leagues"
```

---

## Chunk 3: Storefront — Redesign categories page

### Task 6: Rewrite the categories index page with grouped sections

**Files:**
- Modify: `apps/home/pages/categories/index.vue` (full rewrite of template and script)

- [ ] **Step 1: Rewrite the full component**

Replace the entire content of `apps/home/pages/categories/index.vue` with:

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
        <!-- Section Header: icon box + label + divider line -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
            <component :is="section.icon" class="w-4 h-4 text-gray-600" />
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
            <div class="bg-gradient-to-br from-gray-800 to-black rounded-lg p-6 hover:from-gray-700 hover:to-gray-900 transition-all duration-300">
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

const productsStore = useProductsStore()

const sectionConfig = [
  { group: 'ligas', label: 'Ligas de Futbol', icon: IconSoccer },
  { group: 'deportes', label: 'Mas Deportes', icon: IconTrophyOutline },
  { group: 'accesorios', label: 'Indumentaria y Accesorios', icon: IconTshirtCrew },
]

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
1. Title reads "Explora por Categoria"
2. Sections appear with icon + label + divider line headers
3. All leagues show in their correct groups (initially all in "Ligas de Futbol" until migration)
4. Cards show league name, product count, and "Comprar ahora" on hover
5. Cards link correctly to `/categories/${slug}`
6. Mobile responsive: 1-col on small screens, 2-col on md, 3-col on lg

- [ ] **Step 3: Commit**

```bash
git add apps/home/pages/categories/index.vue
git commit -m "feat: redesign categories page with grouped sections layout"
```

---

### Task 7: Update breadcrumb in category detail page

**Files:**
- Modify: `apps/home/pages/categories/[slug].vue:11`

- [ ] **Step 1: Change breadcrumb text from "Ligas" to "Categorias"**

In `apps/home/pages/categories/[slug].vue`, find line 11:

```html
          <NuxtLink to="/categories" class="text-gray-500 hover:text-gray-700">Ligas</NuxtLink>
```

Change "Ligas" to "Categorias":

```html
          <NuxtLink to="/categories" class="text-gray-500 hover:text-gray-700">Categorias</NuxtLink>
```

- [ ] **Step 2: Verify in browser**

Navigate to any category detail page (e.g., `/categories/futbol-argentino`) and confirm the breadcrumb shows "Inicio / Categorias / Futbol Argentino".

- [ ] **Step 3: Commit**

```bash
git add apps/home/pages/categories/[slug].vue
git commit -m "fix: update breadcrumb text from Ligas to Categorias"
```

---

## Post-Implementation: Data Migration

After all code changes are deployed:

1. Open the back-office leagues page
2. Edit each league and set the correct group:
   - **Ligas de Futbol** (`ligas`): Futbol Argentino, Premier League, La Liga, Serie A, Bundesliga, Brasileirao, Resto del Mundo
   - **Mas Deportes** (`deportes`): Selecciones, Basquet, Otros Deportes
   - **Indumentaria y Accesorios** (`accesorios`): Pelotas, Guantes, Botines, Abrigos, Ropa de Entrenamiento
3. Verify the categories page shows all 3 sections correctly
