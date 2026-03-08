<template>
  <v-sheet class="pa-8 d-flex gr-5 flex-column" style="max-width: 1104px; margin: auto">
    <CaseTopBar :loading @refetchCases="fetchCases" />
    <v-sheet class="d-flex flex-column gr-6">
      <CasesTable :cases="fetchedCases.cases" :loading="loading" />
      <CasesFooter :maxValue="maxValue" />
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import CaseTopBar from '@/components/app/cases/CasesTopBar.vue'
import CasesTable from '@/components/app/cases/CasesTable.vue'
import CasesFooter from '@/components/app/cases/CasesFooter.vue'
import { useCaseStore } from '@/stores/case'
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, type LocationQueryValue } from 'vue-router'
import useMitt from '@/functions/useMitt'

const route = useRoute()
const caseStore = useCaseStore()

const loading = ref(false)

const fetchedCases = ref({ cases: [], totalCases: 0 })

const maxValue = ref()
const { emitter } = useMitt()

const fetchCases = async (payload?: { search?: string; page?: number; limit?: number }) => {
  try {
    loading.value = true
    const response = await caseStore.fetchCases(payload)
    fetchedCases.value = { cases: response.data, totalCases: response.count }
  } finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  const page = Number(route.query.page ?? 1)
  const limit = Number(route.query.rows ?? 10)
  const search = (route.query.search as LocationQueryValue) ?? ''
  try {
    await fetchCases({
      page,
      limit,
      search
    })
  } catch (error) {
    console.error(error)
  } finally {
    maxValue.value = Math.ceil(Number(fetchedCases.value.totalCases) / limit)
  }
})

watch(
  () => route.params,
  async () => {
    const page = Number(route.query.page ?? 1)
    const limit = Number(route.query.rows ?? 10)
    const search = (route.query.search as LocationQueryValue) ?? ''

    try {
      await fetchCases({ page, limit, search })
    } catch (error) {
      console.error(error)
    } finally {
      maxValue.value = Math.ceil(Number(fetchedCases.value.totalCases) / limit)
    }
  }
)

onMounted(() => {
  emitter.on('refetch-cases', async () => {
    await fetchCases()
  })
})

onUnmounted(() => {
  emitter.off('refetch-cases')
})

</script>

<style lang="scss" scoped></style>
