<template>
  <v-sheet class="d-flex justify-center">
    <div class="px-6 py-6 d-flex flex-column gr-6 w-100" style="max-width: 1140px">
      <v-sheet class="d-flex justify-space-between w-100">
        <v-sheet class="d-flex align-center gc-4">
          <UtilityBar path="Veterinarians" />
          <v-btn
            v-push
            flat
            class="text-grey1 px-0 reload-btn"
            min-width="auto"
            height="auto"
            min-height="auto"
            color="transparent "
            style="margin: 0px"
            @click="handleReload"
          >
            <template v-slot:prepend>
              <v-icon icon="$tb-reload" size="20" />
            </template>
          </v-btn>
        </v-sheet>

        <v-btn
          color="grey1"
          class="text-body-2 px-2"
          prepend-icon="$tb-plus"
          density="comfortable"
          to="/smoll-home/veterinarians/add"
        >
          <template v-slot:prepend>
            <v-icon icon="$tb-plus" size="20" style="margin-right: -4px" />
          </template>
          New Vet
        </v-btn>
      </v-sheet>
      <v-sheet class="d-flex flex-column gr-3">
        <v-tabs v-model="tab" class="tabs text-grey2" height="auto">
          <v-tab
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            style="line-height: 18px"
            class="pa-1 pb-2"
            min-width="auto"
            height="auto"
            >{{ tab.title }}</v-tab
          >
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item v-for="tab in tabs" :value="tab.value">
            <HomeVetsWindow :homeVets="homeVets.data" :actionLoading :maxValue />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script lang="ts" setup>
import HomeVetsWindow from '@/components/app/homeVets/HomeVetsWindow.vue'
import UtilityBar from '@/components/partials/UtilityBar.vue'
import useMitt from '@/functions/useMitt'
import type { HomeVet } from '@/stores/types/homeVets'
import { useHomeVetsStore } from '@/stores/homeVets'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const { emitter } = useMitt()

const tab = ref('active')
const tabs = [
  { title: 'Active', value: 'active' },
  { title: 'Deactivated', value: 'deactivate' }
]
const isSuspended = computed(() => tab.value === 'deactivate')

const homeVets = ref<{ data: HomeVet[]; totalRequests: number }>({ data: [], totalRequests: 0 })

const homeVetsStore = useHomeVetsStore()
const actionLoading = ref(false)
const maxValue = ref()

const getHomeVets = async (isSuspended: boolean, search?: string, page?: number) => {
  try {
    actionLoading.value = true
    const { data, count } = await homeVetsStore.fetchHomeVets(isSuspended, search, page)
    homeVets.value = { data, totalRequests: count }
    maxValue.value = Math.ceil(Number(count) / 10)
  } finally {
    actionLoading.value = false
  }
}

const handleReload = () => {
  getHomeVets(isSuspended.value)
}

watch(
  [isSuspended, () => route.query.page, () => route.query.search],
  ([suspended, page, search]) => {
    getHomeVets(suspended as boolean, (search as string) ?? '', Number(page) || 1)
  },
  { immediate: true }
)

watch(tab, () => {
  router.replace({ query: undefined })
})

onMounted(() => {
  emitter.on('home-vets:update', () => getHomeVets(isSuspended.value))
})

onUnmounted(() => {
  emitter.off('home-vets:update', () => getHomeVets(isSuspended.value))
})
</script>

<style scoped lang="scss">
.tabs:deep(.v-slide-group__content) {
  gap: 16px;
}
.tabs:deep(.v-tab-item--selected) {
  color: #222222 !important;
}
.reload-btn {
  &:deep(.v-btn__prepend) {
    margin: 0px;
  }
}
</style>
