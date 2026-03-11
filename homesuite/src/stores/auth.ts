import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  initializationComplete: boolean
}

export const useAuthStore = defineStore('AuthStore', {
  state: (): AuthState => ({
    user: null,
    initializationComplete: false
  }),
  actions: {
    async login(payload: { email: string; password: string }) {
      await api.post('/vet/auth/login', payload)
    },
    async refreshToken() {
      await api.post('/vet/auth/refresh-token')
    },
    async logout() {
      await api.post('/vet/auth/logout')
      this.user = null
    },
    async fetchUser(): Promise<User> {
      const { data } = await api.get('/vets/me')
      this.user = data
      return data
    }
  }
})
