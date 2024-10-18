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
    const zegoToken = res.data.zegoToken;
    const envs = res.data.envs as Record<string, string>;

    await AsyncStorage.setItem("accessToken", token);
    await AsyncStorage.setItem("zegoToken", zegoToken);
    await AsyncStorage.setItem("envs", JSON.stringify(envs));
  },
}));
