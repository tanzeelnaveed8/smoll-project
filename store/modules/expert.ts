import { create } from "zustand";
import api from "@/utils/api";
import { ExpertState, RateExpertPayloadDto } from "../types/expert";

export const useExpertStore = create<ExpertState>((set, get) => ({
  expertDetailMap: new Map(),
  experts: null,

  fetchExperts: async () => {
    const response = await api.get("/member/vets");

    set(() => ({
      experts: response.data,
    }));

    return response.data;
  },
  fetchExpertDetail: async (id: string) => {
    const response = await api.get(`/member/vets/${id}`);

    set((state) => ({
      expertDetailMap: state.expertDetailMap.set(id, response.data),
    }));
  },
  fetchExpertAvailability: async (id: string, date?: Date) => {
    const response = await api.get(`/member/vets/${id}/availabilities`, {
      params: {
        date,
      },
    });

    return response.data;
  },
  findOneConsultation: async (id: string) => {
    const res = await api.get(`/member/vets/consultations/${id}`);
    return res.data;
  },
  requestConsultation: async (id: string): Promise<{ id: string }> => {
    const res = await api.post(`/member/vets/${id}/consultations/request`);

    return { id: res.data.id };
  },
  endConsultation: async (id: string) => {
    await api.post(`/member/vets/consultations/${id}/end`);
  },
  updateConsultation: async (payload: { id: string; caseId: string }) => {
    const { id, caseId } = payload;
    const res = await api.patch(`/member/vets/consultations/${id}`, {
      caseId,
    });

    return res.data;
  },
  rateExpert: async (payload: RateExpertPayloadDto) => {
    const { id, caseId, rating, comment } = payload;

    const res = await api.post(
      `/member/vets/${id}/feedbacks`,
      {
        rating,
        comment,
      },
      {
        params: {
          caseId,
        },
      }
    );

    return res.data;
  },
}));
