import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSession } from "@/lib/auth";
import { isValidTag, listTagMembers } from "@/lib/tags";
import type { TagMembersResponse } from "@/lib/analytics-types";

/**
 * E-mail list for one tag — deliberately its own endpoint (not embedded in
 * the tag list markup) so it is only fetched after an explicit click +
 * confirmation in the admin panel, and never appears in a page's initial
 * HTML or logs.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    if (!(await getSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tag } = await params;
    if (!isValidTag(tag)) {
      return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const emails = await listTagMembers(admin, tag);
    const body: TagMembersResponse = { tag, emails };
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error(
      "[admin tags members GET] Unexpected error:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
