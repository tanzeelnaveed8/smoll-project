import { createContext, useReducer, useMemo, useContext } from "react";
import { AuthStateType, CHANGE_HANDLER_TYPES } from "../types/index";

import * as AuthAPI from "../../apis/auth.api";
import useAsync from "@/hooks/useAsync";
import { useNavigation } from "@react-navigation/native";
import { AuthPayloadDto, VerifyOtpArgsType } from "@/apis/types/auth";
import { reducer } from "./reducer";

const initialState: AuthStateType = {
  code: "🇮🇳 (+91) India",
  phone: "6395566973",
  otp: "",
  isLoginInProgress: false,
  isOTPConfrimInProgress: false,
  firstName: "",
  lastName: "",
  isUpdatingUserInProgress: false,
} as AuthStateType;

// Create Context
const AuthStateContext = createContext<AuthStateType>(initialState);

export const AuthStateProvider = ({ children }: any) => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const loginQuery = useAsync((payload: AuthPayloadDto) =>
    AuthAPI.login(payload)
  );
  const verifyOTPQuery = useAsync((payload: VerifyOtpArgsType) =>
    AuthAPI.verifyOtp(payload)
  );
  const signupQuery = useAsync((payload: AuthPayloadDto) =>
    AuthAPI.register(payload)
  );
  const getUserDetailsQuery = useAsync(AuthAPI.getUserDetails);
  const updateUserDetailsQuery = useAsync(AuthAPI.updateUserDetails);

  const fieldChangeHandler = (type: CHANGE_HANDLER_TYPES, value: string) => {
    const payload = { value };
    dispatch({ type, payload });
  };

  const login = async (payload: AuthPayloadDto) => {
    try {
      await loginQuery.execute(payload);
      // @ts-ignore
      navigation.navigate("VerifyNumber");
    } catch (error) {
      // TODO: Error needs to be handled
      console.log("Login Error:", error);
    }
  };

  const signup = async (payload: AuthPayloadDto) => {
    try {
      await signupQuery.execute(payload);
      //@ts-ignore
      navigation.navigate("VerifyNumber");
    } catch (error) {
      const { statusCode, error: err } = error?.response?.data || {};
      // if this is true, it means user already exist, then run login
      if (statusCode === 409 && err === "Conflict") {
        console.log("Login running...");
        login(payload);
        return;
      }

      // TODO: Error needs to be handled
      console.log("Signup Error:", error);
    }
  };

  const getOPTHandler = async () => {
    const phone = `${getCountryCode(state.code)}${state.phone}`;
    const payload = { phone };
    try {
      signup(payload);
    } catch (error) {
      // TODO: Error needs to be handled
      console.log("getOPTHandler", error);
    }
  };

  const getUserDetails = async () => {
    try {
      const data = await getUserDetailsQuery.execute();
      const { name } = data.data;
      const payload = { ...data.data };
      dispatch({ type: "UPDATE_USER", payload });
      const screen = name ? "Home" : "SignUpUserName";
      // @ts-ignore
      navigation.navigate(screen);
    } catch (error) {
      // TODO: Error needs to be handled
      console.log("Get user error", error);
    }
  };

  const updateUserDetailsHandler = async () => {
    const _payload = { name: `${state.firstName}  ${state.lastName}` };
    try {
      const data = await updateUserDetailsQuery.execute(_payload);
      const payload = { ...data.data };
      dispatch({ type: "UPDATE_USER", payload });
      navigation.navigate("Home");
    } catch (error) {
      // TODO: Error needs to be handled
      console.log("Get user error", error);
    }
  };

  const confirmOTPHandler = async () => {
    const payload = {
      phone: `${getCountryCode(state.code)}${state.phone}`,
      otp: state.otp,
    };
    try {
      const data = await verifyOTPQuery.execute(payload);

      if (data.status === 201) {
        await getUserDetails();
      }
    } catch (error) {
      // TODO: handle errors
      console.log("error", error);
    }
  };

  const value: AuthStateType = {
    ...state,
    fieldChangeHandler,
    getOPTHandler,
    isLoginInProgress: loginQuery.loading || signupQuery.loading,
    isOTPConfrimInProgress:
      verifyOTPQuery.loading || getUserDetailsQuery.loading,
    confirmOTPHandler,
    isUpdatingUserInProgress: updateUserDetailsQuery.loading,
    updateUserDetailsHandler,
  };
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
