<template>
  <v-data-table
    :loading="loading"
    class="table text-body-2 text-grey1"
    height="484"
    style="font-weight: 600; line-height: 24px"
    hide-default-footer
    :items-per-page="items?.length || 20"
    :items="items ?? []"
    :headers="headers"
    hover
    @click:row="handleRowClick"
  >
    <template #item.name="{ item }">
      <v-sheet class="d-flex gc-2 align-center">
        <v-avatar
          color="#d5d5d5"
          size="32"
          :image="item.profileImg?.url"
          icon="$tb-user"
          class="text-caption text-grey2"
        />
        <p>{{ item.name }}</p>
      </v-sheet>
    </template>
  </v-data-table>
  <v-dialog
    v-model="drawerProfile"
    transition="slide-x-reverse-transition"
    width="auto"
    class="dialog"
  >
    <ProfileDetailsDrawer :loading="actionLoading" :vetDetails="vetDetails!" @close="drawerProfile = false" />
  </v-dialog>
</template>

<script lang="ts" setup>
import ProfileDetailsDrawer from '@/components/drawer/ProfileDetailsDrawer.vue'
import type { VetDetails, Veterinarians } from '@/stores/types/vet'
import { useVetStore } from '@/stores/vets'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

const props = defineProps<{
  loading: boolean
  veterinarians: Veterinarians[] | null
}>()

const vetStore = useVetStore()

const headers = [
  { title: 'Name', key: 'name', width: '168' },
  { title: 'Email', key: 'email', width: '168' },
  { title: 'Added On', key: 'createdAt', width: '168' },
  { title: 'Designation', key: 'designation', width: '168' },
  { title: 'Phone', key: 'phone', width: '168' }
] as const

const actionLoading = ref(false)

const items = computed(() =>
  props.veterinarians?.map((item) => ({
    ...item,
    name :item.name.replace(" undefined",""),
    email: item.email ?? '-',
    createdAt: dayjs(item.createdAt).format('DD MMMM YYYY')
  }))
)

const vetDetails = ref<VetDetails | null>()

const drawerProfile = ref(false)

const handleRowClick = async (event: Event, row: any) => {
  const id = row.item.id
  drawerProfile.value = true

  actionLoading.value = true
  const details = await vetStore.fetchVetDetails(id)
  vetDetails.value = details
  actionLoading.value = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.table {
  &:deep(td) {
    white-space: nowrap !important;
  }

  &:deep(.v-data-table__th) {
    font-weight: 600 !important;
    color: #494949 !important;
    font-size: 14px;
    line-height: 16px;
    white-space: nowrap;
  }
}
</style>
