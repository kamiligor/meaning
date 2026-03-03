import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/program/dashboard";

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

  return NextResponse.redirect(new URL(next, request.url));
}
