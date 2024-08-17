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

    console.log("response", response.data);

    set({
      partnerVetDetails: new Map([
        ...get().partnerVetDetails,
        [id, response.data],
      ]),
    });
  },
}));
