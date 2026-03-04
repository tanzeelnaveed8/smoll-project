<template>
  <v-data-table
    :loading="loading"
    class="table text-body-2 text-grey1"
    height="530"
    style="font-weight: 600"
    hide-default-footer
    items-per-page="20"
    :items="requests"
    :headers="headers"
    @click:row="(event: Event, row: any) => handleTableAction(row.item, 'view')"
  >
    <template #item.nameTable="{ item }">
      <VueHighlightWords
        :textToHighlight="item.nameTable"
        :searchWords="[`${$route.query.search}`]"
      />
    </template>

    <template #item.vet="{ item }">
      <VueHighlightWords :textToHighlight="item.vet" :searchWords="[`${$route.query.search}`]" />
    </template>

    <template #item.status="{ item }">
      <p
        :style="{
          color: requestStatus(item.status)?.color
        }"
      >
        {{ requestStatus(item.status)?.status }}
      </p>
    </template>

    <template #item.action="{ item, index }">
      <RequestTableMenu
        :case="item"
        @editQuotation="handleTableAction(item)"
        @submitQuotation="handleTableAction(item)"
      />
    </template>
  </v-data-table>

  <!-- DRAWER VIEW -->
  <v-dialog
    v-model="drawerView"
    transition="slide-x-reverse-transition"
    width="auto"
    class="dialog"
  >
    <CaseDetailsDrawer
      class="dialog"
      :actionLoading
      @close="drawerView = false"
      @openQuoteDrawer="handleOpenQuoteDrawer"
      :caseDetails="caseDetails"
      :type="caseDetails?.partnerBookingId ? 'booked' : 'submitted'"
    />
  </v-dialog>

  <!-- DRAWER QUOTATION -->
  <v-dialog
    v-model="drawerQuotation"
    @update:model-value="handleCloseQuotation"
    transition="slide-x-reverse-transition"
    width="auto"
    class="dialog quotation-dialog"
  >
    <QuotationDrawer
      class="dialog scroll-none"
      :actionLoading
      @close="drawerQuotation = false"
      :caseDetails="caseDetails"
      @updateShowModal="showConfirmationModal = $event"
    />
  </v-dialog>

  <!-- CONFIRMATION MODAL -->
  <v-dialog v-model="modalConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure changes you made so far will not be saved!"
      btnText="Leave"
      @close="handleCloseConfirmationModal"
      @closeAll="handleSubmitConfirmationModal"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Case, CaseDetails } from '@/stores/types/case'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useCaseStore } from '@/stores/case'
import CaseDetailsDrawer from '@/components/drawer/caseDetailsDrawer/CaseDetailsDrawer.vue'
import QuotationDrawer from '@/components/drawer/quotationDrawer/QuotationDrawer.vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import RequestTableMenu from '@/components/menu/requestTableMenu/RequestTableMenu.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { requestStatus } from '@/utils/helpers'
import VueHighlightWords from 'vue-highlight-words'

const props = defineProps<{
  requestInfo: Case[]
  loading: boolean
}>()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const requests = computed(() =>
  props.requestInfo.map((item) => {
    let status = 'New'

    console.log(item)

    if (item.quoteExists) {
      status = 'Quotation Submitted'
    }

    if (item.partnerBookingId) {
      if (item.partnerBookingId === user.value?.id) {
        status = 'Approved'
      } else {
        status = 'Assigned to other'
      }
    }

    return {
      ...item,
      nameTable: `${item.member}/${item.pet}`,
      date: dayjs(item.updatedAt).format('hh:mm A, DD MMMM YYYY'),
      status
    }
  })
)

const headers = ref([
  { title: 'Patient name/Pet name', key: 'nameTable', width: '280px' },
  { title: 'Date', key: 'date', width: '320px' },
  { title: 'Escalated by', key: 'vet', width: '210px' },
  { title: 'Status', key: 'status', width: '270px' },
  { title: 'Action', key: 'action', width: '100px' }
])

const drawerView = ref(false)
const drawerQuotation = ref(false)
const modalConfirmation = ref(false)
const showConfirmationModal = ref(false)

const actionLoading = ref(false)
const caseDetails = ref<CaseDetails | null>(null)

const caseStore = useCaseStore()

const fetchCaseDetails = async (id: string) => {
  try {
    actionLoading.value = true
    const details = await caseStore.fetchCaseDetails(id)
    caseDetails.value = details as Case | any
  } finally {
    actionLoading.value = false
  }
}

const handleTableAction = async (item: Case, type?: string) => {
  const id = item.id
  caseDetails.value = null

  fetchCaseDetails(id)

  if (type) {
    drawerView.value = true
  } else {
    drawerQuotation.value = true
  }
}

const handleCloseQuotation = (e: boolean) => {
  if (!e && showConfirmationModal.value) {
    drawerQuotation.value = true
    modalConfirmation.value = true
  }
}

const handleOpenQuoteDrawer = () => {
  drawerQuotation.value = true
  drawerView.value = false
}

const handleCloseConfirmationModal = () => {
  modalConfirmation.value = false
  showConfirmationModal.value = false
}

const handleSubmitConfirmationModal = () => {
  drawerQuotation.value = false
  modalConfirmation.value = false
  showConfirmationModal.value = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.actionText {
  font-weight: 600;
  color: #494949;
}
.actionDraftText {
  color: #e13a10;
}

.table {
  &:deep(td) {
    white-space: nowrap !important;
  }

  &:deep(.v-data-table__th) {
    font-weight: 700 !important;
    color: #494949 !important;
    white-space: nowrap;
  }
}

.td-cases {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 591px;
}

.action-submit-quote {
  color: #494949;
  transition: all 0.3s;

  &:hover {
    color: #109be1;
  }
}

.quotation-dialog {
  &:deep(.v-overlay__content) {
    max-width: 1200px;
    width: 100% !important;
  }
}
</style>
