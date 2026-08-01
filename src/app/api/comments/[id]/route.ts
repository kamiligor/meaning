import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Remove one's own comment. The row survives as a thread anchor when replies
 * hang off it, but the text goes; a comment with no replies is removed outright.
 */
export async function DELETE(
  _request: NextRequest,
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

    // RLS already restricts this to the author; the filter keeps the intent
    // visible at the call site.
    const { data: comment } = await supabase
      .from("post_comments")
      .select("id, parent_id")
      .eq("id", commentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!comment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let hasReplies = false;
    if (comment.parent_id === null) {
      const { count } = await supabase
        .from("post_comments")
        .select("id", { count: "exact", head: true })
        .eq("parent_id", commentId);
      hasReplies = (count ?? 0) > 0;
    }

    if (hasReplies) {
      // Clients hold no UPDATE grant on this table, so the blanking runs with
      // the service role. Ownership was verified above.
      const { error } = await getSupabaseAdmin()
        .from("post_comments")
        .update({ body: "", deleted_at: new Date().toISOString() })
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) {
        console.error("[comment DELETE] Update error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      return NextResponse.json({ deleted: true, anchored: true });
    }

    const { error } = await supabase
      .from("post_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("[comment DELETE] Delete error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ deleted: true, anchored: false });
  } catch (err) {
    console.error("[comment DELETE] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
