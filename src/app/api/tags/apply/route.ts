import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { applyAutoTags } from "@/lib/tags";

/**
 * Daily rule run, meant for a scheduler (Coolify cron), same pattern as
 * `/api/course/reminders`:
 *   curl -X POST https://poprostusens.pl/api/tags/apply \
 *     -H "Authorization: Bearer $CRON_SECRET"
 *
 * Recomputes every automatic tag and reconciles `user_tags`; safe to rerun
 * (it is a diff against current state, not an append). Needs the same
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
    const result = await applyAutoTags(admin);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[tags apply] Failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Tag run failed" }, { status: 500 });
  }
}
