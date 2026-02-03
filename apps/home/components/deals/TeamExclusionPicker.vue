<template>
  <div>
    <!-- Input to add teams -->
    <div class="flex gap-2 mb-4">
      <input
        type="text"
        v-model="teamInput"
        @keyup.enter="addTeam"
        placeholder="Escribí el nombre del equipo..."
        :disabled="modelValue.length >= 5"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        @click="addTeam"
        :disabled="!teamInput.trim() || modelValue.length >= 5"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0',
          !teamInput.trim() || modelValue.length >= 5
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        ]"
      >
        <IconPlus class="w-5 h-5" />
      </button>
    </div>

    <!-- Info text -->
    <p class="text-sm text-gray-600 mb-4">
      <span v-if="modelValue.length >= 5">Alcanzaste el máximo de 5 equipos</span>
      <span v-else>Podés excluir hasta 5 equipos ({{ 5 - modelValue.length }} restantes)</span>
    </p>

    <!-- Excluded teams list -->
    <div v-if="modelValue.length > 0">
      <p class="text-sm font-medium text-gray-700 mb-2">
        Equipos excluidos:
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="team in modelValue"
          :key="team"
          class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-full"
        >
          {{ team }}
          <button
            type="button"
            @click="removeTeam(team)"
            class="ml-2 hover:text-red-600 transition-colors"
          >
            <IconClose class="w-4 h-4" />
          </button>
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-sm text-gray-500">No hay equipos excluidos</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IconPlus from '~icons/mdi/plus'
import IconClose from '~icons/mdi/close'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const teamInput = ref('')

const addTeam = () => {
  const team = teamInput.value.trim()

  if (!team) return
  if (props.modelValue.length >= 5) return

  // Check if team is already in the list (case insensitive)
  const alreadyExists = props.modelValue.some(
    t => t.toLowerCase() === team.toLowerCase()
  )

  if (alreadyExists) {
    teamInput.value = ''
    return
  }

  emit('update:modelValue', [...props.modelValue, team])
  teamInput.value = ''
}

const removeTeam = (team) => {
  emit('update:modelValue', props.modelValue.filter(t => t !== team))
}
</script>
