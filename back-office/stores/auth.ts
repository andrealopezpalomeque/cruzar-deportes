import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginCredentials } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<{ username: string; loginTime: string } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // Call the login API endpoint
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (response.success) {
        user.value = {
          username: credentials.username,
          loginTime: new Date().toISOString()
        }

        // Store auth state in localStorage for persistence (24 hours)
        if (process.client) {
          localStorage.setItem('backoffice_auth', JSON.stringify(user.value))
        }

        return true
      } else {
        error.value = response.error || 'Invalid credentials'
        return false
      }
    } catch (err: any) {
      error.value = err.data?.error || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    user.value = null
    error.value = null

    if (process.client) {
      localStorage.removeItem('backoffice_auth')
    }
  }

  const initializeAuth = (): void => {
    if (!process.client) return

    try {
      const storedAuth = localStorage.getItem('backoffice_auth')

      if (storedAuth) {
        const authData = JSON.parse(storedAuth)

        // Check if the session is still valid (24 hours)
        const loginTime = new Date(authData.loginTime).getTime()
        const currentTime = new Date().getTime()
        const hoursDiff = (currentTime - loginTime) / (1000 * 60 * 60)

        if (hoursDiff < 24) {
          user.value = authData
        } else {
          // Session expired, clear storage
          localStorage.removeItem('backoffice_auth')
        }
      }
    } catch (err) {
      console.error('Error initializing auth:', err)
      localStorage.removeItem('backoffice_auth')
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    isAuthenticated,

    // Actions
    login,
    logout,
    initializeAuth,
    clearError
  }
})
