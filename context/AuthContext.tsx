"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  Login,
  createAccount,
  Logout,
  account,
  client,
} from "@/lib/appwrite";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: Models.User<{}> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<{}> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Manage session cookie for middleware
  const setSessionCookie = (sessionId: string) => {
    document.cookie = `a_session=${sessionId}; path=/;`;
  };
  const clearSessionCookie = () => {
    document.cookie = `a_session=; path=/; max-age=0;`;
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const session = await Login({ email, password });
      // Persist session ID for middleware
      if (session && session.$id) setSessionCookie(session.$id);
      // Generate and set JWT for authenticated API calls
      const jwtResponse = await account.createJWT();
      client.setJWT(jwtResponse.jwt);
      await fetchUser();
      router.push("/profile");
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const accountData = await createAccount({ email, password, name });

      if (accountData && accountData.$id) setSessionCookie(accountData.$id);
      const jwtResponse = await account.createJWT();
      client.setJWT(jwtResponse.jwt);
      await fetchUser();
      router.push("/profile");
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await Logout();
    // Clear client state, JWT, and middleware cookie
    clearSessionCookie();
    client.setJWT("");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
