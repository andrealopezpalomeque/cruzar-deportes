<template>
  <div class="min-h-screen bg-surface-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Decorative accents -->
    <div class="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-brand-orange-100/60 rounded-full blur-3xl" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-brand-coral-100/50 rounded-full blur-3xl" aria-hidden="true"></div>

    <div class="max-w-md w-full space-y-8 relative">
      <div class="text-center">
        <img
          src="/cruzar-logo-no-bg.png"
          alt="Cruzar Deportes"
          class="h-20 w-auto mx-auto mb-4"
        />
        <h1 class="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-ink mb-2 leading-none">
          Cruzar Deportes
        </h1>
        <p class="font-display text-sm font-semibold uppercase tracking-widest text-brand-orange-600 mb-6">
          Back Office
        </p>
        <p class="text-sm text-ink-muted">
          Administra tu catálogo de camisetas deportivas
        </p>
      </div>

      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="username" class="form-label">
                Usuario
              </label>
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                required
                class="form-input"
                :class="{ 'border-brand-coral-500 focus:border-brand-coral-500 focus:ring-brand-coral-500/30': authStore.error }"
                placeholder="Ingresa tu usuario"
                :disabled="authStore.loading"
              >
            </div>

            <div>
              <label for="password" class="form-label">
                Contraseña
              </label>
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                required
                class="form-input"
                :class="{ 'border-brand-coral-500 focus:border-brand-coral-500 focus:ring-brand-coral-500/30': authStore.error }"
                placeholder="Ingresa tu contraseña"
                :disabled="authStore.loading"
              >
            </div>

            <div v-if="authStore.error" class="form-error">
              {{ authStore.error }}
            </div>

            <button
              type="submit"
              class="btn btn-brand w-full btn-lg"
              :disabled="authStore.loading || !canSubmit"
            >
              <div v-if="authStore.loading" class="spinner mr-2"></div>
              <IconLogin v-else class="mr-2 w-5 h-5" />
              {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-xs text-ink-muted">
              Acceso restringido solo para administradores
            </p>
          </div>
        </div>
      </div>

      <div class="text-center text-xs text-ink-subtle">
        <p>
          © {{ new Date().getFullYear() }} Cruzar Deportes. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconLogin from '~icons/mdi/login'

// Define page meta
definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Composables
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

// State
const credentials = ref({
  username: '',
  password: ''
})

// Computed
const canSubmit = computed(() => {
  return credentials.value.username.length > 0 &&
         credentials.value.password.length > 0
})

// Methods
const handleLogin = async () => {
  authStore.clearError()

  const success = await authStore.login(credentials.value)

  if (success) {
    toast.success('¡Bienvenido al Back Office!')

    // Redirect to dashboard
    await router.push('/')
  } else {
    // Error is handled by the store
    toast.error('Error al iniciar sesión')
  }
}

// Clear any errors when component mounts
onMounted(() => {
  authStore.clearError()
})
</script>
