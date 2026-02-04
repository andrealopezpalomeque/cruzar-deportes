<template>
  <div class="p-6 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <!-- Product Type Dropdown -->
        <div class="relative">
          <button
            @click="isTypeDropdownOpen = !isTypeDropdownOpen"
            :class="[
              'group flex h-11 min-w-[180px] items-center justify-between gap-3 rounded-xl',
              'border border-gray-200/80 bg-white px-4 transition-all duration-200',
              'hover:border-gray-300 hover:shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:ring-offset-0',
              isTypeDropdownOpen && 'border-gray-300 shadow-sm'
            ]"
          >
            <span class="text-sm font-medium text-gray-900">
              {{ selectedProductType ? getProductTypeName(selectedProductType) : 'Todos los tipos' }}
            </span>
            <IconChevronDown
              :class="[
                'w-4 h-4 text-gray-500 transition-transform duration-200',
                isTypeDropdownOpen && 'rotate-180'
              ]"
            />
          </button>

          <Transition name="dropdown">
            <div v-if="isTypeDropdownOpen" class="relative z-[100]">
              <div class="fixed inset-0 z-[100]" @click="isTypeDropdownOpen = false" />
              <div class="absolute left-0 right-0 top-full z-[110] mt-2 rounded-xl border border-gray-200/80 bg-white shadow-lg shadow-gray-900/5 backdrop-blur-xl">
                <div class="max-h-80 overflow-y-auto custom-scroll">
                  <button
                    @click="selectProductType('')"
                    :class="[
                      'block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150',
                      !selectedProductType ? 'bg-gray-900 text-white font-medium' : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    Todos los tipos
                  </button>
                  <button
                    v-for="type in productTypes"
                    :key="type.slug"
                    @click="selectProductType(type.slug)"
                    :class="[
                      'block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150',
                      type.slug === selectedProductType ? 'bg-gray-900 text-white font-medium' : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    {{ type.name }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- League Dropdown -->
        <div class="relative">
          <button
            @click="isLeagueDropdownOpen = !isLeagueDropdownOpen"
            :class="[
              'group flex h-11 min-w-[180px] items-center justify-between gap-3 rounded-xl',
              'border border-gray-200/80 bg-white px-4 transition-all duration-200',
              'hover:border-gray-300 hover:shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:ring-offset-0',
              isLeagueDropdownOpen && 'border-gray-300 shadow-sm'
            ]"
          >
            <span class="text-sm font-medium text-gray-900">
              {{ selectedLeague ? getLeagueName(selectedLeague) : 'Todas las ligas' }}
            </span>
            <IconChevronDown
              :class="[
                'w-4 h-4 text-gray-500 transition-transform duration-200',
                isLeagueDropdownOpen && 'rotate-180'
              ]"
            />
          </button>

          <Transition name="dropdown">
            <div v-if="isLeagueDropdownOpen" class="relative z-[100]">
              <div class="fixed inset-0 z-[100]" @click="isLeagueDropdownOpen = false" />
              <div class="absolute left-0 right-0 top-full z-[110] mt-2 rounded-xl border border-gray-200/80 bg-white shadow-lg shadow-gray-900/5 backdrop-blur-xl">
                <div class="max-h-80 overflow-y-auto custom-scroll">
                  <button
                    @click="selectLeague('')"
                    :class="[
                      'block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150',
                      !selectedLeague ? 'bg-gray-900 text-white font-medium' : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    Todas las ligas
                  </button>
                  <button
                    v-for="league in filteredLeagueOptions"
                    :key="league.slug"
                    @click="selectLeague(league.slug)"
                    :class="[
                      'block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150',
                      league.slug === selectedLeague ? 'bg-gray-900 text-white font-medium' : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    {{ league.name }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Enhanced Search Input -->
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <IconSearch class="w-4 h-4 text-gray-400" />
          </div>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar productos..."
            :class="[
              'h-11 w-full sm:w-[320px] rounded-xl border border-gray-200/80 bg-white pl-11 pr-4',
              'text-sm text-gray-900 placeholder:text-gray-400',
              'transition-all duration-200',
              'hover:border-gray-300 hover:shadow-sm',
              'focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:ring-offset-0',
              searchTerm && 'border-gray-300 shadow-sm'
            ]"
          />
        </div>
      </div>

      <!-- Product Stats and Bulk Actions -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
          <span class="font-medium">Mostrando {{ currentRangeStart }}-{{ currentRangeEnd }} de {{ filteredProducts.length }} productos</span>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="openCreateProductModal"
            class="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-black transition-colors"
          >
            <IconPlus class="w-4 h-4" />
            Nuevo producto
          </button>

          <!-- Select All on Page -->
          <div
            v-if="!loading && !error && paginatedProducts.length > 0"
            class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2"
          >
            <label class="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                :checked="allOnPageSelected"
                :indeterminate="someOnPageSelected && !allOnPageSelected"
                @change="toggleSelectAllOnPage"
                class="sr-only"
              />
              <div
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  allOnPageSelected
                    ? 'bg-blue-600 border-blue-600'
                    : someOnPageSelected
                    ? 'bg-blue-100 border-blue-600'
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
                ]"
              >
                <IconCheck v-if="allOnPageSelected" class="w-3.5 h-3.5 text-white" />
                <IconMinus v-else-if="someOnPageSelected" class="w-3.5 h-3.5 text-blue-600" />
              </div>
            </label>
            <span class="text-sm text-gray-700 font-medium">
              Seleccionar página
            </span>
          </div>

          <!-- Bulk Actions -->
          <div
            v-if="selectedProducts.length > 0"
            class="flex flex-wrap items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
          >
            <span class="text-sm text-gray-700 font-medium">
              {{ selectedProducts.length }} {{ selectedProducts.length === 1 ? 'producto seleccionado' : 'productos seleccionados' }}
            </span>

            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="openBulkPricingModal"
                class="px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                <IconCashMultiple class="w-4 h-4" />
                <span>Editar precios</span>
              </button>
              <button
                @click="deleteSelectedProducts"
                :disabled="bulkDeleteState.deleting"
                :class="[
                  'px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 border text-red-700 bg-red-50 border-red-200',
                  bulkDeleteState.deleting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-100'
                ]"
              >
                <IconLoading
                  v-if="bulkDeleteState.deleting"
                  class="w-4 h-4 text-red-600 animate-spin"
                />
                <IconTrashCan
                  v-else
                  class="w-4 h-4"
                />
                <span>{{ bulkDeleteState.deleting ? 'Eliminando...' : 'Eliminar' }}</span>
              </button>

              <button
                @click="clearSelection"
                class="px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-white transition-colors border border-transparent"
              >
                Limpiar selección
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <IconLoading class="w-10 h-10 text-blue-500 animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-3">
        <IconAlertCircle class="w-6 h-6 text-red-500" />
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-else class="relative">
      <!-- Loading Overlay -->
      <Transition name="fade">
        <div
          v-if="isTransitioning"
          class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg"
        >
          <div class="flex flex-col items-center gap-3">
            <IconLoading class="w-10 h-10 text-blue-500 animate-spin" />
            <p class="text-sm text-gray-600 font-medium">Cargando productos...</p>
          </div>
        </div>
      </Transition>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          :class="[
            'relative bg-white rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden',
            isProductSelected(product.id)
              ? 'border-blue-500 bg-blue-50/30 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
        <!-- Selection Checkbox (top-left overlay) -->
        <div class="absolute top-4 left-4 z-10">
          <label class="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              :checked="isProductSelected(product.id)"
              @change="toggleProductSelection(product.id)"
              class="sr-only"
            />
            <div
              :class="[
                'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                isProductSelected(product.id)
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-gray-300 group-hover:border-blue-400'
              ]"
            >
              <IconCheck v-if="isProductSelected(product.id)" class="w-4 h-4 text-white" />
            </div>
          </label>
        </div>

        <!-- Product Header -->
        <div class="p-4 sm:p-5 border-b border-gray-100">
          <div class="flex flex-col gap-3">
            <div class="flex-1 space-y-3 pl-10">
              <!-- Category & Status Badges - Enhanced Row -->
              <div class="flex items-center gap-2.5 flex-wrap">
                <span v-if="product.productType" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm">
                  {{ getProductTypeName(product.productType) }}
                </span>
                <span v-if="product.league" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm">
                  {{ getLeagueName(product.league) }}
                </span>
                <span
                  v-if="product.featured"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-sm"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Destacado</span>
                </span>
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm',
                    product.inStock
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                  ]"
                >
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path v-if="product.inStock" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ product.inStock ? 'En stock' : 'A pedido' }}</span>
                </span>
              </div>

              <!-- Product Title - Inline Edit -->
              <div class="group relative">
                <div class="flex items-start gap-2">
                  <IconPencil class="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <input
                    v-model="product.name"
                    @input="markProductDirty(product)"
                    :disabled="isProductSaving(product.id)"
                    type="text"
                    class="flex-1 text-lg font-semibold text-gray-900 bg-gray-50 border border-gray-200 outline-none rounded-lg px-3 py-2 transition-all hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 disabled:opacity-60 disabled:cursor-wait cursor-text"
                    placeholder="Nombre del producto"
                  />
                </div>
              </div>

              <!-- Product Description - Inline Edit -->
              <div class="group relative">
                <div class="flex items-start gap-2">
                  <IconPencil class="w-4 h-4 text-gray-400 mt-2 flex-shrink-0" />
                  <textarea
                    v-model="product.description"
                    @input="markProductDirty(product)"
                    :disabled="isProductSaving(product.id)"
                    rows="2"
                    class="flex-1 text-sm text-gray-600 leading-relaxed bg-gray-50 border border-gray-200 outline-none resize-none rounded-lg px-3 py-2 transition-all hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 disabled:opacity-60 disabled:cursor-wait cursor-text"
                    placeholder="Agrega una descripción del producto..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Content -->
        <div class="p-4 sm:p-5 space-y-5">
          <!-- Images Management - Enhanced -->
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200 shadow-sm">
              <div class="flex items-center gap-3">
                <!-- Image Preview or Icon -->
                <div
                  v-if="(product.selectedImages || product.images || []).length > 0"
                  class="w-9 h-9 rounded-lg shadow-sm overflow-hidden ring-2 ring-sky-500/30"
                >
                  <img
                    :src="optimizeUrl((product.selectedImages || product.images || [])[0], 100)"
                    :alt="`${product.name} preview`"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="flex items-center justify-center w-9 h-9 rounded-lg shadow-sm bg-gradient-to-br from-gray-300 to-gray-400"
                >
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Galería</p>
                  <p
                    :class="[
                      'text-sm font-bold',
                      (product.selectedImages || product.images || []).length > 0 ? 'text-slate-700' : 'text-gray-500'
                    ]"
                  >
                    {{ (product.selectedImages || product.images || []).length > 0
                      ? `${(product.selectedImages || product.images || []).length} ${(product.selectedImages || product.images || []).length === 1 ? 'imagen' : 'imágenes'}`
                      : 'Sin imágenes' }}
                  </p>
                </div>
              </div>
              <button
                @click="openImageBrowser(product)"
                class="px-4 py-2 bg-gradient-to-r from-slate-700 to-gray-800 text-white text-xs rounded-lg hover:from-slate-800 hover:to-gray-900 transition-all shadow-md hover:shadow-lg font-semibold flex items-center gap-2 transform hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Gestionar</span>
              </button>
            </div>

          </div>

          <!-- Pricing Management -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900">Precios</h4>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-medium text-gray-600">Precio actual</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    v-model.number="product.price"
                    @input="markProductDirty(product)"
                    :disabled="isProductSaving(product.id)"
                    type="number"
                    step="100"
                    min="0"
                    class="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-300 transition-colors cursor-text disabled:opacity-60 disabled:cursor-wait"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-medium text-gray-600">Precio original</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    v-model.number="product.originalPrice"
                    @input="markProductDirty(product)"
                    :disabled="isProductSaving(product.id)"
                    type="number"
                    step="100"
                    min="0"
                    class="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-300 transition-colors cursor-text disabled:opacity-60 disabled:cursor-wait"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Status Toggles -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900">Configuración</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="text-sm font-medium text-gray-700">Destacado</span>
                <div class="flex items-center gap-2">
                  <IconLoading
                    v-if="isStatusLoading(product.id, 'featured')"
                    class="w-4 h-4 text-gray-500 animate-spin"
                  />
                  <button
                    @click="toggleProductStatus(product, 'featured')"
                    :disabled="isStatusLoading(product.id, 'featured')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
                      product.featured ? 'bg-gray-900' : 'bg-gray-300',
                      isStatusLoading(product.id, 'featured') ? 'opacity-50 cursor-wait' : ''
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
                        product.featured ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="text-sm font-medium text-gray-700">En stock</span>
                <div class="flex items-center gap-2">
                  <IconLoading
                    v-if="isStatusLoading(product.id, 'inStock')"
                    class="w-4 h-4 text-gray-500 animate-spin"
                  />
                  <button
                    @click="toggleProductStatus(product, 'inStock')"
                    :disabled="isStatusLoading(product.id, 'inStock')"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2',
                      product.inStock ? 'bg-green-600' : 'bg-gray-300',
                      isStatusLoading(product.id, 'inStock') ? 'opacity-50 cursor-wait' : ''
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
                        product.inStock ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Last Modified -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <span class="text-xs text-gray-500">Última modificación</span>
            <span class="text-xs font-medium text-gray-700">{{ formatDate(product.lastModified) }}</span>
          </div>

          <!-- Save/Cancel Buttons (shown when dirty) - Fixed at bottom of card -->
          <Transition name="fade">
            <div v-if="isProductDirty(product.id)" class="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
              <button
                @click="cancelProductChanges(product)"
                :disabled="isProductSaving(product.id)"
                class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-wait"
              >
                Cancelar
              </button>
              <button
                @click="saveProductChanges(product)"
                :disabled="isProductSaving(product.id)"
                :class="[
                  'px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2',
                  isProductSaving(product.id) ? 'opacity-60 cursor-wait' : 'hover:bg-gray-800'
                ]"
              >
                <IconLoading
                  v-if="isProductSaving(product.id)"
                  class="w-4 h-4 animate-spin"
                />
                <span>{{ isProductSaving(product.id) ? 'Guardando...' : 'Guardar todos los cambios' }}</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="!loading && !error && filteredProducts.length > 0" class="flex justify-center items-center gap-2 mt-8">
      <!-- Previous Button -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        Anterior
      </button>

      <!-- Page Numbers -->
      <div class="flex gap-1">
        <button
          v-for="(page, index) in pageNumbers"
          :key="index"
          @click="page !== '...' && goToPage(page)"
          :disabled="page === '...'"
          :class="[
            'min-w-[2.5rem] h-10 rounded-lg font-medium transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : page === '...'
              ? 'bg-transparent text-gray-400 cursor-default'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        Siguiente
      </button>
    </div>

    <!-- Image Browser Modal -->
    <Teleport to="body">
      <div
        v-if="showImageBrowser"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleModalOverlayClick"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          <div class="relative bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                Seleccionar Imágenes - {{ selectedProduct?.name }}
              </h3>
              <div class="flex items-center gap-3">
                <button
                  v-if="modalSelectedForDeletion.size > 0"
                  type="button"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="modalDeletionState.processing"
                  @click="handleModalBulkDelete"
                >
                  <IconLoading
                    v-if="modalDeletionState.processing"
                    class="w-4 h-4 text-gray-500 animate-spin"
                  />
                  <IconTrashCan
                    v-else
                    class="w-4 h-4"
                  />
                  <span>
                    {{ modalDeletionState.processing
                      ? 'Eliminando...'
                      : `Eliminar seleccionadas (${modalSelectedForDeletion.size})`
                    }}
                  </span>
                </button>
                <button
                  @click="handleModalClose"
                  :disabled="modalDeletionState.processing"
                  class="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <IconClose class="w-6 h-6" />
                </button>
              </div>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto">
              <!-- Upload Controls -->
              <div class="px-4 sm:px-6 pt-4 sm:pt-6">
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  multiple
                  ref="modalUploadInputRef"
                  @change="handleModalFilesSelected"
                />
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-900">Subí imágenes nuevas</p>
                    <p class="text-xs text-gray-500">
                      Se guardarán en <span class="font-mono text-[11px]">{{ selectedProduct ? getProductFolderPath(selectedProduct) : 'la carpeta del producto' }}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="modalUploadState.uploading || !selectedProduct"
                    @click="triggerModalUpload"
                  >
                    <IconCloudUpload class="w-4 h-4" />
                    <span>
                      {{ modalUploadState.uploading
                        ? `Subiendo ${modalUploadState.uploaded}/${modalUploadState.total}`
                        : 'Seleccionar archivos'
                      }}
                    </span>
                  </button>
                </div>
                <p
                  v-if="modalUploadState.uploading"
                  class="mt-2 text-xs text-gray-500"
                >
                  Esto puede tardar unos segundos...
                </p>
              </div>

              <!-- Selected Images (reorderable) -->
              <div v-if="tempSelectedImages.length" class="px-4 sm:px-6 pt-4 sm:pt-6">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-medium text-gray-900">Imágenes seleccionadas</h4>
                  <div class="flex items-center gap-3 text-xs text-gray-500">
                    <span>Arrastra para cambiar el orden</span>
                    <span class="hidden sm:inline">Click para marcarlas y eliminarlas en lote</span>
                  </div>
                </div>

                <div
                  class="flex flex-wrap gap-2 sm:gap-3"
                  @dragover.prevent="allowSelectedDrop"
                  @drop.prevent="handleSelectedListDrop"
                >
                  <div
                    v-for="(image, index) in tempSelectedImages"
                    :key="image"
                    class="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    draggable="true"
                    :class="[
                      draggingSelectedIndex === index ? 'ring-2 ring-blue-400 ring-offset-2' : '',
                      modalSelectedForDeletion.has(image) ? 'border-red-400 ring-2 ring-red-200' : ''
                    ]"
                    @dragstart="handleSelectedDragStart(index, $event)"
                    @dragover.prevent="allowSelectedDrop"
                    @drop.prevent="handleSelectedItemDrop(index, $event)"
                    @dragend="handleSelectedDragEnd"
                    @click="toggleModalImageSelection(image)"
                  >
                    <img
                      :src="optimizeUrl(image, 180)"
                      :alt="`Selected image ${index + 1}`"
                      class="w-full h-full object-cover pointer-events-none"
                    />

                    <span class="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-full">
                      {{ index + 1 }}
                    </span>

                    <div
                      v-if="modalSelectedForDeletion.has(image)"
                      class="absolute inset-0 bg-red-500/30 flex items-center justify-center text-white text-xs font-semibold"
                    >
                      Seleccionada
                    </div>
                    <button
                      v-if="!modalSelectedForDeletion.has(image)"
                      type="button"
                      @click.stop="removeFromSelection(image)"
                      class="absolute top-1 right-1 bg-white/90 text-gray-700 hover:text-red-600 hover:bg-white rounded-full p-1 shadow transition-colors"
                    >
                      <IconClose class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Available Images -->
              <div class="p-4 sm:p-6">
                <div v-if="loadingImages" class="flex justify-center py-8">
                  <IconLoading class="w-8 h-8 text-blue-500 animate-spin" />
                </div>

                <div v-else-if="availableImages.length > 0" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
                  <div
                    v-for="(image, index) in availableImages"
                    :key="index"
                    class="relative group aspect-square"
                  >
                    <img
                      :src="optimizeUrl(image, 150)"
                      :alt="`Available image ${index + 1}`"
                      class="w-full h-full object-cover rounded-lg border-2 cursor-pointer transition-all"
                      :class="[
                        isImageSelected(image) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                      ]"
                      @click="toggleImageSelection(image)"
                    />

                    <!-- Selection Indicator -->
                    <div
                      v-if="isImageSelected(image)"
                      class="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1"
                    >
                      <IconCheck class="w-3 h-3" />
                    </div>
                    <div
                      class="absolute top-1 left-1 flex gap-1"
                    >
                      <button
                        type="button"
                        class="bg-white/90 rounded-full p-1 shadow transition-colors"
                        :class="modalSelectedForDeletion.has(image) ? 'bg-red-50 text-red-600 ring-2 ring-red-500' : 'text-gray-700 hover:bg-red-100 hover:text-red-600'"
                        @click.stop="toggleModalImageSelection(image)"
                      >
                        <IconTrashCan
                          class="w-3 h-3"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-8">
                  <IconImageOff class="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p class="text-gray-500">No se encontraron imágenes disponibles</p>
                </div>
              </div>
            </div>

            <!-- Modal Footer - Fixed at bottom -->
            <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <p class="text-sm text-gray-600 text-center sm:text-left">
                {{ tempSelectedImages.length }} imágenes seleccionadas
              </p>

              <div class="flex gap-3">
                <button
                  @click="handleModalClose"
                  :disabled="modalDeletionState.processing || modalSaveState.saving"
                  class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  @click="saveImageSelection"
                  :disabled="modalSaveState.saving || modalDeletionState.processing"
                  class="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <IconLoading
                    v-if="modalSaveState.saving"
                    class="w-4 h-4 animate-spin text-white"
                  />
                  <span>{{ modalSaveState.saving ? 'Guardando...' : 'Guardar Selección' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Bulk Pricing Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showBulkPricingModal"
          class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
        >
          <div
            class="absolute inset-0 bg-black/40 backdrop-blur-sm"
            @click="closeBulkPricingModal"
          />
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
            <div class="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Actualización masiva
                </p>
                <h3 class="text-xl font-semibold text-gray-900 mt-1">
                  Editar precios ({{ selectedProducts.length }})
                </h3>
                <p class="text-sm text-gray-500 mt-2">
                  Define valores específicos o aplica un ajuste porcentual para los productos seleccionados.
                </p>
              </div>
              <button
                @click="closeBulkPricingModal"
                :disabled="bulkPricingState.saving"
                class="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <IconClose class="w-5 h-5" />
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 space-y-6">
              <div class="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200">
                <p class="text-sm font-medium text-gray-700">Resumen de selección</p>
                <ul class="mt-3 space-y-2">
                  <li
                    v-for="product in selectedProductPreview"
                    :key="product.id"
                    class="flex items-center justify-between text-sm text-gray-600"
                  >
                    <span class="truncate pr-3">{{ product.name }}</span>
                    <span class="text-gray-900 font-medium">
                      {{ formatPrice(product.price) }}
                    </span>
                  </li>
                </ul>
                <p
                  v-if="selectedProducts.length > selectedProductPreview.length"
                  class="mt-2 text-xs text-gray-500"
                >
                  + {{ selectedProducts.length - selectedProductPreview.length }} productos adicionales seleccionados
                </p>
              </div>

              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Modo de actualización
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label
                    class="flex items-start gap-3 border rounded-xl p-3 cursor-pointer transition-colors"
                    :class="bulkPricingForm.strategy === 'absolute' ? 'border-blue-500 bg-blue-50/60' : 'border-gray-200 hover:border-gray-300'"
                  >
                    <input
                      type="radio"
                      value="absolute"
                      v-model="bulkPricingForm.strategy"
                      class="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p class="text-sm font-semibold text-gray-900">Establecer valores</p>
                      <p class="text-xs text-gray-600">Define un nuevo precio y/o precio original fijo.</p>
                    </div>
                  </label>
                  <label
                    class="flex items-start gap-3 border rounded-xl p-3 cursor-pointer transition-colors"
                    :class="bulkPricingForm.strategy === 'percent' ? 'border-blue-500 bg-blue-50/60' : 'border-gray-200 hover:border-gray-300'"
                  >
                    <input
                      type="radio"
                      value="percent"
                      v-model="bulkPricingForm.strategy"
                      class="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p class="text-sm font-semibold text-gray-900">Ajustar por porcentaje</p>
                      <p class="text-xs text-gray-600">Incrementa o reduce los precios actuales en bloque.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div v-if="bulkPricingForm.strategy === 'absolute'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Nuevo precio</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      v-model.number="bulkPricingForm.priceValue"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="Sin cambios"
                      class="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p class="text-xs text-gray-500">Deja vacío para mantener el valor actual.</p>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Nuevo precio original</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      v-model.number="bulkPricingForm.originalPriceValue"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="Sin cambios"
                      class="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p class="text-xs text-gray-500">Opcional. Úsalo para precios tachados o comparativos.</p>
                </div>
              </div>

              <div v-else class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Porcentaje de ajuste</label>
                  <div class="relative">
                    <input
                      v-model.number="bulkPricingForm.percentageValue"
                      type="number"
                      step="0.5"
                      placeholder="Ej. 10 para +10% o -15 para -15%"
                      class="w-full pr-12 pl-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <p class="text-xs text-gray-500">Utiliza valores negativos para aplicar descuentos.</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                  <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      v-model="bulkPricingForm.applyToPrice"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Precio actual
                  </label>
                  <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      v-model="bulkPricingForm.applyToOriginalPrice"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Precio original
                  </label>
                </div>
              </div>
            </div>

            <div class="p-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p class="text-sm text-gray-500">
                {{ selectedProducts.length }} {{ selectedProducts.length === 1 ? 'producto' : 'productos' }} serán actualizados.
              </p>
              <div class="flex items-center gap-3">
                <button
                  @click="closeBulkPricingModal"
                  :disabled="bulkPricingState.saving"
                  class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  @click="applyBulkPricing"
                  :disabled="!isBulkPricingValid || bulkPricingState.saving"
                  :class="[
                    'px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-colors',
                    !isBulkPricingValid || bulkPricingState.saving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  ]"
                >
                  <IconLoading
                    v-if="bulkPricingState.saving"
                    class="w-4 h-4 animate-spin text-white"
                  />
                  <span>{{ bulkPricingState.saving ? 'Aplicando...' : 'Aplicar cambios' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ProductCreateModal
      :show="showCreateProductModal"
      :product-types="productTypes"
      :leagues="leagues"
      :existing-slugs="existingProductSlugs"
      :existing-ids="existingProductIds"
      @close="closeCreateProductModal"
      @created="handleNewProductCreated"
    />
  </div>
</template>

<script setup>
import IconLoading from '~icons/eos-icons/loading'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconClose from '~icons/mdi/close'
import IconImageOff from '~icons/mdi/image-off'
import IconImageMultiple from '~icons/mdi/image-multiple'
import IconCheck from '~icons/mdi/check'
import IconMinus from '~icons/mdi/minus'
import IconCashMultiple from '~icons/mdi/cash-multiple'
import IconPencil from '~icons/mdi/pencil'
import IconSearch from '~icons/mdi/magnify'
import IconChevronDown from '~icons/mdi/chevron-down'
import IconPlus from '~icons/mdi/plus'
import IconCloudUpload from '~icons/mdi/cloud-upload'
import IconTrashCan from '~icons/mdi/trash-can'
import { slugify } from '~/utils/slugify'
import { onBeforeRouteLeave } from 'vue-router'

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const {
  loadProducts,
  saveProduct,
  updateProduct,
  updateProductImages,
  updateProductPricing: updateProductPricingAPI,
  updateProductStatus,
  deleteProduct
} = useSharedProducts()
const { loadProductTypes } = useProductTypes()
const { loadLeagues, loadLeaguesByProductType } = useLeagues()
const { getFolderImages, uploadImage, deleteImage: deleteCloudinaryImage } = useCloudinary()
const toast = useToast()

// Helper to optimize Cloudinary URLs
const optimizeUrl = (url, size = 300) => {
  if (!url.includes('cloudinary.com')) {
    return url
  }
  // Use same optimization logic as home project
  return url.replace('/upload/', `/upload/c_thumb,w_${size},h_${size},g_face/`)
}

// Reactive state
const loading = ref(false)
const error = ref(null)
const products = ref([])
const searchTerm = ref('')
const selectedProducts = ref([])
const showBulkPricingModal = ref(false)
const showCreateProductModal = ref(false)

// Product types and leagues - loaded from API
const productTypes = ref([])
const leagues = ref([])
const selectedProductType = ref('')
const selectedLeague = ref('')
const isTypeDropdownOpen = ref(false)
const isLeagueDropdownOpen = ref(false)

// Load product types from API
const fetchProductTypes = async () => {
  try {
    const types = await loadProductTypes()
    productTypes.value = types.filter(t => t.isActive !== false)
  } catch (err) {
    console.error('Error loading product types:', err)
  }
}

// Load leagues from API
const fetchLeagues = async () => {
  try {
    const allLeagues = await loadLeagues()
    leagues.value = allLeagues.filter(l => l.isActive !== false)
  } catch (err) {
    console.error('Error loading leagues:', err)
  }
}

// Computed filtered leagues based on selected product type
const filteredLeagueOptions = computed(() => {
  if (!selectedProductType.value) return leagues.value
  return leagues.value.filter(l => l.applicableTypes?.includes(selectedProductType.value))
})

// Get product type name
const getProductTypeName = (typeSlug) => {
  const type = productTypes.value.find(t => t.slug === typeSlug)
  return type?.name || typeSlug || 'Sin tipo'
}

// Get league name
const getLeagueName = (leagueSlug) => {
  const league = leagues.value.find(l => l.slug === leagueSlug)
  return league?.name || leagueSlug || 'Sin liga'
}

// Select product type
const selectProductType = (value) => {
  selectedProductType.value = value
  selectedLeague.value = '' // Reset league when type changes
  isTypeDropdownOpen.value = false
}

// Select league
const selectLeague = (value) => {
  selectedLeague.value = value
  isLeagueDropdownOpen.value = false
}

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(20)
const isTransitioning = ref(false)

// Image browser state
const showImageBrowser = ref(false)
const selectedProduct = ref(null)
const availableImages = ref([])
const tempSelectedImages = ref([])
const loadingImages = ref(false)
const draggingSelectedIndex = ref(null)
const statusLoading = reactive({})
const bulkPricingForm = reactive({
  strategy: 'absolute',
  priceValue: null,
  originalPriceValue: null,
  percentageValue: null,
  applyToPrice: true,
  applyToOriginalPrice: false
})
const bulkPricingState = reactive({
  saving: false
})
const bulkDeleteState = reactive({
  deleting: false
})
const detailsLoading = reactive({})
const detailsSnapshots = reactive({})
const dirtyProducts = reactive({}) // Track which products have unsaved changes
const savingProducts = reactive({}) // Track which products are being saved
const modalUploadInputRef = ref(null)
const modalUploadState = reactive({
  uploading: false,
  uploaded: 0,
  total: 0
})
const modalDeletionState = reactive({
  processing: false
})
const modalSelectedForDeletion = ref(new Set())
const modalSaveState = reactive({
  saving: false
})
const existingProductSlugs = computed(() => products.value
  .map(product => (product.slug ?? '').toString())
  .filter(Boolean))
const existingProductIds = computed(() => products.value
  .map(product => product.id)
  .filter(Boolean))

const isDetailsLoading = (productId) => Boolean(detailsLoading[productId])
const isProductDirty = (productId) => Boolean(dirtyProducts[productId])
const isProductSaving = (productId) => Boolean(savingProducts[productId])
const isProductSelected = (productId) => selectedProducts.value.includes(productId)

const toggleProductSelection = (productId) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const clearSelection = () => {
  selectedProducts.value = []
}

// Select all products on current page
const allOnPageSelected = computed(() => {
  if (paginatedProducts.value.length === 0) return false
  return paginatedProducts.value.every(p => isProductSelected(p.id))
})

// Check if some (but not all) products on current page are selected
const someOnPageSelected = computed(() => {
  if (paginatedProducts.value.length === 0) return false
  return paginatedProducts.value.some(p => isProductSelected(p.id))
})

const toggleSelectAllOnPage = () => {
  const allSelected = allOnPageSelected.value

  if (allSelected) {
    // Deselect all products on current page
    const pageIds = new Set(paginatedProducts.value.map(p => p.id))
    selectedProducts.value = selectedProducts.value.filter(id => !pageIds.has(id))
  } else {
    // Select all products on current page
    paginatedProducts.value.forEach(p => {
      if (!isProductSelected(p.id)) {
        selectedProducts.value.push(p.id)
      }
    })
  }
}

const getProductFolderPath = (product) => {
  if (product.cloudinaryFolderPath) {
    return product.cloudinaryFolderPath
  }
  const normalizedSlug = slugify(product.slug || product.name || product.id || 'producto')
  const folderSegment = normalizedSlug.replace(/-/g, '_')
  const categorySlug = product.category || product.categoryId || 'uncategorized'
  return `cruzar-deportes/products/${categorySlug}/${folderSegment}`
}

const appendImagesToProduct = async (product, newUrls) => {
  if (!Array.isArray(newUrls) || newUrls.length === 0) {
    return
  }

  const currentSelected = Array.isArray(product.selectedImages) ? [...product.selectedImages] : []
  const currentAll = Array.isArray(product.allAvailableImages) ? [...product.allAvailableImages] : []
  const mergedSelected = Array.from(new Set([...currentSelected, ...newUrls]))
  const mergedAll = Array.from(new Set([...currentAll, ...newUrls]))

  await updateProductImages(product.id, mergedSelected, mergedAll)
  product.selectedImages = mergedSelected
  product.allAvailableImages = mergedAll
}

const triggerModalUpload = () => {
  if (!selectedProduct.value) {
    toast.error('Seleccioná un producto')
    return
  }
  modalUploadInputRef.value?.click()
}

const handleModalFilesSelected = async (event) => {
  if (!selectedProduct.value) {
    toast.error('Seleccioná un producto')
    return
  }
  const input = event.target
  const files = Array.from(input?.files || [])
  if (!files.length) {
    return
  }

  const folderPath = getProductFolderPath(selectedProduct.value)
  modalUploadState.uploading = true
  modalUploadState.uploaded = 0
  modalUploadState.total = files.length

  const uploadedUrls = []

  for (const file of files) {
    try {
      const uploadResult = await uploadImage(file, folderPath)
      const secureUrl = typeof uploadResult === 'string' ? uploadResult : uploadResult?.secure_url
      if (secureUrl) {
        uploadedUrls.push(secureUrl)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(`No pudimos subir "${file.name}"`)
    } finally {
      modalUploadState.uploaded += 1
    }
  }

  if (uploadedUrls.length > 0) {
    await appendImagesToProduct(selectedProduct.value, uploadedUrls)
    selectedProduct.value.cloudinaryFolderPath = folderPath
    availableImages.value = [...selectedProduct.value.allAvailableImages]
    tempSelectedImages.value = [...selectedProduct.value.selectedImages]
    toast.success(
      uploadedUrls.length === 1
        ? 'Se subió 1 imagen'
        : `Se subieron ${uploadedUrls.length} imágenes`
    )
  }

  modalUploadState.uploading = false
  modalUploadState.uploaded = 0
  modalUploadState.total = 0
  if (input) {
    input.value = ''
  }
}

const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null
  }
  const uploadIndex = url.indexOf('/upload/')
  if (uploadIndex === -1) {
    return null
  }
  let path = url.slice(uploadIndex + '/upload/'.length)
  const segments = path.split('/')
  if (segments[0]?.startsWith('v') && /^\d+$/.test(segments[0].slice(1))) {
    segments.shift()
  }
  path = segments.join('/')
  const queryIndex = path.indexOf('?')
  if (queryIndex !== -1) {
    path = path.slice(0, queryIndex)
  }
  const extensionIndex = path.lastIndexOf('.')
  if (extensionIndex !== -1) {
    path = path.slice(0, extensionIndex)
  }
  return path
}

const toggleModalImageSelection = (imageUrl) => {
  const current = new Set(modalSelectedForDeletion.value)
  if (current.has(imageUrl)) {
    current.delete(imageUrl)
  } else {
    current.add(imageUrl)
  }
  modalSelectedForDeletion.value = current
}

const clearModalDeletions = () => {
  modalSelectedForDeletion.value = new Set()
}

const handleModalBulkDelete = async () => {
  if (!selectedProduct.value || modalSelectedForDeletion.value.size === 0) {
    return
  }

  const confirmed = window.confirm(
    modalSelectedForDeletion.value.size === 1
      ? '¿Seguro que querés eliminar esta imagen?'
      : `¿Seguro que querés eliminar estas ${modalSelectedForDeletion.value.size} imágenes?`
  )
  if (!confirmed) {
    return
  }

  modalDeletionState.processing = true

  try {
    const urlsToDelete = Array.from(modalSelectedForDeletion.value)
    for (const imageUrl of urlsToDelete) {
      const publicId = extractPublicIdFromUrl(imageUrl)
      if (publicId) {
        await deleteCloudinaryImage(publicId)
      }
    }

    const updatedSelected = (selectedProduct.value.selectedImages || []).filter(url => !modalSelectedForDeletion.value.has(url))
    const updatedAll = (selectedProduct.value.allAvailableImages || []).filter(url => !modalSelectedForDeletion.value.has(url))
    await updateProductImages(selectedProduct.value.id, updatedSelected, updatedAll)
    selectedProduct.value.selectedImages = updatedSelected
    selectedProduct.value.allAvailableImages = updatedAll
    tempSelectedImages.value = tempSelectedImages.value.filter(url => updatedSelected.includes(url))
    availableImages.value = availableImages.value.filter(url => updatedAll.includes(url))
    toast.success(
      urlsToDelete.length === 1
        ? 'Imagen eliminada'
        : `Se eliminaron ${urlsToDelete.length} imágenes`
    )
    clearModalDeletions()
  } catch (error) {
    console.error('Error deleting images:', error)
    toast.error('No pudimos eliminar las imágenes')
  } finally {
    modalDeletionState.processing = false
  }
}

const openCreateProductModal = () => {
  showCreateProductModal.value = true
}

const closeCreateProductModal = () => {
  if (showCreateProductModal.value) {
    showCreateProductModal.value = false
  }
}

const handleNewProductCreated = async () => {
  showCreateProductModal.value = false
  await loadAllProducts()
  currentPage.value = 1
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const selectedProductPreview = computed(() => {
  const selectedIds = new Set(selectedProducts.value)
  return products.value.filter(p => selectedIds.has(p.id)).slice(0, 4)
})

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0
})

const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  try {
    return currencyFormatter.format(value)
  } catch (err) {
    return `$${value}`
  }
}

