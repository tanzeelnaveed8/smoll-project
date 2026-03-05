<template>
  <v-sheet height="100vh" width="810" color="#fff" style="transform-origin: right">
    <template v-if="actionLoading">
      <v-sheet class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-sheet>
    </template>
    <v-sheet v-else>
      <!-- //TOP -->
      <v-sheet
        class="d-flex justify-space-between align-center gc-6"
        style="border-bottom: 1px solid #dde7ee; padding: 14px 32px"
      >
        <v-sheet class="d-flex gc-8 align-center">
          <div class="d-flex gc-3">
            <h4 style="font-size: 18px; line-height: 24px; color: black">
              {{ caseDetails?.member }}/{{ caseDetails?.pet.name }}
            </h4>
          </div>

          <span class="font-weight-bold text-body-2 text-grey2" style="line-height: 24px">
            <p>Date: {{ dayjs(caseDetails?.createdAt).format('DD MMM YYYY') }}</p>
          </span>
        </v-sheet>

        <div class="d-flex gc-6 align-center">
          <v-sheet class="d-flex gc-3">
            <!-- When the type is 'scheduled' -->
            <template v-if="type">
              <!-- When the time has passed for the appointment -->
              <v-btn
                v-if="isPastSchedule"
                :loading
                :disabled="loading"
                @click="modalCloseConfirmation = true"
                color="#e7f3f7"
                flat
              >
                Close
              </v-btn>
              <!-- When there is time remaining for the appointment -->
              <v-btn
                v-else-if="!isPastSchedule && appointment"
                color="grey1"
                variant="outlined"
                :disabled="loading || reminderSend"
                @click="handleSendAppointmentReminder"
                flat
              >
                Send Reminder
              </v-btn>
            </template>

            <!-- <v-btn flat v-if="!caseDetails?.quote.length" @click="$emit('openQuoteDrawer')">
                Submit Quotation
            </v-btn> -->

            <!-- //When the type is not 'scheduled' -->
            <template v-else-if="!caseDetails?.partnerBookingId">
              <!-- When Quote is not submitted -->
              <v-btn
                flat
                color="#e7f3f7"
                style="font-weight: 600"
                v-if="!caseDetails?.quote.length"
                @click="modalConfirmation = true"
                :loading
              >
                Decline
              </v-btn>

              <!-- To delete the quote that was submitted -->
              <v-btn
                v-if="caseDetails?.quote.length && !caseDetails.partnerBookingId"
                color="#e02a2a"
                :loading
                @click="modalwithdraweQuoteConfirmation = true"
              >
                Withdraw Quotation
              </v-btn>
            </template>
          </v-sheet>

          <v-btn
            class="text-grey1"
            icon="$tb-x"
            width="auto"
            height="auto"
            flat
            color="transparent"
            @click="emit('close')"
          />
        </div>
      </v-sheet>

      <!-- //MAIN -->
      <v-sheet>
        <v-tabs
          v-model="tab"
          class="tabs px-5 text-grey2"
          height="auto"
          style="padding-top: 14px; border-bottom: 1px solid #dde7ee"
        >
          <v-tab
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            style="line-height: 24px; font-weight: 600"
            class="py-2 px-3 pb-4 text-body-1"
            min-width="auto"
            height="auto"
          >
            {{ tab.label }}
          </v-tab>
          <v-tab
            v-if="props.caseDetails?.quote.length"
            value="quotes"
            style="line-height: 24px; font-weight: 600"
            class="py-2 px-3 pb-4 text-body-1"
            min-width="auto"
            height="auto"
          >
            Quote
          </v-tab>

          <div class="ml-auto">
            <v-chip
              v-if="caseDetails?.isEmergency"
              variant="flat"
              color="#f52c11"
              class="cursor-default"
              v-tooltip="{
                maxWidth: 300,
                text: 'This case has been directly escalated by the vet as an emergency, please handle it immediately.'
              }"
            >
              Emergency
            </v-chip>

            <!-- When there is time remaining for the appointment -->
            <v-menu v-if="!isPastSchedule && type" offset="12">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="$tb-dots"
                  variant="text"
                  rounded="lg"
                  class="ml-3 align-self-center pa-1"
                  color="grey2"
                  height="auto"
                  width="auto"
                />
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in menuList"
                  :key="index"
                  :value="index"
                  class="text-body-1"
                  style="font-weight: 600"
                  @click="item.action"
                  :style="item?.style"
                  >{{ item.title }}
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="basic-details">
            <CaseDetailsWindow :caseDetails="caseDetails!" :type="type" />
          </v-tabs-window-item>
          <v-tabs-window-item value="shared-files">
            <SharedFilesWindow :caseDetails="caseDetails!" />
          </v-tabs-window-item>
          <v-tabs-window-item value="quotes" v-if="props.caseDetails?.quote.length">
            <QuotationWindow :caseDetails="caseDetails!" :type />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-sheet>
    </v-sheet>
  </v-sheet>

  <!-- CONFIRMATION FOR DECLINE JOB -->
  <v-dialog v-model="modalConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to decline this job?"
      btnText="Decline"
      @close="modalConfirmation = false"
      @closeAll="handleDeleteCase"
    />
  </v-dialog>

  <!-- CONFIRMATION FOR WITHDRAW QUOTATION -->
  <v-dialog v-model="modalwithdraweQuoteConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to withdraw the quotation?"
      btnText="Confirm"
      @close="modalwithdraweQuoteConfirmation = false"
      @closeAll="handleRemoveQuotation"
    />
  </v-dialog>

  <!-- CONFIRMATION FOR CANCEL APPOINTMENTS -->
  <v-dialog v-model="modalCancelConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to cancel the appointment?"
      btnText="Confirm"
      @close="modalCancelConfirmation = false"
      @closeAll="handleCancelAppointment"
    />
  </v-dialog>

  <!-- CONFIRMATION FOR CLOSING APPOINTMENTS AFTER THE SCHEDULED TIME HAS PASSED -->
  <v-dialog v-model="modalCloseConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to close the appointment?"
      btnText="Confirm"
      @close="modalCloseConfirmation = false"
      @closeAll="handleCloseAppointment"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { CaseDetails } from '@/stores/types/case'
