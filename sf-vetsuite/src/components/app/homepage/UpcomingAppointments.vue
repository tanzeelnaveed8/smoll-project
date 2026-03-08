<template>
  <v-sheet color="#fff" rounded="lg" class="w-100" style="padding: 18px" min-height="294">
    <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
      <p style="font-weight: 600">Upcoming Appointments</p>
    </v-sheet>
    <v-sheet class="d-flex justify-center align-center" height="100%">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>

      <p v-else-if="!consultations?.length" class="text-grey2" style="font-weight: 600">
        No Appointments
      </p>
      <v-list v-else :class="`align-self-start mt-2  consultation-scroll  ${consultations.length > 5 && 'pr-2'}`" width="100%" :style="` ${consultations.length > 5 && 'overflow-y:scroll;'}`">
        <AppointmentItem
          v-for="consultation in consultations"
          :key="consultation.id"
          :consultation
        />
      </v-list>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import type { Consultation } from '@/stores/types/consultation.d'
import AppointmentItem from './AppointmentItem.vue'

const props = defineProps<{
  consultations: Consultation[] | null
  loading: boolean
}>()
</script>

<style lang="scss" scoped>

.consultation-scroll {
  min-height:262px; 
  max-height: calc(100vh - 430px);
  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #c8c8c8;
  }
}

</style>