import { toast } from '~/composables/useToast'

export default defineNuxtPlugin(() => {
  // Make toast globally available
  return {
    provide: {
      toast
    }
  }
})