import { computed, ref, watchEffect } from 'vue'
import CaseDetailsWindow from './CaseDetailsWindow.vue'
import SharedFilesWindow from './SharedFilesWindow.vue'
import dayjs from 'dayjs'
import QuotationWindow from './QuotationWindow.vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import { useCaseStore } from '@/stores/case'
import useMitt from '@/functions/useMitt'
import { toast } from 'vue3-toastify'
import { useAppointmentsStore } from '@/stores/appointments'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const props = defineProps<{
  caseDetails: CaseDetails | null
  actionLoading: boolean
  type?: string
  appointment?: {
    id: string
    scheduledAt: string
  }
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'openQuoteDrawer'): void
}>()

const modalConfirmation = ref(false)
const modalwithdraweQuoteConfirmation = ref(false)
const modalCancelConfirmation = ref(false)
const modalCloseConfirmation = ref(false)
const loading = ref(false)
const reminderSend = ref(false)
const isPastSchedule = ref(false)

const caseStore = useCaseStore()
const appointmentsStore = useAppointmentsStore()
const { emitter } = useMitt()
// const quoteElement = ref<null | HTMLElement>(null)

const tab = ref('basic-details')

const tabs = ref([
  {
    label: 'Basic Details',
    value: 'basic-details'
  },
  {
    label: 'Shared Files',
    value: 'shared-files'
  }
])

const menuList = computed(() => [
  {
    title: 'View Paid Invoice',
    action: handleDownloadQuote,
    style: { display: tab.value === 'quotes' ? 'visible' : 'none' }
  },
  {
    title: 'Cancel Appointment',
    action: handleCancelAppointmentConfirmation,
    style: { color: 'red' }
  }
])

