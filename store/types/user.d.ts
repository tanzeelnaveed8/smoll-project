import { Nullable } from "../types";

export type UpdateUserPayloadDto = Partial<{
  name: string;
  email: string;
  address: string;
  villa: string;
  city: string;
  country: string;
  timeZone: string;
}>;

export interface User {
  id: string;
  name: Nullable<string>;
  phone: string;
  email: Nullable<string>;
  isEmailVerified: boolean;
  address: Nullable<string>;
  villa: Nullable<string>;
  city: Nullable<string>;
  country: Nullable<string>;
  postalCode: Nullable<string>;
  timeZone: Nullable<string>;
  petCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  user: Nullable<User>;
  findUser: () => Promise<User>;
  updateUser: (payload: UpdateUserPayloadDto) => Promise<User>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (otp: string) => Promise<void>;
}
