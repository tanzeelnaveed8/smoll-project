<template>
  <v-sheet class="d-flex justify-center">
    <v-sheet class="mx-8 d-flex flex-column gr-6 w-100" maxWidth="1140">
      <div class="d-flex gc-6">
        <h4 class="font-weight-bold">Set your Availabilty</h4>
        <p class="text-body-2 text-grey2" style="font-weight: 600; line-height: 24px">
          Timezone: {{ user?.timeZone }}
        </p>
      </div>
      <v-sheet
        class="pa-8 d-flex flex-column gr-4"
        height="575"
        style="border: 1px solid #dde7ee; border-radius: 30px"
      >
        <p class="text-grey2" style="font-weight: 600">Weekly</p>

        <v-divider horizontal color="#dde7ee" class="opacity-100" />
        <v-sheet class="availabilities-scroll">
          <v-sheet v-if="loading" class="d-flex justify-center align-center h-100 w-100">
            <v-progress-circular indeterminate color="primary" />
          </v-sheet>
          <v-sheet v-else class="d-flex flex-column gr-6">
            <ManageAppointment
              v-for="item in availabilities"
              :key="item.id"
              :availabilityItem="item"
              @handleAvailabilitySchedule="handleAvailabilitySchedule"
            />
          </v-sheet>
        </v-sheet>
        <v-sheet class="d-flex justify-end mt-2">
          <v-btn :disabled="actionLoading" :loading="actionLoading" @click="updateAvailabilities"
            >Update</v-btn
          >
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useAvailabilitiesStore } from '@/stores/availabilities'
import ManageAppointment from './ManageAppointment.vue'
import { onMounted, ref, watch } from 'vue'
import type { AvailabilityItem, UpdateAvailabilitiesPayload } from '@/stores/types/availabilities'
import { defaultAvailabilities } from '@/constant'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { convertTimeToUtc } from '@/utils/helpers'
import { toast } from 'vue3-toastify'
const availabilities = ref<AvailabilityItem[]>(defaultAvailabilities)

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const availabilitiesStore = useAvailabilitiesStore()
const isMounted = ref(true)
const loading = ref(false)
const actionLoading = ref(false)
const availabiltySchedule = ref<UpdateAvailabilitiesPayload>({
  availability: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: []
  }
})

const handleAvailabilitySchedule = (item: {
  day: string
  availabilities: { from: string; to: string }[]
}) => {
  availabiltySchedule.value = {
    availability: { ...availabiltySchedule.value.availability, [item.day]: item.availabilities }
  }
}

const fetchAvailabilities = async () => {
  try {
    loading.value = true
    const res = await availabilitiesStore.fetchAvailabilities()
    if (!res.length) return
    availabilities.value = []
    const sortedSchedule = res
      .filter((item: AvailabilityItem) => item.dayOfWeek !== null)
      .sort((a: AvailabilityItem, b: AvailabilityItem) => +a.id - +b.id)

    availabilities.value = sortedSchedule
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const updateAvailabilities = async () => {
  try {
    const availabilitiesPayload = {
      availability: Object.entries(availabiltySchedule.value.availability).reduce(
        (acc, [day, slots]) => ({
          ...acc,
          [day]: slots.map((slot) => ({
            from: convertTimeToUtc(slot.from),
            to: convertTimeToUtc(slot.to)
          }))
        }),
        {}
      )
    }

    actionLoading.value = true
    await availabilitiesStore.updateAvailabilities(availabilitiesPayload)

    toast.success('Availabilities updated successfully')
  } finally {
    actionLoading.value = false
  }
}

onMounted(async () => {
  await fetchAvailabilities()
  isMounted.value = false
})
</script>

<style lang="scss" scoped>
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
</style>
