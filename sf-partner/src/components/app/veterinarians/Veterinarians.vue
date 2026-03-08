<template>
  <v-sheet class="px-8 d-flex justify-center py-8">
    <v-sheet class="d-flex flex-column gr-6 w-100" max-width="1104">
      <v-sheet class="d-flex justify-space-between w-100">
        <h2 style="font-weight: 600; line-height: 32px">Manage veterinarian</h2>
        <v-btn flat appendIcon="$tb-plus" class="px-3 btn" @click="drawerAddVet = true"
          >Add Vet</v-btn
        >
      </v-sheet>
      <VeterinariansTable :loading :veterinarians />
    </v-sheet>
  </v-sheet>
  <v-dialog
    v-model="drawerAddVet"
    transition="slide-x-reverse-transition"
    width="auto"
    class="dialog"
  >
    <AddVetDrawer @close="drawerAddVet = false" />
  </v-dialog>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import AddVetDrawer from '@/components/drawer/addVetDrawer/AddVetDrawer.vue'
import useMitt from '@/functions/useMitt'
import { useVetStore } from '@/stores/vets'
import type { Veterinarians } from '@/stores/types/vet'
import VeterinariansTable from './VeterinariansTable.vue'
import { storeToRefs } from 'pinia'

const loading = ref(false)
const drawerAddVet = ref(false)

const vetStore = useVetStore()
const { fetchVets } = vetStore
const {veterinarians} = storeToRefs(vetStore)

const { emitter } = useMitt()

const updateServices = (payload: Veterinarians) => {
  const vetIndex = veterinarians.value?.findIndex((vet) => vet.id === payload.id) as number

  const vetsArr = veterinarians.value as any[]
  if (vetIndex !== -1) {
    vetsArr[vetIndex] = payload
    veterinarians.value = vetsArr
  } else {
    veterinarians.value = [...(veterinarians.value as []), payload]
  }
}

const deleteService = (id: string) => {
  if (veterinarians.value) {
    const filterService = veterinarians.value.filter((vet) => `${vet.id}` !== `${id}`)
    veterinarians.value = filterService
  }
}

const getVets = async () => {
  try {
    loading.value = true
    const fetchedVets = await fetchVets()
    veterinarians.value = fetchedVets
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if(!veterinarians.value){
  await getVets()
  }
  emitter.on('manage-service-drawer:update_vet', (event: { payload: Veterinarians }) =>
    updateServices(event.payload)
  )
  emitter.on('profile-details-drawer:delete_vet', (event: { id: string }) =>
    deleteService(event.id)
  )
})

onUnmounted(async () => {
  emitter.off('manage-service-drawer:update_vet')
  emitter.off('profile-details-drawer:delete_vet')
})
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.availabilities-scroll {
  overflow-y: scroll;
  min-height: 396px;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #e8e8e8;
  }
}

.btn {
  text-indent: 0px;
  letter-spacing: 0px;
  font-weight: 600;
}
</style>
