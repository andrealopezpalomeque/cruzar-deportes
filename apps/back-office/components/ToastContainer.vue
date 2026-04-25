<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Transition
        v-for="toast in toasts"
        :key="toast.id"
        name="toast"
        appear
      >
        <div
          v-if="toast.show"
          class="max-w-sm bg-white shadow-lg shadow-ink/10 rounded-sm border-l-4 border border-surface-muted overflow-hidden"
          :class="getToastClass(toast.type)"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component
                  :is="getToastIcon(toast.type)"
                  class="w-5 h-5"
                  :class="getIconClass(toast.type)"
                />
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-semibold text-ink">
                  {{ toast.title }}
                </p>
                <p v-if="toast.message" class="mt-1 text-sm text-ink-muted">
                  {{ toast.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <button
                  @click="removeToast(toast.id)"
                  class="inline-flex text-ink-subtle hover:text-ink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange-500"
                >
                  <IconClose class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Progress bar -->
          <div
            class="h-1 bg-surface-muted"
            :class="getProgressBarClass(toast.type)"
          >
            <div
              class="h-full transition-all duration-[5000ms] ease-linear"
              :class="{
                'w-0': toast.show,
                'w-full': !toast.show
              }"
            ></div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import IconCheckCircle from '~icons/mdi/check-circle'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconAlert from '~icons/mdi/alert'
import IconInformation from '~icons/mdi/information'
import IconClose from '~icons/mdi/close'

const { toasts, removeToast } = useToast()

const toastIconMap = {
  success: IconCheckCircle,
  error: IconAlertCircle,
  warning: IconAlert,
  info: IconInformation
}

const getToastIcon = (type) => {
  return toastIconMap[type] || IconInformation
}

const getToastClass = (type) => {
  const classMap = {
    success: 'border-l-brand-sage-500',
    error: 'border-l-brand-coral-500',
    warning: 'border-l-brand-orange-500',
    info: 'border-l-brand-olive-500'
  }
  return classMap[type] || 'border-l-ink-subtle'
}

const getIconClass = (type) => {
  const classMap = {
    success: 'text-brand-sage-600',
    error: 'text-brand-coral-600',
    warning: 'text-brand-orange-600',
    info: 'text-brand-olive-600'
  }
  return classMap[type] || 'text-ink-muted'
}

const getProgressBarClass = (type) => {
  const classMap = {
    success: 'bg-brand-sage-100',
    error: 'bg-brand-coral-100',
    warning: 'bg-brand-orange-100',
    info: 'bg-brand-olive-100'
  }
  return classMap[type] || 'bg-surface-muted'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
