import { NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { createClient } from "@supabase/supabase-js";

export async function DELETE() {
  try {
    const { user } = await requireProgramUser();

    const { allowed, retryAfterMs } = checkRateLimit(
      `account-deletion:${user.id}`,
      RATE_LIMITS.accountDeletion
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    // Use service role key to delete user (CASCADE deletes their data)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
