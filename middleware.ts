import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/admin", "/cart"];

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("a_session") !== undefined;
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  console.log("Middleware is running...", isProtected);
  return NextResponse.next();
}
