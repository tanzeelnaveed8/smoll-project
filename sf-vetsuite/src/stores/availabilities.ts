import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { UpdateAvailabilitiesPayload } from './types/availabilities'

export const useAvailabilitiesStore = defineStore('AvailabilitiesStore', {
  state: () => ({}),
  actions: {
    async fetchAvailabilities() {
      const response = await api.get('/vets/me/availabilities')
      return response.data
    },
    async updateAvailabilities(payload: UpdateAvailabilitiesPayload) {
      const response = await api.post('/vets/me/availabilities', payload)
      return response.data
    }
  }
})
