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

function isWordPressProbe(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return (
    p.startsWith("/wp-admin") ||
    p.startsWith("/wp-content") ||
    p.startsWith("/wp-includes") ||
    p.startsWith("/wordpress") ||
    p === "/wp-login.php" ||
    p === "/xmlrpc.php" ||
    p.endsWith(".php")
  );
}

/**
 * Auth for admin/editor + cheap 404 for WP probe bots (saves Node processes).
 * Host canonicalization stays on Hostinger (hcdn) to avoid double redirects
 * that Lighthouse flags under "Avoid multiple page redirects".
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isWordPressProbe(pathname)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

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
  matcher: [
    "/admin/:path*",
    "/duzenle",
    "/duzenle/:path*",
    "/wp-admin",
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wordpress",
    "/wordpress/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
    "/index.php",
    "/:path*.php",
  ],
};
