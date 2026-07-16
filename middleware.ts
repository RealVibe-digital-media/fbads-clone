import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that must stay reachable without a session.
const PUBLIC_PATHS = ["/login", "/api/login"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = req.cookies.get("fb_auth")?.value === "ok";

  if (isPublic(pathname)) {
    // Already logged in? Skip the login screen.
    if (authed && pathname === "/login") {
      return NextResponse.redirect(new URL("/billing/invoices", req.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and static asset files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|ttf|woff|woff2)$).*)",
  ],
};
