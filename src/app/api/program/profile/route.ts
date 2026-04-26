import { NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";
import { isProgramAdmin } from "@/lib/admin-email";
import type { GenderForm } from "@/lib/personalize";

const VALID_GENDER_FORMS: GenderForm[] = ["feminine", "masculine", "neutral"];

export async function GET() {
  try {
    const { user, supabase } = await requireProgramUser();

    if (!isProgramAdmin(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("gender_form, disclaimer_accepted_at, created_at, updated_at")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({
      profile: data || {
        gender_form: "neutral",
        disclaimer_accepted_at: null,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[profile GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { user, supabase } = await requireProgramUser();

    if (!isProgramAdmin(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.gender_form) {
      if (!VALID_GENDER_FORMS.includes(body.gender_form)) {
        return NextResponse.json(
          { error: "Invalid gender_form" },
          { status: 400 }
        );
      }
      updates.gender_form = body.gender_form;
    }

    if (body.accept_disclaimer) {
      updates.disclaimer_accepted_at = new Date().toISOString();
    }

    const { error } = await supabase.from("user_profiles").upsert(
      {
        user_id: user.id,
        ...updates,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[profile PUT] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
