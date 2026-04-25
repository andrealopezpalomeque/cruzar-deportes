<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-end">
      <button @click="openCreateModal" class="btn btn-primary">
        <IconPlus class="w-4 h-4 mr-2" />
        Nuevo Tipo
      </button>
    </div>

    <!-- Product Types Table -->
    <div class="card">
      <div class="card-body p-0">
        <!-- Loading State -->
        <div v-if="loading && productTypes.length === 0" class="p-8 text-center">
          <div class="spinner w-8 h-8 text-ink mx-auto mb-4"></div>
          <p class="text-ink-muted">Cargando tipos de producto...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="productTypes.length === 0" class="p-8 text-center">
          <IconTag class="w-12 h-12 text-ink-subtle mx-auto mb-4" />
          <p class="text-ink-muted">No hay tipos de producto</p>
          <button @click="openCreateModal" class="mt-4 btn btn-secondary">
            Crear primer tipo
          </button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-surface-muted">
            <thead class="bg-surface-warm/40">
              <tr>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Nombre
                </th>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Slug
                </th>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Orden
                </th>
                <th class="px-6 py-3 text-left font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Estado
                </th>
                <th class="px-6 py-3 text-right font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-surface-muted">
              <tr v-for="type in productTypes" :key="type.id" class="hover:bg-surface-warm/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-ink">{{ type.name }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <code class="text-sm text-ink-light bg-surface-warm px-2 py-1 rounded">{{ type.slug }}</code>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                  {{ type.order }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="type.isActive ? 'bg-brand-sage-100 text-brand-sage-800' : 'bg-surface-warm text-ink'"
                  >
                    {{ type.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="openEditModal(type)"
                      class="p-1.5 rounded-md text-ink-subtle hover:text-brand-orange-600 hover:bg-brand-olive-50 transition-colors"
                      title="Editar"
                    >
                      <IconPencil class="w-4 h-4" />
                    </button>
                    <button
                      @click="confirmDelete(type)"
                      class="p-1.5 rounded-md text-ink-subtle hover:text-brand-coral-700 hover:bg-brand-coral-50 transition-colors"
                      title="Eliminar"
                    >
                      <IconDelete class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeModal">
          <div class="absolute inset-0 bg-ink opacity-75"></div>
        </div>

        <div class="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink mb-4">
            {{ editingType ? 'Editar Tipo de Producto' : 'Nuevo Tipo de Producto' }}
          </h3>

          <form @submit.prevent="saveProductType" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-ink-light mb-1">Nombre</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="input"
                placeholder="Ej: Camisetas"
                @input="generateSlug"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-ink-light mb-1">Slug</label>
              <input
                v-model="formData.slug"
                type="text"
                required
                class="input"
                placeholder="Ej: camisetas"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-ink-light mb-1">Orden</label>
              <input
                v-model.number="formData.order"
                type="number"
                min="0"
                class="input"
              />
            </div>

            <div class="flex items-center">
              <input
                v-model="formData.isActive"
                type="checkbox"
                id="isActive"
                class="h-4 w-4 text-brand-orange-600 focus:ring-brand-orange-500/30 border-surface-muted rounded"
              />
              <label for="isActive" class="ml-2 block text-sm text-ink">Activo</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showDeleteModal = false">
          <div class="absolute inset-0 bg-ink opacity-75"></div>
        </div>

        <div class="relative inline-block w-full max-w-sm p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <h3 class="font-display text-lg font-bold uppercase tracking-tight text-ink mb-2">Eliminar Tipo de Producto</h3>
          <p class="text-sm text-ink-muted mb-4">
            ¿Seguro que quieres eliminar "{{ typeToDelete?.name }}"? Esta accion no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button @click="showDeleteModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="deleteType" class="btn btn-danger" :disabled="deleting">
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconPlus from '~icons/mdi/plus'
import IconTag from '~icons/mdi/tag-outline'
import IconPencil from '~icons/mdi/pencil'
import IconDelete from '~icons/mdi/delete'

definePageMeta({
  middleware: 'auth'
})

const { loading, loadProductTypes, createProductType, updateProductType, deleteProductType } = useProductTypes()

const productTypes = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingType = ref(null)
const typeToDelete = ref(null)
const saving = ref(false)
const deleting = ref(false)

const formData = ref({
  name: '',
  slug: '',
  order: 0,
  isActive: true
})

const generateSlug = () => {
  if (!editingType.value) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

const openCreateModal = () => {
  editingType.value = null
  formData.value = { name: '', slug: '', order: productTypes.value.length + 1, isActive: true }
  showModal.value = true
}

const openEditModal = (type) => {
  editingType.value = type
  formData.value = {
    name: type.name,
    slug: type.slug,
    order: type.order,
    isActive: type.isActive
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingType.value = null
}

const saveProductType = async () => {
  try {
    saving.value = true
    if (editingType.value) {
      await updateProductType(editingType.value.id, formData.value)
    } else {
      await createProductType(formData.value)
    }
    await refreshList()
    closeModal()
  } catch (err) {
    console.error('Error saving product type:', err)
    alert('Error al guardar: ' + err.message)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (type) => {
  typeToDelete.value = type
  showDeleteModal.value = true
}

const deleteType = async () => {
  try {
    deleting.value = true
    await deleteProductType(typeToDelete.value.id)
    await refreshList()
    showDeleteModal.value = false
    typeToDelete.value = null
  } catch (err) {
    console.error('Error deleting product type:', err)
    alert('Error al eliminar: ' + err.message)
  } finally {
    deleting.value = false
  }
}

const refreshList = async () => {
  try {
    productTypes.value = await loadProductTypes()
  } catch (err) {
    console.error('Error loading product types:', err)
  }
}

onMounted(() => {
  refreshList()
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @apply border-transparent text-white bg-ink hover:bg-ink focus:ring-brand-orange-500/30;
}

.btn-secondary {
  @apply border-surface-muted text-ink-light bg-white hover:bg-surface-warm/50 focus:ring-brand-orange-500/30;
}

.btn-danger {
  @apply border-transparent text-white bg-brand-coral-600 hover:bg-brand-coral-700 focus:ring-brand-orange-500/30;
}

.input {
  @apply block w-full px-3 py-2 border border-surface-muted rounded-md shadow-sm focus:ring-brand-orange-500/30 focus:border-brand-orange-500 sm:text-sm;
}

.spinner {
  @apply animate-spin rounded-full border-2 border-surface-muted border-t-current;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-surface-muted;
}

.card-body {
  @apply px-6 py-4;
}
</style>
