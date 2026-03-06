<template>
  <div class="px-8 py-10 d-flex flex-column gr-6 h-100" style="background-color: #f8fafb">
    <v-sheet>
      <p class="mb-3 text-h5 font-weight-regular text-grey1" style="font-family: 'CooperLtBT' !important">
        Finance
      </p>
      <h1 class="text-grey1 text-h3 font-weight-regular" style="
          font-family: 'CooperLtBT' !important;
          max-width: 1106px;
          letter-spacing: 1.2px !important;
        ">
        Stats of earnings and number of visits
      </h1>
    </v-sheet>

    <v-sheet v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </v-sheet>

    <template v-else>
      <v-sheet class="d-flex flex-wrap gc-4" style="gap: 24px">
        <v-card
          v-for="card in statCards"
          :key="card.label"
          flat
          class="px-5 py-5 rounded-lg d-flex flex-column gr-2"
          style="border: 1px solid #d0d7dc; min-width: 200px"
        >
          <p class="text-grey2 text-body-2" style="font-weight: 600">{{ card.label }}</p>
          <p class="text-grey1" style="font-size: 28px; line-height: 36px; font-weight: 700">
            {{ card.value }}
          </p>
        </v-card>
      </v-sheet>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from '@/stores/finance'
import { computed, onMounted, ref } from 'vue'

const financeStore = useFinanceStore()
const loading = ref(true)

const statCards = computed(() => [
  { label: 'Total Visits', value: financeStore.stats?.totalVisits ?? 0 },
  { label: 'Completed Visits', value: financeStore.stats?.completedVisits ?? 0 },
  { label: 'Total Earnings (AED)', value: financeStore.stats?.totalEarnings ?? 0 }
])

onMounted(async () => {
  try {
    loading.value = true
    await financeStore.fetchFinanceStats()
  } finally {
    loading.value = false
  }
})
</script>
