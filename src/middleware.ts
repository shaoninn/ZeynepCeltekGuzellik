import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/auth";
import { getJwtSecretBytes } from "@/lib/jwt-secret";

/** Scanners that ignore robots.txt and hold Node workers on Hostinger. */
const BLOCKED_UA =
  /CMS-Checker|ClaudeBot|GPTBot|CCBot|Bytespider|Amazonbot|meta-externalagent|Applebot-Extended|Google-Extended|anthropic-ai/i;

function safeFrom(pathname: string): string {
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/duzenle")) &&
    !pathname.startsWith("//")
  ) {
    return pathname;
  }
  return "/admin";
}

/** Cheap 404 — never hit Next render / MySQL (Hostinger entry process saver). */
function isProbePath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  if (
    p.startsWith("/wp-admin") ||
    p.startsWith("/wp-content") ||
    p.startsWith("/wp-includes") ||
    p.startsWith("/wordpress") ||
    p === "/wp-login.php" ||
    p === "/xmlrpc.php" ||
    p.endsWith(".php")
  ) {
    return true;
  }
  if (
    p.startsWith("/.env") ||
    p.startsWith("/.git") ||
    p.startsWith("/.aws") ||
    p.startsWith("/phpmyadmin") ||
    p.startsWith("/pma") ||
    p.startsWith("/cgi-bin") ||
    p.startsWith("/vendor/") ||
    p.startsWith("/actuator") ||
    p.includes("wlwmanifest") ||
    p.includes("wp-config")
  ) {
    return true;
  }
  return false;
}

function cheapNotFound(): NextResponse {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

/**
 * 1) Drop known abusive crawlers early (cheap 403 — no page/DB work).
 * 2) Early 404 for scanner probes (saves Node entry processes).
 * 3) Auth for admin/editor.
 * Host canonicalization stays on Hostinger (hcdn).
 */
export async function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (BLOCKED_UA.test(ua)) {
    return new NextResponse(null, {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const { pathname } = request.nextUrl;

  if (isProbePath(pathname)) {
    return cheapNotFound();
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
    "/((?!_next/static|_next/image|images/|favicon\\.ico|icon\\.png|apple-icon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|css|js|map)$).*)",
  ],
};
