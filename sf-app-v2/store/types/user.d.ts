import { Nullable } from "../types";
import { UploadedFile } from "./file";

export type UpdateUserPayloadDto = Partial<{
  name: string;
  playerId: string;
  email: string;
  address: string;
  villa: string;
  city: string;
  country: string;
  timeZone: string;
  postalCode: string;
  profileImg: UploadedFile;
}>;

export interface User {
  id: string;
  careId?: string;
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
  profileImg: UploadedFile;
  stripeCustomerId: string;
  playerId: string;
  navNotif?: { newQuotation?: number };
  popups: { emergency: {} | null; quotation: {} | null };
}

export interface UserState {
  user: Nullable<User>;
  callId: Nullable<string>;
  navNotif: number | null;

  /** Dev-only: set a mock user to bypass login and explore the app. */
  setDevUser: (user: User | null) => void;
  UPDATE_PET_COUNT: (increment: number) => void;
  SET_CALL_ID: (callId: string | null) => void;
  SET_NAV_NOTIF: (value: number | null) => void;

  fetchEnvs: () => Promise<void>;
  findUser: (skipErr?: boolean) => Promise<User>;
  updateUser: (payload: UpdateUserPayloadDto) => Promise<User>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (otp: string) => Promise<void>;
  createPaymentIntent: (
    customerId: string,
    price: number,
    currency: string
  ) => Promise<{
    paymentIntent: string;
    paymentIntentClientSecret: string;
    ephemeralKey: string;
    customer: string;
  }>;
  readQuotation: (caseId: string, quotationId: string) => Promise<void>;
  clearPopupNotification: (type: "emergency" | "quotation" | "appointment") => Promise<void>;
}
