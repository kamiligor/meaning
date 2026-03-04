import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createServerClient } from "@supabase/ssr";

const COOKIE_NAME = "jh-admin-token";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

async function isAdminAuthenticated(
  request: NextRequest
): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

// Program pages that DON'T require auth (exact match)
const PUBLIC_PROGRAM_PATHS = [
  "/program",
  "/program/onboarding",
  "/program/zasoby",
  "/program/auth/callback",
];

function isProgramPublicPath(pathname: string): boolean {
  return PUBLIC_PROGRAM_PATHS.includes(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  // --- Locale: forward cookie as header for server components ---
  const locale = request.cookies.get("jh-locale")?.value ?? "en";
  response.headers.set("x-locale", locale);

  // --- Security headers ---
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // --- Admin auth (JWT) ---
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!(await isAdminAuthenticated(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // --- Admin API mutations (JWT) ---
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/") &&
    !pathname.startsWith("/api/slides/") &&
    !pathname.startsWith("/api/newsletter/") &&
    !pathname.startsWith("/api/program/") &&
    !pathname.match(/^\/api\/posts\/[^/]+\/like$/) &&
    request.method !== "GET"
  ) {
    if (!(await isAdminAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // --- Auth routes: redirect logged-in users away ---
  const AUTH_ROUTES = ["/login", "/register", "/lost-password"];
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // --- Supabase session refresh ---
  if (
    pathname.startsWith("/program") ||
    pathname.startsWith("/api/program") ||
    pathname.startsWith("/api/posts/") ||
    pathname.startsWith("/post/") ||
    pathname === "/profil" ||
    pathname === "/ulubione" ||
    isAuthRoute
  ) {
    const supabase = createSupabaseMiddlewareClient(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect logged-in users away from auth pages
    if (isAuthRoute && user) {
      const next = request.nextUrl.searchParams.get("next") ?? "/program/dashboard";
      return NextResponse.redirect(new URL(next, request.url));
    }

    // Protect program pages (except public ones) and /profil
    if (
      (pathname.startsWith("/program") && !isProgramPublicPath(pathname)) ||
      pathname === "/profil" ||
      pathname === "/ulubione"
    ) {
      if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Protect program API mutations
    if (
      pathname.startsWith("/api/program/") &&
      request.method !== "GET"
    ) {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/api/:path*",
    "/program/:path*",
    "/login",
    "/register",
    "/lost-password",
    "/profil",
    "/ulubione",
    "/mission",
    "/misja",
    "/post/:path*",
  ],
};
