import { create } from "zustand";
import { PetState } from "../types/pet";
import api from "@/utils/api";

export const usePetStore = create<PetState>((set, get) => ({
  petsDetailMap: new Map(),

  createPet: async (payload) => {
    const response = await api.post("/member/pets", payload);

    const petMap = get().petsDetailMap.set(response.data.id, response.data);

    set(() => ({
      petsDetailMap: petMap,
    }));

    return response.data;
  },

  updatePet: async (id, payload) => {
    const response = await api.put(`/member/pets/${id}`, payload);

    const updatedPetMap = get().petsDetailMap.set(id, response.data);

    set(() => ({
      petsDetailMap: updatedPetMap,
    }));

    return response.data;
  },
}));
