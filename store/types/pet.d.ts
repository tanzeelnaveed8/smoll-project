import { Nullable, UploadedFile } from "../types";

export enum PetGenderEnum {
  MALE = "male",
  FEMALE = "female",
}

export enum PetSpeciesEnum {
  DOG = "dog",
  CAT = "cat",
}

export type PetDetail = {
  name: string;
  age: number;
  weight: number;
  species: string;
  spayedOrNeutered: boolean;
  gender: PetGenderEnum;
  breed: string;
  dob: string;
  chipNumber: number;
  photos: UploadedFile[];
};

export interface Pet extends Pick<PetDetail, ["id", "name", "photos"]> {}

export interface CreatePetPayloadDto extends Omit<PetDetail, ["photos"]> {}
export interface UpdatePetPayloadDto extends Partial<PetDetail> {}

export interface PetState {
  petsDetailMap: Map<string, Nullable<PetDetail>>;
  createPet: (pet: CreatePetPayloadDto) => Promise<PetDetail>;
  updatePet: (id: string, payload: UpdatePetPayloadDto) => Promise<PetDetail>;
}
