<template>
  <v-data-table
    :loading="loading"
    class="table text-body-2 text-grey1"
    height="484"
    style="font-weight: 600"
    hide-default-footer
    items-per-page="20"
    :items="items"
    :headers="headers"
    :hover="true"
    @click:row="handleRowClick"
  >
  <template #item.id="{ item }">
    <VueHighlightWords :textToHighlight="item.id" :searchWords="[`${$route.query.search}`]" />
  </template>

  <template #item.name="{ item }">
    <VueHighlightWords :textToHighlight="item.name" :searchWords="[`${$route.query.search}`]" />
  </template>

    <template #item.status="{ item }">
      <p :style="`color: ${item.status.color}`" class="text-capitalize">
        {{ item.status.label }}
      </p>
    </template>

    <template #item.description="{ item }">
    <VueHighlightWords :textToHighlight="item.description" :searchWords="[`${$route.query.search}`]" />
  </template>

  </v-data-table>
  <v-dialog v-model="drawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
    <CaseDetailsDrawer
      class="dialog"
      @close="drawer = false"
      :caseDetails="caseDetails"
      :loading="actionLoading"
    />
  </v-dialog>
  
  
</template>

<script lang="ts" setup>
import type { Case } from '@/stores/types/case.d'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useCaseStore } from '@/stores/case'
import CaseDetailsDrawer from '@/components/drawer/caseDetailsDrawer/CaseDetailsDrawer.vue'
import { getCaseStatusData } from '@/utils/helpers'
import VueHighlightWords from 'vue-highlight-words'
import EscalateCaseDrawer from '@/components/drawer/escalateDrawer/EscalateCaseDrawer.vue'

const props = defineProps<{
  cases: Case[]
  loading: boolean
}>()

const caseStore = useCaseStore()

const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Patient name/Pet name', key: 'name' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Status', key: 'status' },
  { title: 'Case Brief', key: 'description', maxWidth: '400px' }
])
const drawer = ref(false)
const actionLoading = ref(false)
const caseDetails = ref<Case | null>(null)

const items = computed(() => {
  return props.cases.map((item) => ({
    ...item,
    createdAt: dayjs(item.updatedAt).format('hh:mm A, DD MMMM YYYY'),
    name: `${item.member}/${item.pet}`,
    status: getCaseStatusData(item.status),
    description:
      item.description.length > 100 ? item.description.slice(0, 60) + '...' : item.description
  }))
})

const handleRowClick = async (event: Event, row: any) => {
  const id = row.item.id

  try {
    actionLoading.value = true
    drawer.value = true
    const details = await caseStore.fetchCaseDetails(id)
    caseDetails.value = details
  } finally {
    actionLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.table {
  &:deep(td) {
    white-space: nowrap !important;
  }

  &:deep(.v-data-table__th) {
    font-weight: 700 !important;
    color: #494949 !important;
  }
}

.td-cases {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 591px;
}

.dialog:deep(.v-overlay__content) {
  right: 0;
}
</style>
