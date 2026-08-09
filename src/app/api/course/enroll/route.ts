import { NextRequest, NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCourse } from "@/lib/courses";

function parseBaseline(value: unknown, max: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < 0 || rounded > max) return null;
  return rounded;
}

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireProgramUser();

    const { allowed, retryAfterMs } = checkRateLimit(`course-enroll:${user.id}`, {
      maxRequests: 10,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    const body = await request.json().catch(() => ({}));

    const course = typeof body.courseSlug === "string" ? getCourse(body.courseSlug) : null;
    if (!course) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 });
    }

    const { error } = await supabase.from("course_enrollments").insert({
      user_id: user.id,
      course_slug: course.slug,
      // 24h of screen time and 1000 pickups a day are generous sanity caps.
      baseline_screen_time_min: course.askBaseline
        ? parseBaseline(body.baselineScreenTimeMin, 1440)
        : null,
      baseline_pickups: course.askBaseline
        ? parseBaseline(body.baselinePickups, 1000)
        : null,
      reminders_enabled: body.remindersEnabled !== false,
    });

    // 23505 = already enrolled; keep the original enrollment untouched.
    if (error && error.code !== "23505") {
      console.error("[course enroll] Database error:", error.code);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ enrolled: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[course enroll] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
