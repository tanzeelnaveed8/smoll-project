<template>
  <v-sheet
    height="100vh"
    width="100%"
    color="#fff"
    style="transform-origin: right;max-width: 1200px;"
    class="position-relative"
  >
    <template v-if="actionLoading">
      <v-sheet class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>
    </template>

    <v-sheet v-else>
      <!-- //TOP -->
      <v-sheet
        class="d-flex justify-space-between align-center gc-6"
        style="border-bottom: 1px solid #dde7ee; padding: 14px 32px"
      >
        <h4 style="font-size: 18px; line-height: 24px">Quotation</h4>
        <v-btn
          class="text-grey1"
          icon="$tb-x"
          width="auto"
          height="auto"
          flat
          color="transparent"
          @click="emit('close')"
        />
      </v-sheet>
      <!-- MAIN -->
      <v-sheet class="d-flex scroll-none" style="height: calc(100vh - 54px); overflow-y: scroll">
        <QuotationBuild
          :caseDetails
          :servicesList
          :loading
          @updateEscalationDetails="escalationDetails = $event"
        />
        <v-divider color="#DDE7EE" vertical class="opacity-100" style="height: 100vh" />
        <QuotationDetails
          :escalationDetails
          :caseDetails="caseDetails!"
          :loading
          :disable
          @submit="handleConfirm"
        />
      </v-sheet>
    </v-sheet>
  </v-sheet>

  <!-- CONFIRMATION MODAL -->
  <v-dialog v-model="modalConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to submit?"
      btnText="Confirm"
      @close="modalConfirmation = false"
      @closeAll="handleSubmitQuote"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { CaseDetails, SendQuotePayload, UpdateQuotePayload } from '@/stores/types/case'
import QuotationBuild from './QuotationBuild.vue'
import QuotationDetails from './QuotationDetails.vue'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useServicesStore } from '@/stores/services'
import type { Service } from '@/stores/types/global'
import { useCaseStore } from '@/stores/case'
import useMitt from '@/functions/useMitt'
import { toast } from 'vue3-toastify'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'

interface EscalationDetails extends Service {
  label: string
}

const props = defineProps<{
  caseDetails: CaseDetails | null
  actionLoading: boolean
}>()
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'updateShowModal', value: boolean): void
}>()

const loading = ref(false)
const disable = ref(false)
const isMounted = ref(true)
const { emitter } = useMitt()

const modalConfirmation = ref(false)

const serviceStore = useServicesStore()
const caseStore = useCaseStore()

const servicesList = ref<Service[] | null>(null)

const escalationDetails = ref<{
  services: EscalationDetails[]
  note: string
} | null>(null)

const getServices = async () => {
  const data = await serviceStore.fetchServices()
  servicesList.value = data
}

const sendQuote = async (id: string, payload: SendQuotePayload) => {
  try {
    loading.value = true

    await caseStore.sendQuote(id, payload)
  } finally {
    loading.value = false
  }
}

const updateQuote = async (caseId: string, quoteId: string, payload: UpdateQuotePayload) => {
  try {
    loading.value = true

    await caseStore.updateQuote(caseId, quoteId, payload)
  } finally {
    loading.value = false
  }
}

const executeSendQuote = async () => {
  if (!escalationDetails.value?.services?.length) return
  const id = props.caseDetails?.id as string
  const services = escalationDetails.value.services.map((item) => ({
    id: item.id,
    label: item.label
  }))
  await sendQuote(id, { services, note: escalationDetails.value.note })
}

const executeUpdateQuote = async () => {
  if (!escalationDetails.value?.services?.length) return
  const id = props.caseDetails?.id as string
  const qouteId = props.caseDetails?.quote[0].id as string
  const services = escalationDetails.value.services.map((item) => ({
    id: item.id,
    label: item.label
  }))
  await updateQuote(id, qouteId, { services, note: escalationDetails.value.note })
}

const handleConfirm = () => {
  modalConfirmation.value = true
}

const handleSubmitQuote = async () => {
  modalConfirmation.value = false
  if (props.caseDetails?.quote.length) {
    //If quote exists
    await executeUpdateQuote()
    toast.success('Quote updated successfully')
  } else {
    //If note
    await executeSendQuote()
    toast.success('Quote sent successfully')
  }
  emit('updateShowModal', false)
  emitter.emit('quotation-drawer:refetch_cases')
  emit('close')
}

watchEffect(() => {
  if (props.caseDetails?.quote.length) {
    disable.value = true
    const updatedServices = props?.caseDetails?.quote[0]?.services.map((service) => ({
      ...service,
      title: service.name
    }))
    escalationDetails.value = {
      services: updatedServices,
      note: props.caseDetails.quote[0].note
    }
  }
})

watch(escalationDetails, () => {
  if (disable.value && !isMounted.value) {
    disable.value = false
  }

  //IF THERE IS NO QUOTATION FOR THE FIRST TIME THEN DISABLE.VALUE = FALSE
  //IF QUOTATAION HAS BEEN SUBMITTED FOR THE FIRST TIME THEN DISABLE.VALUE = TRUE
  emit('updateShowModal', !disable.value)

  if (isMounted.value) isMounted.value = false
})

onMounted(() => {
  getServices()
})
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';
</style>
