<template>
  <div class="p-6 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <select
          v-model="selectedCategory"
          class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las categorías</option>
          <option value="afc">AFC</option>
          <option value="caf">CAF</option>
          <option value="eredivisie">Eredivisie</option>
          <option value="lpf_afa">LPF AFA</option>
          <option value="serie_a_enilive">Serie A Enilive</option>
          <option value="national_retro">Retro Nacional</option>
        </select>

        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar productos..."
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Product Stats and Bulk Actions -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
          <span class="font-medium">Mostrando {{ currentRangeStart }}-{{ currentRangeEnd }} de {{ filteredProducts.length }} productos</span>
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
              @click="clearSelection"
              class="px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-white transition-colors border border-transparent"
            >
              Limpiar selección
            </button>
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
              <!-- Category & Status Badges - Compact Row -->
              <div class="flex items-center gap-3 flex-wrap">
                <span class="text-xs font-medium text-gray-500 tracking-wide">
                  {{ getCategoryName(product.category) }}
                </span>
                <span class="text-gray-300">•</span>
                <div class="flex items-center gap-1.5">
                  <span :class="['w-1.5 h-1.5 rounded-full', product.featured ? 'bg-yellow-500' : 'bg-gray-300']" />
                  <span class="text-xs text-gray-600">{{ product.featured ? 'Destacado' : 'Normal' }}</span>
                </div>
                <span class="text-gray-300">•</span>
                <div class="flex items-center gap-1.5">
                  <span :class="['w-1.5 h-1.5 rounded-full', product.inStock ? 'bg-green-500' : 'bg-blue-400']" />
                  <span class="text-xs text-gray-600">{{ product.inStock ? 'En stock' : 'A pedido' }}</span>
                </div>
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

            <!-- Save/Cancel Buttons (shown when dirty) -->
            <Transition name="fade">
              <div v-if="isProductDirty(product.id)" class="flex gap-2 pl-10">
                <button
                  @click="saveProductChanges(product)"
                  :disabled="isProductSaving(product.id)"
                  :class="[
                    'px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2',
                    isProductSaving(product.id) ? 'opacity-60 cursor-wait' : 'hover:bg-gray-800'
                  ]"
                >
                  <IconLoading
                    v-if="isProductSaving(product.id)"
                    class="w-3 h-3 animate-spin"
                  />
                  <span>{{ isProductSaving(product.id) ? 'Guardando...' : 'Guardar' }}</span>
                </button>
                <button
                  @click="cancelProductChanges(product)"
                  :disabled="isProductSaving(product.id)"
                  class="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-wait"
                >
                  Cancelar
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Product Content -->
        <div class="p-4 sm:p-5 space-y-5">
          <!-- Images Management - Compact -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm font-medium text-gray-700">
                  {{ product.selectedImages.length > 0
                    ? `${product.selectedImages.length} ${product.selectedImages.length === 1 ? 'imagen' : 'imágenes'}`
                    : 'Sin imágenes' }}
                </span>
              </div>
              <button
                @click="openImageBrowser(product)"
                class="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Seleccionar</span>
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
        @click.self="closeImageBrowser"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          <div class="relative bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                Seleccionar Imágenes - {{ selectedProduct?.name }}
              </h3>
              <button
                @click="closeImageBrowser"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IconClose class="w-6 h-6" />
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto">
              <!-- Selected Images (reorderable) -->
              <div v-if="tempSelectedImages.length" class="px-4 sm:px-6 pt-4 sm:pt-6">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-medium text-gray-900">Imágenes seleccionadas</h4>
                  <span class="text-xs text-gray-500 hidden sm:inline">Arrastra para cambiar el orden</span>
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
                    :class="draggingSelectedIndex === index ? 'ring-2 ring-blue-400 ring-offset-2' : ''"
                    @dragstart="handleSelectedDragStart(index, $event)"
                    @dragover.prevent="allowSelectedDrop"
                    @drop.prevent="handleSelectedItemDrop(index, $event)"
                    @dragend="handleSelectedDragEnd"
                  >
                    <img
                      :src="optimizeUrl(image, 180)"
                      :alt="`Selected image ${index + 1}`"
                      class="w-full h-full object-cover pointer-events-none"
                    />

                    <span class="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-full">
                      {{ index + 1 }}
                    </span>

                    <button
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
                  @click="closeImageBrowser"
                  class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="saveImageSelection"
                  class="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar Selección
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
  </div>
</template>

<script setup>
import IconLoading from '~icons/eos-icons/loading'
import IconAlertCircle from '~icons/mdi/alert-circle'
import IconClose from '~icons/mdi/close'
import IconImageOff from '~icons/mdi/image-off'
import IconImageMultiple from '~icons/mdi/image-multiple'
import IconCheck from '~icons/mdi/check'
import IconCashMultiple from '~icons/mdi/cash-multiple'
import IconPencil from '~icons/mdi/pencil'

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const {
  loadProducts,
  saveProduct,
  updateProductImages,
  updateProductPricing: updateProductPricingAPI,
  updateProductStatus
} = useSharedProducts()
// Removed useCloudinary - now using efficient manifest approach
const toast = useToast()

// Helper to optimize URLs using cloudinaryImageLoader
const optimizeUrl = (url, size = 300) => {
  if (!url.includes('cloudinary.com')) {
    return url
  }
  // Use same optimization logic as home project
  return url.replace('/upload/', `/upload/c_thumb,w_${size},h_${size},g_face/`)
}

const slugify = (value) => {
  return (value ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Reactive state
const loading = ref(false)
const error = ref(null)
const products = ref([])
const selectedCategory = ref('')
const searchTerm = ref('')
const selectedProducts = ref([])
const showBulkPricingModal = ref(false)

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
const detailsLoading = reactive({})
const detailsSnapshots = reactive({})
const dirtyProducts = reactive({}) // Track which products have unsaved changes
const savingProducts = reactive({}) // Track which products are being saved

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

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
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
    products.value = loadedProducts
    products.value.forEach(captureDetailsSnapshot)
    clearSelection()
  } catch (err) {
    error.value = err.message
    toast.error('Error al cargar productos')
  } finally {
    loading.value = false
  }
}

const getCategoryName = (category) => {
  const categoryNames = {
    afc: 'AFC',
    caf: 'CAF',
    eredivisie: 'Eredivisie',
    lpf_afa: 'LPF AFA',
    serie_a_enilive: 'Serie A Enilive',
    national_retro: 'Retro Nacional'
  }
  return categoryNames[category] || category
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
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

  // Load available images using smart manifest approach (same as home project)
  try {
    loadingImages.value = true

    // Extract team key from product slug/id
    const teamKey = product.slug.replace(/-/g, '_') // Convert slug back to team key

    // Use the efficient image loader from home project
    const { getTeamImages } = await import('~/utils/cloudinaryImageLoader')
    const images = await getTeamImages(teamKey, product.category)
    const uniqueImages = Array.from(new Set([...images, ...tempSelectedImages.value]))

    availableImages.value = uniqueImages

    console.log(`Found ${availableImages.value.length} images in folder`)
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

    const payload = {
      ...product,
      name: trimmedName,
      description: trimmedDescription,
      slug: generatedSlug,
      price: product.price || 0,
      originalPrice: product.originalPrice || 0
    }

    await saveProduct(payload)

    product.name = trimmedName
    product.description = trimmedDescription
    product.slug = generatedSlug
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
watch([selectedCategory, searchTerm], async () => {
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

// Lifecycle
onMounted(() => {
  loadAllProducts()
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
</style>
