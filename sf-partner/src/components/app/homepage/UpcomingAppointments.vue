<template>
  <v-sheet color="#fff" rounded="lg" class="w-100" style="padding: 18px;" min-height="294">
    <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
      <p style="font-weight: 600">Upcoming Appointments</p>
    </v-sheet>
    <v-sheet class="d-flex justify-center align-center" height="100%">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>

      <p v-else-if="!appointments?.length" class="text-grey2" style="font-weight: 600">
        No Appointments
      </p>
      <v-list v-else :class="`align-self-start mt-2 appointment-scroll ${appointments.length > 5 && 'pr-2'}`" width="100%" :style="`${appointments.length > 5 && 'overflow-y:scroll;'}`" >
        <AppointmentItem
          v-for="appointment in appointments"
          :key="appointment.id"
          :appointment="appointment"
        />
      </v-list>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import type { Appointment } from '@/stores/appointments'
import AppointmentItem from './AppointmentItem.vue'

const props = defineProps<{
  appointments: Appointment[]
  loading: boolean
}>()
</script>

<style lang="scss" scoped>

.appointment-scroll {
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