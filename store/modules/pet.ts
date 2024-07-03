import { create } from "zustand";
import { PetState } from "../types/pet";
import api from "@/utils/api";

export const usePetStore = create<PetState>((set, get) => ({
  petsDetailMap: new Map(),
  petBreeds: null,

  fetchPetBreeds: async () => {
    const response = await api.get("/member/pets/breeds");

    set(() => ({
      petBreeds: response.data,
    }));
  },

  addPet: async (payload) => {
    const response = await api.post("/member/pets", {
      ...payload,
      dob: new Date(payload.dob).toISOString(),
    });

    const petMap = get().petsDetailMap.set(response.data.id, response.data);

    set(() => ({
      petsDetailMap: petMap,
    }));

    return response.data;
  },

  updatePet: async (id, payload) => {
    const response = await api.put(`/member/pets/${id}`, {
      ...payload,
      dob: payload.dob ? new Date(payload.dob).toISOString() : undefined,
    });

    const updatedPetMap = get().petsDetailMap.set(id, response.data);

    set(() => ({
      petsDetailMap: updatedPetMap,
    }));

    return response.data;
  },
}));
