import { NextRequest, NextResponse } from "next/server";
import { requireProgramUser } from "@/lib/program-auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { user, supabase } = await requireProgramUser();
    const { slug } = await params;

    // Check if already liked
    const { data: existing } = await supabase
      .from("user_interactions")
      .select("id")
      .eq("user_id", user.id)
      .eq("interaction_type", "like")
      .eq("target_type", "post")
      .eq("target_id", slug)
      .maybeSingle();

    if (existing) {
      // Unlike
      await supabase
        .from("user_interactions")
        .delete()
        .eq("id", existing.id);
      return NextResponse.json({ liked: false });
    }

    // Like
    await supabase.from("user_interactions").insert({
      user_id: user.id,
      interaction_type: "like",
      target_type: "post",
      target_id: slug,
    });

    return NextResponse.json({ liked: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
