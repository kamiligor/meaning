import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getPostBySlug } from "@/lib/posts";
import { isLocale, type Locale } from "@/lib/i18n";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  buildCommentTree,
  isCommentBodyValid,
  type CommentRow,
} from "@/lib/comments";

/** Display names for the authors in a thread, fetched in one round trip. */
async function loadAuthorNames(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userIds: string[]
): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  if (userIds.length === 0) return names;

  const { data } = await supabase
    .from("user_profiles")
    .select("user_id, display_name")
    .in("user_id", userIds);

  for (const row of data ?? []) {
    if (row.display_name) names.set(row.user_id, row.display_name);
  }
  return names;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const locale: Locale = isLocale(post.locale) ? post.locale : "en";
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // RLS already filters out hidden comments.
    const { data, error } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_slug", slug)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[comments GET] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const rows = (data ?? []) as CommentRow[];
    const names = await loadAuthorNames(
      supabase,
      [...new Set(rows.map((r) => r.user_id))].filter(
        (id): id is string => id !== null
      )
    );

    return NextResponse.json({
      comments: buildCommentTree(rows, names, user?.id ?? null, locale),
    });
  } catch (err) {
    console.error("[comments GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post || post.status !== "published") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // RLS blocks banned users anyway; checking here turns a generic failure
    // into a message the person can understand.
    const { data: ban } = await supabase
      .from("comment_bans")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (ban) {
      return NextResponse.json({ error: "Banned" }, { status: 403 });
    }

    const { allowed, retryAfterMs } = checkRateLimit(`comments:${user.id}`, {
      maxRequests: 5,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many comments", retryAfterMs },
        { status: 429 }
      );
    }

    const payload = await request.json().catch(() => null);
    const body = typeof payload?.body === "string" ? payload.body.trim() : "";
    const parentId =
      typeof payload?.parentId === "number" ? payload.parentId : null;

    if (!isCommentBodyValid(body)) {
      return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
    }

    // The database trigger is the real guard; this gives a usable error first.
    if (parentId !== null) {
      const { data: parent } = await supabase
        .from("post_comments")
        .select("id, parent_id, post_slug")
        .eq("id", parentId)
        .maybeSingle();

      if (!parent || parent.post_slug !== slug || parent.parent_id !== null) {
        return NextResponse.json({ error: "Invalid parent" }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_slug: slug,
        locale: post.locale,
        user_id: user.id,
        parent_id: parentId,
        body,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[comments POST] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    console.error("[comments POST] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
