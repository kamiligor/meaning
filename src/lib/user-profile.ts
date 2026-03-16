import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenderForm } from "./personalize";

export async function getUserGenderForm(
  supabase: SupabaseClient,
  userId: string
): Promise<GenderForm> {
  const { data } = await supabase
    .from("user_profiles")
    .select("gender_form")
    .eq("user_id", userId)
    .single();
  return (data?.gender_form as GenderForm) || "neutral";
}
