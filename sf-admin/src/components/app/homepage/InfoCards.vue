<template>
  <v-sheet v-if="loading" class="d-flex w-100 gc-4" height="162">
    <v-skeleton-loader
      v-for="(i, ind) in 4"
      class="w-100 h-100 rounded-lg overflow-hidden loading"
      :key="ind"
      type="image"
    />
  </v-sheet>
  <v-sheet v-else class="d-flex justify-space-between gc-4">
    <v-card
      v-for="(card) in infoCards"
      :key="card.value"
      flat
      class="px-4 py-5 w-100 rounded-lg d-flex flex-column gr-6"
      style="border: 1px solid #d0d7dc"
    >
      <div>
        <p
          class="text-grey1"
          style="font-size: 32px; line-height: 40px; font-weight: 400; font-family: 'Cooper'"
        >
          {{ analytics ? analytics[card.value] : '' }}
        </p>
        <p class="mt-2 text-grey2 text-body-1" style="line-height: 24px; font-weight: 600">
          {{ card.title }}
        </p>
      </div>
      <v-card-actions class="d-flex justify-end pa-0" style="min-height: auto">
        <v-btn
          height="24"
          flat
          :to="card.to"
          class="px-2 text-primary text-caption"
          variant="elevated"
          append-icon="$tb-arrow-right"
          style="
            background-color: #f4f5f5 !important;
            font-weight: 500 !important;
            line-height: 16px;
          "
        >
          Manage
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>
<script lang="ts" setup>
import type { Analytics } from '@/stores/analytics'

defineProps<{
  analytics: Analytics | null
  loading: boolean
}>()

const infoCards: Array<{ title: string; to: string; value: keyof Analytics }> = [
  { title: 'Customers', to: '/members', value: 'members' },
  { title: 'Our Veterinarians', to: '/experts', value: 'vets' },
  { title: 'Partners', to: '/partners', value: 'partners' },
  { title: 'Total Visits', to: '/visits', value: 'cases' },
  { title: 'Services', to: '/services', value: 'services' },
  { title: 'Products', to: '/products', value: 'products' },
  { title: 'Open Visits', to: '/visits', value: 'openCases' },
  { title: 'Closed Visits', to: '/visits', value: 'closedCases' }
]
</script>

<style lang="scss" scoped>
.loading {
  &:deep(.v-skeleton-loader__bone) {
    height: 100%;
  }
}
</style>
