import { api } from ".";
import { VerifyOtpResDto } from "./types/auth";

export type AuthArgsType = {
  phone: string;
};

interface VerifyOtpArgsType extends AuthArgsType {
  otp: string;
}

export function login(data: AuthArgsType) {
  console.log("data", data);
  return api.post("/member/auth/login", { data: { ...data } });
}

export function register(data: AuthArgsType) {
  return api({
    method: "post",
    url: "/register",
    data,
  });
}

export function verifyOtp(data: VerifyOtpArgsType) {
  return api({
    method: "post",
    url: "/verify-otp",
    data: { ...data },
  });
}
