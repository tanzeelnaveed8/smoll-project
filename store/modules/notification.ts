import { create } from "zustand";
import api from "@/utils/api";
import { NotificationState } from "../types/notification";
import { dummyNotificationList } from "@/constant/notificationDummyData";

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: null,

  fetchNotifications: async (page: number, limit: number) => {
    const response = await api.get(
      `/notifications?page=${page}&limit=${limit}`
    );

    // const response = {
    //   data: {
    //     data: dummyNotificationList,
    //     count: 0,
    //     currentPage: 0,
    //     nextPage: 2,
    //   },
    // };

    // const data = response.data;
    const result = response.data;

    let udpatedData = [];
    if (get().notifications?.data && get().notifications?.data.length) {
      const existing = get().notifications?.data || [];
      udpatedData = [...existing, ...result.data];
    } else {
      udpatedData = result.data;
    }

    set(() => ({
      notifications: { ...response.data, data: udpatedData },
    }));

    return response.data;
  },

  readAllNotification: async () => {
    const response = await api.post(`/notifications/read-all`);

    set(() => ({
      notifications: null,
    }));
  },
}));
