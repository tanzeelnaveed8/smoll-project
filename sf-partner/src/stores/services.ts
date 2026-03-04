import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { Service, UpdateServicesPayload } from './types/services'

export const useServicesStore = defineStore('ServicesStore', {
  state: () => ({}),
  actions: {
    async fetchServices() {
      const response = await api.get('/partners/services')
      return response.data
    },
    async addServices(payload: UpdateServicesPayload) {
      const response = await api.post('/partners/services', payload)
      return response.data
    },
    async UpdateServices(id: string, payload: UpdateServicesPayload) {
      await api.patch(`/partners/services/${id}`, payload)
    },
    async removeService(id: string) {
      await api.delete(`/partners/services/${id}`)
    },
    async getSpecialities() {
      const response = await api.get('/partners/specialities')
      return response.data
    },
    async addBulkServices (payload:Service[]){
      await api.post('/partners/services/bulk',payload)
    }
  }
})
