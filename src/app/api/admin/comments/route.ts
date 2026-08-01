import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSession } from "@/lib/auth";

/**
 * Moderation queue.
 *
 * The proxy only gates non-GET requests, so reading the queue has to check the
 * admin session itself — otherwise the pending, unmoderated comments would be
 * readable by anyone who guessed the URL.
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await getSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status") ?? "pending";

    const { data, error } = await getSupabaseAdmin()
      .from("post_comments")
      .select("id, post_slug, locale, body, status, created_at, user_id")
      .eq("status", status)
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) {
      console.error("[admin comments GET] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const rows = data ?? [];
    const names = new Map<string, string>();

    if (rows.length > 0) {
      const { data: profiles } = await getSupabaseAdmin()
        .from("user_profiles")
        .select("user_id, display_name")
        .in("user_id", [...new Set(rows.map((r) => r.user_id))]);

      for (const p of profiles ?? []) {
        if (p.display_name) names.set(p.user_id, p.display_name);
      }
    }

    return NextResponse.json({
      comments: rows.map((r) => ({
        id: r.id,
        postSlug: r.post_slug,
        locale: r.locale,
        body: r.body,
        status: r.status,
        createdAt: r.created_at,
        authorName: names.get(r.user_id) ?? "—",
      })),
    });
  } catch (err) {
    console.error("[admin comments GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => null);
    const id = typeof payload?.id === "number" ? payload.id : null;
    const status = payload?.status;

    if (id === null || (status !== "approved" && status !== "rejected")) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("post_comments")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("[admin comments PATCH] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ id, status });
  } catch (err) {
    console.error("[admin comments PATCH] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
