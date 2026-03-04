import { NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { decrypt } from "@/lib/encryption";

export async function GET() {
  try {
    const { user, supabase } = await requireProgramUser();

    const [responsesResult, progressResult] = await Promise.all([
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
    ]);

    if (responsesResult.error || progressResult.error) {
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

    const exportData = {
      exportedAt: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      responses: decryptedResponses,
      progress,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="pisz-siebie-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
