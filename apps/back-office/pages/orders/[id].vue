<template>
  <div class="space-y-6">
    <!-- Back Button & Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <IconArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Orden {{ order?.orderNumber || '...' }}
          </h1>
          <p v-if="order" class="text-sm text-gray-500">
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
        <div class="spinner w-8 h-8 text-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Cargando orden...</p>
      </div>
    </div>

    <!-- Order Not Found -->
    <div v-else-if="!order && !loading" class="card">
      <div class="card-body p-8 text-center">
        <IconPackageVariantClosed class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">Orden no encontrada</p>
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
              <h3 class="text-lg font-medium text-gray-900 flex items-center">
                <IconAccount class="w-5 h-5 mr-2 text-gray-400" />
                Datos del Cliente
              </h3>
            </div>
            <div class="card-body">
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Nombre</dt>
                  <dd class="text-sm text-gray-900">{{ order.customer?.name || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Telefono</dt>
                  <dd class="text-sm text-gray-900">
                    <a
                      v-if="order.customer?.phone"
                      :href="`tel:${order.customer.phone}`"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      {{ order.customer.phone }}
                    </a>
                    <span v-else>-</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="text-sm text-gray-900">
                    <a
                      v-if="order.customer?.email"
                      :href="`mailto:${order.customer.email}`"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      {{ order.customer.email }}
                    </a>
                    <span v-else>-</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Direccion</dt>
                  <dd class="text-sm text-gray-900">{{ order.customer?.address || '-' }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Products -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900 flex items-center">
                <IconTshirtCrew class="w-5 h-5 mr-2 text-gray-400" />
                Productos ({{ order.items?.length || 0 }})
              </h3>
            </div>
            <div class="card-body p-0">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Talla
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Precio Unit.
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in order.items" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.productName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ item.size }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ${{ formatNumber(item.unitPrice) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ${{ formatNumber(item.subtotal) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="4" class="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      Total Original:
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900 text-right">
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
              <h3 class="text-lg font-medium text-gray-900">Estado de la Orden</h3>
            </div>
            <div class="card-body space-y-4">
              <!-- Current Status Badge -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Estado actual:</span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusBadgeClass(editableOrder.status)"
                >
                  {{ getStatusLabel(editableOrder.status) }}
                </span>
              </div>

              <!-- Status Selector -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar estado:
                </label>
                <select
                  v-model="editableOrder.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              <div class="flex items-center justify-between py-2 border-t border-gray-200">
                <div>
                  <span class="text-sm text-gray-700 font-medium">Cliente contactado</span>
                  <p class="text-xs text-gray-500">Marcar cuando recibas el WhatsApp del cliente</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="editableOrder.contactado"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <!-- Payment Method -->
              <div class="flex items-center justify-between py-2 border-t border-gray-200">
                <span class="text-sm text-gray-500">Metodo de pago:</span>
                <span class="text-sm text-gray-900">
                  {{ paymentMethodLabel }}
                </span>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Monto</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Total productos:</span>
                <span class="text-sm text-gray-900">${{ formatNumber(order.totalAmount) }}</span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Monto ajustado (descuentos):
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    v-model.number="editableOrder.adjustedAmount"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div
                v-if="editableOrder.adjustedAmount !== order.totalAmount"
                class="p-3 bg-yellow-50 rounded-md"
              >
                <p class="text-sm text-yellow-800">
                  Descuento aplicado: ${{ formatNumber(order.totalAmount - editableOrder.adjustedAmount) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Notas</h3>
            </div>
            <div class="card-body">
              <textarea
                v-model="editableOrder.notes"
                rows="4"
                placeholder="Agregar notas sobre la conversacion de WhatsApp, acuerdos, etc..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <IconAlertCircle class="w-6 h-6 text-red-600" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">
          Eliminar Orden
        </h3>
        <p class="text-sm text-gray-500 text-center mb-6">
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
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
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
  @apply border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500;
}

.btn-danger {
  @apply border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.spinner {
  @apply animate-spin rounded-full border-2 border-gray-200 border-t-current;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.card-body {
  @apply px-6 py-4;
}
</style>
