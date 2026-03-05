<template>
  <v-sheet class="d-flex justify-center">
    <div class="px-6 py-6 d-flex flex-column gr-6 w-100" style="max-width: 1140px">
      <v-sheet>
        <h2 class="text-grey1" style="font-family: 'CooperLtBT'; font-weight: 400">Finance Overview</h2>
        <p class="text-grey2 mt-1 text-body-1" style="font-weight: 600">Revenue, visits, and inventory statistics.</p>
      </v-sheet>

      <v-sheet v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>

      <template v-else>
        <!-- Revenue & Visits Row -->
        <v-sheet class="d-flex gc-4">
          <v-card v-for="card in topCards" :key="card.label" flat class="px-4 py-5 w-100 rounded-lg d-flex flex-column gr-2" style="border: 1px solid #d0d7dc">
            <p class="text-grey2 text-body-2" style="font-weight: 600">{{ card.label }}</p>
            <p class="text-grey1" style="font-size: 28px; line-height: 36px; font-weight: 700">{{ card.value }}</p>
          </v-card>
        </v-sheet>

        <!-- Case Breakdown -->
        <v-sheet>
          <h3 class="text-grey1 mb-4" style="font-weight: 600">Visits Breakdown</h3>
          <v-sheet class="d-flex gc-4">
            <v-card flat class="px-4 py-5 w-100 rounded-lg" style="border: 1px solid #d0d7dc">
              <p class="text-grey2 text-body-2" style="font-weight: 600">Open Visits</p>
              <p class="text-grey1 mt-2" style="font-size: 28px; font-weight: 700">{{ analytics?.openCases ?? 0 }}</p>
            </v-card>
            <v-card flat class="px-4 py-5 w-100 rounded-lg" style="border: 1px solid #d0d7dc">
              <p class="text-grey2 text-body-2" style="font-weight: 600">Closed Visits</p>
              <p class="text-grey1 mt-2" style="font-size: 28px; font-weight: 700">{{ analytics?.closedCases ?? 0 }}</p>
            </v-card>
            <v-card flat class="px-4 py-5 w-100 rounded-lg" style="border: 1px solid #d0d7dc">
              <p class="text-grey2 text-body-2" style="font-weight: 600">Escalated Visits</p>
              <p class="text-grey1 mt-2" style="font-size: 28px; font-weight: 700">{{ analytics?.escalatedCases ?? 0 }}</p>
            </v-card>
          </v-sheet>
        </v-sheet>

        <!-- Inventory -->
        <v-sheet>
          <h3 class="text-grey1 mb-4" style="font-weight: 600">Inventory Overview</h3>
          <v-sheet class="d-flex gc-4">
            <v-card flat class="px-4 py-5 w-100 rounded-lg" style="border: 1px solid #d0d7dc">
              <p class="text-grey2 text-body-2" style="font-weight: 600">Total Services</p>
              <p class="text-grey1 mt-2" style="font-size: 28px; font-weight: 700">{{ analytics?.services ?? 0 }}</p>
            </v-card>
            <v-card flat class="px-4 py-5 w-100 rounded-lg" style="border: 1px solid #d0d7dc">
              <p class="text-grey2 text-body-2" style="font-weight: 600">Total Products</p>
              <p class="text-grey1 mt-2" style="font-size: 28px; font-weight: 700">{{ analytics?.products ?? 0 }}</p>
            </v-card>
            <v-card flat class="px-4 py-5 w-100 rounded-lg" style="border: 1px solid #d0d7dc">
              <p class="text-grey2 text-body-2" style="font-weight: 600">Total Partners</p>
              <p class="text-grey1 mt-2" style="font-size: 28px; font-weight: 700">{{ analytics?.partners ?? 0 }}</p>
            </v-card>
          </v-sheet>
        </v-sheet>
      </template>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { useAnalyticsStore } from '@/stores/analytics'
import { computed, onMounted, ref } from 'vue'

const analyticsStore = useAnalyticsStore()
const analytics = ref<any>(null)
const loading = ref(false)

const topCards = computed(() => [
  { label: 'Total Visits', value: analytics.value?.cases ?? 0 },
  { label: 'Total Members', value: analytics.value?.members ?? 0 },
  { label: 'Total Veterinarians', value: analytics.value?.vets ?? 0 },
  { label: 'Total Partners', value: analytics.value?.partners ?? 0 }
])

onMounted(async () => {
  try {
    loading.value = true
    analytics.value = await analyticsStore.fetchAnalytics()
  } finally {
    loading.value = false
  }
})
</script>
