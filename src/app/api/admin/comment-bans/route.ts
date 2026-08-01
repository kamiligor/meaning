import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Bar a user from commenting, or lift the bar. Existing comments are left
 * alone: hiding or deleting them is a separate decision from stopping new ones.
 *
 * The proxy gates both verbs behind the admin token.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => null);
    const userId = typeof payload?.userId === "string" ? payload.userId : null;
    const reason =
      typeof payload?.reason === "string" ? payload.reason.slice(0, 500) : null;

    if (!userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("comment_bans")
      .upsert({ user_id: userId, reason }, { onConflict: "user_id" });

    if (error) {
      console.error("[comment-bans POST] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ banned: true });
  } catch (err) {
    console.error("[comment-bans POST] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("comment_bans")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("[comment-bans DELETE] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ banned: false });
  } catch (err) {
    console.error("[comment-bans DELETE] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
