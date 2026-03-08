import { defineStore } from 'pinia'
import api from '@/utils/api'

export interface VetFinanceStats {
  totalVisits: number
  completedVisits: number
  totalEarnings: number
}

export const useFinanceStore = defineStore('FinanceStore', {
  state: () => ({
    stats: null as VetFinanceStats | null
  }),
  actions: {
    async fetchFinanceStats(): Promise<VetFinanceStats> {
      const { data } = await api.get<VetFinanceStats>('/vets/finance')
      this.stats = data
      return data
    }
  }
})
