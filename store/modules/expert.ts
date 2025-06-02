import { create } from "zustand";
import api from "@/utils/api";
import { ExpertState } from "../types/expert";
import { ZIMConversationQueryConfig } from "zego-zim-react-native";
import { zim } from "@/utils/chat.v2";
import { IMessage } from "react-native-gifted-chat";

export const useExpertStore = create<ExpertState>((set, get) => ({
  expertDetailMap: new Map(),
  experts: null,
  unreadMessages: new Map(),
  conversations: new Map(),
  activeConvo: null,

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
  requestConsultation: async (vetId, petId) => {
    const res = await api.post(`/member/vets/${vetId}/consultations/request`, {
      petId,
    });

    return { id: res.data.id };
  },
  scheduleConsultation: async (id, payload) => {
    const { data } = await api.post(`/member/vets/${id}/consultations/schedule`, payload);

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

  getUnreadMessage: async () => {
    const queryConfig: ZIMConversationQueryConfig = {
      count: 9999,
    };
    const { conversationList } = await zim.queryConversationList(queryConfig);
    conversationList.forEach((conv) =>
      set((state) => ({
        unreadMessages: state.unreadMessages.set(conv.conversationID, conv.unreadMessageCount),
      }))
    );
  },

  setUnreadMessage: (value: Map<string, number>) => {
    set((state) => ({
      unreadMessages: value,
    }));
  },

  setConversations: (value: Map<string, IMessage[]>) => {
    set((state) => ({
      conversations: value,
    }));
  },

  setActiveConvo: (value: string | null) => {
    set((state) => ({
      activeConvo: value,
    }));
  },
}));
