import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSession } from "@/lib/auth";

type Filter = "reported" | "hidden" | "all";

interface ReportSummary {
  reason: string;
  note: string | null;
  createdAt: string;
}

/**
 * Moderation view.
 *
 * The proxy only gates non-GET requests, so reading this has to check the admin
 * session itself — otherwise hidden comments and reports would be readable by
 * anyone who guessed the URL.
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await getSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filter = (request.nextUrl.searchParams.get("filter") ??
      "reported") as Filter;
    const admin = getSupabaseAdmin();

    // Reported comments are found through the reports, everything else
    // straight from the comments table.
    let commentIds: number[] | null = null;
    const reportsByComment = new Map<number, ReportSummary[]>();

    if (filter === "reported") {
      const { data: reports, error } = await admin
        .from("comment_reports")
        .select("comment_id, reason, note, created_at")
        .is("resolved_at", null)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) {
        console.error("[admin comments GET] Reports error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      for (const r of reports ?? []) {
        const list = reportsByComment.get(r.comment_id) ?? [];
        list.push({ reason: r.reason, note: r.note, createdAt: r.created_at });
        reportsByComment.set(r.comment_id, list);
      }

      commentIds = [...reportsByComment.keys()];
      if (commentIds.length === 0) {
        return NextResponse.json({ comments: [] });
      }
    }

    let query = admin
      .from("post_comments")
      .select("id, post_slug, locale, body, status, created_at, deleted_at, user_id")
      .order("created_at", { ascending: false })
      .limit(200);

    if (commentIds) query = query.in("id", commentIds);
    if (filter === "hidden") query = query.eq("status", "hidden");

    const { data, error } = await query;

    if (error) {
      console.error("[admin comments GET] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    const names = new Map<string, string>();
    const banned = new Set<string>();

    if (userIds.length > 0) {
      const [profiles, bans] = await Promise.all([
        admin
          .from("user_profiles")
          .select("user_id, display_name")
          .in("user_id", userIds),
        admin.from("comment_bans").select("user_id").in("user_id", userIds),
      ]);

      for (const p of profiles.data ?? []) {
        if (p.display_name) names.set(p.user_id, p.display_name);
      }
      for (const b of bans.data ?? []) banned.add(b.user_id);
    }

    return NextResponse.json({
      comments: rows.map((r) => ({
        id: r.id,
        postSlug: r.post_slug,
        locale: r.locale,
        body: r.body,
        status: r.status,
        deleted: r.deleted_at !== null,
        createdAt: r.created_at,
        authorId: r.user_id,
        authorName: names.get(r.user_id) ?? "—",
        authorBanned: banned.has(r.user_id),
        reports: reportsByComment.get(r.id) ?? [],
      })),
    });
  } catch (err) {
    console.error("[admin comments GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** Hide or restore a comment, and mark its reports handled. */
export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => null);
    const id = typeof payload?.id === "number" ? payload.id : null;
    const status = payload?.status;

    if (id === null || (status !== "visible" && status !== "hidden")) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    const { error } = await admin
      .from("post_comments")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("[admin comments PATCH] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    await admin
      .from("comment_reports")
      .update({ resolved_at: new Date().toISOString() })
      .eq("comment_id", id)
      .is("resolved_at", null);

    return NextResponse.json({ id, status });
  } catch (err) {
    console.error("[admin comments PATCH] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** Remove a comment for good. Replies cascade with it. */
export async function DELETE(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("post_comments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[admin comments DELETE] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("[admin comments DELETE] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
