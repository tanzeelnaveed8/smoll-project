<template>
  <v-sheet class="d-flex flex-column gr-6">
    <HomeVetsTable :homeVets="homeVets" :actionLoading />
    <TableFooter :maxValue path="smoll-home/veterinarians" />
  </v-sheet>
</template>

<script lang="ts" setup>
import TableFooter from '@/components/partials/table/TableFooter.vue'
import HomeVetsTable from './HomeVetsTable.vue'
import type { HomeVet } from '@/stores/types/homeVets'

defineProps<{
  maxValue: number
  homeVets: HomeVet[]
  actionLoading: boolean
}>()
</script>
