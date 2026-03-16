import type { SupabaseClient } from "@supabase/supabase-js";
import { decrypt } from "./encryption";

export interface SavedResponse {
  questionIndex: number;
  content: string;
  updatedAt: string;
}

export async function getDecryptedResponses(
  supabase: SupabaseClient,
  userId: string,
  exerciseId: string
): Promise<SavedResponse[]> {
  const { data } = await supabase
    .from("exercise_responses")
    .select(
      "question_index, ciphertext, iv, salt, word_count, time_spent_sec, updated_at"
    )
    .eq("user_id", userId)
    .eq("exercise_id", exerciseId)
    .order("question_index");

  return (data || []).map((row) => ({
    questionIndex: row.question_index as number,
    content: decrypt(
      row.ciphertext as string,
      row.iv as string,
      row.salt as string,
      userId
    ),
    updatedAt: row.updated_at as string,
  }));
}
