import { UserResDto } from "./types/auth.d";
import { api } from ".";
import {
  AuthPayloadDto,
  VerifyOtpArgsType,
  VerifyOtpResDto,
} from "./types/auth";

export function login(data: AuthPayloadDto) {
  return api.post("/member/auth/login", { ...data });
}

export function register(data: AuthPayloadDto) {
  return api.post("/member/auth/register", { ...data });
}

export function verifyOtp(data: VerifyOtpArgsType) {
  return api.post<VerifyOtpResDto>("/member/auth/verify-otp", { ...data });
}

export function getUserDetails() {
  return api.get<UserResDto>("/members/me");
}

export function updateUserDetails(data: Partial<UserResDto>) {
  return api.patch<UserResDto>("/members/me", { ...data });
}
