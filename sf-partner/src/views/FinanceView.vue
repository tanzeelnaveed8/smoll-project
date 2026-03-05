<template>
  <v-sheet class="px-8 py-8 d-flex justify-center">
    <v-sheet class="d-flex flex-column gr-6 w-100" max-width="1104">
      <v-sheet>
        <h2 style="font-weight: 600; line-height: 32px">Finance</h2>
        <p class="mt-1">Revenue and visit-level finance overview for your clinic.</p>
      </v-sheet>

      <v-sheet class="d-grid gc-4" style="grid-template-columns: repeat(4, minmax(0, 1fr))">
        <v-sheet class="metric-card">
          <p class="metric-label">Total Revenue</p>
          <p class="metric-value">{{ summary.currency }} {{ summary.totalRevenue.toFixed(2) }}</p>
        </v-sheet>
        <v-sheet class="metric-card">
          <p class="metric-label">Completed Visits</p>
          <p class="metric-value">{{ summary.completedVisits }}</p>
        </v-sheet>
        <v-sheet class="metric-card">
          <p class="metric-label">Upcoming Visits</p>
          <p class="metric-value">{{ summary.upcomingVisits }}</p>
        </v-sheet>
        <v-sheet class="metric-card">
          <p class="metric-label">Cancelled Visits</p>
          <p class="metric-value">{{ summary.cancelledVisits }}</p>
        </v-sheet>
      </v-sheet>

      <v-sheet>
        <h3 class="text-h6 mb-3">Recent Visits</h3>
        <v-data-table
          :loading="loading"
          class="table text-body-2 text-grey1"
          hide-default-footer
          :items-per-page="12"
          :items="appointments"
          :headers="headers"
        >
          <template #item.action="{ item }">
            <v-btn
              variant="plain"
              color="#10AFE1"
              class="px-0"
              min-width="auto"
              @click="viewInvoice(item.raw.id)"
              >View Paid Invoice</v-btn
            >
          </template>
        </v-data-table>
      </v-sheet>
    </v-sheet>
  </v-sheet>

  <v-dialog v-model="invoiceDialog" width="620">
    <v-sheet class="pa-6">
      <h3 class="text-h6 mb-2">Invoice {{ invoice?.id ?? '' }}</h3>
      <p class="text-grey2 mb-4">{{ invoice?.memberName ?? '-' }} | {{ invoice?.memberPhone ?? '-' }}</p>

      <v-table density="compact" class="mb-4">
        <thead>
          <tr>
            <th>Service</th>
            <th>Label</th>
            <th class="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in invoice?.services ?? []" :key="`${service.name}-${service.label}`">
            <td>{{ service.name }}</td>
            <td>{{ service.label }}</td>
            <td class="text-right">{{ invoice?.currency }} {{ Number(service.price).toFixed(2) }}</td>
          </tr>
        </tbody>
      </v-table>

      <div class="d-flex justify-end">
        <p class="font-weight-bold">
          Total: {{ invoice?.currency ?? 'AED' }} {{ Number(invoice?.total ?? 0).toFixed(2) }}
        </p>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAppointmentsStore, type Appointment } from '@/stores/appointments'
import { useFinanceStore, type AppointmentInvoice } from '@/stores/finance'
import { onMounted, reactive, ref } from 'vue'
import { toast } from 'vue3-toastify'

const appointmentsStore = useAppointmentsStore()
const financeStore = useFinanceStore()
const loading = ref(false)
const appointments = ref<Appointment[]>([])
const invoice = ref<AppointmentInvoice | null>(null)
const invoiceDialog = ref(false)

const summary = reactive({
  completedVisits: 0,
  upcomingVisits: 0,
  cancelledVisits: 0,
  totalRevenue: 0,
  currency: 'AED'
})

const headers = [
  { title: 'Member', key: 'member' },
  { title: 'Scheduled At', key: 'scheduledAt' },
  { title: 'Case', key: 'caseId' },
  { title: 'Action', key: 'action', sortable: false }
]

const loadData = async () => {
  try {
    loading.value = true
    const [financeSummary, fetchedAppointments] = await Promise.all([
      financeStore.fetchSummary(),
      appointmentsStore.fetchAppointments()
    ])
    summary.completedVisits = financeSummary.completedVisits
    summary.upcomingVisits = financeSummary.upcomingVisits
    summary.cancelledVisits = financeSummary.cancelledVisits
    summary.totalRevenue = Number(financeSummary.totalRevenue ?? 0)
    summary.currency = financeSummary.currency || 'AED'
    appointments.value = fetchedAppointments
  } finally {
    loading.value = false
  }
}

const viewInvoice = async (appointmentId: string) => {
  try {
    loading.value = true
    invoice.value = await financeStore.fetchAppointmentInvoice(appointmentId)
    invoiceDialog.value = true
  } catch (error) {
    toast.error('Unable to load invoice')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadData()
})
</script>

<style scoped>
.metric-card {
  border: 1px solid #dde7ee;
  border-radius: 12px;
  padding: 20px;
}

.metric-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 600;
}

.metric-value {
  margin-top: 8px;
  font-size: 28px;
  line-height: 32px;
  font-weight: 700;
}
</style>