import { NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { isProgramAdmin } from "@/lib/admin-email";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Take the person's comments down before the account goes.
 *
 * A comment with replies underneath keeps its row so those replies survive,
 * but the text is wiped — an empty anchor is not personal data, so no consent
 * is needed for it. Comments with nothing hanging off them go entirely.
 *
 * Called only when the person did NOT agree to leave their comments up; in
 * that case the rows stay untouched and the deletion cascade simply sets
 * user_id to NULL, signing them "deleted user".
 */
async function wipeComments(
  admin: ReturnType<typeof getSupabaseAdmin>,
  userId: string
): Promise<void> {
  const { data: own } = await admin
    .from("post_comments")
    .select("id")
    .eq("user_id", userId);

  const ids = (own ?? []).map((c) => c.id);
  if (ids.length === 0) return;

  const { data: replies } = await admin
    .from("post_comments")
    .select("parent_id")
    .in("parent_id", ids);

  const withReplies = new Set((replies ?? []).map((r) => r.parent_id));
  const toAnchor = ids.filter((id) => withReplies.has(id));
  const toRemove = ids.filter((id) => !withReplies.has(id));

  if (toAnchor.length > 0) {
    await admin
      .from("post_comments")
      .update({ body: "", deleted_at: new Date().toISOString() })
      .in("id", toAnchor);
  }

  if (toRemove.length > 0) {
    await admin.from("post_comments").delete().in("id", toRemove);
  }
}

export async function DELETE(request: Request) {
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

    // Opt-in only: without an explicit yes, the comments come down with the
    // account. Consent has to be a real choice, so the default is removal.
    const payload = await request.json().catch(() => null);
    const keepComments = payload?.keepComments === true;

    if (!keepComments) {
      await wipeComments(supabaseAdmin, user.id);
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
