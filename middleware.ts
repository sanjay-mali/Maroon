import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/appwrite";

export async function middleware(request: NextRequest) {
  const session = await getCurrentUser();

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Optionally, specify which paths to run middleware on
export const config = {
  matcher: [
    /*
      Match all routes except for:
      - /login
      - /register
      - /api/*
      - /_next/*
      - /favicon.ico
      - /public/*
    */
    "/((?!login|register|api|_next|favicon.ico|public).*)",
  ],
};