//TO REMOVE THE SUBMITTED QUOTATIONS
const removeQutotation = async (caseId: string, quoteId: string) => {
  try {
    loading.value = true
    await caseStore.deleteQuote(caseId, quoteId)
  } finally {
    loading.value = false
  }
}
const handleRemoveQuotation = async () => {
  modalwithdraweQuoteConfirmation.value = false
  const caseId = props.caseDetails?.id as string
  const quoteId = props.caseDetails?.quote[0].id as string
  await removeQutotation(caseId, quoteId)
  emitter.emit('quotation-drawer:refetch_cases')
  emit('close')
  toast.success('Quotation removed successfully!')
}

//TO DECLINE FOR THE REQUEST
const deleteCase = async (caseId: string) => {
  try {
    loading.value = true
    await caseStore.deleteCase(caseId)
  } finally {
    loading.value = false
  }
}
const handleDeleteCase = async () => {
  modalConfirmation.value = false
  const caseId = props.caseDetails?.id as string
  await deleteCase(caseId)
  emitter.emit('quotation-drawer:refetch_cases')
  emit('close')
  toast.success('Request delete successfully!')
}

//TO CANCEL THE BOOKED APPOINTMENT
function handleCancelAppointmentConfirmation() {
  modalCancelConfirmation.value = true
}

const cancelAppointment = async (appointmentId: string) => {
  try {
    loading.value = true
    await appointmentsStore.deleteAppointment(appointmentId)
  } finally {
    loading.value = false
  }
}
async function handleCancelAppointment() {
  modalCancelConfirmation.value = false
  const appointmentId = props.appointment?.id as string
  await cancelAppointment(appointmentId)
  emitter.emit('case-details-drawer:refetch_appointments')
  emitter.emit('case-details-drawer:refetch_upcoming-appointments')
  emit('close')
  toast.success('Appointment canceled successfully!')
}

//TO DELETE THE BOOKED APPOINTMENT AFTER THE TIME HAS PASSED
const closeAppointment = async (appointmentId: string) => {
  try {
    loading.value = true
    await appointmentsStore.closeAppointment(appointmentId)
  } finally {
    loading.value = false
  }
}
async function handleCloseAppointment() {
  modalCloseConfirmation.value = false
  const appointmentId = props.appointment?.id as string
  await closeAppointment(appointmentId)
  emitter.emit('case-details-drawer:refetch_appointments')
  emitter.emit('case-details-drawer:refetch_upcoming-appointments')
  emit('close')
  toast.success('Appointment closed successfully!')
}

//SEND REMINDER IN BOOKED APPOINTMENT
const sendReminder = async (appointmentId: string) => {
  try {
    loading.value = true
    await appointmentsStore.sendReminder(appointmentId)
  } finally {
    loading.value = false
  }
}
const handleSendAppointmentReminder = async () => {
  const appointmentId = props.appointment?.id as string
  await sendReminder(appointmentId)
  reminderSend.value = true
  toast.success('Reminder sent successfully!')
}

