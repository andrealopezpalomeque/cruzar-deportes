<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ligas</h1>
        <p class="text-sm text-gray-500 mt-1">Gestiona las ligas y categorias de equipos</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        <IconPlus class="w-4 h-4 mr-2" />
        Nueva Liga
      </button>
    </div>

    <!-- Leagues Table -->
    <div class="card">
      <div class="card-body p-0">
        <!-- Loading State -->
        <div v-if="loading && leagues.length === 0" class="p-8 text-center">
          <div class="spinner w-8 h-8 text-gray-900 mx-auto mb-4"></div>
          <p class="text-gray-500">Cargando ligas...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="leagues.length === 0" class="p-8 text-center">
          <IconTrophy class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No hay ligas</p>
          <button @click="openCreateModal" class="mt-4 btn btn-secondary">
            Crear primera liga
          </button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipos Aplicables
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="league in leagues" :key="league.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ league.name }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <code class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{{ league.slug }}</code>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="typeSlug in league.applicableTypes"
                      :key="typeSlug"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ getProductTypeName(typeSlug) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ league.order }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="league.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ league.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button @click="openEditModal(league)" class="text-blue-600 hover:text-blue-800">
                    Editar
                  </button>
                  <button @click="confirmDelete(league)" class="text-red-600 hover:text-red-800">
                    Eliminar
                  </button>
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
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingLeague ? 'Editar Liga' : 'Nueva Liga' }}
          </h3>

          <form @submit.prevent="saveLeague" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="input"
                placeholder="Ej: Premier League"
                @input="generateSlug"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                v-model="formData.slug"
                type="text"
                required
                class="input"
                placeholder="Ej: premier-league"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipos de Producto Aplicables</label>
              <div class="space-y-2 mt-2">
                <div v-for="type in productTypes" :key="type.slug" class="flex items-center">
                  <input
                    type="checkbox"
                    :id="`type-${type.slug}`"
                    :value="type.slug"
                    v-model="formData.applicableTypes"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label :for="`type-${type.slug}`" class="ml-2 block text-sm text-gray-900">
                    {{ type.name }}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Orden</label>
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
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="isActive" class="ml-2 block text-sm text-gray-900">Activo</label>
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
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="relative inline-block w-full max-w-sm p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Eliminar Liga</h3>
          <p class="text-sm text-gray-500 mb-4">
            ¿Seguro que quieres eliminar "{{ leagueToDelete?.name }}"? Esta accion no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button @click="showDeleteModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="deleteLeagueItem" class="btn btn-danger" :disabled="deleting">
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
import IconTrophy from '~icons/mdi/trophy-outline'

definePageMeta({
  middleware: 'auth'
})

const { loading, loadLeagues, createLeague, updateLeague, deleteLeague } = useLeagues()
const { loadProductTypes } = useProductTypes()

const leagues = ref([])
const productTypes = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingLeague = ref(null)
const leagueToDelete = ref(null)
const saving = ref(false)
const deleting = ref(false)

const formData = ref({
  name: '',
  slug: '',
  order: 0,
  isActive: true,
  applicableTypes: []
})

const getProductTypeName = (slug) => {
  const type = productTypes.value.find(t => t.slug === slug)
  return type?.name || slug
}

const generateSlug = () => {
  if (!editingLeague.value) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

const openCreateModal = () => {
  editingLeague.value = null
  formData.value = {
    name: '',
    slug: '',
    order: leagues.value.length + 1,
    isActive: true,
    applicableTypes: []
  }
  showModal.value = true
}

const openEditModal = (league) => {
  editingLeague.value = league
  formData.value = {
    name: league.name,
    slug: league.slug,
    order: league.order,
    isActive: league.isActive,
    applicableTypes: [...(league.applicableTypes || [])]
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingLeague.value = null
}

const saveLeague = async () => {
  try {
    saving.value = true
    if (editingLeague.value) {
      await updateLeague(editingLeague.value.id, formData.value)
    } else {
      await createLeague(formData.value)
    }
    await refreshList()
    closeModal()
  } catch (err) {
    console.error('Error saving league:', err)
    alert('Error al guardar: ' + err.message)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (league) => {
  leagueToDelete.value = league
  showDeleteModal.value = true
}

const deleteLeagueItem = async () => {
  try {
    deleting.value = true
    await deleteLeague(leagueToDelete.value.id)
    await refreshList()
    showDeleteModal.value = false
    leagueToDelete.value = null
  } catch (err) {
    console.error('Error deleting league:', err)
    alert('Error al eliminar: ' + err.message)
  } finally {
    deleting.value = false
  }
}

const refreshList = async () => {
  try {
    leagues.value = await loadLeagues()
  } catch (err) {
    console.error('Error loading leagues:', err)
  }
}

const loadTypes = async () => {
  try {
    productTypes.value = await loadProductTypes()
  } catch (err) {
    console.error('Error loading product types:', err)
  }
}

onMounted(() => {
  refreshList()
  loadTypes()
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @apply border-transparent text-white bg-gray-900 hover:bg-gray-800 focus:ring-gray-500;
}

.btn-secondary {
  @apply border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500;
}

.btn-danger {
  @apply border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500;
}

.input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}

.spinner {
  @apply animate-spin rounded-full border-2 border-gray-200 border-t-current;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.card-body {
  @apply px-6 py-4;
}
</style>
