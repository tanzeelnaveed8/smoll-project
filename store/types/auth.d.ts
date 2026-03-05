export type AuthPayloadDto = {
  phone: string;
};

export interface VerifyOtpPayloadDto extends AuthPayloadDto {
  otp: string;
}

export interface AuthState {
  login: (payload: AuthPayloadDto) => Promise<void>;
  verifyOtp: (payload: VerifyOtpPayloadDto) => Promise<void>;
  /** Dev-only: login + verify with DEV_BYPASS_PHONE and DEV_BYPASS_OTP. */
  devLogin: () => Promise<void>;
  deactivateAccount: () => Promise<void>;
}
