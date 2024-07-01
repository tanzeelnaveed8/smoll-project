import { AuthStateActionType, AuthStateType } from "../types/index";
// import {  } from "../types/index";

export const reducer = (state: AuthStateType, action: AuthStateActionType) => {
  switch (action.type) {
    case "ON_CODE_CHANGE":
      return { ...state, code: action.payload.value };
    case "ON_PHONE_CHANGE":
      return { ...state, phone: action.payload.value };
    case "ON_OTP_CHANGE":
      return { ...state, otp: action.payload.value };
    case "ON_FIRST_NAME_CHANGE":
      return { ...state, firstName: action.payload.value };
    case "ON_LAST_NAME_CHANGE":
      return { ...state, lastName: action.payload.value };
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      return state;
  }
};
