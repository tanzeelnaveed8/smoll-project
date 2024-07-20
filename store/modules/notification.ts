import { create } from "zustand";
import api from "@/utils/api";
import { NotificationState } from "../types/notification";

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: null,

  fetchNotifications: async (page: number, limit: number) => {
    const response = await api.get(
      `/notifications?page=${page}&limit=${limit}`
    );

    let udpatedData = [];
    if (get().notifications?.data && get().notifications?.data.length) {
      const existing = get().notifications?.data || [];
      udpatedData = [...existing, ...response.data];
    } else {
      udpatedData = response.data;
    }

    set(() => ({
      notifications: { ...response.data, data: udpatedData },
    }));
  },
}));
