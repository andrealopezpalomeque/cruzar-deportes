<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Cruzar Deportes
        </h1>
        <h2 class="text-xl text-gray-600 mb-8">
          Back Office
        </h2>
        <p class="text-sm text-gray-500">
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
                :class="{ 'border-red-500': authStore.error }"
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
                :class="{ 'border-red-500': authStore.error }"
                placeholder="Ingresa tu contraseña"
                :disabled="authStore.loading"
              >
            </div>

            <div v-if="authStore.error" class="form-error">
              {{ authStore.error }}
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full btn-lg"
              :disabled="authStore.loading || !canSubmit"
            >
              <div v-if="authStore.loading" class="spinner mr-2"></div>
              <IconLogin v-else class="mr-2 w-5 h-5" />
              {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
              Acceso restringido solo para administradores
            </p>
          </div>
        </div>
      </div>

      <div class="text-center text-xs text-gray-400">
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
