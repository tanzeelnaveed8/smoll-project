<template>
  <div class="d-flex flex-column gr-4">
    <h2 class="text-h6 font-weight-bold" style="color: #1565C0">Visit History</h2>

    <!-- Filters -->
    <v-card rounded="lg" elevation="0" border>
      <v-card-text class="d-flex flex-wrap" style="gap: 10px">
        <v-text-field
          v-model="search"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          density="compact"
          clearable
          style="min-width: 150px; flex: 1"
          @update:model-value="debouncedFetch"
        />
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          item-title="text"
          item-value="value"
          placeholder="Status"
          hide-details
          density="compact"
          clearable
          style="min-width: 140px; max-width: 200px"
        />
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <template v-if="loading">
      <div class="d-flex flex-column gr-3">
        <v-skeleton-loader v-for="i in 4" :key="i" type="card" />
      </div>
    </template>

    <!-- Empty -->
    <template v-else-if="!filteredCases.length">
      <v-sheet rounded="lg" class="pa-8 text-center" border>
        <v-icon icon="mdi-history" size="48" color="grey-lighten-1" class="mb-3" />
        <p class="text-body-1 text-grey-darken-1">No visits found</p>
      </v-sheet>
    </template>

    <!-- List -->
    <template v-else>
      <div class="d-flex flex-column gr-3">
        <v-card
          v-for="c in filteredCases"
          :key="c.id"
          rounded="lg"
          elevation="0"
          border
          :to="`/visits/${c.id}`"
          class="visit-card"
        >
          <v-card-text class="d-flex flex-column gr-2">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center" style="gap: 10px">
                <v-avatar color="primary" size="36">
                  <span class="text-white text-caption">{{ getInitials(c.member) }}</span>
                </v-avatar>
                <div>
                  <p class="text-body-2 font-weight-medium">{{ c.member || 'Customer' }}</p>
                  <p class="text-caption text-grey-darken-1">{{ c.pet || '' }}</p>
                </div>
              </div>
              <v-chip
                size="x-small"
                variant="flat"
                :color="c.status === 'open' ? '#56B686' : '#F7F7F7'"
                :class="c.status !== 'open' && 'text-grey1'"
              >
                {{ c.status === 'open' ? 'Open' : c.status === 'openEscalated' ? 'Escalated' : 'Closed' }}
              </v-chip>
            </div>
            <div class="d-flex align-center text-caption text-grey-darken-1" style="gap: 12px">
              <span class="d-flex align-center" style="gap: 4px">
                <v-icon icon="mdi-calendar" size="14" />
                {{ dayjs(c.createdAt).format('DD MMMM YYYY') }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCaseStore } from '@/stores/case'
import type { Cases } from '@/stores/types/cases'
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'

const caseStore = useCaseStore()

const cases = ref<Cases[]>([])
const loading = ref(true)
const search = ref('')
const statusFilter = ref<string | null>(null)

const statusOptions = [
  { text: 'Open', value: 'open' },
  { text: 'Escalated', value: 'openEscalated' },
  { text: 'Closed', value: 'closed' }
]

const getInitials = (name?: string) => {
  if (!name) return 'C'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const filteredCases = computed(() => {
  let result = cases.value
  if (statusFilter.value) {
    result = result.filter((c) => c.status === statusFilter.value)
  }
  return result
})

let debounceTimer: ReturnType<typeof setTimeout>
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchCases(), 400)
}

const fetchCases = async () => {
  try {
    loading.value = true
    const { data } = await caseStore.fetchCases(search.value || '', 1)
    cases.value = data || []
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchCases())
</script>

<style scoped>
.visit-card {
  cursor: pointer;
  transition: background-color 0.15s;
}
.visit-card:hover {
  background-color: #f5f7fa;
}
</style>