const resetBulkPricingForm = () => {
  bulkPricingForm.strategy = 'absolute'
  bulkPricingForm.priceValue = null
  bulkPricingForm.originalPriceValue = null
  bulkPricingForm.percentageValue = null
  bulkPricingForm.applyToPrice = true
  bulkPricingForm.applyToOriginalPrice = false
}

const openBulkPricingModal = () => {
  if (selectedProducts.value.length === 0) {
    return
  }
  resetBulkPricingForm()
  showBulkPricingModal.value = true
}

const closeBulkPricingModal = () => {
  if (bulkPricingState.saving) {
    return
  }
  showBulkPricingModal.value = false
}

const deleteSelectedProducts = async () => {
  if (selectedProducts.value.length === 0 || bulkDeleteState.deleting) {
    return
  }

  const confirmed = window.confirm(
    selectedProducts.value.length === 1
      ? '¿Seguro que querés eliminar este producto?'
      : `¿Seguro que querés eliminar estos ${selectedProducts.value.length} productos?`
  )

  if (!confirmed) {
    return
  }

  bulkDeleteState.deleting = true

  try {
    const idsToDelete = [...selectedProducts.value]
    const failedIds = []
    let deletedCount = 0

    for (const productId of idsToDelete) {
      try {
        await deleteProduct(productId)
        const productIndex = products.value.findIndex(product => product.id === productId)
        if (productIndex !== -1) {
          products.value.splice(productIndex, 1)
        }
        if (selectedProduct.value?.id === productId) {
          selectedProduct.value = null
          showImageBrowser.value = false
        }
        delete dirtyProducts[productId]
        delete detailsSnapshots[productId]
        delete detailsLoading[productId]
        Object.keys(statusLoading).forEach((key) => {
          if (key.startsWith(`${productId}-`)) {
            delete statusLoading[key]
          }
        })
        deletedCount++
      } catch (error) {
        console.error(`Error deleting product ${productId}:`, error)
        failedIds.push(productId)
      }
    }

    if (deletedCount > 0) {
      toast.success(
        deletedCount === 1
          ? 'Se eliminó 1 producto'
          : `Se eliminaron ${deletedCount} productos`
      )
    }

    if (failedIds.length > 0) {
      toast.error(
        failedIds.length === 1
          ? 'No pudimos eliminar 1 producto'
          : `No pudimos eliminar ${failedIds.length} productos`
      )
      selectedProducts.value = failedIds
    } else {
      clearSelection()
    }

    if (currentPage.value > totalPages.value) {
      currentPage.value = Math.max(totalPages.value, 1)
    }
  } catch (error) {
    console.error('Error deleting selected products:', error)
    toast.error('No pudimos eliminar los productos seleccionados')
  } finally {
    bulkDeleteState.deleting = false
  }
}

