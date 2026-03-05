import type { Case } from './case'
import type { Nullable } from './global'
import type { Member } from './member'

export enum ConsultationStatusEnum {
  INITIATED = 'initiated',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  SCHEDULED = 'scheduled',
  EXPIRED = 'expired'
}

export interface Consultation {
  member: { name: string }
  caseBrief: string
  pet: string
  id: string
  status: ConsultationStatusEnum
  scheduledAt?: string
  type: 'instant' | 'scheduled'
  createdAt: string
  isAccepted: boolean
  rejectedByVetName?: string | null
}

export interface ConsultationDetail {
  id: string
  status: ConsultationStatusEnum
  scheduledAt?: string
  createdAt: string
  member: Member
  case: Case
  isAccepted: boolean
  rejectedByVetName?: string | null
}

export interface State {
  consultations: Nullable<Consultation[]>
  consultationDetailMap: Map<string, ConsultationDetail>
  appointments: Consultation[] | []
  activeConsultationId: null | string
  remoteStream: MediaStream | null
  audioEnabled: boolean
  videoEnabled: boolean
}
