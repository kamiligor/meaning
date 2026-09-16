import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSession } from "@/lib/auth";
import { syncTagsToMailerLite } from "@/lib/tags";

/**
 * On-demand full reconciliation with MailerLite, triggered by the
 * "Synchronizuj" button in /admin/tagi before a campaign goes out. Unlike
 * the nightly /api/tags/sync (incremental, additive-only), this adds AND
 * removes group members to match `user_tags` exactly.
 */
export async function POST() {
  try {
    if (!(await getSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    const result = await syncTagsToMailerLite(admin, { full: true });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error(
      "[admin tags sync POST] Unexpected error:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