async function handleDownloadQuote() {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()

    // Add the first page (existing implementation)
    const page1 = pdfDoc.addPage([595.28, 841.89]) // A4 size
    const { width, height } = page1.getSize()

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // First page content (existing implementation)
    page1.drawText('smoll', {
      x: 40,
      y: height - 40,
      size: 28,
      font: boldFont
    })

    const caseText = `Case ${props.caseDetails?.id || ''}`
    const caseTextWidth = font.widthOfTextAtSize(caseText, 16)
    page1.drawText(caseText, {
      x: width - caseTextWidth - 40,
      y: height - 40,
      size: 16,
      font: font
    })

    // Draw underline under header
    page1.drawLine({
      start: { x: 40, y: height - 60 },
      end: { x: width - 40, y: height - 60 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5)
    })

    // Add Pet and Owner details
    const labelX = 40
    let currentY = height - 85

    // Pet Name
    page1.drawText('Pet Name:', {
      x: labelX,
      y: currentY,
      size: 12,
      font: boldFont
    })
    page1.drawText(props.caseDetails?.pet?.name || '', {
      x: labelX + 70,
      y: currentY,
      size: 12,
      font: font
    })

    // Pet Owner
    currentY -= 25
    page1.drawText('Pet Owner:', {
      x: labelX,
      y: currentY,
      size: 12,
      font: boldFont
    })
    page1.drawText(props.caseDetails?.member || '', {
      x: labelX + 70,
      y: currentY,
      size: 12,
      font: font
    })

    // Phone number (aligned right)
    page1.drawText(props.caseDetails?.memberPhone || '', {
      x: width - 140,
      y: currentY,
      size: 12,
      font: font
    })

    // Scribed by
    currentY -= 25
    page1.drawText('Scribed by:', {
      x: labelX,
      y: currentY,
      size: 12,
      font: boldFont
    })
    page1.drawText(props.caseDetails?.vet || '', {
      x: labelX + 70,
      y: currentY,
      size: 12,
      font: font
    })

    // Appointment
    currentY -= 45
    page1.drawText('Appointment:', {
      x: labelX,
      y: currentY,
      size: 12,
      font: boldFont
    })

    const appointmentDate = props.caseDetails?.createdAt
      ? dayjs(props.caseDetails.createdAt).format('dddd DD.MM.YYYY HH:mm')
      : ''
    page1.drawText(appointmentDate, {
      x: labelX + 82,
      y: currentY,
      size: 12,
      font: font
    })

    // Draw underline before case brief
    page1.drawLine({
      start: { x: 40, y: currentY - 25 },
      end: { x: width - 40, y: currentY - 25 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5)
    })

    // Case Brief section
    currentY -= 60
    page1.drawText('Case Brief', {
      x: labelX,
      y: currentY,
      size: 20,
      font: font
    })

    // Case Brief content
    currentY -= 30
    const caseBrief = props.caseDetails?.description || ''
    const wrappedCaseBrief = wrapText(caseBrief, 80)
    wrappedCaseBrief.forEach((line) => {
      page1.drawText(line, {
        x: labelX,
        y: currentY,
        size: 12,
        font: font
      })
      currentY -= 20
    })

    // Expert Notes section
    currentY -= 25
    page1.drawText('Expert Notes', {
      x: labelX,
      y: currentY,
      size: 20,
      font: font
    })

    // Expert Notes content
    currentY -= 30
    const expertNotes = props.caseDetails?.vetNote || ''
    const wrappedExpertNotes = wrapText(expertNotes, 80)
    wrappedExpertNotes.forEach((line) => {
      page1.drawText(line, {
        x: labelX,
        y: currentY,
        size: 12,
        font: font
      })
      currentY -= 20
    })

    // Footer
    const footerY = 40
    page1.drawText('+971 4 451 0090    care@smoll.me', {
      x: labelX,
      y: footerY,
      size: 12,
      font: font
    })

    page1.drawText('smoll.me', {
      x: width - 80,
      y: footerY,
      size: 12,
      font: font
    })

    // Add second page for services
    const page2 = pdfDoc.addPage([595.28, 841.89])
    const { width: width2, height: height2 } = page2.getSize()

    // Add header to second page
    page2.drawText('smoll', {
      x: 40,
      y: height2 - 40,
      size: 28,
      font: boldFont
    })

    // Draw case number on second page
    page2.drawText(caseText, {
      x: width2 - caseTextWidth - 40,
      y: height2 - 40,
      size: 16,
      font: font
    })

    // Draw underline under header
    page2.drawLine({
      start: { x: 40, y: height2 - 60 },
      end: { x: width2 - 40, y: height2 - 60 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5)
    })

    // Services section title
    let currentY2 = height2 - 100
    page2.drawText('Approved Services', {
      x: 40,
      y: currentY2,
      size: 20,
      font: boldFont
    })

    currentY2 -= 40

    // Draw table headers
    const columns = ['Quantity', 'Service', 'Label', 'Cost']
    const columnWidths = [80, 250, 100, 80]
    const startX = 40
    let xPosition = startX

    // Draw table headers
    columns.forEach((header, index) => {
      page2.drawText(header, {
        x: xPosition,
        y: currentY2,
        size: 12,
        font: boldFont
      })
      xPosition += columnWidths[index]
    })

    currentY2 -= 20

    // Draw horizontal line under headers
    page2.drawLine({
      start: { x: startX, y: currentY2 },
      end: { x: width2 - 40, y: currentY2 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    })

    // Draw services
    props.caseDetails?.quote[0]?.services.forEach((service, index) => {
      if (props.caseDetails?.partnerBookingId && !service.isSelected) {
        return
      }

      currentY2 -= 30
      xPosition = startX

      // Quantity (always 1 for now)
      page2.drawText('1', {
        x: xPosition,
        y: currentY2,
        size: 12,
        font: font
      })

      // Service name
      xPosition += columnWidths[0]
      page2.drawText(service.name, {
        x: xPosition,
        y: currentY2,
        size: 12,
        font: font
      })

      // Label
      xPosition += columnWidths[1]
      page2.drawText(service.label, {
        x: xPosition,
        y: currentY2,
        size: 12,
        font: font
      })

      // Cost
      xPosition += columnWidths[2]
      page2.drawText(`${service.price} AED`, {
        x: xPosition,
        y: currentY2,
        size: 12,
        font: font
      })
    })

    // Calculate totals
    const total =
      props.caseDetails?.quote[0]?.services.reduce((sum, service) => {
        if (props.caseDetails?.partnerBookingId && !service.isSelected) {
          return sum
        }

        return sum + service.price
      }, 0) || 0
    const platformFees = total * 0.229 + 1 // Platform fee calculation
    const customerPayment = total - platformFees

    // Draw totals section
    currentY2 -= 40
    page2.drawLine({
      start: { x: startX, y: currentY2 },
      end: { x: width2 - 40, y: currentY2 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    })

    // Total Estimate
    currentY2 -= 30
    page2.drawText('Total Estimate:', {
      x: width2 - 210,
      y: currentY2,
      size: 12,
      font: boldFont
    })

    page2.drawText(`${total.toFixed(2)} AED`, {
      x: width2 - 120,
      y: currentY2,
      size: 12,
      font: font
    })

    // Platform Fees
    currentY2 -= 25
    page2.drawText('Customer Paid:', {
      x: width2 - 213,
      y: currentY2,
      size: 12,
      font: boldFont
    })

    page2.drawText(`${platformFees.toFixed(2)} AED`, {
      x: width2 - 120,
      y: currentY2,
      size: 12,
      font: font
    })

    // Draw line before final amount
    currentY2 -= 15
    page2.drawLine({
      start: { x: width2 - 220, y: currentY2 },
      end: { x: width2 - 40, y: currentY2 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    })

    // Customer Payment
    currentY2 -= 25
    page2.drawText('Customer to pay at clinic:', {
      x: width2 - 295,
      y: currentY2,
      size: 14,
      font: boldFont
    })

    page2.drawText(`${customerPayment.toFixed(2)} AED`, {
      x: width2 - 120,
      y: currentY2,
      size: 14,
      font
    })

    // Add footer to second page
    const footerY2 = 40
    page2.drawText('+971 4 451 0090    care@smoll.me', {
      x: 40,
      y: footerY2,
      size: 12,
      font: font
    })

    page2.drawText('smoll.me', {
      x: width2 - 80,
      y: footerY2,
      size: 12,
      font: font
    })

    // Generate and download PDF
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Case-${props.caseDetails?.id || 'report'}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.error('Failed to generate PDF')
  }
}

// Helper function to wrap text
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    if (currentLine.length + word.length <= maxCharsPerLine) {
      currentLine += (currentLine.length === 0 ? '' : ' ') + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  })

  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  return lines
}

watchEffect(() => {
  if (props.appointment?.scheduledAt) {
    isPastSchedule.value = dayjs().isAfter(dayjs(props.appointment?.scheduledAt))
  }
})
</script>
<style></style>

<style lang="scss" scoped>
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

.dialog:deep(.v-overlay__content) {
  right: 0;
}
</style>
