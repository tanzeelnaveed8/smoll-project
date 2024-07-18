import { create } from "zustand";
import api from "@/utils/api";
import { CasesState } from "../types/case";

export const useCaseStore = create<CasesState>((set, get) => ({
  casesList: [],
  caseRequests: [],
  vetDoctorList: [],

  createCase: async (payload) => {
    const { petId, ...rest } = payload;

    const res = await api.post("/member/cases", rest, {
      params: {
        petId,
      },
    });

    return { id: res.data.id };
  },

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
