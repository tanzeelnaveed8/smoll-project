import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { UploadedFile } from './types/global'

export const useUploadStore = defineStore('UploadStore', {
  state: () => ({}),
  actions: {
    async uploadFile(files: FormData): Promise<UploadedFile[]> {
      const response = await api.post('/files', files)
      return response.data
    }
  }
})
