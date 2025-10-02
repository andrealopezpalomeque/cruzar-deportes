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
          class="max-w-sm bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
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
                <p class="text-sm font-medium text-gray-900">
                  {{ toast.title }}
                </p>
                <p v-if="toast.message" class="mt-1 text-sm text-gray-600">
                  {{ toast.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <button
                  @click="removeToast(toast.id)"
                  class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <IconClose class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Progress bar -->
          <div
            class="h-1 bg-gray-100"
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
    success: 'border-green-200',
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200'
  }
  return classMap[type] || 'border-gray-200'
}

const getIconClass = (type) => {
  const classMap = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }
  return classMap[type] || 'text-gray-500'
}

const getProgressBarClass = (type) => {
  const classMap = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100'
  }
  return classMap[type] || 'bg-gray-100'
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
