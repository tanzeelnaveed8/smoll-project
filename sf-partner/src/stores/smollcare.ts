import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { GetBenefitUsagePayload, UpdateBenefitsPayload } from './types/pet'

export const useSmollcareStore = defineStore('smollcareStore', {
  state: () => ({}),
  actions: {
    async fetchPetById(petId: string) {
      const { data } = await api.get(`/partner/smollcare/pet/${petId}`)
      return data
    },
    async updateBenefits(payload: UpdateBenefitsPayload) {
      const res = await api.post(`/partner/smollcare/benefit/use`, payload)
    },
    async getBenefitUsage(payload: GetBenefitUsagePayload) {
      const { month, year, page, limit } = payload;
      const res = await api.get('/partner/smollcare/benefit-usage', {
        params: { month, year, page, limit }
      });
      return res.data;
    },
    async exportBenefitUsagePDF(payload: GetBenefitUsagePayload) {
      const { month, year, page, limit } = payload;
      const res = await api.get('/partner/smollcare/benefit-usage/export-pdf', {
        params: { month, year, page, limit },
        responseType: 'blob', // ⬅️ Important for handling PDF files
      });
      return res;
    }
  }
})
