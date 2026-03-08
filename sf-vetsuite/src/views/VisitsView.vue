<template>
  <div class="px-8 py-10 d-flex flex-column gr-6 h-100" style="background-color: #f8fafb">
    <v-sheet>
      <p class="mb-3 text-h5 font-weight-regular text-grey1" style="font-family: 'CooperLtBT' !important">
        Visits
      </p>
      <h1 class="text-grey1 text-h3 font-weight-regular" style="
          font-family: 'CooperLtBT' !important;
          max-width: 1106px;
          letter-spacing: 1.2px !important;
        ">
        Visits history (view only)
      </h1>
    </v-sheet>

    <v-sheet color="#fff" rounded="lg" class="w-100" style="padding: 18px" min-height="294">
      <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
        <p style="font-weight: 600">Past visits</p>
      </v-sheet>
      <v-sheet class="d-flex justify-center align-center" height="100%">
        <v-progress-circular v-if="loading" indeterminate color="primary" />
        <p v-else-if="!consultations?.length" class="text-grey2" style="font-weight: 600">
          No past visits
        </p>
        <v-list
          v-else
          :class="`align-self-start mt-2 consultation-scroll ${consultations.length > 5 ? 'pr-2' : ''}`"
          width="100%"
          :style="consultations.length > 5 ? 'overflow-y:scroll;' : ''"
        >
          <AppointmentItem
            v-for="consultation in consultations"
            :key="consultation.id"
            :consultation="consultation"
          />
        </v-list>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import AppointmentItem from '@/components/app/homepage/AppointmentItem.vue'
import { useConsultationStore } from '@/stores/consultation'
import type { Consultation } from '@/stores/types/consultation.d'
import { onMounted, ref } from 'vue'

const consultationStore = useConsultationStore()
const consultations = ref<Consultation[] | null>(null)
const loading = ref(true)

const fetchConsultations = async () => {
  try {
    loading.value = true
    const res = await consultationStore.fetchConsultation('all')
    consultations.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConsultations()
})
</script>

<style lang="scss" scoped>
.consultation-scroll {
  min-height: 262px;
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
