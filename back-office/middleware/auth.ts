export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Initialize auth on client side
  if (process.client && !authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login']

  // If trying to access a protected route without authentication
  if (!publicRoutes.includes(to.path) && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo('/')
  }
})