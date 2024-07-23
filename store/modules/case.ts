import { create } from "zustand";
import api from "@/utils/api";
import { CasesState } from "../types/case";

export const useCaseStore = create<CasesState>((set, get) => ({
  cases: null,
  caseRequests: [],
  vetDoctorList: [],

  createCase: async (payload) => {
    const { petId, vetId, ...rest } = payload;

    const res = await api.post("/member/cases", rest, {
      params: {
        petId,
        vetId,
      },
    });

    return { id: res.data.id };
  },
  removeCase: async (id: string) => {
    await api.delete(`/member/cases/${id}`);
  },
  fetchCases: async (loadMore?: boolean) => {
    const response = await api.get("/member/cases");

    const cases = get().cases || [];

    console.log("case", response.data);

    set(() => ({
      cases: loadMore ? [...cases, ...response.data] : response.data,
    }));
  },

  fetchVetDoctors: async () => {
    const response = await api.get("/member/pets/breeds");

    // set(() => ({
    //   cases: response.data,
    // }));
  },
}));
