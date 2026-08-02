import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const MIN = 2;
const MAX = 40;

/**
 * Names nobody may claim. "Deleted user" is the signature left on comments
 * whose account is gone, so letting someone take it would hand them a way to
 * pose as one.
 */
const RESERVED = [
  "użytkownik usunięty",
  "uzytkownik usuniety",
  "deleted user",
  "administrator",
  "admin",
  "moderator",
];

/** Collapse whitespace so "Anna  K" and "Anna K" cannot both exist. */
function normalize(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/**
 * The name shown next to comments. Kept separate from the program profile
 * endpoint, which is admin-only — every logged-in reader needs this one.
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json().catch(() => null);
    const name =
      typeof payload?.displayName === "string"
        ? normalize(payload.displayName)
        : "";

    if (name.length < MIN || name.length > MAX) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    if (RESERVED.includes(name.toLowerCase())) {
      return NextResponse.json({ error: "reserved" }, { status: 409 });
    }

    const { error } = await supabase
      .from("user_profiles")
      .upsert(
        { user_id: user.id, display_name: name },
        { onConflict: "user_id" }
      );

    if (error) {
      // 23505 unique_violation — somebody already goes by this name.
      if (error.code === "23505") {
        return NextResponse.json({ error: "taken" }, { status: 409 });
      }
      // 23514 check_violation — raised by the once-a-day trigger.
      if (error.code === "23514") {
        return NextResponse.json({ error: "cooldown" }, { status: 429 });
      }

      console.error("[display-name PUT] Database error:", error);
      return NextResponse.json({ error: "server" }, { status: 500 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name, display_name_changed_at")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      displayName: profile?.display_name ?? name,
      changedAt: profile?.display_name_changed_at ?? null,
    });
  } catch (err) {
    console.error("[display-name PUT] Unexpected error:", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
