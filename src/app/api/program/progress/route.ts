import { NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";

export async function GET() {
  try {
    const { user, supabase } = await requireProgramUser();

    const { data, error } = await supabase
      .from("user_progress")
      .select("exercise_id, status, started_at, completed_at, updated_at")
      .eq("user_id", user.id);

    if (error) {
      console.error("[progress GET] Database error:", error.code);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const progress: Record<
      string,
      { status: string; startedAt: string | null; completedAt: string | null }
    > = {};

    for (const row of data) {
      progress[row.exercise_id] = {
        status: row.status,
        startedAt: row.started_at,
        completedAt: row.completed_at,
      };
    }

    return NextResponse.json({ progress });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[progress GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
