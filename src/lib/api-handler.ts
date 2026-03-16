import { NextResponse } from "next/server";
import { requireProgramUser } from "./program-auth";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type ProgramHandler<TArgs extends unknown[]> = (
  user: User,
  supabase: SupabaseClient,
  ...args: TArgs
) => Promise<NextResponse>;

export function withProgramAuth<TArgs extends unknown[]>(
  handler: ProgramHandler<TArgs>
) {
  return async (...args: TArgs): Promise<NextResponse> => {
    try {
      const { user, supabase } = await requireProgramUser();
      return await handler(user, supabase, ...args);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      console.error("Unexpected error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
