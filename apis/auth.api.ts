import { getApi } from ".";
import { VerifyOtpResDto } from "./types/auth";
const api = getApi("/member/auth/");

type AuthArgsType = {
  phone: string;
};

interface VerifyOtpArgsType extends AuthArgsType {
  otp: string;
}

export function login(data: AuthArgsType) {
  return api({
    method: "post",
    url: "/login",
    data,
  });
}

export function register(data: AuthArgsType) {
  return api({
    method: "post",
    url: "/register",
    data,
  });
}

export function verifyOtp(data: VerifyOtpArgsType) {
  return api<VerifyOtpResDto>({
    method: "post",
    url: "/verify-otp",
    data,
  });
}
