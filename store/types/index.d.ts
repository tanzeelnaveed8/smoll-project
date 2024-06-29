type CODE_CHANGE = "ON_CODE_CHANGE";
type PHONE_CHANGE = "ON_PHONE_CHANGE";
type OTP_CHANGE = "ON_OTP_CHANGE";

export type CHANGE_HANDLER_TYPES = CODE_CHANGE | PHONE_CHANGE | OTP_CHANGE;

export interface AuthStateType {
  code: string;
  phone: string;
  otp: string;
  fieldChangeHandler: (type: CHANGE_HANDLER_TYPES, value: string) => void;
}

export type AuthStateActionType =
  | { type: "ON_CODE_CHANGE"; payload: { value: string } }
  | { type: "ON_PHONE_CHANGE"; payload: { value: string } }
  | { type: "ON_OTP_CHANGE"; payload: { value: string } };
