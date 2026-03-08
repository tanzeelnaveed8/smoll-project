import type { Service, ServicePayload, UploadedFile } from './global'
import type { Pet } from './pet'

export enum CaseStatusEnum {
  OPEN = 'open',
  OPEN_ESCALATED = 'openEscalated',
  CLOSED = 'closed'
}

export enum CaseQuoteLabel {
  ESSENTIAL = 'Essential',
  RECOMMENDED = 'Recommended',
  CONTINGENT = 'Contingent'
}

export interface Quote {
  id: string
  note: string
  partner: {
    name: string
    clinicImg: UploadedFile
    isSelected: boolean
  }
  services: {
    description: string
    id: string
    label: string
    name: string
    price: number
    isSelected: boolean
  }[]
}

export interface Case {
  id: string
  description: string
  assets: UploadedFile[]
  createdAt: string
  member: string
  memberPhone: string
  pet: Pet
  status: CaseStatusEnum
  vetNote: string
  feedback: {
    rating: 0
    comment: 'string'
  }
  quotes?: Quote[]
  notes?:[] | string[]
  updatedAt?:string
  serviceChecklist?: { name: string; checked: boolean }[]
  customerNotReachable?: boolean
}

export interface State {}

export interface DirectEscalateCasePayload {
    partnerId: string
    vetNote: string
    services: ServicePayload[]
    partnerVetId?:string
    scheduledAt?:string
    isEmergency:boolean
}

export interface SendNotePayload {
    notes:{content:string,createdAt:string}[]
}