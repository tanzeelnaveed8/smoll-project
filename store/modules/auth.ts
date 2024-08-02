import { AxiosError } from "axios";
import { create } from "zustand";
import { AuthState } from "../types/auth";
import api from "@/utils/api";

export const useAuthStore = create<AuthState>((set) => ({
  async login(payload) {
    let exist = true;

    try {
      await api.post("/member/auth/login", payload);
    } catch (err) {
      const error = err as AxiosError;
      console.log(api.defaults.baseURL, error.code, error.status);
      if (error.response?.status === 404) {
        exist = false;
      }
    }

    console.log("e", exist);

    if (!exist) {
      await api.post("/member/auth/register", payload);
      await api.post("/member/auth/login", payload);
    }
  },
  async verifyOtp(payload) {
    await api.post("/member/auth/verify-otp", payload);
  },
}));
