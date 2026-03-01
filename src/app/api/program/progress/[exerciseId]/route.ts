import { NextRequest, NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";

const VALID_STATUSES = ["not_started", "in_progress", "completed", "skipped"];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const { user, supabase } = await requireProgramUser();
    const { exerciseId } = await params;
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updated: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
