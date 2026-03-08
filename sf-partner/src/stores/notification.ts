import { defineStore } from 'pinia'
import api from '@/utils/api'

interface State {
  notificationIndicator: null | boolean
}

export const useNotificationStore = defineStore('NotificationStore', {
  state: (): State => ({
    notificationIndicator: null
  }),
  actions: {
    async fetchNotification(payload?: { limit?: number; page?: number }) {
      const { data } = await api.get('/notifications', {
        params: { page: payload?.page ?? 1, limit: payload?.limit ?? 30 }
      })
      return data
    },
    async readAllNotifications() {
      await api.post('/notifications/read-all')
      this.notificationIndicator = null
    },
    async sendNotification(payload: {
      playerId: string
      heading: string
      message: string
      meta: Record<string, any>
      icon?: string
    }) {
      await api.post('/notifications/send-onesignal-notification', payload)
    }
  }
})
