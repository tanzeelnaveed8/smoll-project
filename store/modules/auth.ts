import { AxiosError } from "axios";
import { create } from "zustand";
import { AuthState } from "../types/auth";
import api from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    if (!exist) {
      await api.post("/member/auth/register", payload);
      await api.post("/member/auth/login", payload);
    }
  },
  async verifyOtp(payload) {
    const res = await api.post("/member/auth/verify-otp", payload);
    const token = res.data.accessToken;
    console.log("verifyOtp", res.data.accessToken);

    await AsyncStorage.setItem("accessToken", token);
  },
}));
