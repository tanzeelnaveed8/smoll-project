import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { State, UpdateUserPayloadDto } from './types/auth'

export const useAuthStore = defineStore('AuthStore', {
  state: (): State => ({
    user: null,
    initializationComplete: false
  }),
  actions: {
    async updateUser(payload: UpdateUserPayloadDto) {
      const { data } = await api.patch('/partners/me', payload)
      this.user = data
    },
    async login(payload: { email: string; password: string }) {
      await api.post('/partner/auth/login', payload)
    },
    async logout() {
      await api.post('/partner/auth/logout')
      this.user = null
    },
    async fetchUser() {
      const { data } = await api.get('/partners/me')
      this.user = data
    }
  }
})
