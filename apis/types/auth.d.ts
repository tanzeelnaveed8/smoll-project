export interface VerifyOtpResDto {
  message: string;
}

export type AuthPayloadDto = {
  phone: string;
};

export interface VerifyOtpArgsType extends AuthPayloadDto {
  otp: string;
}

export interface UserDto {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  isEmailVerified: false;
  address: string | null;
  villa: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  timeZone: string | null;
}

export interface UserResDto extends UserDto {
  createdAt: string;
  updatedAt: string;
}
