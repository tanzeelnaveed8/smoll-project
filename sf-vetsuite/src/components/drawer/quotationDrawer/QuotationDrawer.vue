<template>
  <v-sheet
    height="100vh"
    width="1200"
    color="#fff"
    style="transform-origin: right"
    class="position-relative"
  >
    <template v-if="drawerProps.actionLoading">
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
          :servicesList
          :loading
          @updateEscalationDetails="selectedServices = $event"
        />
        <v-divider color="#DDE7EE" vertical class="opacity-100" style="height: 100vh" />
        <QuotationDetails
          :services="selectedServices"
          :case="case"
          :isEmergency="isEmergency"
          :directBookingProps
          :loading
          :disable
          :member
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
      color="primary"
      @close="modalConfirmation = false"
      @closeAll="handleSubmitQuote"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import QuotationBuild from './QuotationBuild.vue'
import QuotationDetails from './QuotationDetails.vue'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useCaseStore } from '@/stores/case'
import useMitt from '@/functions/useMitt'
import { toast } from 'vue3-toastify'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import type { Case, DirectEscalateCasePayload } from '@/stores/types/case'
import { usePartnerStore } from '@/stores/partner'
import type { Member } from '@/stores/types/member'
import type { Service } from '@/stores/types/global'
import dayjs from 'dayjs'

interface ServiceDetails extends Service {
  label: string
}

const props = defineProps<{
  case:Case
  isEmergency:boolean
  drawerProps:{
      partnerId:string
      note: string
      actionLoading: boolean
  }
  directBookingProps?:{
    partnerVet: null | {id:string,name:string} ;
    scheduledAt: string;
  }
  member:Member
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit'): void
  (event: 'updateShowModal', value: boolean): void
}>()

const loading = ref(false)
const disable = ref(false)
const isMounted = ref(true)
const { emitter } = useMitt()

const modalConfirmation = ref(false)

const caseStore = useCaseStore()
const partnerStore = usePartnerStore()

const servicesList = ref<Service[] | null>(null)

const selectedServices = ref<ServiceDetails[] | null>(null)

const getServices = async () => {
  const data = await partnerStore.fetchServices(props.drawerProps.partnerId,true)
  servicesList.value = data
}

const sendQuote = async (caseId: string, payload: DirectEscalateCasePayload ) => {
  try {
    loading.value = true
   
    await caseStore.directEscalateCase(caseId, payload)
  } finally {
    loading.value = false
  }
}


const executeSendQuote = async () => {
  if (!selectedServices.value?.length) return
  const id = props.case?.id as string
  const services = selectedServices.value.map(({ id, label }) => ({ id: id.toString(), label }))
  
  const payload = {
    partnerId: props.drawerProps.partnerId,
    services,
    vetNote: props.drawerProps.note,
    isEmergency: props.isEmergency,
    ...(props.isEmergency ? {} : {
      partnerVetId: props.directBookingProps?.partnerVet?.id || '',
      scheduledAt: props.directBookingProps?.scheduledAt || ''
    })
  }
  
  await sendQuote(id, payload)
}

const handleConfirm = () => {
  modalConfirmation.value = true
}

const handleSubmitQuote = async () => {
  modalConfirmation.value = false
  await executeSendQuote()
  toast.success('Quote sent successfully')
  emit('updateShowModal', false)
  emit('close')
  emit('submit')
}

onMounted(() => {
  getServices()
})
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';
</style>