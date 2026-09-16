import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { syncTagsToMailerLite } from "@/lib/tags";

/**
 * Nightly, incremental push to MailerLite, meant for a scheduler (Coolify
 * cron), same pattern as `/api/course/reminders`:
 *   curl -X POST https://poprostusens.pl/api/tags/sync \
 *     -H "Authorization: Bearer $CRON_SECRET"
 *
 * Only pushes tags never synced before (`synced_at IS NULL`); never removes
 * anything from MailerLite groups. Full reconciliation lives behind the
 * admin panel button at POST /api/admin/tags/sync. Needs the same
 * CRON_SECRET exemption in src/proxy.ts as /api/course/reminders — that file
 * is out of scope here.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const result = await syncTagsToMailerLite(admin, { full: false });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[tags sync] Failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Sync run failed" }, { status: 500 });
  }
}
