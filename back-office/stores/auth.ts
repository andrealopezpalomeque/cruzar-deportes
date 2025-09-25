import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, LoginCredentials } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value?.isAuthenticated)
  const currentUser = computed(() => user.value)

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

      if (response.success && response.data) {
        user.value = {
          username: credentials.username,
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        }

        // Store auth state in localStorage for persistence
        const authData = {
          username: credentials.username,
          isAuthenticated: true,
          loginTime: user.value.loginTime
        }

        if (process.client) {
          localStorage.setItem('backoffice_auth', JSON.stringify(authData))
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

  const logout = async (): Promise<void> => {
    loading.value = true

    try {
      // Call logout API endpoint
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear user state
      user.value = null
      error.value = null
      loading.value = false

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('backoffice_auth')
      }
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

        if (hoursDiff < 24 && authData.isAuthenticated) {
          user.value = authData
        } else {
          // Session expired, clear storage
          localStorage.removeItem('backoffice_auth')
        }
      }
    } catch (err) {
      console.error('Error initializing auth:', err)
      // Clear corrupted auth data
      localStorage.removeItem('backoffice_auth')
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  const validateSession = async (): Promise<boolean> => {
    if (!user.value?.isAuthenticated) return false

    try {
      const response = await $fetch('/api/auth/validate', {
        method: 'GET'
      })

      if (response.success) {
        return true
      } else {
        // Session invalid, logout
        await logout()
        return false
      }
    } catch (err) {
      // Session validation failed, logout
      await logout()
      return false
    }
  }

  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    isAuthenticated,
    currentUser,

    // Actions
    login,
    logout,
    initializeAuth,
    clearError,
    validateSession
  }
})