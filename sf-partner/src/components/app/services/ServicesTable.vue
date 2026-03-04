<template>
 <v-data-table 
    :loading="loading"
    class="table text-body-2 text-grey1"
    height="454"
    style="font-weight: 600; line-height: 24px" 
    hide-default-footer 
    :items-per-page="services?.length || 20"
    :items="services" 
    :headers="headers"
  >
    <template #item.title="{ item }">
      <div class="d-flex align-center">
        <p class="item-title">{{ item.title }}</p>
        <v-tooltip v-if="item.quickBooking" activator="parent" location="top" open-delay="200" text="Service included in Quick list">
          <template v-slot:activator="{ props }">
            <v-icon icon="$tb-clock-bolt" size="20" v-bind="props" class="cursor-pointer " style="color: #00a907;" />
          </template>
        </v-tooltip>
      </div>
    </template>

    <template #item.description="{ item }">
      <p class="item-description">{{ item.description }}</p>
    </template>

    <template #item.action="{ item }">
      <v-btn variant="plain" color="#10AFE1" class="px-0" minWidth="auto" @click="handleEdit($event, item)">Edit</v-btn>
    </template>

  </v-data-table>
  <v-dialog v-model="drawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
    <ManageServicesDrawer @close="drawer = false" type="edit" :formData />
  </v-dialog>
</template>
<script lang="ts" setup>
import ManageServicesDrawer from '@/components/drawer/ManageServicesDrawer.vue'
import type { Service } from '@/stores/types/services'
import { computed, ref, watch } from 'vue'

defineProps<{
  loading: boolean
  services: Service[]
}>()

const drawer = ref(false)
const formData = ref()

const headers = [
  { title: 'Services title', key: 'title', width: '184' },
  { title: 'Description', key: 'description', width: '184' },
  { title: 'Type', key: 'type', width: '184' },
  { title: 'AED', key: 'price', width: '184' },
  { title: 'Action', key: 'action', width: '90' }
]

const handleEdit = (event: Event, payload: Service) => {
  formData.value = payload
  drawer.value = true
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

.item-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}

.item-title {
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 8px;
}
</style>
