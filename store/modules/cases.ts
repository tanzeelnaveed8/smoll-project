import { create } from "zustand";
import { PetState } from "../types/pet";
import api from "@/utils/api";
import { CasesState } from "../types/cases";

export const useCasesStore = create<CasesState>((set, get) => ({
  casesList: [],
  caseRequests: [],
  vetDoctorList: [],

  fetchCases: async () => {
    const response = await api.get("/member/pets/breeds");

    set(() => ({
      casesList: response.data,
    }));
  },

  fetchCaseRequests: async () => {
    const response = await api.get("/member/pets/breeds");

    set(() => ({
      casesList: response.data,
    }));
  },
  fetchVetDoctors: async () => {
    const response = await api.get("/member/pets/breeds");

    set(() => ({
      casesList: response.data,
    }));
  },
}));
