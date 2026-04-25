<template>
  <div class="space-y-6">
    <!-- Back Button & Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="p-2 rounded-md text-ink-subtle hover:text-ink-light hover:bg-surface-warm transition-colors"
        >
          <IconArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="font-display text-2xl font-bold uppercase tracking-tight text-ink">
            Orden {{ order?.orderNumber || '...' }}
          </h1>
          <p v-if="order" class="text-sm text-ink-muted">
            Creada el {{ formatDate(order.createdAt) }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="showDeleteConfirm = true"
          class="btn btn-danger"
          :disabled="loading"
        >
          <IconDelete class="w-4 h-4 mr-2" />
          Eliminar
        </button>
        <button
          @click="saveOrder"
          class="btn btn-primary"
          :disabled="loading || !hasChanges"
        >
          <IconContentSave class="w-4 h-4 mr-2" />
          Guardar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !order" class="card">
      <div class="card-body p-8 text-center">
        <div class="spinner w-8 h-8 text-ink mx-auto mb-4"></div>
        <p class="text-ink-muted">Cargando orden...</p>
      </div>
    </div>

    <!-- Order Not Found -->
    <div v-else-if="!order && !loading" class="card">
      <div class="card-body p-8 text-center">
        <IconPackageVariantClosed class="w-12 h-12 text-ink-subtle mx-auto mb-4" />
        <p class="text-ink-muted">Orden no encontrada</p>
        <button @click="goBack" class="btn btn-secondary mt-4">
          Volver a ordenes
        </button>
      </div>
    </div>

    <!-- Order Content -->
    <template v-else-if="order">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Customer Info & Products -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer Info -->
          <div class="card">
            <div class="card-header">
              <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink flex items-center">
                <IconAccount class="w-5 h-5 mr-2 text-ink-subtle" />
                Datos del Cliente
              </h3>
            </div>
            <div class="card-body">
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-ink-muted">Nombre</dt>
                  <dd class="text-sm text-ink">{{ order.customer?.name || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-ink-muted">Telefono</dt>
                  <dd class="text-sm text-ink">
                    <div v-if="order.customer?.phone" class="flex items-center gap-3">
                      <a
                        :href="`tel:${order.customer.phone}`"
                        class="text-ink hover:text-ink underline"
                      >
                        {{ order.customer.phone }}
                      </a>
                      <a
                        :href="getWhatsAppUrl(order.customer.phone)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-sage-600 hover:bg-brand-sage-700 text-white text-xs font-medium rounded-lg transition-colors"
                        title="Abrir conversacion en WhatsApp"
                      >
                        <IconWhatsapp class="w-4 h-4" />
                        WhatsApp
                      </a>
                    </div>
                    <span v-else>-</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-ink-muted">Email</dt>
                  <dd class="text-sm text-ink">
                    <a
                      v-if="order.customer?.email"
                      :href="`mailto:${order.customer.email}`"
                      class="text-ink hover:text-ink underline"
                    >
                      {{ order.customer.email }}
                    </a>
                    <span v-else>-</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-ink-muted">Direccion</dt>
                  <dd class="text-sm text-ink">{{ order.customer?.address || '-' }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Products -->
          <div class="card">
            <div class="card-header">
              <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink flex items-center">
                <IconTshirtCrew class="w-5 h-5 mr-2 text-ink-subtle" />
                Productos ({{ order.items?.length || 0 }})
              </h3>
            </div>
            <div class="card-body p-0">
              <table class="min-w-full divide-y divide-surface-muted">
                <thead class="bg-surface-warm/40">
                  <tr>
                    <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Producto
                    </th>
                    <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Talla
                    </th>
                    <th class="px-6 py-3 text-right font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Cantidad
                    </th>
                    <th class="px-6 py-3 text-right font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Precio Unit.
                    </th>
                    <th class="px-6 py-3 text-right font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-surface-muted">
                  <tr v-for="(item, index) in order.items" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-ink">
                      {{ item.productName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      {{ item.size }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-ink text-right">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-ink-muted text-right">
                      ${{ formatNumber(item.unitPrice) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink text-right">
                      ${{ formatNumber(item.subtotal) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-surface-warm/40">
                  <tr>
                    <td colspan="4" class="px-6 py-4 text-sm font-medium text-ink text-right">
                      Total Original:
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-ink text-right">
                      ${{ formatNumber(order.totalAmount) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column: Status & Management -->
        <div class="space-y-6">
          <!-- Status & Quick Actions -->
          <div class="card">
            <div class="card-header">
              <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink">Estado de la Orden</h3>
            </div>
            <div class="card-body space-y-4">
              <!-- Current Status Badge -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-ink-muted">Estado actual:</span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusBadgeClass(editableOrder.status)"
                >
                  {{ getStatusLabel(editableOrder.status) }}
                </span>
              </div>

              <!-- Status Selector -->
              <div>
                <label class="block text-sm font-medium text-ink-light mb-2">
                  Cambiar estado:
                </label>
                <select
                  v-model="editableOrder.status"
                  class="w-full px-3 py-2 border border-surface-muted rounded-md shadow-sm focus:ring-brand-orange-500/30 focus:border-brand-orange-500"
                >
                  <option
                    v-for="status in ORDER_STATUSES"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
              </div>

              <!-- Contactado Status -->
              <div class="flex items-center justify-between py-2 border-t border-surface-muted">
                <div>
                  <span class="text-sm text-ink-light font-medium">Cliente contactado</span>
                  <p class="text-xs text-ink-muted">Marcar cuando recibas el WhatsApp del cliente</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="editableOrder.contactado"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-surface-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-orange-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-sage-600"></div>
                </label>
              </div>

              <!-- Payment Method -->
              <div class="flex items-center justify-between py-2 border-t border-surface-muted">
                <span class="text-sm text-ink-muted">Metodo de pago:</span>
                <span class="text-sm text-ink">
                  {{ paymentMethodLabel }}
                </span>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="card">
            <div class="card-header">
              <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink">Monto</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-ink-muted">Total productos:</span>
                <span class="text-sm text-ink">${{ formatNumber(order.totalAmount) }}</span>
              </div>

              <div>
                <label class="block text-sm font-medium text-ink-light mb-2">
                  Monto ajustado (descuentos):
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-muted">$</span>
                  <input
                    v-model.number="editableOrder.adjustedAmount"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full pl-7 pr-3 py-2 border border-surface-muted rounded-md shadow-sm focus:ring-brand-orange-500/30 focus:border-brand-orange-500"
                  />
                </div>
              </div>

              <div
                v-if="editableOrder.adjustedAmount !== order.totalAmount"
                class="p-3 bg-brand-orange-50 rounded-md"
              >
                <p class="text-sm text-brand-orange-800">
                  Descuento aplicado: ${{ formatNumber(order.totalAmount - editableOrder.adjustedAmount) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="card">
            <div class="card-header">
              <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink">Notas</h3>
            </div>
            <div class="card-body">
              <textarea
                v-model="editableOrder.notes"
                rows="4"
                placeholder="Agregar notas sobre la conversacion de WhatsApp, acuerdos, etc..."
                class="w-full px-3 py-2 border border-surface-muted rounded-md shadow-sm focus:ring-brand-orange-500/30 focus:border-brand-orange-500"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-brand-coral-100 rounded-full mb-4">
          <IconAlertCircle class="w-6 h-6 text-brand-coral-600" />
        </div>
        <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink text-center mb-2">
          Eliminar Orden
        </h3>
        <p class="text-sm text-ink-muted text-center mb-6">
          ¿Estas seguro de que deseas eliminar la orden {{ order?.orderNumber }}?
          Esta accion no se puede deshacer.
        </p>
        <div class="flex space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 btn btn-danger"
            :disabled="loading"
          >
            {{ loading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconArrowLeft from '~icons/mdi/arrow-left'
import IconDelete from '~icons/mdi/delete'
import IconContentSave from '~icons/mdi/content-save'
import IconPackageVariantClosed from '~icons/mdi/package-variant-closed'
import IconAccount from '~icons/mdi/account'
import IconTshirtCrew from '~icons/mdi/tshirt-crew'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconWhatsapp from '~icons/mdi/whatsapp'

// Define page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const route = useRoute()
const router = useRouter()
const { success: toastSuccess, error: toastError } = useToast()
const {
  loading,
  loadOrder,
  updateOrder,
  deleteOrder,
  getStatusLabel,
  getStatusColor,
  ORDER_STATUSES
} = useOrders()

// State
const order = ref(null)
const editableOrder = ref({
  status: 'nuevo',
  adjustedAmount: 0,
  notes: '',
  contactado: false
})
const showDeleteConfirm = ref(false)

// Computed
const hasChanges = computed(() => {
  if (!order.value) return false
  return (
    editableOrder.value.status !== order.value.status ||
    editableOrder.value.adjustedAmount !== order.value.adjustedAmount ||
    editableOrder.value.notes !== (order.value.notes || '') ||
    editableOrder.value.contactado !== (order.value.contactado || false)
  )
})

const paymentMethodLabel = computed(() => {
  const methods = {
    transfer: 'Transferencia bancaria',
    cash: 'Efectivo',
    card: 'Tarjeta de credito/debito'
  }
  return methods[order.value?.paymentMethod] || order.value?.paymentMethod || '-'
})

// Methods
const getStatusBadgeClass = (status) => {
  const color = getStatusColor(status)
  const colorMap = {
    blue: 'bg-brand-olive-100 text-brand-olive-800',
    yellow: 'bg-brand-orange-100 text-brand-orange-800',
    green: 'bg-brand-sage-100 text-brand-sage-800',
    purple: 'bg-brand-coral-100 text-brand-coral-800',
    orange: 'bg-brand-orange-100 text-brand-orange-800',
    red: 'bg-brand-coral-100 text-brand-coral-800',
    gray: 'bg-surface-muted text-ink-light'
  }
  return colorMap[color] || colorMap.gray
}

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('es-AR')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const getWhatsAppUrl = (phone) => {
  if (!phone) return '#'
  // Remove all non-numeric characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  return `https://wa.me/${cleanPhone}`
}

const goBack = () => {
  router.push('/orders')
}

const loadOrderData = async () => {
  try {
    const orderId = route.params.id
    const data = await loadOrder(orderId)
    if (data) {
      order.value = data
      editableOrder.value = {
        status: data.status || 'nuevo',
        adjustedAmount: data.adjustedAmount ?? data.totalAmount ?? 0,
        notes: data.notes || '',
        contactado: data.contactado || false
      }
    }
  } catch (err) {
    console.error('Error loading order:', err)
    toastError('Error al cargar la orden')
  }
}

const saveOrder = async () => {
  try {
    const orderId = route.params.id
    await updateOrder(orderId, {
      status: editableOrder.value.status,
      adjustedAmount: editableOrder.value.adjustedAmount,
      notes: editableOrder.value.notes,
      contactado: editableOrder.value.contactado
    })
    toastSuccess('Orden actualizada correctamente')
    await loadOrderData()
  } catch (err) {
    console.error('Error saving order:', err)
    toastError('Error al guardar la orden')
  }
}

const confirmDelete = async () => {
  try {
    const orderId = route.params.id
    await deleteOrder(orderId)
    toastSuccess('Orden eliminada correctamente')
    showDeleteConfirm.value = false
    router.push('/orders')
  } catch (err) {
    console.error('Error deleting order:', err)
    toastError('Error al eliminar la orden')
  }
}

// Load order on mount
onMounted(() => {
  loadOrderData()
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @apply border-transparent text-white bg-brand-orange-600 hover:bg-brand-orange-700 focus:ring-brand-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply border-surface-muted text-ink-light bg-white hover:bg-surface-warm/50 focus:ring-brand-orange-500/30;
}

.btn-danger {
  @apply border-transparent text-white bg-brand-coral-600 hover:bg-brand-coral-700 focus:ring-brand-coral-500/30 disabled:opacity-50 disabled:cursor-not-allowed;
}

.spinner {
  @apply animate-spin rounded-full border-2 border-surface-muted border-t-current;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-surface-muted;
}

.card-header {
  @apply px-6 py-4 border-b border-surface-muted;
}

.card-body {
  @apply px-6 py-4;
}
</style>
