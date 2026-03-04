import { defineStore } from 'pinia'
import { type ConsultationDetail, type State } from './types/consultation.d'
import api from '@/utils/api'

export const useConsultationStore = defineStore('ConsultationStore', {
  state: (): State => ({
    consultations: null,
    consultationDetailMap: new Map(),
    appointments: [],
    activeConsultationId: null,
    remoteStream: null,
    audioEnabled: true,
    videoEnabled: true
  }),
  actions: {
    async fetchConsultation(status: 'scheduled' | 'instant' | 'all', page?: number) {
      const { data } = await api.get('/vets/consultations', {
        params: {
          type: status === 'all' ? undefined : status,
          page: page ?? 1,
          limit: 100,
          isCompleted: status === 'all' ? true : undefined
        }
      })
      this.consultations = data.data
      return data
    },

    async fetchConsultationDetails(id: string): Promise<ConsultationDetail> {
      const { data } = await api.get(`/vets/consultations/${id}`)
      this.consultationDetailMap.set(id, data)
      return data
    },
    async initiateConsultation(id: string) {
      // socket events
      await api.post(`/vets/consultations/${id}/initiate-call`)
    },
    async initiateConsultationCall(id: string, callId: string, memberId: string) {
      // socket events
      await api.post(`/vets/consultations/${id}/initiate-call/${callId}`, {
        memberId
      })
    },
    async endConsultation(id: string) {
      await api.post(`/vets/consultations/${id}/end-call`)
    },

    async fetchConsultationsCalendar(startDate: string, type?: 'monthly' | 'weekly') {
      const res = await api.get(`/vets/consultations/calendar`, { params: { startDate, type } })

      this.appointments = [...this.appointments, ...res.data.consultations]
      return res.data
    },
    async sendReminder(id: string) {
      await api.post(`/vets/consultations/${id}/send-reminder`)
    }
  }
})
