<template>
  <v-sheet class="d-flex justify-center">
    <v-sheet class="d-flex flex-column" max-width="1104">
      <v-sheet class="pa-8 pb-6">
        <RequestTopBar :loading @refetchRequests="fetchRequests"/>
      </v-sheet>
      <v-sheet class="d-flex flex-column gr-8 px-8 py-8">
        <RequestTable :requestInfo="fetchedRequests.request" :loading="loading" />
        <RequestFooter :maxValue="maxValue" />
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useCaseStore } from '@/stores/case'
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, type LocationQueryValue } from 'vue-router'
import RequestTopBar from '@/components/app/request/RequestTopBar.vue'
import RequestTable from '@/components/app/request/RequestTable.vue'
import RequestFooter from '@/components/app/request/RequestFooter.vue'
import useMitt from '@/functions/useMitt'

const route = useRoute()
const caseStore = useCaseStore()

const loading = ref(false)
const { emitter } = useMitt()

const fetchedRequests = ref<{ request: any; totalRequests: number }>({
  request: [],
  totalRequests: 0
})

const maxValue = ref()

const fetchRequests = async (payload?: { search?: string; page?: number; limit?: number }) => {
  try {
    loading.value = true
    const response = await caseStore.fetchCases(payload)
    fetchedRequests.value = { request: response.data, totalRequests: response.count }
  } finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  const page = Number(route.query.page ?? 1)
  const limit = Number(route.query.rows ?? 10)
  const search = (route.query.search as LocationQueryValue) ?? ''
  try {
    await fetchRequests({
      page,
      limit,
      search
    })
  } finally {
    maxValue.value = Math.ceil(Number(fetchedRequests.value.totalRequests) / limit)
  }
})

watch(
  () => route.params,
  async () => {
    const page = Number(route.query.page ?? 1)
    const limit = Number(route.query.rows ?? 10)
    const search = (route.query.search as LocationQueryValue) ?? ''

    try {
      loading.value = true
      await fetchRequests({ page, limit, search })
    } finally {
      loading.value = false
      maxValue.value = Math.ceil(Number(fetchedRequests.value.totalRequests) / limit)
    }
  }
)

onMounted(() => {
  emitter.on('quotation-drawer:refetch_cases', async () => {
    await fetchRequests()
  })
})

onUnmounted(() => {
  emitter.off('quotation-drawer:refetch_cases')
})
</script>

<style lang="scss" scoped>
.tabs:deep(.v-slide-group__content) {
  gap: 16px;
}
.tabs:deep(.v-tab-item--selected) {
  color: #222222 !important;
}

.tabs:deep(.v-tab) {
  padding-bottom: 14px !important;
}

.tabs:deep(.v-tab__slider) {
  color: #427594;
  height: 4px;
}
</style>
