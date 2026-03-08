import { defineStore } from 'pinia'
import type { SendQuotePayload, State, UpdateQuotePayload } from './types/case'
import api from '@/utils/api'

export const useCaseStore = defineStore('CaseStore', {
  state: (): State => ({}),
  actions: {
    async fetchCases(payload?: { search?: string; page?: number; limit?: number }) {
      const response = await api.get('/partner/cases', {
        params: payload
      })
      return response.data
    },

    async fetchCaseDetails(caseId: string) {
      const response = await api.get(`/partner/cases/${caseId}`)
      return response.data
    },

    async deleteCase(id: string) {
      await api.delete(`/partner/cases/${id}`)
    },

    async sendQuote(id: string, payload: SendQuotePayload) {
      await api.post(`/partner/cases/${id}/quote`, payload)
    },

    async updateQuote(caseId: string, quoteId: string, payload: UpdateQuotePayload) {
      await api.patch(`/partner/cases/${caseId}/quote/${quoteId}`, payload)
    },

    async deleteQuote(caseId: string, quoteId: string) {
      await api.delete(`/partner/cases/${caseId}/quote/${quoteId}`)
    }
  }
})
