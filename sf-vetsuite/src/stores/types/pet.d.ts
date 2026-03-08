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
  age: number
  weight: number
  species: PetSpeciesEnum
  gender: PetGenderEnum
  spayedOrNeutered: boolean
  breed: string
  chipNumber: number | string
  photos: string[]
  healthHistory: PetHealthHistory[]
  createdAt: string
  updatedAt: string
  preExistingConditions: string
  subscription?: {
    status: string
    benefitUsages: {
      id: string
      name: string
      totalUsageCount: number
      consumedUsageCount: number
      history: []
    }[]
  }
  benefitUsageSummary: {
    id: string
    name: string
    totalUsageCount: number
    consumedUsageCount: number
    history: {
      clinicName: string
      createdAt: string
      note: string
      partnerId: string
      vet: string
    }[]
  }[]
}

export interface PetHealthHistory {
  id: number
  name: string
  description: string
  date: string
  documents: UploadedFile[]
}
