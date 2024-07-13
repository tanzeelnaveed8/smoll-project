import { create } from "zustand";
import { HealthHistory, PetState } from "../types/pet";
import api from "@/utils/api";

export const usePetStore = create<PetState>((set, get) => ({
  petsDetailMap: new Map(),
  petBreeds: null,
  healthHistoryMap: new Map(),

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
    const response = await api.patch(`/member/pets/${id}`, {
      ...payload,
      dob: payload.dob ? new Date(payload.dob).toISOString() : undefined,
    });

    const updatedPetMap = get().petsDetailMap.set(id, response.data);

    set(() => ({
      petsDetailMap: updatedPetMap,
    }));

    return response.data;
  },

  addHealthHistory: async (petId, payload) => {
    const response = await api.post(
      `/member/pets/${petId}/health-history`,
      payload
    );

    console.log("addHealthHistory response", response);

    const existingData = get().healthHistoryMap.get(petId);
    let data;
    if (existingData) {
      data = [response.data, ...existingData];
    } else {
      data = [response.data];
    }

    const updatedHealthHistoryMap = get().healthHistoryMap.set(petId, data);

    set(() => ({
      healthHistoryMap: updatedHealthHistoryMap,
    }));

    return response.data;
  },

  updateHealthHistory: async (petId, healthHistoryId, payload) => {
    const response = await api.patch(
      `/member/pets/${petId}/health-history/${healthHistoryId}`,
      payload
    );

    const existingData = get().healthHistoryMap.get(petId) as HealthHistory[];

    const updatedData: HealthHistory[] = existingData.map((item) =>
      item.id === healthHistoryId ? response.data : item
    );

    const updatedHealthHistoryMap = get().healthHistoryMap.set(
      petId,
      updatedData
    );

    set(() => ({
      healthHistoryMap: updatedHealthHistoryMap,
    }));

    return response.data;
  },
}));
