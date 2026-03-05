<template>
  <v-sheet class="pa-8 d-flex justify-center">
    <v-sheet class="d-flex flex-column gr-6 w-100" style="max-width: 1104px">
      <v-sheet>
        <h2 class="text-grey1">Finance Overview</h2>
        <p class="text-grey2 mt-1">Earnings and visit performance snapshot for your account.</p>
      </v-sheet>

      <v-sheet class="d-grid gc-4" style="grid-template-columns: repeat(4, minmax(0, 1fr))">
        <v-sheet class="metric-card">
          <p class="metric-label">Estimated Earnings (AED)</p>
          <p class="metric-value">{{ metrics.estimatedEarnings }}</p>
        </v-sheet>
        <v-sheet class="metric-card">
          <p class="metric-label">Completed Visits</p>
          <p class="metric-value">{{ metrics.completedVisits }}</p>
        </v-sheet>
        <v-sheet class="metric-card">
          <p class="metric-label">Open Visits</p>
          <p class="metric-value">{{ metrics.openVisits }}</p>
        </v-sheet>
        <v-sheet class="metric-card">
          <p class="metric-label">Upcoming Visits</p>
          <p class="metric-value">{{ metrics.upcomingVisits }}</p>
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import { useCaseStore } from '@/stores/case'
import { useConsultationStore } from '@/stores/consultation'
import type { Case } from '@/stores/types/case'
import { CaseStatusEnum } from '@/stores/types/case'
import { onMounted, reactive } from 'vue'

const caseStore = useCaseStore()
const consultationStore = useConsultationStore()

const metrics = reactive({
  estimatedEarnings: 0,
  completedVisits: 0,
  openVisits: 0,
  upcomingVisits: 0
})

const fetchMetrics = async () => {
  const [caseRes, consultationRes] = await Promise.all([
    caseStore.fetchCases({ page: 1, limit: 500 }),
    consultationStore.fetchConsultation('all')
  ])

  const cases = (caseRes?.data ?? []) as Case[]
  const completedCases = cases.filter((item) => item.status === CaseStatusEnum.CLOSED)
  const openCases = cases.filter((item) => item.status !== CaseStatusEnum.CLOSED)

  metrics.completedVisits = completedCases.length
  metrics.openVisits = openCases.length
  metrics.upcomingVisits = consultationRes?.data?.length ?? 0
  metrics.estimatedEarnings = completedCases.length * 150
}

onMounted(async () => {
  await fetchMetrics()
})
</script>

<style lang="scss" scoped>
.metric-card {
  border: 1px solid #dde7ee;
  border-radius: 12px;
  padding: 20px;
}

.metric-label {
  color: #6c757d;
  font-size: 14px;
  font-weight: 600;
}

.metric-value {
  margin-top: 8px;
  color: #222;
  font-size: 28px;
  font-weight: 700;
  line-height: 32px;
}
</style>
