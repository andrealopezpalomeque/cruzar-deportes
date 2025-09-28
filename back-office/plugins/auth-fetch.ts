import { ofetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const customFetch = ofetch.create({
    async onRequest({ options }) {
      options.credentials = 'include'

      const token = authStore.sessionToken
      if (token) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`
        }
      }
    }
  })

  // Override global $fetch used by auto-imports
  // eslint-disable-next-line no-global-assign
  ;(globalThis as any).$fetch = customFetch

  return {
    provide: {
      fetch: customFetch
    }
  }
})
