import { NextRequest, NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCourse } from "@/lib/courses";
import { getCourseState } from "@/lib/course";

const RATINGS = ["worth_it", "mixed", "not_for_me"] as const;

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireProgramUser();

    const { allowed, retryAfterMs } = checkRateLimit(`course-feedback:${user.id}`, {
      maxRequests: 5,
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

    const course =
      typeof body.courseSlug === "string" ? getCourse(body.courseSlug) : null;
    if (!course) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 });
    }

    if (!RATINGS.includes(body.rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const state = await getCourseState(supabase, user.id, course.slug);
    if (!state.enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }
    if (!state.days[course.days.length]?.completedAt) {
      return NextResponse.json(
        { error: "Course not finished yet" },
        { status: 403 }
      );
    }

    const toText = (value: unknown): string | null => {
      if (typeof value !== "string") return null;
      const trimmed = value.trim().slice(0, 2000);
      return trimmed || null;
    };

    const { error } = await supabase.from("course_feedback").upsert(
      {
        user_id: user.id,
        course_slug: course.slug,
        rating: body.rating,
        hardest: toText(body.hardest),
        suggestion: toText(body.suggestion),
      },
      { onConflict: "user_id,course_slug" }
    );

    if (error) {
      console.error("[course feedback] Database error:", error.code);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Feedback closes the course: the enrollment gets its completion date.
    if (!state.enrollment.completedAt) {
      await supabase
        .from("course_enrollments")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", state.enrollment.id);
    }

    return NextResponse.json({ saved: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[course feedback] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
