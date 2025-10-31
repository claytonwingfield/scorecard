import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("strapi_token");
  const { pathname } = request.nextUrl;

  // List of public paths that don't require authentication
  const publicPaths = [
    "/auth/login", // This is now our only sign-in page
    "/auth/callback",
    "/auth/check-email",
  ];

  // Check if the current path is a public one
  const isPublicPath = publicPaths.includes(pathname);

  // If the user is trying to access a protected route without a token
  if (!token && !isPublicPath) {
    // Redirect them to the new sign-in page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // --- This is the new logic for your second request ---
  // If the user IS logged in (has a token) and tries to access
  // the login page, redirect them to the main app.
  if (token && pathname === "/auth/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // Redirect to your main app page
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (/api/...)
     * - Static files (/_next/static/...)
     * - Image optimization files (/_next/image/...)
     * - Favicon (favicon.ico)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
