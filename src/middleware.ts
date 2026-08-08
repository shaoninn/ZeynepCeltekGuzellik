import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/auth";
import { getJwtSecretBytes } from "@/lib/jwt-secret";

function safeFrom(pathname: string): string {
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/duzenle")) &&
    !pathname.startsWith("//")
  ) {
    return pathname;
  }
  return "/admin";
}

/**
 * Auth only for admin/editor.
 * Host canonicalization stays on Hostinger (hcdn) to avoid double redirects
 * that Lighthouse flags under "Avoid multiple page redirects".
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isEditor = pathname.startsWith("/duzenle");
  const isAdmin =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (!isEditor && !isAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", safeFrom(pathname));
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, getJwtSecretBytes());
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/duzenle", "/duzenle/:path*"],
};
