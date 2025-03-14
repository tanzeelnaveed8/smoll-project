import { create } from "zustand";
import api from "@/utils/api";
import { ExpertState } from "../types/expert";

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
  fetchExpertDetail: async (id) => {
    const response = await api.get(`/member/vets/${id}`);

    set((state) => ({
      expertDetailMap: state.expertDetailMap.set(id, response.data),
    }));
  },
  updateExpertStatus: (id, status) => {
    set((state) => {
      const expertDetailMap = new Map(state.expertDetailMap);
      const expert = expertDetailMap.get(id);

      const updatedExperts =
        get().experts?.map((expert) => {
          if (expert.id === id) {
            return { ...expert, isOnline: status };
          }
          return expert;
        }) ?? [];

      set(() => ({
        experts: updatedExperts,
      }));

      if (expert) {
        expert.isOnline = status;
        expertDetailMap.set(id, expert);
      }
      return { expertDetailMap };
    });
  },

  fetchExpertAvailability: async (id, date) => {
    const response = await api.get(`/member/vets/${id}/availabilities`, {
      params: {
        date,
      },
    });

    return response.data;
  },
  findOneConsultation: async (id) => {
    const res = await api.get(`/member/vets/consultations/${id}`);
    return res.data;
  },
  requestConsultation: async (id) => {
    const res = await api.post(`/member/vets/${id}/consultations/request`);

    return { id: res.data.id };
  },
  scheduleConsultation: async (id, payload) => {
    const { data } = await api.post(
      `/member/vets/${id}/consultations/schedule`,
      payload
    );

    return { id: data.id };
  },

  updateConsultation: async (payload) => {
    const { id, caseId } = payload;
    const res = await api.patch(`/member/vets/consultations/${id}`, {
      caseId,
    });

    return res.data;
  },
  rateExpert: async (payload) => {
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
