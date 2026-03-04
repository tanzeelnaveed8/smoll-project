<template>
  <v-menu offset="12">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        icon="$tb-dots"
        variant="text"
        rounded="lg"
        class="ml-auto align-self-center pa-1"
        color="grey2"
        height="auto"
        width="auto"
      />
    </template>
    <v-list class="elevation-3" style="border: 1px solid #d5d5d5">
      <template v-for="(item, index) in menuList" :key="index">
        <v-list-item
          v-if="!item.hide"
          :value="index"
          :disabled="item.disabled"
          class="menu-item"
          @click="item.action"
          >{{ item.title }}
        </v-list-item>
      </template>
    </v-list>
  </v-menu>

  <!-- CONFIRMATION FOR WITHDRAW QUOTATION -->
  <v-dialog v-model="modalwithdraweQuoteConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to withdraw the quotation?"
      btnText="Confirm"
      :loading
      @close="closeWithdrawQuoteModal"
      @closeAll="handleRemoveQuotation"
    />
  </v-dialog>

  <!-- CONFIRMATION FOR DECLINE JOB -->
  <v-dialog v-model="modalConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to decline this job?"
      btnText="Decline"
      :loading
      @close="closeDeclineModal"
      @closeAll="handleDeleteCase"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Case } from '@/stores/types/case'

import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import useMitt from '@/functions/useMitt'
import { useCaseStore } from '@/stores/case'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'

const props = defineProps<{
  case: Case & { status: string }
}>()

const emit = defineEmits<{
  (event: 'editQuotation'): void
  (event: 'submitQuotation'): void
}>()

const { emitter } = useMitt()
const caseStore = useCaseStore()

const loading = ref(false)

const modalwithdraweQuoteConfirmation = ref(false)
const modalConfirmation = ref(false)

const menuList = computed(() => [
  {
    title: 'Submit',
    action: () => {
      emit('submitQuotation')
    },
    hide: props.case.status.toLowerCase() !== 'new'
  },
  {
    title: 'Edit',
    action: () => {
      emit('editQuotation')
    },
    disabled:
      !props.case.quoteExists ||
      props.case.status.includes('other') ||
      props.case.status.includes('Approved')
  },
  {
    title: 'Withdraw',
    action: () => (modalwithdraweQuoteConfirmation.value = true),
    disabled:
      !props.case.quoteExists ||
      props.case.status.includes('other') ||
      props.case.status.includes('Approved')
  },
  {
    title: 'Decline',
    action: () => (modalConfirmation.value = true),
    disabled: props.case.quoteExists || props.case.status.includes('other')
  }
])

// //TO WITHDRAW THE SUBMITTED QUOTATIONS
const removeQutotation = async (caseId: string) => {
  try {
    loading.value = true
    const caseDetails = await caseStore.fetchCaseDetails(caseId)
    const quoteId = caseDetails.quote[0].id as string
    await caseStore.deleteQuote(caseId, quoteId)
  } finally {
    loading.value = false
  }
}
const handleRemoveQuotation = async () => {
  const caseId = props.case.id as string
  await removeQutotation(caseId)
  emitter.emit('quotation-drawer:refetch_cases')
  modalwithdraweQuoteConfirmation.value = false
  toast.success('Quotation removed successfully!')
}
const closeWithdrawQuoteModal = () => {
  modalwithdraweQuoteConfirmation.value = false
}

// //TO DECLINE FOR THE REQUEST
const deleteCase = async (caseId: string) => {
  try {
    loading.value = true
    await caseStore.deleteCase(caseId)
  } finally {
    loading.value = false
  }
}
const handleDeleteCase = async () => {
  const caseId = props.case?.id as string
  await deleteCase(caseId)
  emitter.emit('quotation-drawer:refetch_cases')
  modalConfirmation.value = false
  toast.success('Request delete successfully!')
}

const closeDeclineModal = () => {
  modalConfirmation.value = false
}
</script>

<style lang="scss">
.menu-item {
  font-weight: 600;
  height: 38px;
  min-height: auto;
}
</style>
