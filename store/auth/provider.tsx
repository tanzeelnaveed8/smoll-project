import { createContext, useReducer, useMemo, useContext } from "react";
import {
  AuthStateActionType,
  AuthStateType,
  CHANGE_HANDLER_TYPES,
} from "../types/index";

const initialState: AuthStateType = {
  code: "",
  phone: "",
  otp: "",
} as AuthStateType;

// Create Context
const AuthStateContext = createContext<AuthStateType>(initialState);

// Reducer
const reducer = (state: AuthStateType, action: AuthStateActionType) => {
  switch (action.type) {
    case "ON_CODE_CHANGE":
      return { ...state, code: action.payload.value };
    case "ON_PHONE_CHANGE":
      return { ...state, phone: action.payload.value };
    case "ON_OTP_CHANGE":
      return { ...state, otp: action.payload.value };

    default:
      return state;
  }
};

export const AuthStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fieldChangeHandler = (type: CHANGE_HANDLER_TYPES, value: string) => {
    const payload = { value };
    dispatch({ type, payload });
  };

  const value = { ...state, fieldChangeHandler };
  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
};

// Custom Hook
export const useAuthState = () => useContext(AuthStateContext);

function getCountryCode(input: string) {
  // Use a regular expression to match the country code
  const match = input.match(/\((\+\d+)\)/);

  if (match) {
    // Return the country code (including the + symbol)
    return match[1];
  } else {
    // If no match is found, return an empty string
    return "";
  }
}
