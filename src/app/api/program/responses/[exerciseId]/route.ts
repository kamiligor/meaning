import { NextRequest, NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { encrypt, decrypt } from "@/lib/encryption";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { loadExercise } from "@/lib/exercises";

const EXERCISE_ID_REGEX = /^[a-z_0-9]+$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const { user, supabase } = await requireProgramUser();
    const { exerciseId } = await params;

    if (!EXERCISE_ID_REGEX.test(exerciseId)) {
      return NextResponse.json({ error: "Invalid exercise ID" }, { status: 400 });
    }

    const rateLimitKey = `responses-get:${user.id}`;
    const { allowed, retryAfterMs } = checkRateLimit(rateLimitKey, {
      maxRequests: 120,
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

    const { data, error } = await supabase
      .from("exercise_responses")
      .select("question_index, ciphertext, iv, salt, word_count, time_spent_sec, updated_at")
      .eq("user_id", user.id)
      .eq("exercise_id", exerciseId)
      .order("question_index");

    if (error) {
      console.error("[responses GET] Database error:", error.code);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const responses = data.map((row) => ({
      questionIndex: row.question_index,
      content: decrypt(row.ciphertext, row.iv, row.salt, user.id),
      wordCount: row.word_count,
      timeSpentSec: row.time_spent_sec,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ responses });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[responses GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const { user, supabase } = await requireProgramUser();
    const { exerciseId } = await params;

    if (!EXERCISE_ID_REGEX.test(exerciseId)) {
      return NextResponse.json({ error: "Invalid exercise ID" }, { status: 400 });
    }

    const rateLimitKey = `responses:${user.id}`;
    const { allowed, retryAfterMs } = checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.responses
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    const body = await request.json();
    const {
      questionIndex = 0,
      content,
      wordCount = 0,
      timeSpentSec = 0,
    } = body;

    if (typeof content !== "string") {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const { ciphertext, iv, salt } = encrypt(content, user.id);

    const { error } = await supabase.from("exercise_responses").upsert(
      {
        user_id: user.id,
        exercise_id: exerciseId,
        question_index: questionIndex,
        ciphertext,
        iv,
        salt,
        word_count: wordCount,
        time_spent_sec: timeSpentSec,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,exercise_id,question_index" }
    );

    if (error) {
      console.error("[responses PUT] Database error:", error.code);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // If exercise is completed but content no longer meets min_chars, revert to in_progress
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("status")
      .eq("user_id", user.id)
      .eq("exercise_id", exerciseId)
      .single();

    if (progressData?.status === "completed") {
      const exercise = loadExercise(exerciseId);
      if (exercise) {
        // Fetch all responses for this exercise
        const { data: allResponses } = await supabase
          .from("exercise_responses")
          .select("question_index, ciphertext, iv, salt")
          .eq("user_id", user.id)
          .eq("exercise_id", exerciseId);

        const belowMinimum = exercise.promptQuestions.some((q, idx) => {
          if (q.minChars === 0) return false;
          const resp = allResponses?.find((r) => r.question_index === idx);
          if (!resp) return true;
          const plaintext = decrypt(resp.ciphertext, resp.iv, resp.salt, user.id);
          const charCount = plaintext.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length;
          return charCount < q.minChars;
        });

        if (belowMinimum) {
          await supabase.from("user_progress").update({
            status: "in_progress",
            completed_at: null,
            updated_at: new Date().toISOString(),
          }).eq("user_id", user.id).eq("exercise_id", exerciseId);
        }
      }
    }

    return NextResponse.json({ saved: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[responses PUT] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
