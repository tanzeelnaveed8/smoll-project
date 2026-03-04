export type AuthPayloadDto = {
  phone: string;
};

export interface VerifyOtpPayloadDto extends AuthPayloadDto {
  otp: string;
}

export interface AuthState {
  login: (payload: AuthPayloadDto) => Promise<void>;
  verifyOtp: (payload: VerifyOtpPayloadDto) => Promise<void>;
  deactivateAccount: () => Promise<void>;
}