const parseMoneyInput = (value) => {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    return null
  }
  return Math.max(0, parsed)
}

const isBulkPricingValid = computed(() => {
  if (selectedProducts.value.length === 0) {
    return false
  }

  if (bulkPricingForm.strategy === 'absolute') {
    const priceValue = parseMoneyInput(bulkPricingForm.priceValue)
    const originalValue = parseMoneyInput(bulkPricingForm.originalPriceValue)
    return priceValue !== null || originalValue !== null
  }

  const percent = Number(bulkPricingForm.percentageValue)
  const hasPercent = !Number.isNaN(percent) && percent !== 0
  const hasTarget = bulkPricingForm.applyToPrice || bulkPricingForm.applyToOriginalPrice
  return hasPercent && hasTarget
})

const captureDetailsSnapshot = (product) => {
  const sanitizedName = (product.name ?? '').trim()
  const sanitizedDescription = (product.description ?? '').trim()
  let sanitizedSlug = (product.slug ?? '').toString().trim()

  if (!sanitizedSlug) {
    const fallbackBase = sanitizedName || product.id || 'producto'
    const fallbackSlug = slugify(fallbackBase)
    sanitizedSlug = fallbackSlug || String(product.id || 'producto')
  }

  product.name = sanitizedName
  product.description = sanitizedDescription
  product.slug = sanitizedSlug

  detailsSnapshots[product.id] = {
    name: sanitizedName,
    description: sanitizedDescription,
    slug: sanitizedSlug,
    price: product.price || 0,
    originalPrice: product.originalPrice || 0
  }
}

