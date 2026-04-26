import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isProgramAdmin } from "@/lib/admin-email";

export async function requireProgramUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { user, supabase };
}

export async function getProgramUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, supabase };
}

export async function requireProgramAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  if (!isProgramAdmin(user.email)) {
    throw new Error("Forbidden");
  }

  return { user, supabase };
}

export async function hasPaidAccess(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("has_paid")
    .eq("user_id", userId)
    .single();

  return data?.has_paid === true;
}
