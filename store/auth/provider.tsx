import { createContext, useReducer, useMemo, useContext } from "react";
import {
  AuthStateActionType,
  AuthStateType,
  CHANGE_HANDLER_TYPES,
} from "../types/index";

import * as AuthAPI from "../../apis/auth.api";
import useAsync from "@/hooks/useAsync";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const loginQuery = useAsync((payload: AuthAPI.AuthArgsType) =>
    AuthAPI.login(payload)
  );

  const fieldChangeHandler = (type: CHANGE_HANDLER_TYPES, value: string) => {
    const payload = { value };
    dispatch({ type, payload });
  };

  const getOPTHandler = async () => {
    const payload = { phone: `${getCountryCode(state.code)}${state.phone}` };
    try {
      console.log("try block");
      const data = await loginQuery.execute(payload);
      console.log(data.status, "res");
    } catch (error) {
      // TODO: handle errors
      console.log("error", error);
    }
  };

  const value = { ...state, fieldChangeHandler, getOPTHandler };
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
