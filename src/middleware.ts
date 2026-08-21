import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";
    const isLeader = role === "LEADER" || isAdmin;
    const isAmbassador = role === "AMBASSADOR" || isAdmin;

    // 1. Protect /admin routes (Only SUPER_ADMIN and ADMIN allowed)
    if (path.startsWith("/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/classroom?error=unauthorized_admin", req.url));
      }
    }

    // 2. Protect /staff routes (Only Leaders and Admins allowed)
    if (path.startsWith("/staff") || path.startsWith("/portal/department")) {
      if (!isLeader) {
        return NextResponse.redirect(new URL("/classroom?error=unauthorized_staff", req.url));
      }
    }

    // 3. Protect /office routes (Only Ambassadors and Admins allowed)
    if (path.startsWith("/office") || path.startsWith("/portal/ambassador")) {
      if (!isAmbassador) {
        return NextResponse.redirect(new URL("/classroom?error=unauthorized_office", req.url));
      }
    }

    // 4. /classroom and /portal/member are accessible to all authenticated accounts (Member, Leader, Ambassador, Admin)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    }
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/office/:path*",
    "/classroom/:path*",
    "/portal/:path*",
    "/dashboard/:path*"
  ],
};
