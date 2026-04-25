<template>
  <div class="min-h-screen bg-surface-cream">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl shadow-ink/5 border-r border-surface-muted transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between px-6 py-6 border-b border-surface-muted bg-surface-cream">
          <div class="flex items-center">
            <img
              src="/cruzar-logo-no-bg.png"
              alt="Cruzar Deportes"
              class="h-16 w-auto object-contain mr-3"
            />
            <div>
              <h1 class="font-display text-xl font-bold uppercase tracking-tight text-ink leading-none">
                Cruzar Deportes
              </h1>
              <p class="font-display text-[10px] font-semibold uppercase tracking-widest text-brand-orange-600 mt-1">Back Office</p>
            </div>
          </div>
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-warm transition-colors"
          >
            <IconClose class="w-5 h-5" />
          </button>
        </div>

        <!-- User Info -->
        <div class="px-6 py-4 border-b border-surface-muted bg-surface-warm/50">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img
                v-if="authStore.currentUser?.username === 'tati_valesani'"
                src="/tati_valesani.png"
                alt="Administrator"
                class="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-brand-orange-500/30"
                style="object-position: center 10%;"
              />
              <div v-else class="w-10 h-10 bg-ink rounded-full flex items-center justify-center shadow-md">
                <IconAccount class="w-[18px] h-[18px] text-surface-cream" />
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-semibold text-ink">
                {{ displayName }}
              </p>
              <p class="font-display text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                Administrador
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
          <div class="space-y-1">
            <NuxtLink
              to="/"
              class="nav-link"
              :class="{ active: $route.path === '/' }"
              @click="closeSidebarOnMobile"
            >
              <IconViewDashboard class="w-5 h-5" />
              <span>Dashboard</span>
            </NuxtLink>

            <NuxtLink
              to="/products/manage"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/products') }"
              @click="closeSidebarOnMobile"
            >
              <IconTshirtCrew class="w-5 h-5" />
              <span>Productos</span>
            </NuxtLink>

            <NuxtLink
              to="/orders"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/orders') }"
              @click="closeSidebarOnMobile"
            >
              <IconPackageVariant class="w-5 h-5" />
              <span>Ordenes</span>
            </NuxtLink>

            <NuxtLink
              to="/product-types"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/product-types') }"
              @click="closeSidebarOnMobile"
            >
              <IconTag class="w-5 h-5" />
              <span>Tipos</span>
            </NuxtLink>

            <NuxtLink
              to="/leagues"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/leagues') }"
              @click="closeSidebarOnMobile"
            >
              <IconTrophy class="w-5 h-5" />
              <span>Ligas</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Logout Button -->
        <div class="p-6 border-t border-surface-muted">
          <button
            @click="handleLogout"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-brand-coral-700 rounded-sm border border-brand-coral-200 hover:bg-brand-coral-50 hover:border-brand-coral-400 hover:text-brand-coral-800 transition-all duration-200"
            :disabled="authStore.loading"
          >
            <IconLogout class="w-[18px] h-[18px]" />
            <span>Cerrar Sesión</span>
            <div v-if="authStore.loading" class="ml-1">
              <div class="spinner w-4 h-4"></div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-ink bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    />

    <!-- Main Content -->
    <div class="lg:pl-64 min-h-screen">
      <!-- Mobile Header -->
      <div class="lg:hidden sticky top-0 z-40 bg-surface-cream/95 backdrop-blur-sm shadow-sm border-b border-surface-muted">
        <div class="flex items-center justify-between px-4 py-3">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-warm transition-colors"
          >
            <IconMenu class="w-5 h-5" />
          </button>
          <h1 class="font-display text-lg font-bold uppercase tracking-tight text-ink">
            {{ pageTitle }}
          </h1>
          <div class="w-8"></div>
        </div>
      </div>

      <!-- Page Header (Desktop) -->
      <div class="hidden lg:block bg-surface-cream/95 backdrop-blur-sm border-b border-surface-muted sticky top-0 z-30">
        <div class="px-6 py-5">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="font-display text-2xl font-bold uppercase tracking-tight text-ink leading-none">
                {{ pageTitle }}
              </h1>
              <p v-if="pageDescription" class="mt-2 text-sm text-ink-muted">
                {{ pageDescription }}
              </p>
            </div>

            <!-- Header Actions Slot -->
            <div class="flex items-center space-x-4">
              <slot name="header-actions" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <main class="flex-1 bg-transparent">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Global Loading Overlay -->
    <div
      v-if="globalLoading"
      class="fixed inset-0 bg-surface-cream bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div class="spinner w-12 h-12 text-brand-orange-600 mx-auto mb-4"></div>
        <p class="font-display text-sm font-semibold uppercase tracking-wider text-ink-muted">Cargando...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconClose from '~icons/mdi/close'
import IconAccount from '~icons/mdi/account'
import IconViewDashboard from '~icons/mdi/view-dashboard'
import IconLogout from '~icons/mdi/logout'
import IconMenu from '~icons/mdi/menu'
import IconPackageVariant from '~icons/mdi/package-variant'
import IconTag from '~icons/mdi/tag-outline'
import IconTrophy from '~icons/mdi/trophy-outline'

// Composables
const authStore = useAuthStore()
const { success: toastSuccess, error: toastError } = useToast()
const route = useRoute()
const router = useRouter()

// State
const sidebarOpen = ref(false)
const globalLoading = ref(false)

// Display name mapping for users
const userDisplayNames = {
  'tati_valesani': 'Tati Valesani'
}

// Computed
const displayName = computed(() => {
  const username = authStore.currentUser?.username
  if (!username) return 'Admin'
  return userDisplayNames[username] || username.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
})

const pageTitle = computed(() => {
  const titleMap = {
    '/': 'Dashboard',
    '/products': 'Productos',
    '/orders': 'Ordenes',
    '/product-types': 'Tipos de Producto',
    '/leagues': 'Ligas'
  }

  // Find matching route (handles dynamic routes)
  for (const [path, title] of Object.entries(titleMap)) {
    if (route.path === path || (path !== '/' && route.path.startsWith(path))) {
      return title
    }
  }

  return 'Back Office'
})

const pageDescription = computed(() => {
  const descriptionMap = {
    '/': 'Resumen general de tu tienda de camisetas deportivas',
    '/products': 'Administra imágenes, precios y estado de productos',
    '/orders': 'Gestiona pedidos y seguimiento de clientes',
    '/product-types': 'Gestiona los tipos de productos disponibles',
    '/leagues': 'Gestiona las ligas y categorías de equipos'
  }

  for (const [path, description] of Object.entries(descriptionMap)) {
    if (route.path === path || (path !== '/' && route.path.startsWith(path))) {
      return description
    }
  }

  return ''
})

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const closeSidebarOnMobile = () => {
  // Close sidebar on mobile after navigation
  if (process.client && window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

  const handleLogout = async () => {
    try {
      globalLoading.value = true
      await authStore.logout()

      toastSuccess('Sesión cerrada correctamente')

      await router.push('/login')
    } catch (error) {
      toastError('Error al cerrar sesión')
    } finally {
      globalLoading.value = false
    }
  }// Initialize auth on mount
onMounted(() => {
  authStore.initializeAuth()
})

// Handle window resize
onMounted(() => {
  if (process.client) {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        sidebarOpen.value = false
      }
    }

    window.addEventListener('resize', handleResize)

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
    })
  }
})

// Provide global loading state
provide('globalLoading', {
  loading: readonly(globalLoading),
  setLoading: (state) => {
    globalLoading.value = state
  }
})
</script>
