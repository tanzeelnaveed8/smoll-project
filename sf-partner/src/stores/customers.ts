import { defineStore } from 'pinia'
import api from '@/utils/api'

export interface Customer {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  visits: number
  orders: number
  pets: number
  lastVisitAt: string | null
}

export interface UpsertCustomerPayload {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

export const useCustomersStore = defineStore('CustomersStore', {
  state: () => ({}),
  actions: {
    async fetchCustomers(search?: string) {
      const response = await api.get('/partners/customers', {
        params: {
          search: search?.trim() || undefined
        }
      })
      return response.data as Customer[]
    },
    async addCustomer(payload: UpsertCustomerPayload) {
      const response = await api.post('/partners/customers', payload)
      return response.data as Customer
    },
    async updateCustomer(id: string, payload: UpsertCustomerPayload) {
      const response = await api.patch(`/partners/customers/${id}`, payload)
      return response.data as Customer
    },
    async deleteCustomer(id: string) {
      await api.delete(`/partners/customers/${id}`)
    }
  }
})
