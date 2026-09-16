import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { runCourseReminders } from "@/lib/course-reminders";

/**
 * Daily reminder job, meant for a scheduler (Coolify cron):
 *   curl -X POST https://poprostusens.pl/api/course/reminders \
 *     -H "Authorization: Bearer $CRON_SECRET"
 *
 * Idempotent within a calendar day — a rerun sends nothing new. Exempt from
 * the session check in src/proxy.ts because it authenticates with CRON_SECRET.
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
    const stats = await runCourseReminders(admin);
    return NextResponse.json({ ok: true, ...stats });
  } catch (err) {
    console.error("[course reminders] Failed:", err);
    return NextResponse.json({ error: "Reminder run failed" }, { status: 500 });
  }
}
