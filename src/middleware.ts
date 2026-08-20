import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Protect /admin routes (Only SUPER_ADMIN and ADMIN allowed)
    if (path.startsWith("/admin")) {
      if (token?.role !== "SUPER_ADMIN" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
