<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between px-6 py-6 border-b border-gray-200/60 bg-gradient-to-r from-white to-gray-50/50">
          <div class="flex items-center">
            <img
              src="/cruzar-logo-no-bg.png"
              alt="Cruzar Deportes"
              class="h-16 w-auto object-contain mr-3"
            />
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Cruzar Deportes
              </h1>
              <p class="text-xs text-gray-500 font-medium">Back Office</p>
            </div>
          </div>
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IconClose class="w-5 h-5" />
          </button>
        </div>

        <!-- User Info -->
        <div class="px-6 py-4 border-b border-gray-200/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img
                v-if="authStore.currentUser?.username === 'tati_valesani'"
                src="/tati_valesani.png"
                alt="Administrator"
                class="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-blue-500/20"
                style="object-position: center 10%;"
              />
              <div v-else class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <IconAccount class="w-[18px] h-[18px] text-white" />
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-semibold text-gray-900">
                {{ authStore.currentUser?.username || 'Admin' }}
              </p>
              <p class="text-xs text-blue-600 font-medium">
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
              <span>Gestión de Productos</span>
            </NuxtLink>
          </div>

          <div class="border-t border-gray-200/60 pt-6 mt-6">
            <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Herramientas
            </p>
            <div class="space-y-1">
              <NuxtLink
                to="/settings"
                class="nav-link"
                :class="{ active: $route.path.startsWith('/settings') }"
                @click="closeSidebarOnMobile"
              >
                <IconCog class="w-5 h-5" />
                <span>Configuración</span>
              </NuxtLink>
            </div>
          </div>
        </nav>

        <!-- Logout Button -->
        <div class="p-6 border-t border-gray-200/60">
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-red-200 hover:border-red-300"
            :disabled="authStore.loading"
          >
            <IconLogout class="w-[18px] h-[18px] mr-2" />
            <span>Cerrar Sesión</span>
            <div v-if="authStore.loading" class="ml-2">
              <div class="spinner w-4 h-4"></div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    />

    <!-- Main Content -->
    <div class="lg:pl-64 min-h-screen">
      <!-- Mobile Header -->
      <div class="lg:hidden sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <IconMenu class="w-5 h-5" />
          </button>
          <h1 class="text-lg font-semibold text-gray-900">
            {{ pageTitle }}
          </h1>
          <div class="w-8"></div> <!-- Placeholder for alignment -->
        </div>
      </div>

      <!-- Page Header (Desktop) -->
      <div class="hidden lg:block bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ pageTitle }}
              </h1>
              <p v-if="pageDescription" class="mt-1 text-sm text-gray-500">
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
      class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div class="spinner w-12 h-12 text-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconClose from '~icons/mdi/close'
import IconAccount from '~icons/mdi/account'
import IconViewDashboard from '~icons/mdi/view-dashboard'
import IconCog from '~icons/mdi/cog'
import IconLogout from '~icons/mdi/logout'
import IconMenu from '~icons/mdi/menu'

// Composables
const authStore = useAuthStore()
const { success: toastSuccess, error: toastError } = useToast()
const route = useRoute()
const router = useRouter()

// State
const sidebarOpen = ref(false)
const globalLoading = ref(false)

// Computed
const pageTitle = computed(() => {
  const titleMap = {
    '/': 'Dashboard',
    '/products': 'Gestión de Productos',
    '/settings': 'Configuración'
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
    '/settings': 'Configuración del sistema'
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
