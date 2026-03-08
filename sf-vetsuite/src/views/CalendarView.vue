<template>
  <div class="pt-4 h-100 w-100 d-flex flex-column gr-8">
    <CalendarTop :loading @refetchConsultations="refetchConsultations" />
    <CalendarTimeline
      :consultations="appointments"
      @fetchNewConsultations="fetchConsultations"
      @setCalendarStartDate="calendarStartDate = $event"
    />
  </div>
</template>

<script setup lang="ts">
import CalendarTop from '@/components/app/calendar/CalendarTop.vue'
import CalendarTimeline from '@/components/app/calendar/CalendarTimeline.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useConsultationStore } from '@/stores/consultation'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { storeToRefs } from 'pinia'
import useMitt from '@/functions/useMitt'
import { useRouter } from 'vue-router'

dayjs.extend(utc)

const loading = ref(true)
const consultationStore = useConsultationStore()
const { appointments } = storeToRefs(consultationStore)
const { emitter } = useMitt()

const router= useRouter()

const startDate = computed(
  () => dayjs().set('hour', 0).utc().format('YYYY-MM-DDTHH:mm').split('+')[0] + 'Z'
)
const period = computed(()=> router.currentRoute.value.query.period || 'monthly')

const calendarStartDate = ref('')

const fetchConsultations = async (startTime: string) => {
  try {
    loading.value = true
    const data = await consultationStore.fetchConsultationsCalendar(startTime,period.value as 'monthly' | 'weekly')
    return data
  } finally {
    loading.value = false
  }
}

const refetchConsultations = async () => {
  loading.value = true
  emitter.emit('inbox-details-drawer:CASE_CLOSED', {
    startTime: calendarStartDate.value || startDate.value,
    period: period.value as 'monthly' | 'weekly'
  })
  setTimeout(() => {
    loading.value = false
  }, 700)
}

onMounted(async () => {
  await fetchConsultations(startDate.value)
})
</script>

<style lang="scss" scoped></style>
