<template>
  <div class="pt-4 h-100 w-100 d-flex flex-column gr-8">
    <CalendarTop :loading :veterinarians />
    <CalendarTimeline
      :appointments
      @fetchNewConsultations="fetchAppointments"
      @setCalendarStartDate="calendarStartDate = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import CalendarTop from '@/components/app/calendar/CalendarTop.vue'
import CalendarTimeline from '@/components/app/calendar/CalendarTimeline.vue'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useAppointmentsStore } from '@/stores/appointments'
import useMitt from '@/functions/useMitt'
import { useRouter } from 'vue-router'
import { useVetStore } from '@/stores/vets'
import { storeToRefs } from 'pinia'
import type { Period } from '@/stores/types/global'

dayjs.extend(utc)

const { emitter } = useMitt()

const router= useRouter()

const vetStore = useVetStore()
const { fetchVets } = vetStore
const {veterinarians} = storeToRefs(vetStore)
const { fetchAppointmentsCalendar } = useAppointmentsStore()

const appointments = ref<any[] | []>([])
const calendarStartDate = ref('')
const loading = ref(true)

const selectedVet = computed(()=>router.currentRoute.value.query.vet || null) 

const startDate = computed(
  () => dayjs().set('hour', 0).utc().format('YYYY-MM-DDTHH:mm').split('+')[0] + 'Z'
)

const fetchAppointments = async (startTime: string, replace: boolean = false) => { 
  //#REPLACE: This boolean parameter determines whether to replace the existing appointments or append to them.

  const period = router.currentRoute.value.query.period || 'monthly'
  const vetId = router.currentRoute.value.query.vet || undefined

  try {
    loading.value = true
    const data = await fetchAppointmentsCalendar(startTime, period as Period, vetId as string)
    appointments.value = replace ? data.appointments : [...appointments.value, ...data.appointments]
    return data
  } finally {
    loading.value = false
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

watch(selectedVet,async ()=>{
fetchAppointments(calendarStartDate.value || startDate.value , true)
})

onMounted(async () => {
  await fetchAppointments(startDate.value)

  emitter.on('case-details-drawer:refetch_appointments', () => {
    appointments.value = []
    const date = calendarStartDate.value ? calendarStartDate.value : startDate.value
    fetchAppointments(date)
  })

  if(!veterinarians.value){
    getVets()
  }
})

onUnmounted(() => {
  emitter.off('case-details-drawer:refetch_appointments')
})
</script>

<style lang="scss" scoped></style>
