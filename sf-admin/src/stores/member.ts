import { defineStore } from 'pinia'
import api from '@/util/api'

export const useMemberStore = defineStore('MemberStore', {
  state: () => ({}),
  actions: {
    async fetchMembers(search?: string, page?: number) {
      const data = await api.get('/admin/members', {
        params: {
          search,
          page: page ? page : 1,
          limit: 10
        }
      })
      return data.data
    },
    async fetchMembersDetails(id: string) {
      const data = await api.get(`/admin/members/${id}`)
      return data.data
    }
  }
})
