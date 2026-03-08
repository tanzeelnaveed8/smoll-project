import type { UploadedFile } from './global'

export enum PetGenderEnum {
  MALE = 'male',
  FEMALE = 'female'
}

export enum PetSpeciesEnum {
  DOG = 'dog',
  CAT = 'cat'
}

export interface Pet {
  id: string
  name: string
  age: number | null
  weight: number | null
  species: PetSpeciesEnum | null
  gender: PetGenderEnum | null
  spayedOrNeutered: boolean
  breed: string
  chipNumber: number | string
  photos: string[] | null
  healthHistory: PetHealthHistory[]
  createdAt: string
  updatedAt: string
  preExistingConditions: string
  careType?: string
}

export interface PetHealthHistory {
  id: number
  name: string
  description: string
  date: string
  documents: UploadedFile[]
}

export interface Benefit {
  id: string
  name: string
  totalUsageCount: number
  consumedUsageCount: number
  history: {
    partnerId: string
    clinicName: string
    note: string
    createdAt: string
  }[]
}

export interface PetProfileDetails {
  pet: {
    id: string
    name: string
    age: number
    weight: number
    species: string
    gender: 'male' | 'female'
    breed: string
    photos: any[] | null
    spayedOrNeutered?: boolean
    smollCareLicense: {
      id: string
      subscription: {
        id: string
        status: string
      }
    }
  }
  benefits: Benefit[]
}

export interface UpdateBenefitsPayload {
  petId: string
  caseId?: string
  benefits: { benefitId: number; note?: string }[]
}

export interface GetBenefitUsagePayload {
  month: number;
  year: number;
  page: number;
  limit: number;
}