const getDetailsSnapshot = (productId) => {
  return detailsSnapshots[productId] || { name: '', description: '', slug: '', price: 0, originalPrice: 0 }
}

// Mark product as dirty when any field changes
const markProductDirty = (product) => {
  const snapshot = getDetailsSnapshot(product.id)
  const isDirty =
    product.name?.trim() !== snapshot.name ||
    product.description?.trim() !== snapshot.description ||
    product.price !== snapshot.price ||
    product.originalPrice !== snapshot.originalPrice

  if (isDirty) {
    dirtyProducts[product.id] = true
  } else {
    delete dirtyProducts[product.id]
  }
}

// Cancel changes and revert to snapshot
const cancelProductChanges = (product) => {
  const snapshot = getDetailsSnapshot(product.id)
  product.name = snapshot.name
  product.description = snapshot.description
  product.price = snapshot.price
  product.originalPrice = snapshot.originalPrice
  delete dirtyProducts[product.id]
}

const allowSelectedDrop = (event) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const moveSelectedImage = (from, to) => {
  if (from === to) return

  const updated = [...tempSelectedImages.value]

  if (from < 0 || from >= updated.length) {
    return
  }

  const [moved] = updated.splice(from, 1)
  const targetIndex = Math.max(0, Math.min(to, updated.length))
  updated.splice(targetIndex, 0, moved)

  tempSelectedImages.value = updated
}

