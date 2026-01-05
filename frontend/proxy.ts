import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { is } from "zod/locales";
import { STRAPI_BASE_URL } from "./lib/strapi";

const protectedRoutes = ["/dashboard", "/profile", "/settings"];

export function checkIsProtectedRoute(pathname: string): boolean {
  return protectedRoutes.includes(pathname);
}

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  const isProtectedRoute = checkIsProtectedRoute(currentPath);

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  try {
    // const jwt = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("jwt="))?.split("=")[1];
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;
    // const jwt = await cookes();

    if (!jwt) {
      return NextResponse.redirect(new URL("/signin", request.url));
      // return new Response("Unauthorized", { status: 401 });
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      }
    });
    const userResponse = await response.json();
    if (!userResponse || userResponse.error) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Error in proxy:", error);
    // return new Response("Error in proxy", { status: 500 });

    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/dashboard", "/dashboard/:path*", "/profile/:path*", "/settings/:path*"],  // Apply the proxy to protected routes
}