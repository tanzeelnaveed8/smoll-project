<template>
  <v-sheet class="px-8 d-flex justify-center py-8">
    <v-sheet class="d-flex flex-column gr-6 w-100" max-width="1104">
      <v-sheet class="d-flex justify-space-between">
        <v-sheet max-width="507">
          <h2 style="font-weight: 600; line-height: 32px">Current Services</h2>
          <p class="mt-1">
            Add single, one-time items or products from your product catalogue to this invoice.
          </p>
        </v-sheet>
        <v-btn flat appendIcon="$tb-plus" class="px-3 btn" @click="drawer = true"
          >Add Service</v-btn
        >
      </v-sheet>
      <ServicesTable :loading :services />
    </v-sheet>
    <v-dialog v-model="drawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
      <ManageServicesDrawer @close="drawer = false" />
    </v-dialog>
  </v-sheet>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ServicesTable from './ServicesTable.vue'
import ManageServicesDrawer from '@/components/drawer/ManageServicesDrawer.vue'
import { useServicesStore } from '@/stores/services'
import type { Service } from '@/stores/types/services'
import useMitt from '@/functions/useMitt'

const loading = ref(true)
const drawer = ref(false)

console.log('console')

const services = ref<Service[] | []>([])
const { fetchServices } = useServicesStore()

const { emitter } = useMitt()

const updateServices = (payload: Service) => {
  const serviceIndex = services.value?.findIndex((service) => service.id === payload.id)
  const servicesArr = services.value
  if (serviceIndex !== -1) {
    servicesArr[serviceIndex] = payload
    services.value = servicesArr
  } else {
    services.value = [...services.value, payload]
  }
}

const deleteService = (id: string) => {
  const filterService = services.value.filter((service) => `${service.id}` !== `${id}`)
  services.value = filterService
}

const getServices = async () => {
  try {
    loading.value = true
    const fetchedServices = await fetchServices()
    services.value = fetchedServices
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getServices()
  emitter.on('manage-service-drawer:update_servcie', (event: { payload: Service }) =>
    updateServices(event.payload)
  )

  emitter.on('manage-service-drawer:delete_servcie', (event: { id: string }) =>
    deleteService(event.id)
  )

  emitter.on('refetch_services', async () => getServices())
})

onUnmounted(async () => {
  emitter.off('manage-service-drawer:update_servcie')
  emitter.off('manage-service-drawer:delete_servcie')
  emitter.off('refetch_services')
})
</script>

<style lang="scss" scoped>
.dialog:deep(.v-overlay__content) {
  right: 0;
}

.btn {
  text-indent: 0px;
  letter-spacing: 0px;
  font-weight: 600;
}
</style>
