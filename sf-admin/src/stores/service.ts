import { defineStore } from 'pinia'
import api from '@/util/api'

export const useServiceStore = defineStore('ServiceStore', {
  state: () => ({}),
  actions: {
    async fetchServices(search?: string, page?: number) {
      const { data } = await api.get('/admin/services', {
        params: { search, page: page ?? 1, limit: 10 }
      })
      return data
    },
    async fetchServiceDetails(id: string) {
      const { data } = await api.get(`/admin/services/${id}`)
      return data
    },
    async addService(payload: { name: string; description?: string; price?: number; currency?: string }) {
      await api.post('/admin/services', payload)
    },
    async updateService(id: string, payload: { name?: string; description?: string; price?: number; isActive?: boolean }) {
      await api.patch(`/admin/services/${id}`, payload)
    },
    async deleteService(id: string) {
      await api.delete(`/admin/services/${id}`)
    }
  }
})
