import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isProgramAdmin } from "@/lib/admin-email";
import { createClient } from "@supabase/supabase-js";

const bodySchema = z.object({
  method: z.enum(["card", "blik"]),
});

// Development-only endpoint for testing payment flow.
// If user is already logged in, updates has_paid directly in DB.
// Also sets a cookie as fallback for the login → callback flow.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body. Expected: { method: 'card' | 'blik' }" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });

  // If user is already logged in, grant access immediately
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && !isProgramAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (user) {
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
  } else {
    // Fallback: cookie for not-yet-logged-in users (consumed in auth callback)
    response.cookies.set("payment_completed", "true", {
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}
