import { NextResponse } from "next/server";
import { getProgramUser } from "@/lib/program-auth";

export async function GET() {
  const { user, supabase } = await getProgramUser();

  if (!user) {
    return NextResponse.json({ slugs: [] });
  }

  const { data } = await supabase
    .from("user_interactions")
    .select("target_id")
    .eq("user_id", user.id)
    .eq("interaction_type", "like")
    .eq("target_type", "post");

  const slugs = (data ?? []).map((row) => row.target_id);
  return NextResponse.json({ slugs });
}
