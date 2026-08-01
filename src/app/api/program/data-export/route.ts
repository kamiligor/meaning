import { NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { isProgramAdmin } from "@/lib/admin-email";
import { decrypt } from "@/lib/encryption";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET() {
  try {
    const { user, supabase } = await requireProgramUser();

    if (!isProgramAdmin(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

    const [responsesResult, progressResult, profileResult, commentsResult] =
      await Promise.all([
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

    const exportData = {
      exportedAt: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      profile,
      responses: decryptedResponses,
      progress,
      comments,
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
