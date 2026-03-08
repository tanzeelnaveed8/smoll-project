import type { AvailabilityItem } from './availabilities'
import type { UploadedFile } from './global'

export interface UpdateVetPayload {
  name?: string
  email?: string
  phone?: string
  designation?: string
  profileImg?: UploadedFile | null
  yearsOfExperience?: number
  availabilities?: UpdateAvailabilitiesPayload
}

export interface Veterinarians {
  id: string
  name: string
  email: string
  phone: string
  designation: string
  isSuspended: null | boolean
  profileImg: null | UploadedFile
  createdAt: string
}

export interface VetDetails {
  id: string
  name: string
  phone: string
  email: string
  designation: string
  profileImg: {
    filename: string
    filesize: 0
    mimetype: string
    url: string
  }
  yearsOfExperience: number
  availabilities: AvailabilityItem[]
  labelColor:string
  about?:string | null
}

export interface State {
  veterinarians: Veterinarians[] | [] | null
}