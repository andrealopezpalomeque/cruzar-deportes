export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Initialize auth on client side
  if (process.client && !authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  // If trying to access a protected route without authentication, redirect to login
  if (to.path !== '/login' && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
