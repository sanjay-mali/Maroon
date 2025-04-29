"use client";
import { createContext } from "react";

type AuthContextType = {
  authStatus: boolean;
  setAuthStatus: (status: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  authStatus: false,
  setAuthStatus: () => {},
});

export const AuthProvider = AuthContext.Provider;

export default AuthContext;