const handleSelectedDragStart = (index, event) => {
  draggingSelectedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

const handleSelectedItemDrop = (index, event) => {
  event.preventDefault()
  if (draggingSelectedIndex.value === null) return

  const from = draggingSelectedIndex.value
  const target = from < index ? index - 1 : index

  moveSelectedImage(from, target)
  draggingSelectedIndex.value = null
}

const handleSelectedListDrop = (event) => {
  event.preventDefault()
  if (draggingSelectedIndex.value === null) return

  const from = draggingSelectedIndex.value
  moveSelectedImage(from, tempSelectedImages.value.length)
  draggingSelectedIndex.value = null
}

const handleSelectedDragEnd = () => {
  draggingSelectedIndex.value = null
}

const removeFromSelection = (imageUrl) => {
  tempSelectedImages.value = tempSelectedImages.value.filter(image => image !== imageUrl)
}

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value

  if (selectedProductType.value) {
    filtered = filtered.filter(p => p.productType === selectedProductType.value)
  }

  if (selectedLeague.value) {
    filtered = filtered.filter(p => p.league === selectedLeague.value)
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      (p.description && p.description.toLowerCase().includes(search))
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    // Show pages around current page
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
})

const currentRangeStart = computed(() => {
  return filteredProducts.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
})

const currentRangeEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length)
})

