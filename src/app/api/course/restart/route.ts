import { NextRequest, NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCourse, isCourseVisible } from "@/lib/courses";

/**
 * Start a finished course again from day 1. The previous run is archived by
 * the `restart_course` database function (see the 20260917 migration), so
 * the notes and answers are kept for the data export, and the day clock
 * starts fresh. Only allowed once the course is completed.
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireProgramUser();

    const { allowed } = checkRateLimit(`course-restart:${user.id}`, {
      maxRequests: 3,
      windowMs: 3_600_000,
    });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = (await request.json().catch(() => ({}))) as { courseSlug?: unknown };
    const course =
      typeof body.courseSlug === "string" ? getCourse(body.courseSlug) : null;
    if (!course || !isCourseVisible(course, user.email)) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin.rpc("restart_course", {
      p_user_id: user.id,
      p_course_slug: course.slug,
    });

    if (error) {
      if (error.message.includes("course not completed")) {
        return NextResponse.json(
          { error: "Course not completed yet" },
          { status: 409 }
        );
      }
      console.error("[course restart] Database error:", error.code ?? error.message);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, run: data });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[course restart] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
