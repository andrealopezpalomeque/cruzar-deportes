const toastState = reactive({
  toasts: []
})

export const useToast = () => {
  let toastId = 0

  const showToast = (toast) => {
    const id = `toast-${toastId++}`
    const toastItem = {
      ...toast,
      id,
      show: true,
      duration: toast.duration || 5000
    }

    toastState.toasts.push(toastItem)

    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id)
    }, toastItem.duration)
  }

  const removeToast = (id) => {
    const index = toastState.toasts.findIndex(t => t.id === id)
    if (index > -1) {
      const toast = toastState.toasts[index]
      if (toast) {
        toast.show = false
      }
      // Remove from array after animation
      setTimeout(() => {
        const currentIndex = toastState.toasts.findIndex(t => t.id === id)
        if (currentIndex > -1) {
          toastState.toasts.splice(currentIndex, 1)
        }
      }, 300)
    }
  }

  const success = (title, message) => {
    showToast({ type: 'success', title, message })
  }

  const error = (title, message) => {
    showToast({ type: 'error', title, message })
  }

  const warning = (title, message) => {
    showToast({ type: 'warning', title, message })
  }

  const info = (title, message) => {
    showToast({ type: 'info', title, message })
  }

  return {
    toasts: readonly(toastState.toasts),
    success,
    error,
    warning,
    info,
    removeToast
  }
}

// Global toast helpers
export const toast = {
  success: (title, options) => {
    const { success } = useToast()
    success(title, options?.message)
  },
  error: (title, options) => {
    const { error } = useToast()
    error(title, options?.message)
  },
  warning: (title, options) => {
    const { warning } = useToast()
    warning(title, options?.message)
  },
  info: (title, options) => {
    const { info } = useToast()
    info(title, options?.message)
  }
}
