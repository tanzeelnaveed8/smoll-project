<template>
  <v-sheet
    style="padding: 14px 0px; font-weight: 600; border-bottom: 1px solid #dde7ee"
    class="d-flex justify-space-between align-center"
  >
    <v-sheet class="d-flex justify-space-between w-100" max-width="780" style="text-wrap: nowrap">
      <span class="d-flex align-center gc-2">
        <v-icon icon="$tb-user-circle" />
        <p>{{ appointment.member }}</p>
      </span>
      <span class="d-flex align-center gc-3">
        <span class="d-flex gc-2">
          <p>Appointment On:</p>
          <p>{{ dayjs(appointment.scheduledAt).format('dddd, DD MMMM YYYY (z)') }}</p>
        </span>
        <v-chip
          color="#10AFE1"
          variant="flat"
          rounded="lg"
          class="pa-1 time"
          style="font-weight: 600; list-style: 24px"
        >
          {{ dayjs(appointment.scheduledAt).format('hh:mm A') }}
        </v-chip>
        <v-chip
          v-if="appointment.isNew"
          color="#FF0000"
          variant="flat"
          rounded="lg"
          class="pa-1 time"
          style="font-weight: 600; list-style: 24px"
        >
          New
        </v-chip>
      </span>
    </v-sheet>

    <v-btn class="px-3" @click="handleClick" flat v-push>View details</v-btn>
    <v-dialog v-model="drawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
      <CaseDetailsDrawer
        :actionLoading
        :caseDetails="caseDetails"
        :appointment
        type="schedule"
        @close="drawer = false"
      />
    </v-dialog>
  </v-sheet>
</template>

<script lang="ts" setup>
import CaseDetailsDrawer from '@/components/drawer/caseDetailsDrawer/CaseDetailsDrawer.vue'
import type { Appointment } from '@/stores/appointments'
import { useCaseStore } from '@/stores/case'
import type { CaseDetails } from '@/stores/types/case'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const props = defineProps<{
  appointment: Appointment
}>()

dayjs.extend(advancedFormat)

const drawer = ref(false)

const actionLoading = ref(false)

const caseDetails = ref<CaseDetails | null>(null)

const caseStore = useCaseStore()

const handleClick = async () => {
  try {
    actionLoading.value = true
    drawer.value = true
    const data = await caseStore.fetchCaseDetails(props.appointment.caseId)
    caseDetails.value = data
  } finally {
    actionLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.dialog:deep(.v-overlay__content) {
  right: 0;
}

.time {
  &:deep(.v-chip__content) {
    line-height: 24px;
  }
}
</style>
