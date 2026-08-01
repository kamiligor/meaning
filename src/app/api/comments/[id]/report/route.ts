import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { isReportReason } from "@/lib/comments";

/**
 * Flag a comment for the admin to look at. One report per person per comment,
 * enforced by a unique constraint; a repeat is treated as already filed rather
 * than an error, so the reader never sees a failure for pressing twice.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = Number(id);
    if (!Number.isInteger(commentId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed } = checkRateLimit(`comment-report:${user.id}`, {
      maxRequests: 10,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json({ error: "Too many reports" }, { status: 429 });
    }

    const payload = await request.json().catch(() => null);
    const reason = payload?.reason;
    const note =
      typeof payload?.note === "string" && payload.note.trim().length > 0
        ? payload.note.trim().slice(0, 500)
        : null;

    if (!isReportReason(reason)) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
    }

    const { error } = await supabase.from("comment_reports").insert({
      comment_id: commentId,
      reporter_id: user.id,
      reason,
      note,
    });

    // 23505 is the unique violation: this person already reported this comment.
    if (error && error.code !== "23505") {
      console.error("[comment report] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ reported: true }, { status: 201 });
  } catch (err) {
    console.error("[comment report] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
