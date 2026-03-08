<template>
  <div class="px-8 py-10 d-flex flex-column gr-6 h-100" style="background-color: #f8fafb">
    <v-sheet>
      <p class="mb-3 text-h5 font-weight-regular text-grey1" style="font-family: 'CooperLtBT' !important">
        Hello {{ user?.name }}
      </p>
      <h1 class="text-grey1 text-h3 font-weight-regular" style="
          font-family: 'CooperLtBT' !important;
          max-width: 1106px;
          letter-spacing: 1.2px !important;
        ">
        Our mission is to minimise the animal’s pain by providing faster access to vet care
      </h1>
    </v-sheet>
    <UpcomingAppointments :consultations="consultations" :loading />
  </div>
</template>

<script setup lang="ts">
import UpcomingAppointments from '@/components/app/homepage/UpcomingAppointments.vue'
import { useAuthStore } from '@/stores/auth'
import { useConsultationStore } from '@/stores/consultation'
import type { Consultation } from '@/stores/types/consultation.d'
import { onMounted, onUnmounted, ref } from 'vue'
import useMitt from '@/functions/useMitt'

const { user } = useAuthStore()
const consultations = ref<Consultation[] | null>(null)
const loading = ref(true)
const consultationStore = useConsultationStore()
const { emitter } = useMitt()

const fetchConsultations = async () => {
  try {
    loading.value = true
    const fetchedConsultation = await consultationStore.fetchConsultation('scheduled')
    consultations.value = fetchedConsultation.data
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchConsultations()
  emitter.on('refetch-upcoming-appointment', async () => {
    await fetchConsultations()

  })
})

onUnmounted(() => {
  emitter.off('refetch-upcoming-appointment')
})
</script>
