import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("admin_auth");
  
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    
    if (isAuthenticated && (pathname === "/admin" || isLoginPage)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    
    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/admin"],
};
