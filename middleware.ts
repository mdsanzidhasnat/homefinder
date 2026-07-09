import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["bn", "en"],
  defaultLocale: "bn",
  localePrefix: "always",
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authPaths = ["/auth/login", "/auth/register", "/auth/forgot-password"];
  const dashboardPaths = ["/dashboard"];
  const isAuthPage = authPaths.some((p) => pathname.includes(p));
  const isDashboardPage = dashboardPaths.some((p) => pathname.includes(p));

  const response = intlMiddleware(request);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
