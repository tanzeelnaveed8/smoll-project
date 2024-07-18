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

export type HealthHistory = {
  id?: string;
  name: string;
  description: string;
  date: string;
  documents: {
    filename: string;
    filesize: number;
    mimetype: string;
    url: string;
  }[];
};

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
  chipNumber: number;
  photos: UploadedFile[];
  healthHistory?: HealthHistory[];
};

export type PetListItemType = {
  id: string;
  name: string;
  photos: [
    {
      filename: string;
      filesize: number;
      mimetype: string;
      url: string;
    }
  ];
};

export interface Pet extends Pick<PetDetail, ["id", "name", "photos"]> {}
export interface PetPayloadDto extends PetDetail {}

export interface PetBreeds {
  cats: string[];
  dogs: string[];
}

export interface PetState {
  petsDetailMap: Map<string, Nullable<PetDetail>>;
  healthHistoryMap: Map<string, HealthHistory[]>;
  petBreeds: Nullable<PetBreeds>;
  petsList: PetListItemType[];

  fetchPetBreeds: () => Promise<void>;
  fetchPets: () => Promise<PetListItemType[]>;
  fetchPetDetails: (id: string) => Promise<PetDetail>;
  addPet: (pet: PetPayloadDto) => Promise<PetDetail>;
  updatePet: (id: string, payload: PetDetail) => Promise<PetDetail>;

  addHealthHistory: (
    petId: string,
    payload: HealthHistory
  ) => Promise<HealthHistory>;
  updateHealthHistory: (
    petId: string,
    healthHistoryId: string,
    payload: HealthHistory
  ) => Promise<PetDetail>;
}
