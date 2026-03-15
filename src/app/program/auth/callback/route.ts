import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";
  // Prevent open redirect: only allow relative paths starting with /
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (!code) {
    return NextResponse.redirect(new URL("/program", request.url));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/program?error=auth", request.url));
  }

  // Create default user profile if not exists
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      // For magic link, gender_form may be in user metadata
      const genderForm = user.user_metadata?.gender_form || "neutral";

      await supabase.from("user_profiles").insert({
        user_id: user.id,
        gender_form: genderForm,
        disclaimer_accepted_at: new Date().toISOString(),
      });
    }
  }

  // Payment cookie check — dev flow (simulate-payment endpoint) or future real payment processor.
  // Must run BEFORE redirect so the cookie is consumed in the same request cycle.
  const paymentCookie = cookieStore.get("payment_completed");
  if (paymentCookie?.value === "true" && user) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      await supabaseAdmin
        .from("user_profiles")
        .update({ has_paid: true, paid_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }

    // Remove the cookie regardless of whether the DB update succeeded,
    // to avoid processing it a second time.
    cookieStore.set("payment_completed", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
    });
  }

  return NextResponse.redirect(new URL(next, request.url));
}
