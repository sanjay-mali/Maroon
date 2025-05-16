"use client";
import type React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import authService from "@/appwrite/authService";

export default function ProtetedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { authStatus, setAuthStatus } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Directly check auth status from service to ensure it's current
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const isLoggedIn = await authService.isLoggedIn();

        // Update auth status if needed
        if (isLoggedIn !== authStatus) {
          setAuthStatus(isLoggedIn);
        }

        if (!isLoggedIn) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [router, authStatus, setAuthStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen"></div>
    );
  }

  if (!authStatus) {
    return null;
  }

  return <>{children}</>;
}
