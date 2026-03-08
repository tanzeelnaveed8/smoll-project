<template>
  <v-sheet
    class="appointment-row d-flex justify-space-between align-center flex-wrap"
    style="padding: 14px 0; font-weight: 600; border-bottom: 1px solid #dde7ee; gap: 12px"
  >
    <v-sheet class="appointment-info d-flex align-center flex-wrap" style="gap: 12px; flex: 1; min-width: 0">
      <span class="d-flex align-center" style="gap: 8px">
        <v-icon icon="$tb-user-circle" size="20" />
        <span class="text-body-2">{{ consultation.member }}</span>
      </span>
      <span class="d-flex align-center flex-wrap" style="gap: 8px">
        <span class="d-flex align-center text-body-2" style="gap: 4px">
          <span class="text-medium-emphasis">Appointment On:</span>
          <span>{{ dateLabel }}</span>
        </span>
        <v-chip
          v-if="timeLabel"
          color="#10AFE1"
          variant="flat"
          rounded="lg"
          size="small"
          class="time-chip"
        >
          {{ timeLabel }}
        </v-chip>
        <v-chip v-if="consultation.rejectedByVetName" color="error" variant="flat" size="small">
          Rejected by {{ consultation.rejectedByVetName }}
        </v-chip>
        <v-chip v-else-if="consultation.acceptedAt" color="success" variant="flat" size="small">
          Accepted
        </v-chip>
      </span>
    </v-sheet>

    <v-sheet class="appointment-actions d-flex align-center flex-shrink-0" style="gap: 8px">
      <v-btn
        v-if="showAcceptButton"
        color="primary"
        variant="flat"
        size="small"
        min-width="90"
        :disabled="actionLoading || rejectLoading || acceptLoading"
        :loading="acceptLoading"
        @click.stop="handleAccept"
      >
        Accept
      </v-btn>
      <v-btn
        v-if="showRejectButton"
        color="error"
        variant="outlined"
        size="small"
        min-width="90"
        :disabled="actionLoading || rejectLoading || acceptLoading"
        :loading="rejectLoading"
        @click.stop="handleReject"
      >
        Reject
      </v-btn>
      <v-btn
        variant="outlined"
        size="small"
        min-width="110"
        :disabled="actionLoading"
        :loading="actionLoading"
        @click="handleClick"
      >
        View details
      </v-btn>
    </v-sheet>
    <v-dialog v-model="drawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
      <InboxDetailsDrawer
        v-if="consultationDetail"
        @close="drawer = false"
        :type="consultation.type || 'scheduled'"
        :consultation="consultationDetail"
      />
    </v-dialog>
  </v-sheet>
</template>

<script lang="ts" setup>
import InboxDetailsDrawer from '@/components/drawer/inboxDetailsDrawer/InboxDetailsDrawer.vue'
import { useConsultationStore } from '@/stores/consultation'
import { ConsultationStatusEnum, type Consultation } from '@/stores/types/consultation.d'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useMitt from '@/functions/useMitt'
import { toast } from 'vue3-toastify'

const props = defineProps<{
  consultation: Consultation
}>()

dayjs.extend(advancedFormat)

const drawer = ref(false)
const actionLoading = ref(false)
const acceptLoading = ref(false)
const rejectLoading = ref(false)
const { emitter } = useMitt()

const isScheduled = computed(() => props.consultation.type === 'scheduled')

const showAcceptButton = computed(
  () =>
    isScheduled.value &&
    props.consultation.status === ConsultationStatusEnum.SCHEDULED &&
    !props.consultation.acceptedAt
)

const showRejectButton = computed(
  () =>
    isScheduled.value &&
    props.consultation.status === ConsultationStatusEnum.SCHEDULED &&
    !props.consultation.acceptedAt
)

const dateLabel = computed(() => {
  const s = props.consultation.scheduledAt
  const created = props.consultation.createdAt
  if (s && dayjs(s).isValid()) return dayjs(s).format('dddd, DD MMMM YYYY (z)')
  if (created && dayjs(created).isValid()) return 'Created: ' + dayjs(created).format('dddd, DD MMM YYYY')
  return '–'
})

const timeLabel = computed(() => {
  const s = props.consultation.scheduledAt
  if (!s) return null
  const d = dayjs(s)
  return d.isValid() ? d.format('hh:mm A') : null
})

const consultationStore = useConsultationStore()
const { consultationDetailMap } = storeToRefs(consultationStore)

const consultationDetail = computed(() => consultationDetailMap.value.get(props.consultation.id))

const handleClick = async () => {
  try {
    actionLoading.value = true
    const detail = await consultationStore.fetchConsultationDetails(props.consultation.id)
    if (detail?.case) drawer.value = true
    else toast.error('Failed to load visit details')
  } catch {
    toast.error('Failed to load visit details')
  } finally {
    actionLoading.value = false
  }
}

const handleAccept = async () => {
  try {
    acceptLoading.value = true
    await consultationStore.acceptConsultation(props.consultation.id)
    toast.success('Appointment accepted')
    emitter.emit('refetch-upcoming-appointment')
  } catch {
    toast.error('Failed to accept appointment')
  } finally {
    acceptLoading.value = false
  }
}

const handleReject = async () => {
  try {
    rejectLoading.value = true
    await consultationStore.rejectConsultation(props.consultation.id)
    toast.success('Appointment rejected')
    emitter.emit('refetch-upcoming-appointment')
  } catch {
    toast.error('Failed to reject appointment')
  } finally {
    rejectLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.dialog:deep(.v-overlay__content) {
  right: 0;
}

.time-chip {
  font-weight: 600;
}
</style>
