"use client";

import authService from "@/appwrite/authService";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    authService
      .isLoggedIn()
      .then(setAuthStatus)
      .catch(() => setAuthStatus(false));
  }, []);

  return (
    <AuthProvider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthProvider>
  );
}
