import { NextRequest, NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { isProgramAdmin } from "@/lib/admin-email";

const VALID_STATUSES = ["not_started", "in_progress", "completed", "skipped"];
const EXERCISE_ID_REGEX = /^[a-z_0-9]+$/;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const { user, supabase } = await requireProgramUser();

    if (!isProgramAdmin(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { exerciseId } = await params;

    if (!EXERCISE_ID_REGEX.test(exerciseId)) {
      return NextResponse.json({ error: "Invalid exercise ID" }, { status: 400 });
    }

    const { status } = await request.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const upsertData: Record<string, unknown> = {
      user_id: user.id,
      exercise_id: exerciseId,
      status,
      updated_at: now,
    };

    if (status === "in_progress") {
      upsertData.started_at = now;
    }
    if (status === "completed") {
      upsertData.completed_at = now;
    }

    const { error } = await supabase
      .from("user_progress")
      .upsert(upsertData, { onConflict: "user_id,exercise_id" });

    if (error) {
      console.error("[progress PUT] Database error:", error.code);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ updated: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[progress PUT] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
