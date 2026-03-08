<template>
  <v-sheet style="height: calc(100vh - 70px)">
    <v-sheet class="pa-8 h-100 d-flex gr-6 flex-column">
      <v-sheet class="d-flex flex-column gr-3">
        <h4 class="font-weight-bold" style="font-size: 24px; line-height: 24px">
          Set Vet Availability
        </h4>
        <p class="text-body-2 text-grey2" style="line-height: 24px; font-weight: 600">
          Timezone: {{ dayjs.tz.guess() }}
        </p>
      </v-sheet>
      <VetAvailabilities @updateAvailability="availability = $event" />
    </v-sheet>
    <!-- FOOTER -->
    <v-sheet class="drawer-footer w-100 bg-white justify-end gc-4">
      <v-btn
        class="px-3 "
        flat
        type="submit"
        color="grey2"
        :disabled="loading"
        @click="$emit('prevStep')"
        >Back</v-btn
      >  
      <v-btn
        class="px-3 "
        flat
        type="submit"
        :loading
        :disabled="loading || disabled"
        @click="handleSubmit"
        >Confirm</v-btn
      >
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { defaultAvailabilities } from '@/constant'
import type { AvailabilityItem, UpdateAvailabilitiesPayload } from '@/stores/types/availabilities'
import { ref } from 'vue'
import ManageAppointment from '../../../partials/vetAvailibilities/ManageAppointment.vue'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import VetAvailabilities from '@/components/partials/vetAvailibilities/VetAvailabilities.vue'

dayjs.extend(timezone)

defineProps<{
  loading: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (event: 'addVet', details: { availabilities: UpdateAvailabilitiesPayload }): void
  (event:'prevStep' ): void
}>()

const availability = ref<{ availabilities: UpdateAvailabilitiesPayload }>({
  availabilities: {
    availability: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }
  }
})

const handleSubmit = () => {
  emit('addVet', availability.value)
}
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.availabilities-scroll {
  padding-right: 6px;
  overflow-y: scroll;
  height: calc(100vh - 310px);
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #e8e8e8;
  }
}
</style>
