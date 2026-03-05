import { defineStore } from 'pinia'
import api from '@/utils/api'

export interface FinanceSummary {
  completedVisits: number
  upcomingVisits: number
  cancelledVisits: number
  totalRevenue: number
  currency: string
}

export interface AppointmentInvoice {
  id: string
  appointmentId: string
  paymentIntentId: string
  scheduledAt: string | null
  services: { name: string; description: string; label: string; price: number }[]
  subtotal: number
  total: number
  currency: string
  memberName: string | null
  memberEmail: string | null
  memberPhone: string | null
}

export const useFinanceStore = defineStore('FinanceStore', {
  state: () => ({}),
  actions: {
    async fetchSummary() {
      const response = await api.get('/partners/finance')
      return response.data as FinanceSummary
    },
    async fetchAppointmentInvoice(appointmentId: string) {
      const response = await api.get(`/partners/appointments/${appointmentId}/invoice`)
      return response.data as AppointmentInvoice
    }
  }
})
