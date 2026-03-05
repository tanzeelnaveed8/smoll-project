import { AxiosError } from "axios";
import { create } from "zustand";
import { AuthState } from "../types/auth";
import api from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OneSignal } from "react-native-onesignal";
import { DEV_BYPASS_OTP, DEV_BYPASS_PHONE } from "@/constant/constant";

export const useAuthStore = create<AuthState>((set) => ({
  async login(payload) {
    let exist = true;

    try {
      await api.post("/member/auth/login", payload);
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 404) {
        exist = false;
      } else {
        throw err;
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

    if (envs?.ONESIGNAL_APP_ID) {
      OneSignal.initialize(envs.ONESIGNAL_APP_ID);
      const playerId = await OneSignal.User.pushSubscription.getIdAsync();
      if (playerId) {
        await api.patch("/members/me", { playerId });
      }
    }
  },
  /**
   * Dev-only: get a token without sending OTP (avoids "Maximum OTP send attempts" limit).
   * Calls only verifyOtp(DEV_BYPASS_PHONE, DEV_BYPASS_OTP). Backend must accept this in dev
   * without requiring a prior login() call for this number (e.g. dev bypass in verify-otp).
   */
  async devLogin() {
    await useAuthStore.getState().verifyOtp({ phone: DEV_BYPASS_PHONE, otp: DEV_BYPASS_OTP });
  },
  async deactivateAccount() {
    await api.post("/members/me/deactivate");
  },
}));
