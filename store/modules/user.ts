import { AxiosError } from "axios";
import { create } from "zustand";
import api from "@/utils/api";
import { UserState } from "../types/user";

// zustand

export const useUserStore = create<UserState>((set, get) => ({
  user: null,

  /** Actions */
  async findUser() {
    const res = await api.get("/members/me");

    set(() => ({
      user: res.data,
    }));

    return res.data;
  },

  async updateUser(payload) {
    const res = await api.patch(`/members/me`, payload);

    set(() => ({
      user: res.data,
    }));

    return res.data;
  },
}));
