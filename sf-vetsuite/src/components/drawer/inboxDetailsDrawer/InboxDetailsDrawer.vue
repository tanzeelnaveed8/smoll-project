<template>
  <v-sheet class="overflow-hidden" height="100vh" width="710" color="#fff" style="transform-origin: right">
    <template v-if="loading">
      <v-sheet class="d-flex justify-center align-center h-100 w-100">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>
    </template>
    <template v-else-if="consultation?.case">
      <v-sheet class="d-flex justify-space-between align-center gc-6"
        style="border-bottom: 1px solid #dde7ee; padding: 14px 32px">
        <v-sheet class="d-flex justify-space-between align-center w-100">
          <h4 style="font-size: 18px; color: black">
            {{ type === 'instant' ? 'Case Details' : 'Review the Appointment' }}
          </h4>
          <div class="d-flex gc-3">
            <v-btn v-if="(type === 'scheduled' && isPastSchedule) || type !== 'scheduled'" v-push class="text-grey1"
              color="#E7F3F7" flat style="font-weight: 600" @click="openEscalateDrawer">
              Escalate
            </v-btn>

            <!-- Show only before schedule started -->
            <template v-if="isBeforeSchedule">
              <v-btn color="grey1" variant="outlined" :loading="sendingReminder"
                :disabled="sendingReminder || reminderSend" @click="handleSendAppointmentReminder" flat>
                Send Reminder
              </v-btn>

              <v-btn v-push class="text-white" color="#E02A2A" flat style="font-weight: 600"
                @click="handleCloseAppointment" :disabled="cancelling" :loading="cancelling">
                Cancel Appointment
              </v-btn>
            </template>

            <v-btn v-push v-if="(type === 'scheduled' && isPastSchedule) || type !== 'scheduled'" class="text-white"
              color="#E02A2A" flat style="font-weight: 600" @click="handleCloseAppointment" :disabled="cancelling"
              :loading="cancelling">
              Close Case
            </v-btn>
          </div>
        </v-sheet>
      </v-sheet>
      <v-sheet class="d-flex px-8 justify-space-between align-center" style="border-bottom: 1px solid #dde7ee">
        <v-tabs v-model="tab" class="tabs pt-2 text-grey2" height="auto">
          <template v-for="tab in tabs" :key="tab.value">
            <v-tab :value="tab.value" style="line-height: 24px; font-weight: 600" class="py-2 px-0 pb-4 text-body-1"
              min-width="auto" height="auto">
              {{ tab.label }}
            </v-tab>
          </template>
        </v-tabs>

        <v-btn v-if="consultation.status !== ConsultationStatusEnum.COMPLETED" class="px-3" flat :key="renderKey"
          :loading="connecting" :disabled="isBeforeSchedule || connecting || activeConsultationId"
          style="letter-spacing: 0.1px; font-weight: 600" @click="handleInitiateCall">
          {{ type === 'instant' ? 'Connect Now' : 'Connect the Call' }}
        </v-btn>
      </v-sheet>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="basic-details">
          <InboxDetailsBasic :consultation="consultation" :type="type" />
        </v-tabs-window-item>
        <v-tabs-window-item value="notes">
          <InboxDetailsNotes :notes="consultation.case.notes ?? []" :readonly="false" :case-id="consultation.case.id" />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template v-else>
      <v-sheet class="d-flex justify-center align-center pa-8 text-grey2">
        <p>Visit details could not be loaded. Please try again.</p>
      </v-sheet>
    </template>
  </v-sheet>
  <!-- ESCALATE DRAWER -->
  <v-dialog v-model="escalateDrawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
    <EscalateCaseDrawer :case="consultation.case" :member="consultation.member" @close="handleEscalationClose" />
  </v-dialog>

  <!-- CLOSE CONSULTATION MODAL -->
  <v-dialog v-model="closeConsultationModal" width="auto">
    <CloseConsultationModal @close="closeConsultationModal = false" @submit="handleCloseCase"
      :caseId="consultation.case.id" />
  </v-dialog>
</template>

<script lang="ts" setup>
import useMitt from '@/functions/useMitt'
import { useConsultationStore } from '@/stores/consultation'
import { ConsultationStatusEnum, type ConsultationDetail } from '@/stores/types/consultation.d'
import { useInterval } from '@vueuse/core'
import dayjs from 'dayjs'
import { computed, ref, watchEffect } from 'vue'
import { toast } from 'vue3-toastify'
import { storeToRefs } from 'pinia'
import EscalateCaseDrawer from '../escalateDrawer/EscalateCaseDrawer.vue'
import CloseConsultationModal from '@/components/modal/CloseConsultationModal.vue'