// Methods
const getStatusKey = (productId, field) => `${productId}-${field}`
const isStatusLoading = (productId, field) => Boolean(statusLoading[getStatusKey(productId, field)])

const loadAllProducts = async () => {
  try {
    loading.value = true
    error.value = null
    Object.keys(statusLoading).forEach(key => {
      delete statusLoading[key]
    })
    Object.keys(detailsLoading).forEach(key => {
      delete detailsLoading[key]
    })
    Object.keys(detailsSnapshots).forEach(key => {
      delete detailsSnapshots[key]
    })
    const loadedProducts = await loadProducts()
    // Normalize products to ensure required fields exist
    products.value = loadedProducts.map(p => ({
      ...p,
      selectedImages: p.selectedImages || p.images || [],
      allAvailableImages: p.allAvailableImages || p.images || [],
      images: p.images || p.selectedImages || [],
      category: p.category || p.categoryId || '',
      categoryId: p.categoryId || p.category || '',  // Ensure categoryId is set
      inStock: p.inStock ?? true,
      featured: p.featured ?? false
    }))
    products.value.forEach(captureDetailsSnapshot)
    clearSelection()
  } catch (err) {
    error.value = err.message
    toast.error('Error al cargar productos')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) {
    return 'Sin fecha'
  }

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Sin fecha'
  }

  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const removeSelectedImage = async (productId, imageIndex) => {
  try {
    const product = products.value.find(p => p.id === productId)
    if (!product) return

    const updatedImages = [...product.selectedImages]
    updatedImages.splice(imageIndex, 1)

    await updateProductImages(productId, updatedImages, product.allAvailableImages)

    // Update local state
    product.selectedImages = updatedImages

    toast.success('Imagen eliminada')
  } catch (err) {
    toast.error('Error al eliminar imagen')
  }
}

