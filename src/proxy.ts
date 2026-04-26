import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createServerClient } from "@supabase/ssr";
import { isProgramAdmin } from "@/lib/admin-email";

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
  "/program/auth/callback",
];

function isProgramPublicPath(pathname: string): boolean {
  return PUBLIC_PROGRAM_PATHS.includes(pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

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

  // Content-Security-Policy
  // 'unsafe-inline' for scripts: required by Next.js hydration scripts and JSON-LD
  // (no nonce setup here yet — adding nonces requires per-page wiring).
  // 'unsafe-inline' for styles: required by Tailwind/next-font inline styles.
  // connect-src includes Supabase (auth + DB) and same-origin (API routes).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseHost = supabaseUrl
    ? new URL(supabaseUrl).origin
    : "";
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${supabaseHost ? ` ${supabaseHost} wss://${new URL(supabaseUrl).host}` : ""}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);

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
    let user = null;
    try {
      const supabase = createSupabaseMiddlewareClient(request, response);
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Supabase unreachable — treat as not logged in
    }

    // Redirect logged-in users away from auth pages
    if (isAuthRoute && user) {
      const next = request.nextUrl.searchParams.get("next") ?? "/";
      return NextResponse.redirect(new URL(next, request.url));
    }

    // Fetch user_profiles once for all /program logic that needs has_paid
    let hasPaid: boolean | null = null;
    const needsProfileCheck =
      user &&
      pathname.startsWith("/program") &&
      !isProgramPublicPath(pathname);

    if (needsProfileCheck || (pathname === "/program" && user)) {
      try {
        const supabase = createSupabaseMiddlewareClient(request, response);
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("has_paid")
          .eq("user_id", user!.id)
          .single();
        hasPaid = profile?.has_paid ?? false;
      } catch {
        hasPaid = false;
      }
    }

    // Redirect paid users from /program landing to dashboard
    // TEMPORARY: program is admin-only until public launch — see ADMIN_EMAIL env
    if (pathname === "/program" && user && isProgramAdmin(user.email) && hasPaid) {
      return NextResponse.redirect(new URL("/program/dashboard", request.url));
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

      // Program content requires admin email (TEMPORARY: admin-only until public launch)
      if (pathname.startsWith("/program") && !isProgramPublicPath(pathname)) {
        if (!isProgramAdmin(user.email)) {
          return NextResponse.redirect(new URL("/", request.url));
        }
        // After admin gate: also require paid access
        if (!hasPaid) {
          return NextResponse.redirect(new URL("/program", request.url));
        }
      }
    }

    // Protect program API (all methods — GET requests not covered by admin-API mutation block)
    if (pathname.startsWith("/api/program/")) {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // TEMPORARY: program is admin-only until public launch — see ADMIN_EMAIL env
      if (!isProgramAdmin(user.email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    "/favorites",
    "/ulubione",
    "/mission",
    "/misja",
    "/post/:path*",
  ],
};
