import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { runDailyAggregate } from "@/lib/analytics-aggregate";

/**
 * Nightly analytics aggregate, meant for a scheduler (Coolify cron), run
 * after midnight in Europe/Warsaw so "yesterday" is a closed day:
 *   curl -X POST https://poprostusens.pl/api/analytics/aggregate \
 *     -H "Authorization: Bearer $CRON_SECRET"
 *
 * Optional `?day=YYYY-MM-DD` backfills a specific day instead of yesterday,
 * e.g. after downtime:
 *   curl -X POST "https://poprostusens.pl/api/analytics/aggregate?day=2026-09-10" \
 *     -H "Authorization: Bearer $CRON_SECRET"
 *
 * Idempotent for a given day — a rerun upserts the same numbers, see
 * runDailyAggregate. Needs its own exemption in src/proxy.ts (next to
 * /api/course/) so the admin-JWT gate does not shadow the CRON_SECRET check
 * below, the same pattern as /api/course/reminders.
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

  const day = request.nextUrl.searchParams.get("day") ?? undefined;

  try {
    const stats = await runDailyAggregate(admin, day);
    return NextResponse.json({ ok: true, ...stats });
  } catch (err) {
    console.error("[analytics aggregate] Failed:", err);
    return NextResponse.json({ error: "Aggregate run failed" }, { status: 500 });
  }
}
