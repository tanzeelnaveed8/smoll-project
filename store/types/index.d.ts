import { UserDto, UserResDto } from "@/apis/types/auth";

type CODE_CHANGE = "ON_CODE_CHANGE";
type PHONE_CHANGE = "ON_PHONE_CHANGE";
type OTP_CHANGE = "ON_OTP_CHANGE";
type FIRST_NAME_CHANGE = "ON_FIRST_NAME_CHANGE";
type LAST_NAME_CHANGE = "ON_LAST_NAME_CHANGE";

export type CHANGE_HANDLER_TYPES =
  | CODE_CHANGE
  | PHONE_CHANGE
  | OTP_CHANGE
  | FIRST_NAME_CHANGE
  | LAST_NAME_CHANGE;

export interface AuthStateType {
  code: string;
  phone: string;
  firstName: string;
  lastName: string;
  otp: string;
  fieldChangeHandler: (type: CHANGE_HANDLER_TYPES, value: string) => void;
  getOPTHandler: () => void;
  isLoginInProgress: boolean;
  confirmOTPHandler: () => void;
  isOTPConfrimInProgress: boolean;
  isLoginModalOpen: boolean;
  toggleLoginModal: (isOpen?: boolean) => void;
  user: UserDto;
  isUpdatingUserInProgress: boolean;
  updateUserDetailsHandler: () => void;
}

export type AuthStateActionType =
  | { type: "ON_CODE_CHANGE"; payload: { value: string } }
  | { type: "ON_PHONE_CHANGE"; payload: { value: string } }
  | { type: "ON_OTP_CHANGE"; payload: { value: string } }
  | { type: "ON_FIRST_NAME_CHANGE"; payload: { value: string } }
  | { type: "ON_LAST_NAME_CHANGE"; payload: { value: string } }
  | { type: "UPDATE_USER"; payload: Partial<UserResDto> };
