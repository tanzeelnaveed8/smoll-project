import { Nullable } from "../types";
import { UploadedFile } from "./file";

export enum PetGenderEnum {
  MALE = "male",
  FEMALE = "female",
}

export enum PetSpeciesEnum {
  DOG = "dog",
  CAT = "cat",
}

export type PetDetail = {
  id?: string;
  name: string;
  age: number;
  weight: number;
  species: string;
  spayedOrNeutered: boolean;
  gender: PetGenderEnum;
  breed: string;
  dob: string;
  chipNumber: string;
  photos: UploadedFile[];
  healthHistory?: HealthHistory[];
  preExistingConditions: string;
  isDeceased?: boolean;
};

export interface Pet {
  id: string;
  name: string;
  photos: UploadedFile[];
}

export type HealthHistory = {
  id?: string;
  name: string;
  description: string;
  date: string;
  documents: UploadedFile[];
};

export interface PetPayloadDto extends PetDetail {}
export interface PetBreeds {
  cats: string[];
  dogs: string[];
}

export interface PetState {
  pets: Nullable<Pet[]>;
  petsDetailMap: Map<string, Nullable<PetDetail>>;
  // healthHistoryMap: Map<string, HealthHistory[]>;
  petBreeds: Nullable<PetBreeds>;

  fetchPetBreeds: () => Promise<void>;
  fetchPets: (isDeceased?: boolean) => Promise<Pet[]>;
  fetchPetDetails: (id: string) => Promise<PetDetail>;
  addPet: (pet: PetPayloadDto) => Promise<PetDetail>;
  updatePet: (id: string, payload: Partial<PetDetail>) => Promise<PetDetail>;

  addHealthHistory: (
    petId: string,
    payload: HealthHistory
  ) => Promise<HealthHistory>;
  updateHealthHistory: (
    petId: string,
    healthHistoryId: string,
    payload: HealthHistory
  ) => Promise<PetDetail>;

  deleteHealthHistory: (
    petId: string,
    healthHistoryId: string
  ) => Promise<void>;

  deletePet: (petId: string) => Promise<void>;
}