const openImageBrowser = async (product) => {
  selectedProduct.value = product
  tempSelectedImages.value = [...product.selectedImages]
  showImageBrowser.value = true
  modalSelectedForDeletion.value = new Set()
  modalDeletionState.processing = false

  try {
    loadingImages.value = true

    let resolvedImages = []

    if (product.cloudinaryFolderPath) {
      try {
        const assets = await getFolderImages(product.cloudinaryFolderPath)
        resolvedImages = assets.map(asset => asset.secure_url)
      } catch (cloudError) {
        console.warn(`No se pudo leer la carpeta ${product.cloudinaryFolderPath}:`, cloudError)
      }
    }

    // If no images from Cloudinary folder, use product's existing images
    if (resolvedImages.length === 0) {
      resolvedImages = product.images || product.selectedImages || []
    }

    const fallbackGallery = Array.isArray(product.allAvailableImages) ? product.allAvailableImages : []
    const uniqueImages = Array.from(new Set([
      ...resolvedImages,
      ...fallbackGallery,
      ...tempSelectedImages.value
    ]))

    availableImages.value = uniqueImages
  } catch (err) {
    console.error('Error loading images:', err)
    toast.error('Error al cargar imágenes disponibles')
    availableImages.value = []
  } finally {
    loadingImages.value = false
  }
}

const closeImageBrowser = () => {
  showImageBrowser.value = false
  selectedProduct.value = null
  availableImages.value = []
  tempSelectedImages.value = []
  draggingSelectedIndex.value = null
  modalSelectedForDeletion.value = new Set()
  modalDeletionState.processing = false
}

const handleModalClose = () => {
  if (modalDeletionState.processing) {
    return
  }
  closeImageBrowser()
}

const handleModalOverlayClick = () => {
  if (modalDeletionState.processing) {
    return
  }
  closeImageBrowser()
}

const isImageSelected = (imageUrl) => {
  return tempSelectedImages.value.includes(imageUrl)
}

const toggleImageSelection = (imageUrl) => {
  const index = tempSelectedImages.value.indexOf(imageUrl)
  if (index > -1) {
    tempSelectedImages.value.splice(index, 1)
  } else {
    tempSelectedImages.value.push(imageUrl)
  }
}

const saveImageSelection = async () => {
  if (!selectedProduct.value) return

  try {
    if (modalSaveState.saving) {
      return
    }

    modalSaveState.saving = true
    await updateProductImages(
      selectedProduct.value.id,
      tempSelectedImages.value,
      availableImages.value
    )

    // Update local state
    selectedProduct.value.selectedImages = [...tempSelectedImages.value]
    selectedProduct.value.allAvailableImages = [...availableImages.value]

    toast.success('Imágenes actualizadas correctamente')
    closeImageBrowser()
  } catch (err) {
    toast.error('Error al guardar selección de imágenes')
  } finally {
    modalSaveState.saving = false
  }
}

