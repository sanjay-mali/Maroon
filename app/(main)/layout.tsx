"use client";

import authService from "@/appwrite/authService";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [authStatus, setAuthStatus] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = await authService.isLoggedIn();
        setAuthStatus(status);
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthStatus(false);
      }
    };
    checkAuth();
  }, [pathname]); // Re-run when route changes

  return (
    <AuthProvider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthProvider>
  );
}
