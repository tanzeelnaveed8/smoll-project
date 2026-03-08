import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { Period } from './types/global'

export interface Appointment {
  id: string
  scheduledAt: string
  member: string
  caseId: string
  isNew: boolean
  labelColor:string
}

export const useAppointmentsStore = defineStore('AppointmentsStore', {
  state: () => ({}),
  actions: {
    async fetchAppointments() {
      const response = await api.get('/partners/appointments')
      return response.data
    },
    async fetchAppointmentsCalendar(startDate: string,type:Period,vetId?:string) {
      const response = await api.get('/partners/appointments/calendar', { params: { startDate,type:type,vetId} })
      return response.data
    },
    async deleteAppointment(appointmentId: string) {
      await api.delete(`/partners/appointments/${appointmentId}`)
    },
    async closeAppointment(appointmentId: string) {
      await api.post(`/partners/appointments/${appointmentId}/close`)
    },
    async sendReminder(appointmentId: string) {
      await api.post(`/partners/appointments/${appointmentId}/reminder`)
    }
  }
})
