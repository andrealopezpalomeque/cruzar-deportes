import { ofetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const customFetch = ofetch.create({
    credentials: 'include'
  })

  // Make sure global $fetch uses credentials by default
  ;(globalThis as any).$fetch = customFetch

  return {
    provide: {
      fetch: customFetch
    }
  }
})
