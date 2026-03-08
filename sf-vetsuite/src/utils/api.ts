import axios from 'axios'
import { toast } from 'vue3-toastify'

// In dev with no VITE_API_URL (or when using proxy), use '' so requests go to same origin and get proxied to backend
const baseURL =
  import.meta.env.DEV && !import.meta.env.VITE_API_URL
    ? ''
    : (import.meta.env.VITE_API_URL as string) || ''

const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
    let msgStr = message

    if (Array.isArray(message)) {
      msgStr = message[0]
    }

    if (msgStr && error.response.status !== 403 && error.config.method !== 'get') {
      toast.error(msgStr)
    }

    throw error
  }
)

export default api
