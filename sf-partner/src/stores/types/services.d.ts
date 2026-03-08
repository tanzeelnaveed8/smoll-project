export interface UpdateServicesPayload {
  title?: string
  description?: string
  type?: string
  price?: number
  currency?: string
  quickBooking?:boolean
}

export interface Service {
  id: string
  title: string
  type: string
  description: string
  price: number
  currency: string
  quickBooking:boolean
}
