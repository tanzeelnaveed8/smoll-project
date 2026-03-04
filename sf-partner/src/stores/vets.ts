import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { UpdateVetPayload, VetDetails , State } from './types/vet'

export const useVetStore = defineStore('VetsStore', {
  state: () : State => ({
    veterinarians: null
  }),
  actions: {
    async fetchVets() {
      const response = await api.get('/partners/vets')
      return response.data
    },
    async addVets(payload: VetDetails) {
      const response = await api.post('/partners/vets', payload)
      return response.data
    },
    async fetchVetDetails(caseId: string) {
      const response = await api.get(`/partners/vets/${caseId}`)
      return response.data
    },
    async UpdateVet(id: string, payload: UpdateVetPayload) {
      await api.patch(`/partners/vets/${id}`, payload)
    },
    async removeVet(id: string) {
      await api.delete(`/partners/vets/${id}`)
    }
  }
})
