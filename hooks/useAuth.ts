import authService from "@/appwrite/authService";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");

  const getCurrentUser = async () => {
    return await authService.getCurrentUser();
  };

  const isLoggedIn = async () => {
    return await authService.isLoggedIn();
  };

  return {
    ...context,
    getCurrentUser,
    isLoggedIn, // only expose the async function, not a boolean state
  };
};
