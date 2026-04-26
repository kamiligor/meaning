import { NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { isProgramAdmin } from "@/lib/admin-email";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE() {
  try {
    const { user } = await requireProgramUser();

    if (!isProgramAdmin(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
    let supabaseAdmin;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[account DELETE] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
