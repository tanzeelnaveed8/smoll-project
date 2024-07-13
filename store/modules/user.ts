import { AxiosError } from "axios";
import { create } from "zustand";
import api from "@/utils/api";
import { UserState } from "../types/user";

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

  async sendVerificationEmail() {
    await api.post("/members/send-email-verification");
  },

  async verifyEmail(otp: string) {
    await api.post("/members/verify-email", { otp });

    const user = get().user;

    if (!user) return;

    set(() => ({
      user: {
        ...user,
        isEmailVerified: true,
      },
    }));
  },
}));
