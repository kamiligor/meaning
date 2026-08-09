import { NextRequest, NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { encrypt } from "@/lib/encryption";
import { getCourse, getDay, type Course } from "@/lib/courses";
import { getCourseState, isDayUnlocked } from "@/lib/course";

interface DayUpdateBody {
  courseSlug?: string;
  day?: number;
  start?: boolean;
  quizAnswers?: number[];
  complete?: boolean;
  checkin?: { day?: number; choice?: string; text?: string };
}

function isValidDay(course: Course, day: unknown): day is number {
  return (
    typeof day === "number" &&
    Number.isInteger(day) &&
    day >= 1 &&
    day <= course.days.length
  );
}

export async function PUT(request: NextRequest) {
  try {
    const { user, supabase } = await requireProgramUser();

    const { allowed, retryAfterMs } = checkRateLimit(`course-day:${user.id}`, {
      maxRequests: 60,
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

    const body: DayUpdateBody = await request.json().catch(() => ({}));

    const course =
      typeof body.courseSlug === "string" ? getCourse(body.courseSlug) : null;
    if (!course) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 });
    }

    if (!isValidDay(course, body.day)) {
      return NextResponse.json({ error: "Invalid day" }, { status: 400 });
    }
    const day = body.day;

    const state = await getCourseState(supabase, user.id, course.slug);
    if (!state.enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    if (
      (body.start || body.complete || body.quizAnswers) &&
      !isDayUnlocked(day, state.days, course.days.length)
    ) {
      return NextResponse.json({ error: "Day is locked" }, { status: 403 });
    }

    // Check-in describes how the previous day's challenge went, so it is
    // stored on that previous day's row.
    if (body.checkin) {
      const checkinDay = body.checkin.day;
      if (!isValidDay(course, checkinDay) || checkinDay !== day - 1) {
        return NextResponse.json({ error: "Invalid check-in day" }, { status: 400 });
      }

      const dayContent = getDay(course, day);
      const validChoices =
        dayContent?.checkinAboutPrevious?.options.map((o) => o.value) ?? [];
      const choice = body.checkin.choice;
      if (typeof choice !== "string" || !validChoices.includes(choice)) {
        return NextResponse.json({ error: "Invalid check-in choice" }, { status: 400 });
      }

      const rawText = typeof body.checkin.text === "string" ? body.checkin.text : "";
      const text = rawText.slice(0, 2000);
      const encrypted = text.trim() ? encrypt(text, user.id) : null;

      const { error } = await supabase.from("course_day_progress").upsert(
        {
          user_id: user.id,
          course_slug: course.slug,
          day: checkinDay,
          checkin_choice: choice,
          checkin_ciphertext: encrypted?.ciphertext ?? null,
          checkin_iv: encrypted?.iv ?? null,
          checkin_salt: encrypted?.salt ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_slug,day" }
      );

      if (error) {
        console.error("[course day] Check-in database error:", error.code);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    if (body.start || body.complete || body.quizAnswers) {
      const existing = state.days[day];

      const update: Record<string, unknown> = {
        user_id: user.id,
        course_slug: course.slug,
        day,
        updated_at: new Date().toISOString(),
      };

      if (Array.isArray(body.quizAnswers)) {
        const answers = body.quizAnswers
          .filter((a) => Number.isInteger(a) && a >= 0 && a < 10)
          .slice(0, 10);
        update.quiz_answers = answers;
      }

      // completed_at is written once; revisiting a finished day never moves it,
      // because the unlock date of the next day hangs off this timestamp.
      if (body.complete && !existing?.completedAt) {
        update.completed_at = new Date().toISOString();
      }

      const { error } = await supabase.from("course_day_progress").upsert(update, {
        onConflict: "user_id,course_slug,day",
      });

      if (error) {
        console.error("[course day] Database error:", error.code);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json({ saved: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[course day] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
