import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const MIN = 2;
const MAX = 40;

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
      typeof payload?.displayName === "string" ? payload.displayName.trim() : "";

    if (name.length < MIN || name.length > MAX) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const { error } = await supabase
      .from("user_profiles")
      .upsert(
        { user_id: user.id, display_name: name },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("[display-name PUT] Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ displayName: name });
  } catch (err) {
    console.error("[display-name PUT] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
