import { AxiosError } from "axios";
import { create } from "zustand";
import { AuthState } from "../types/auth";
import api from "@/utils/api";

export const useAuthStore = create<AuthState>((set) => ({
  async login(payload) {
    let exist = false;

    try {
      await api.post("/member/auth/register", payload);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 409) {
        exist = true;
      }
    }

    if (exist) {
      await api.post("/member/auth/login", payload);
    }
  },
  async verifyOtp(payload) {
    await api.post("/member/auth/verify-otp", payload);
  },
}));
