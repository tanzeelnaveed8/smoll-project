<template>
  <div class="px-8 py-10 d-flex flex-column gr-6 fill-height" style="background-color: #f8fafb">
    <v-sheet>
      <p
        class="mb-3 text-h5 font-weight-regular text-grey1"
        style="font-family: 'CooperLtBT' !important"
      >
        Welcome {{ user?.name ?? '-' }}
      </p>
      <h1
        class="text-grey1 text-h3 font-weight-regular"
        style="font-family: 'CooperLtBT' !important"
      >
        Our mission is to minimise the animal’s pain by providing faster access to vet care
      </h1>
    </v-sheet>
    <UpcomingAppointments :loading :appointments />
  </div>
</template>

<script setup lang="ts">
import UpcomingAppointments from '@/components/app/homepage/UpcomingAppointments.vue'
import useMitt from '@/functions/useMitt'
import { useAppointmentsStore, type Appointment } from '@/stores/appointments'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc' 
import { onMounted, ref } from 'vue'

dayjs.extend(utc)

const authStore = useAuthStore()
const { user } = authStore
const { emitter } = useMitt()

const loading = ref(true)

const appointments = ref<Appointment[] | []>([])

const appointmentsStore = useAppointmentsStore()

const fetchAppointments = async () => {
  try {
    loading.value = true
    const fetchedAppointments = await appointmentsStore.fetchAppointments()
    appointments.value = fetchedAppointments.filter((appointment: Appointment) => {
        return dayjs().subtract(10, 'minute').isBefore(dayjs(appointment.scheduledAt))
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchAppointments()
  emitter.on('case-details-drawer:refetch_upcoming-appointments', async () => {
    await fetchAppointments()
  })
})
</script>
