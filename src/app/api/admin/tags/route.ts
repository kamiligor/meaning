import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSession } from "@/lib/auth";
import {
  listTags,
  createManualTag,
  assignManualTag,
  removeManualTag,
} from "@/lib/tags";
import type { TagsResponse } from "@/lib/analytics-types";

/**
 * Tag list with counts for the admin panel.
 *
 * The proxy only gates non-GET requests under /api/admin/ with the admin
 * JWT, so — same as /api/admin/comments — this checks the session itself.
 */
export async function GET() {
  try {
    if (!(await getSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    const tags = await listTags(admin);
    const body: TagsResponse = { tags };
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[admin tags GET] Unexpected error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

type Body =
  | { action: "create"; tag: string; description: string }
  | { action: "assign"; tag: string; email: string }
  | { action: "remove"; tag: string; email: string };

function isBody(value: unknown): value is Body {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.tag !== "string") return false;
  if (v.action === "create") return typeof v.description === "string";
  if (v.action === "assign" || v.action === "remove") return typeof v.email === "string";
  return false;
}

/**
 * Create a manual tag, or assign/remove a manual tag to/from a person by
 * e-mail. Already protected by the admin JWT gate in src/proxy.ts for any
 * non-GET /api/admin/* request, but the session is checked explicitly too so
 * this route behaves correctly even if that gate's rules ever change.
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await getSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json().catch(() => null);
    if (!isBody(payload)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    if (payload.action === "create") {
      await createManualTag(admin, { tag: payload.tag, description: payload.description });
    } else if (payload.action === "assign") {
      await assignManualTag(admin, { tag: payload.tag, email: payload.email });
    } else {
      await removeManualTag(admin, { tag: payload.tag, email: payload.email });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    // These are user-facing validation errors (bad tag name, unknown user,
    // tag already exists as auto, ...), not database internals — safe to
    // surface directly to the admin panel.
    const knownError =
      err instanceof Error &&
      /Invalid tag format|Description is required|already exists as an automatic tag|is not a manual tag|User not found/.test(
        message
      );
    if (knownError) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error("[admin tags POST] Unexpected error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
