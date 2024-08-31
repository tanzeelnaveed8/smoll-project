import { create } from "zustand";
import api from "@/utils/api";
import { State as PartnerState } from "../types/partner";

export const usePartnerStore = create<PartnerState>((set, get) => ({
  partnerVets: new Map(),
  partnerVetDetails: new Map(),

  fetchPartnerVets: async (partnerId) => {
    const response = await api.get(`/member/partners/${partnerId}/vets`);

    set({
      partnerVets: new Map([...get().partnerVets, [partnerId, response.data]]),
    });
  },
  fetchPartnerVetDetails: async (id, partnerId) => {
    const response = await api.get(`/member/partners/${partnerId}/vets/${id}`);

    set({
      partnerVetDetails: new Map([
        ...get().partnerVetDetails,
        [id, response.data],
      ]),
    });

    return response.data;
  },
  fetchPartnerVetAvailability: async (id, partnerId, date) => {
    const response = await api.get(
      `/member/partners/${partnerId}/vets/${id}/availabilities`,
      {
        params: {
          date,
        },
      }
    );

    return response.data;
  },
  bookPartnerVet: async (
    id,
    partnerId,
    caseId,
    date,
    services,
    paymentIntentId
  ) => {
    const res = await api.post(
      `/member/partners/${partnerId}/vets/${id}/book`,
      {
        scheduleAt: date,
        caseId,
        services,
        paymentIntentId,
      }
    );

    return { id: res.data.id };
  },
}));
