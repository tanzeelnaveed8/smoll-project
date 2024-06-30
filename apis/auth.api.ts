import { api } from ".";
import { VerifyOtpResDto } from "./types/auth";

export type AuthPayloadDto = {
  phone: string;
};

export interface VerifyOtpArgsType extends AuthPayloadDto {
  otp: string;
}

export function login(data: AuthPayloadDto) {
  return api.post("/member/auth/login", { ...data });
}

export function register(data: AuthPayloadDto) {
  return api({
    method: "post",
    url: "/register",
    data,
  });
}

export function verifyOtp(data: VerifyOtpArgsType) {
  return api.post<VerifyOtpResDto>("/member/auth/verify-otp", { ...data });
}
