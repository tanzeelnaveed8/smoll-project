<template>
  <v-sheet height="100vh" width="710" color="#fff" style="transform-origin: right">
    <template v-if="loading">
      <v-sheet class="d-flex justify-center align-center h-100 w-100">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>
    </template>
    <template v-else>
      <!-- //TOP -->
      <v-sheet class="d-flex justify-space-between align-center gc-6"
        style="border-bottom: 1px solid #dde7ee; padding: 14px 32px">
        <v-sheet class="d-flex gc-8 align-center">
          <span class="d-flex align-center gc-3" style="font-size: 18px; font-weight: 600; color: black">

            <v-chip class="px-2 font-weight-bold" variant='outlined' style="border-radius: 8px;">{{ caseDetails?.id
            }}</v-chip>
            <p>{{ dayjs(caseDetails?.createdAt).format('hh:mm A, DD MMMM YYYY') }}</p>
          </span>

          <span v-if="caseDetails?.status !== 'open'" class="font-weight-bold text-capitalize"
            style="line-height: 24px">
            <p v-if="caseDetails" :style="`color: ${getCaseStatusData(caseDetails.status).color}`">
              Status: {{ getCaseStatusData(caseDetails.status).label }}
            </p>
          </span>
        </v-sheet>

        <v-btn v-if="caseDetails?.status !== 'open'" v-push class="text-grey1" icon="$tb-x" width="auto" height="auto"
          flat color="transparent" @click="emit('close')" />

        <div v-else class="d-flex gc-3">
          <v-btn v-push class="text-grey1" color="#E7F3F7" flat style="font-weight: 600" @click="openEscalateDrawer">
            Escalate
          </v-btn>
          <v-btn v-push class="text-white" color="#E02A2A" flat style="font-weight: 600" @click="handleCloseAppointment"
            :disabled="cancelling" :loading="cancelling">
            Close Case
          </v-btn>
        </div>

      </v-sheet>

      <!-- //MAIN -->
      <v-sheet>
        <v-tabs v-model="tab" class="tabs px-5 text-grey2" height="auto"
          style="padding-top: 14px; border-bottom: 1px solid #dde7ee">
          <template v-for="tab in tabs" :key="tab.value">
            <v-tab v-if="tab.show" :value="tab.value" style="line-height: 24px; font-weight: 600"
              class="py-2 px-3 pb-4 text-body-1" min-width="auto" height="auto">
              {{ tab.label }}
            </v-tab>
          </template>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="basic-details">
            <CaseDetailsWindow :caseDetails="caseDetails" />
          </v-tabs-window-item>
          <v-tabs-window-item value="shared-files">
            <SharedFilesWindow :caseDetails="caseDetails" />
          </v-tabs-window-item>
          <v-tabs-window-item value="feedback" v-if="caseDetails?.feedback?.rating || caseDetails?.feedback?.comment">
            <FeedbackWindow :caseDetails="caseDetails" />
          </v-tabs-window-item>
          <v-tabs-window-item value="quotes" v-if="props.caseDetails?.quotes?.length">
            <QuotationWindow :quotes="props.caseDetails?.quotes" />
          </v-tabs-window-item>
          <v-tabs-window-item value="notes">
            <InboxDetailsNotes :notes="caseDetails?.notes ?? []" :readonly="true" :case-id="`${caseDetails?.id}`" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-sheet>
    </template>
  </v-sheet>
  <v-dialog v-if="caseDetails" v-model="escalateDrawer" transition="slide-x-reverse-transition" width="auto"
    class="dialog">
    <EscalateCaseDrawer :case="caseDetails" :member="{ name: caseDetails?.member || '' }"
      @close="handleEscalationClose" />
  </v-dialog>
  <!-- CLOSE CONSULTATION MODAL -->
  <v-dialog v-model="closeConsultationModal" width="auto">
    <CloseConsultationModal @close="closeConsultationModal = false" @submit="handleCloseCase"
      :caseId="caseDetails?.id" />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Case } from '@/stores/types/case.d'
import { computed, ref, watch } from 'vue'
import CaseDetailsWindow from './CaseDetailsWindow.vue'
import FeedbackWindow from './FeedbackWindow.vue'
import SharedFilesWindow from './SharedFilesWindow.vue'
import QuotationWindow from './QuotationWindow.vue'
import dayjs from 'dayjs'
import { getCaseStatusData } from '@/utils/helpers'
import InboxDetailsNotes from '../inboxDetailsDrawer/InboxDetailsNotes.vue'
import EscalateCaseDrawer from '../escalateDrawer/EscalateCaseDrawer.vue'
import type { Member } from '@/stores/types/member'
import useMitt from '@/functions/useMitt'
import CloseConsultationModal from '@/components/modal/CloseConsultationModal.vue'

const props = defineProps<{
  caseDetails: Case | null
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const tab = ref('basic-details')
const escalateDrawer = ref(false)

const closeConsultationModal = ref(false)
const cancelling = ref(false)

const { emitter } = useMitt()

const tabs = computed(() => [
  {
    label: 'Basic Details',
    value: 'basic-details',
    show: true
  },
  {
    label: 'Shared Files',
    value: 'shared-files',
    show: true
  },
  {
    label: 'Feedback',
    value: 'feedback',
    show: props.caseDetails?.feedback?.rating || props.caseDetails?.feedback?.comment
  },
  {
    label: 'Quotes',
    value: 'quotes',
    show: props.caseDetails?.quotes?.length
  },
  {
    label: 'Notes',
    value: 'notes',
    show: true
  }
])

const openEscalateDrawer = () => {
  escalateDrawer.value = true
}

const handleCloseAppointment = () => {
  closeConsultationModal.value = true
}

const handleEscalationClose = () => {
  escalateDrawer.value = false
  emit('close')
}

const handleCloseCase = () => {
  emitter.emit('refetch-cases')
  closeConsultationModal.value = false
  emit('close')
}
</script>

<style lang="scss" scoped>
.dialog:deep(.v-overlay__content) {
  right: 0;
}

.pet-details--grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(10px, 234px));
  justify-content: space-between;
}

.tabs:deep(.v-slide-group__content) {
  gap: 16px;
}

.tabs:deep(.v-tab-item--selected) {
  color: #222222 !important;
}

.tabs:deep(.v-tab__slider) {
  color: #427594;
  height: 4px;
}
</style>
