import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { State, UpdateUserPayloadDto, User } from './types/auth'

export const useAuthStore = defineStore('AuthStore', {
  state: (): State => ({
    user: null,
    zegoToken: null,
    initializationComplete: false
  }),
  actions: {
    async updateUser(payload: UpdateUserPayloadDto) {
      const { data } = await api.patch('/vets/me', payload)
      this.user = data
    },
    async login(payload: { email: string; password: string }) {
      const { data } = await api.post('/vet/auth/login', payload)

      this.zegoToken = data.tokens.zegoToken
      // save to local storage
      localStorage.setItem('zegoToken', data.tokens.zegoToken)

      // Fetch and set user so dashboard knows we're logged in
      await this.fetchUser()
    },
    async refreshLoginToken() {
      const { data } = await api.post('/vet/auth/refresh-token')
      this.zegoToken = data.zegoToken
      // save to local storage
      localStorage.setItem('zegoToken', data.zegoToken)
    },
    async logout() {
      try {
        await api.post('/vet/auth/logout')
      } finally {
        this.user = null
        this.zegoToken = null
        localStorage.removeItem('zegoToken')
      }
    },
    async fetchUser(): Promise<User> {
      const { data } = await api.get('/vets/me')
      this.user = data

      return data
    }
  }
})
