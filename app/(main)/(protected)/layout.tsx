"use client";
import type React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function ProtetedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { authStatus } = useAuth();

  useEffect(() => {
    if (!authStatus) {
      router.replace("/login");
    }
  }, [authStatus, router]);

  if (!authStatus) {
    return null;
  }

  return <>{children}</>;
}
