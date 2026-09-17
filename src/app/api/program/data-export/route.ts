import { NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { decrypt } from "@/lib/encryption";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    // Access to one's own data is a right of every account holder, not a
    // program feature, so this sits outside the pre-launch admin gate.
    const { user, supabase } = await requireProgramUser();

    const { allowed, retryAfterMs } = checkRateLimit(
      `data-export:${user.id}`,
      RATE_LIMITS.dataExport
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

    // Tags, login/read events and likes are behind RLS with no policy for
    // the account holder (analytics_events and user_tags are service-role
    // only by design; likes go through the admin client here too, for one
    // consistent code path), so they are read with the admin client instead
    // of the session-scoped one used for everything else in this export.
    const admin = getSupabaseAdmin();

    const [
      responsesResult,
      progressResult,
      profileResult,
      commentsResult,
      courseEnrollmentsResult,
      courseDaysResult,
      courseFeedbackResult,
      tagsResult,
      loginEventsResult,
      postActivityResult,
      likesResult,
      courseArchiveResult,
    ] = await Promise.all([
      supabase
        .from("exercise_responses")
        .select("*")
        .eq("user_id", user.id)
        .order("exercise_id")
        .order("question_index"),
      supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id),
      supabase
        .from("user_profiles")
        .select("gender_form, created_at, has_paid, display_name")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("post_comments")
        .select("post_slug, locale, body, status, created_at, edited_at")
        .eq("user_id", user.id)
        .order("created_at"),
      supabase
        .from("course_enrollments")
        .select("*")
        .eq("user_id", user.id),
      supabase
        .from("course_day_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("course_slug")
        .order("day"),
      supabase
        .from("course_feedback")
        .select("course_slug, rating, hardest, suggestion, created_at")
        .eq("user_id", user.id),
      admin
        .from("user_tags")
        .select("tag, source, created_at")
        .eq("user_id", user.id)
        .order("created_at"),
      admin
        .from("analytics_events")
        .select("occurred_at")
        .eq("user_id", user.id)
        .eq("event_type", "login")
        .order("occurred_at"),
      admin
        .from("analytics_events")
        .select("occurred_at, event_type, target_id")
        .eq("user_id", user.id)
        .in("event_type", ["post_view", "post_read"])
        .order("occurred_at"),
      admin
        .from("user_interactions")
        .select("target_type, target_id, created_at")
        .eq("user_id", user.id)
        .eq("interaction_type", "like")
        .order("created_at"),
      supabase
        .from("course_day_progress_archive")
        .select("*")
        .eq("user_id", user.id)
        .order("course_slug")
        .order("run")
        .order("day"),
    ]);

    if (responsesResult.error || progressResult.error) {
      console.error(
        "[data-export] Database error:",
        responsesResult.error?.code ?? progressResult.error?.code
      );
      return NextResponse.json(
        { error: "Failed to export data" },
        { status: 500 }
      );
    }

    const decryptedResponses = responsesResult.data.map((row) => ({
      exerciseId: row.exercise_id,
      questionIndex: row.question_index,
      content: decrypt(row.ciphertext, row.iv, row.salt, user.id),
      wordCount: row.word_count,
      timeSpentSec: row.time_spent_sec,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    const progress = progressResult.data.map((row) => ({
      exerciseId: row.exercise_id,
      status: row.status,
      startedAt: row.started_at,
      completedAt: row.completed_at,
    }));

    const profile = profileResult.data
      ? {
          genderForm: profileResult.data.gender_form,
          displayName: profileResult.data.display_name,
          createdAt: profileResult.data.created_at,
          hasPaid: profileResult.data.has_paid,
        }
      : null;

    const comments = (commentsResult.data ?? []).map((row) => ({
      postSlug: row.post_slug,
      locale: row.locale,
      body: row.body,
      status: row.status,
      createdAt: row.created_at,
      editedAt: row.edited_at,
    }));

    const courseEnrollments = (courseEnrollmentsResult.data ?? []).map((row) => ({
      courseSlug: row.course_slug,
      enrolledAt: row.enrolled_at,
      completedAt: row.completed_at,
      baselineScreenTimeMin: row.baseline_screen_time_min,
      baselinePickups: row.baseline_pickups,
      remindersEnabled: row.reminders_enabled,
    }));

    const courseDays = (courseDaysResult.data ?? []).map((row) => ({
      courseSlug: row.course_slug,
      day: row.day,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      checkinChoice: row.checkin_choice,
      checkinNote: row.checkin_ciphertext
        ? decrypt(row.checkin_ciphertext, row.checkin_iv, row.checkin_salt, user.id)
        : null,
      quizAnswers: row.quiz_answers,
    }));

    // Earlier runs of a restarted course, same shape plus the run number.
    const courseDaysArchive = (courseArchiveResult.data ?? []).map((row) => ({
      courseSlug: row.course_slug,
      run: row.run,
      day: row.day,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      checkinChoice: row.checkin_choice,
      checkinNote: row.checkin_ciphertext
        ? decrypt(row.checkin_ciphertext, row.checkin_iv, row.checkin_salt, user.id)
        : null,
      quizAnswers: row.quiz_answers,
      archivedAt: row.archived_at,
    }));

    const courseFeedback = (courseFeedbackResult.data ?? []).map((row) => ({
      courseSlug: row.course_slug,
      rating: row.rating,
      hardest: row.hardest,
      suggestion: row.suggestion,
      createdAt: row.created_at,
    }));

    // Tags, login dates and read activity — never the anonymous
    // visitor_hash, which is a technical de-duplication key, not content
    // for the person to review.
    const tags = (tagsResult.data ?? []).map((row) => ({
      tag: row.tag,
      source: row.source,
      createdAt: row.created_at,
    }));

    const loginEvents = (loginEventsResult.data ?? []).map(
      (row) => row.occurred_at
    );

    const postActivity = (postActivityResult.data ?? []).map((row) => ({
      occurredAt: row.occurred_at,
      eventType: row.event_type,
      targetId: row.target_id,
    }));

    const likes = (likesResult.data ?? []).map((row) => ({
      targetType: row.target_type,
      targetId: row.target_id,
      createdAt: row.created_at,
    }));

    const exportData = {
      exportedAt: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      profile,
      responses: decryptedResponses,
      progress,
      comments,
      courseEnrollments,
      courseDays,
      courseDaysArchive,
      courseFeedback,
      tags,
      loginEvents,
      postActivity,
      likes,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="justmeaning-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[data-export] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
