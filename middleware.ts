import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const token = req.cookies.get("token")?.value;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isProtected =
    pathname === "/clients" ||
    pathname.startsWith("/clients/") ||
    pathname === "/freelancers" ||
    pathname.startsWith("/freelancers/") ||
    pathname.startsWith("/admin/");

  if (!isProtected) {
    return;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return;
}

export const config = {
  matcher: [
    "/clients/:path*",
    "/freelancers/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