import InboxDetailsBasic from './InboxDetailsBasic.vue'
import InboxDetailsNotes from './InboxDetailsNotes.vue'

const props = defineProps<{
  type: 'instant' | 'scheduled'
  consultation: ConsultationDetail
  loading?: boolean
  period?: 'monthly' | 'weekly'
  startTime?: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { emitter } = useMitt()
const consultationStore = useConsultationStore()

const escalateDrawer = ref(false)
const closeConsultationModal = ref(false)
const renderKey = props.type === 'scheduled' ? useInterval(1000) : ref(0)
const { activeConsultationId } = storeToRefs(consultationStore)

const isBeforeSchedule = ref(false)
const isPastSchedule = ref(false)
const cancelling = ref(false)
const connecting = ref(false)
const reminderSend = ref(false)
const sendingReminder = ref(false)

const tab = ref('basic-details')

const tabs = computed(() => [
  {
    label: 'Basic Details',
    value: 'basic-details'
  },
  {
    label: 'Notes',
    value: 'notes'
  }
])

const openEscalateDrawer = () => {
  escalateDrawer.value = true
}

watchEffect(() => {
  // This will re-run every time renderKey changes
  renderKey.value

  if (props.type === 'instant') {
    isBeforeSchedule.value = false
    isPastSchedule.value = false
    return
  }
  if (props.consultation) {
    const now = dayjs()
    const scheduledTime = dayjs(props.consultation.scheduledAt)
    const thirtyMinutesAfterScheduled = scheduledTime.add(30, 'minute')

    isBeforeSchedule.value = now.isBefore(scheduledTime)
    isPastSchedule.value = now.isAfter(thirtyMinutesAfterScheduled)
  }
})

const handleInitiateCall = () => {
  connecting.value = true
  emitter.emit('inbox-details-drawer:CONNECT', { consultationId: props.consultation.id })

  setTimeout(() => {
    connecting.value = false
  }, 3000)
}

const handleCloseAppointment = () => {
  // Validate all services are checked off before allowing close
  const checklist = props.consultation.case.serviceChecklist ?? []
  if (checklist.length > 0) {
    const unchecked = checklist.filter((s: any) => !s.checked)
    if (unchecked.length > 0) {
      toast.error(`Please check off all services before closing. ${unchecked.length} service(s) remaining.`)
      return
    }
  }
  closeConsultationModal.value = true
}

const refetchCases = () => {
  const { startTime, period } = props
  const validPeriod = period === 'monthly' || period === 'weekly' ? period : undefined
  emitter.emit('inbox-details-drawer:CASE_CLOSED', { startTime, period: validPeriod })
}

const handleEscalationClose = () => {
  if (props.type === 'scheduled') {
    refetchCases()
    emitter.emit('inbox-details-drawer:escalated', { type: 'scheduled' })
    emit('close')
  } else {
    emitter.emit('inbox-details-drawer:escalated', { type: 'all' })
  }

  escalateDrawer.value = false
}

const handleCloseCase = () => {
  if (props.type === 'instant') {
    emitter.emit('inbox-details-drawer:escalated', { type: 'all' })
    toast.success('Case closed successfully')
  } else {
    refetchCases()
    emitter.emit('inbox-details-drawer:escalated', { type: 'scheduled' })

    emit('close')
    emitter.emit('refetch-upcoming-appointment')
    toast.success('Appointment canceled successfully')
  }
  closeConsultationModal.value = false
}

const handleSendAppointmentReminder = async () => {
  try {
    sendingReminder.value = true
    await consultationStore.sendReminder(props.consultation.id)

    toast.success('Reminder sent successfully')
  } catch (error) {
    toast.error('Failed to send reminder')
  } finally {
    sendingReminder.value = false
    reminderSend.value = true
  }
}
</script>

<style lang="scss" scoped>
.pet-details--grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(10px, 234px));
  justify-content: space-between;
}

.dialog:deep(.v-overlay__content) {
  right: 0;
}

.tabs {
  &:deep(.v-slide-group__content) {
    gap: 28px;
  }
}
</style>
