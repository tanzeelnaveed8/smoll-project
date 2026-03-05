import api from '@/util/api'
import { defineStore } from 'pinia'

export interface Analytics {
  cases: number
  partners: number
  vets: number
  members: number
  services: number
  products: number
  openCases: number
  closedCases: number
  escalatedCases: number
}

export const useAnalyticsStore = defineStore('AnalyticsStore', {
  state: () => ({}),
  actions: {
    async fetchAnalytics() {
      const { data } = await api.get('/admin/analytics')
      return data
    }
  }
})
