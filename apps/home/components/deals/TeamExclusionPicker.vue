<template>
  <div>
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar equipo..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
    </div>

    <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
      <button
        v-for="team in filteredTeams"
        :key="team"
        type="button"
        @click="toggleTeam(team)"
        :disabled="!isSelected(team) && modelValue.length >= 5"
        :class="[
          'w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 transition-colors',
          isSelected(team)
            ? 'bg-gray-100 font-medium'
            : 'hover:bg-gray-50',
          !isSelected(team) && modelValue.length >= 5
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        ]"
      >
        <div class="flex items-center justify-between">
          <span>{{ team }}</span>
          <IconCheck v-if="isSelected(team)" class="w-5 h-5 text-black" />
        </div>
      </button>
    </div>

    <div v-if="modelValue.length > 0" class="mt-4">
      <p class="text-sm text-gray-600 mb-2">
        Equipos excluidos ({{ modelValue.length }}/5):
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="team in modelValue"
          :key="team"
          class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
        >
          {{ team }}
          <button
            type="button"
            @click="removeTeam(team)"
            class="ml-2 hover:text-black"
          >
            <IconClose class="w-4 h-4" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IconCheck from '~icons/mdi/check'
import IconClose from '~icons/mdi/close'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')

// Popular teams from various leagues
const teams = [
  // Argentina
  'Boca Juniors', 'River Plate', 'Racing Club', 'Independiente', 'San Lorenzo',
  // Europe
  'Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool', 'Bayern Munich',
  'Juventus', 'AC Milan', 'Inter Milan', 'PSG', 'Chelsea',
  // More teams...
  'Arsenal', 'Manchester City', 'Atletico Madrid', 'Borussia Dortmund'
].sort()

const filteredTeams = computed(() => {
  if (!searchQuery.value) return teams
  return teams.filter(team =>
    team.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const isSelected = (team) => {
  return props.modelValue.includes(team)
}

const toggleTeam = (team) => {
  const newValue = isSelected(team)
    ? props.modelValue.filter(t => t !== team)
    : [...props.modelValue, team]
  emit('update:modelValue', newValue)
}

const removeTeam = (team) => {
  emit('update:modelValue', props.modelValue.filter(t => t !== team))
}
</script>
