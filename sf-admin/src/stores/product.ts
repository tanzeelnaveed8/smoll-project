import { defineStore } from 'pinia'
import api from '@/util/api'

export const useProductStore = defineStore('ProductStore', {
  state: () => ({}),
  actions: {
    async fetchProducts(search?: string, page?: number) {
      const { data } = await api.get('/admin/products', {
        params: { search, page: page ?? 1, limit: 10 }
      })
      return data
    },
    async fetchProductDetails(id: string) {
      const { data } = await api.get(`/admin/products/${id}`)
      return data
    },
    async addProduct(payload: { name: string; description?: string; price?: number; stock?: number; category?: string }) {
      await api.post('/admin/products', payload)
    },
    async updateProduct(id: string, payload: { name?: string; description?: string; price?: number; stock?: number; isActive?: boolean }) {
      await api.patch(`/admin/products/${id}`, payload)
    },
    async deleteProduct(id: string) {
      await api.delete(`/admin/products/${id}`)
    }
  }
})
