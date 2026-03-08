import type { Nullable, UploadedFile } from './global'

export interface User {
  id: string
  name: string
  receptionistName: string
  phone: string
  email: string
  clinicImg: UploadedFile
  address: string
  country: string
  city: string
  openingHours: string
  postalCode: string
  timeZone: string
  createdAt: string
  specialities: { id: string; name: string }[]
  imgCollections: UploadedFile[] | null
}

export interface UpdateUserPayloadDto {
  yearsOfExperience?: number
  receptionistName?: string
  clinicImg?: UploadedFile
  city?: string
  isOnline?: boolean
  name?: string
  designation?: string
  address?: string
  country?: string
  timeZone?: string
  phone?: string
  specialities?: string[]
  openingHours?: string
  imgCollections?: UploadedFile[] | null,
  oldPassword?: string,
  password?: string,
}

export interface State {
  user: Nullable<User>
  initializationComplete: boolean
}
