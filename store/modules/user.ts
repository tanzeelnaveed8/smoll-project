import { create } from "zustand";
import api from "@/utils/api";
import { UserState } from "../types/user";

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  callId: null,
  navNotif: null,

  /** Mutations */
  SET_CALL_ID: (callId) => {
    set(() => ({
      callId: callId,
    }));
  },
  UPDATE_PET_COUNT: (increment: number = 1) => {
    const user = get().user;

    if (user) {
      set({
        user: {
          ...user,
          petCount: (user.petCount || 0) + increment,
        },
      });
    }
  },
  SET_NAV_NOTIF: (val: number | null) => {
    console.log(val, "SET NAV NOT VALUE");
    set(() => ({
      navNotif: val,
    }));
  },

  fetchEnvs: async () => {
    const res = await api.get("/envs");
    return res.data;
  },

  /** Actions */
  async findUser(skipErr) {
    const res = await api.get("/members/me" + (skipErr ? "?skiperr" : ""));

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

  async createPaymentIntent(customerId, price, currency) {
    const res = await api.post("/member/stripe/create-payment-session", {
      customerId,
      price,
      currency,
    });

    return res.data;
  },

  async readQuotation(caseId: string, quotationId: string) {
    await api.patch(`/member/cases/${caseId}/quotes/${quotationId}/read`);
  },

  async clearPopupNotification(type: "emergency" | "appointment" | "quotation") {
    await api.post("/members/me/clear-popups", type);
  },
}));