// Unified save function for all product changes
const saveProductChanges = async (product) => {
  if (!product?.id) {
    return
  }

  const productId = product.id
  const snapshot = getDetailsSnapshot(productId)
  const trimmedName = (product.name ?? '').trim()
  const trimmedDescription = (product.description ?? '').trim()

  if (!trimmedName) {
    toast.error('El nombre del producto no puede estar vacío')
    product.name = snapshot.name
    product.description = snapshot.description
    product.price = snapshot.price
    product.originalPrice = snapshot.originalPrice
    delete dirtyProducts[productId]
    return
  }

  if (savingProducts[productId]) {
    return
  }

  let generatedSlug = slugify(trimmedName)
  if (!generatedSlug) {
    const fallbackBase = trimmedName || product.id || snapshot.slug || 'producto'
    generatedSlug = slugify(fallbackBase) || snapshot.slug || String(product.id || 'producto')
  }

  try {
    savingProducts[productId] = true

    // Preserve the existing cloudinaryFolderPath, or generate one if it doesn't exist
    const existingFolderPath = product.cloudinaryFolderPath
    const folderPath = existingFolderPath || getProductFolderPath(product)

    const payload = {
      name: trimmedName,
      description: trimmedDescription,
      slug: generatedSlug,
      price: product.price || 0,
      originalPrice: product.originalPrice || 0,
      categoryId: product.categoryId || product.category,  // API expects "categoryId"
      category: product.category || product.categoryId,    // Keep for front-end consistency
      images: product.images || product.selectedImages || [],
      selectedImages: product.selectedImages || product.images || [],
      allAvailableImages: product.allAvailableImages || product.images || [],
      cloudinaryFolderPath: folderPath,  // Always preserve the folder path
      inStock: product.inStock,
      featured: product.featured
    }

    // Use updateProduct (PUT) for existing products, not saveProduct (POST)
    await updateProduct(productId, payload)

    product.name = trimmedName
    product.description = trimmedDescription
    product.slug = generatedSlug
    product.cloudinaryFolderPath = folderPath  // Store the folder path locally too
    product.lastModified = new Date().toISOString()
    captureDetailsSnapshot(product)
    delete dirtyProducts[productId]

    toast.success('Cambios guardados correctamente')
  } catch (err) {
    toast.error('Error al guardar los cambios')
    product.name = snapshot.name
    product.description = snapshot.description
    product.slug = snapshot.slug
    product.price = snapshot.price
    product.originalPrice = snapshot.originalPrice
  } finally {
    delete savingProducts[productId]
  }
}

// Keep old function for backwards compatibility (but it won't be used from UI anymore)
const updateProductDetails = async (product) => {
  await saveProductChanges(product)
}

// Keep old function name but it won't actually save - just for backwards compatibility
const updateProductPricing = async (product) => {
  // This function is no longer used - pricing is saved via saveProductChanges
  // Kept for backwards compatibility only
}

const toggleProductStatus = async (product, field) => {
  try {
    const statusKey = getStatusKey(product.id, field)
    if (statusLoading[statusKey]) {
      return
    }
    statusLoading[statusKey] = true

    const updates = {
      [field]: !product[field]
    }

    await updateProductStatus(product.id, updates)

    // Update local state
    product[field] = !product[field]

    const statusName = field === 'featured' ? 'destacado' : 'stock'
    toast.success(`Estado ${statusName} actualizado`)
  } catch (err) {
    toast.error(`Error al actualizar estado ${field}`)
  } finally {
    const statusKey = getStatusKey(product.id, field)
    statusLoading[statusKey] = false
  }
}

const applyBulkPricing = async () => {
  if (!isBulkPricingValid.value) {
    return
  }

  try {
    bulkPricingState.saving = true
    const selectedIds = new Set(selectedProducts.value)
    const productsToUpdate = products.value.filter(p => selectedIds.has(p.id))
    const priceValue = parseMoneyInput(bulkPricingForm.priceValue)
    const originalValue = parseMoneyInput(bulkPricingForm.originalPriceValue)
    const percent = Number(bulkPricingForm.percentageValue)
    const percentFactor = 1 + percent / 100
    let updatedCount = 0

    for (const product of productsToUpdate) {
      let nextPrice = typeof product.price === 'number' ? product.price : 0
      let nextOriginalPrice = typeof product.originalPrice === 'number' ? product.originalPrice : nextPrice
      let shouldUpdate = false

      if (bulkPricingForm.strategy === 'absolute') {
        if (priceValue !== null && priceValue !== product.price) {
          nextPrice = priceValue
          shouldUpdate = true
        }
        if (originalValue !== null && originalValue !== product.originalPrice) {
          nextOriginalPrice = originalValue
          shouldUpdate = true
        }
      } else {
        if (bulkPricingForm.applyToPrice) {
          const basePrice = typeof product.price === 'number' ? product.price : 0
          const calculatedPrice = Number((basePrice * percentFactor).toFixed(2))
          if (!Number.isNaN(calculatedPrice) && calculatedPrice !== product.price) {
            nextPrice = calculatedPrice
            shouldUpdate = true
          }
        }
        if (bulkPricingForm.applyToOriginalPrice) {
          const baseOriginal = typeof product.originalPrice === 'number'
            ? product.originalPrice
            : (typeof product.price === 'number' ? product.price : 0)
          const calculatedOriginal = Number((baseOriginal * percentFactor).toFixed(2))
          if (!Number.isNaN(calculatedOriginal) && calculatedOriginal !== product.originalPrice) {
            nextOriginalPrice = calculatedOriginal
            shouldUpdate = true
          }
        }
      }

      if (shouldUpdate) {
        await updateProductPricingAPI(product.id, nextPrice, nextOriginalPrice)
        product.price = nextPrice
        product.originalPrice = nextOriginalPrice
        product.lastModified = new Date().toISOString()
        captureDetailsSnapshot(product)
        delete dirtyProducts[product.id]
        updatedCount++
      }
    }

    if (updatedCount === 0) {
      toast.info('No hubo cambios de precio necesarios')
      return
    }

    toast.success(
      updatedCount === 1
        ? 'Se actualizó el precio de 1 producto'
        : `Se actualizaron los precios de ${updatedCount} productos`
    )
    showBulkPricingModal.value = false
  } catch (err) {
    toast.error('Error al actualizar precios en lote')
  } finally {
    bulkPricingState.saving = false
  }
}

const goToPage = async (page) => {
  if (page < 1 || page > totalPages.value) return

  // Show loading state
  isTransitioning.value = true

  // Use nextTick to ensure the transition is visible
  await nextTick()

  // Brief delay for visual feedback
  await new Promise(resolve => setTimeout(resolve, 300))

  currentPage.value = page

  // Scroll to top of products grid
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // Hide loading state
  isTransitioning.value = false
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

watch(
  () => selectedProducts.value.length,
  (newLength) => {
    if (newLength === 0 && showBulkPricingModal.value) {
      closeBulkPricingModal()
    }
  }
)

// Watchers - Reset pagination when filters change
watch([selectedProductType, selectedLeague, searchTerm], async () => {
  // Show loading state for filter changes
  isTransitioning.value = true

  await nextTick()

  // Brief delay for visual feedback
  await new Promise(resolve => setTimeout(resolve, 300))

  currentPage.value = 1
  clearSelection()

  // Hide loading state
  isTransitioning.value = false
})

// Reset league when product type changes
watch(selectedProductType, () => {
  selectedLeague.value = ''
})

// Check if there are any unsaved changes
const hasUnsavedChanges = computed(() => {
  return Object.keys(dirtyProducts).length > 0
})

// Handle browser/tab close with unsaved changes
const handleBeforeUnload = (event) => {
  if (hasUnsavedChanges.value) {
    event.preventDefault()
    // Modern browsers require returnValue to be set
    event.returnValue = 'Tenés cambios sin guardar. ¿Seguro que querés salir?'
    return event.returnValue
  }
}

// Navigation guard for in-app navigation
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const confirmed = window.confirm(
      'Tenés cambios sin guardar. ¿Seguro que querés salir de esta página?'
    )
    if (confirmed) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

// Lifecycle
onMounted(() => {
  fetchProductTypes()
  fetchLeagues()
  loadAllProducts()

  // Add beforeunload listener for tab close/refresh
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // Clean up beforeunload listener
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af transparent;
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.6);
  border-radius: 9999px;
}
</style>
