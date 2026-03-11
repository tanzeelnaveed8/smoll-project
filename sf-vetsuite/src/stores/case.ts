import { defineStore } from 'pinia'
import type { DirectEscalateCasePayload, SendNotePayload, State } from './types/case'
import api from '@/utils/api'

interface escalateCasePayload {
  partnerIds: string[]
  vetNote: string
}

export const useCaseStore = defineStore('CaseStore', {
  state: (): State => ({}),
  actions: {
    async fetchCases(payload?: { search?: string; page?: number; limit?: number }) {
      const response = await api.get('/vet/cases', {
        params: payload
      })
      return response.data
    },
    async fetchCaseDetails(caseId: string) {
      const response = await api.get(`/vet/cases/${caseId}`)
      return response.data
    },
    async escalateCase(caseId: string, payload: escalateCasePayload) {
      const response = await api.post(`/vet/cases/${caseId}/escalate`, payload)
    },
    async closeCase(caseId: string, payload: { note: string }) {
      await api.post(`/vet/cases/${caseId}/close`, payload)
    },
    async directEscalateCase (caseId:string,payload: DirectEscalateCasePayload){
      await api.post(`/vet/cases/${caseId}/direct-escalate`,payload)
    },
    async sendNote (caseId:string , payload :SendNotePayload){
      await api.post(`/vet/cases/${caseId}/notes`,payload)
    }
  }
})
