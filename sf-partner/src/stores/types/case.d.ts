import type { Nullable, UploadedFile } from './global'
import type { Pet } from './pet'

export enum CaseQuoteLabel {
  ESSENTIAL = 'Essential',
  RECOMMENDED = 'Recommended',
  CONTINGENT = 'Contingent'
}

export interface Case {
  member: string
  caseBrief: string
  pet: string
  id: string
  createdAt: string
  vet: string
  quoteExists: boolean
  partnerBookingId: Nullable<string>
  updatedAt?:string
}

export interface CaseDetails {
  pet: Pet
  description: string
  vetNote: string
  assets: UploadedFile[]
  quote: [
    {
      id: 'string'
      note: 'string'
      services: [
        {
          id: 'string'
          name: 'string'
          description: 'string'
          label: string
          price: 0
          currency: 'string'
          isSelected: boolean
        }
      ]
    }
  ]
  id: string
  member: string
  memberPhone: string
  vet: string
  createdAt: string
  partnerBookingVet?: string
  partnerBookingId: Nullable<string>
  isEmergency?:boolean | null
}

export interface SendQuotePayload {
  services: { id: string; label: string }[]
  note: string
}

export interface UpdateQuotePayload {
  services?: { id: string; label: string }[]
  note?: string
}

export interface State {}
