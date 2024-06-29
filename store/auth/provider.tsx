import { createContext, useReducer, useMemo, useContext } from "react";

const initialState = {
  user: "Mohammad shahzaib",
};

// Create Context
const AuthStateContext = createContext(initialState);

// Reducer
const reducer = () => {
  return { ...initialState };
};

export const AuthStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ ...state, dispatch }), []);

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
};

// Custom Hook
export const useAuthState = () => useContext(AuthStateContext);
