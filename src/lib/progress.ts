import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExerciseStatus } from "./program-types";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

/**
 * Sync exercise progress status based on actual content.
 *
 * @param updateTimestamp - true when user saves content (autosave),
 *   false on page load (don't shift CTA priority just by visiting)
 *
 * Rules:
 * - Has content + not yet in_progress → set in_progress
 * - No content + was in_progress → revert to not_started
 * - Completed but below min_chars → revert to in_progress
 * - Otherwise → no change
 */
export async function syncExerciseProgress(
  supabase: SupabaseClient,
  userId: string,
  exerciseId: string,
  responses: { content: string }[],
  options?: {
    updateTimestamp?: boolean;
    minCharsCheck?: { questions: { minChars: number }[]; getContent: (idx: number) => string };
  }
): Promise<void> {
  const updateTimestamp = options?.updateTimestamp ?? false;
  const minCharsCheck = options?.minCharsCheck;

  const { data: progressData } = await supabase
    .from("user_progress")
    .select("status")
    .eq("user_id", userId)
    .eq("exercise_id", exerciseId)
    .single();

  const status = (progressData?.status ?? "not_started") as ExerciseStatus;
  const hasContent = responses.some((r) => stripHtml(r.content).length > 0);
  const now = new Date().toISOString();

  if (status === "completed" && minCharsCheck) {
    const belowMinimum = minCharsCheck.questions.some((q, idx) => {
      if (q.minChars === 0) return false;
      return stripHtml(minCharsCheck.getContent(idx)).length < q.minChars;
    });
    if (belowMinimum) {
      await supabase.from("user_progress").update({
        status: "in_progress",
        completed_at: null,
        updated_at: now,
      }).eq("user_id", userId).eq("exercise_id", exerciseId);
    }
    return;
  }

  if (hasContent && status !== "in_progress" && status !== "completed") {
    await supabase.from("user_progress").upsert({
      user_id: userId,
      exercise_id: exerciseId,
      status: "in_progress",
      started_at: now,
      ...(updateTimestamp && { updated_at: now }),
    }, { onConflict: "user_id,exercise_id" });
    return;
  }

  if (!hasContent && status === "in_progress") {
    await supabase.from("user_progress").update({
      status: "not_started",
      started_at: null,
      completed_at: null,
      updated_at: now,
    }).eq("user_id", userId).eq("exercise_id", exerciseId);
    return;
  }

  if (updateTimestamp && status === "in_progress") {
    await supabase.from("user_progress").update({
      updated_at: now,
    }).eq("user_id", userId).eq("exercise_id", exerciseId);
  }
}

export interface NextExercise {
  id: string;
  title: string;
  estimatedTime: string;
  moduleLabel: string | null;
  isGate: boolean;
  isInProgress: boolean;
}

export interface ProgressEntry {
  status: ExerciseStatus;
  updatedAt: string | null;
}

export async function getUserProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<Record<string, ProgressEntry>> {
  const { data } = await supabase
    .from("user_progress")
    .select("exercise_id, status, updated_at")
    .eq("user_id", userId);

  const progress: Record<string, ProgressEntry> = {};
  if (data) {
    for (const row of data) {
      progress[row.exercise_id as string] = {
        status: row.status as ExerciseStatus,
        updatedAt: row.updated_at as string | null,
      };
    }
  }
  return progress;
}

export function getModuleStatus(
  exercises: { id: string }[],
  progress: Record<string, ProgressEntry>
): "locked" | "available" | "in_progress" | "completed" {
  const statuses = exercises.map((e) => progress[e.id]?.status || "not_started");
  const completedCount = statuses.filter((s) => s === "completed").length;

  if (completedCount === exercises.length) return "completed";
  if (statuses.some((s) => s === "in_progress" || s === "completed" || s === "skipped"))
    return "in_progress";
  return "available";
}

export function findNextExercise(
  gate: { id: string; title: string; estimatedTime: string } | null,
  modules: {
    order: number;
    title: string;
    slug: string;
    exercises: { id: string; title: string; estimatedTime: string }[];
  }[],
  progress: Record<string, ProgressEntry>,
  gateCompleted: boolean
): NextExercise | null {
  // Gate not done yet
  if (gate && !gateCompleted) {
    const gateStatus = progress["gate_00"]?.status || "not_started";
    return {
      id: gate.id,
      title: gate.title,
      estimatedTime: gate.estimatedTime,
      moduleLabel: null,
      isGate: true,
      isInProgress: gateStatus === "in_progress",
    };
  }

  // Find the most recently updated non-completed exercise
  let lastActive: { ex: { id: string; title: string; estimatedTime: string }; mod: typeof modules[number]; updatedAt: string } | null = null;

  for (const mod of modules) {
    for (const ex of mod.exercises) {
      const entry = progress[ex.id];
      if (!entry) continue;
      if (entry.status === "completed") continue;
      // in_progress or skipped — candidate
      if (entry.updatedAt && (!lastActive || entry.updatedAt > lastActive.updatedAt)) {
        lastActive = { ex, mod, updatedAt: entry.updatedAt };
      }
    }
  }

  if (lastActive) {
    const status = progress[lastActive.ex.id]?.status;
    return {
      id: lastActive.ex.id,
      title: lastActive.ex.title,
      estimatedTime: lastActive.ex.estimatedTime,
      moduleLabel: `Moduł ${lastActive.mod.order}: ${lastActive.mod.title}`,
      isGate: false,
      isInProgress: status === "in_progress",
    };
  }

  // No active exercises — find first not-started
  for (const mod of modules) {
    for (const ex of mod.exercises) {
      const status = progress[ex.id]?.status || "not_started";
      if (status === "not_started") {
        return {
          id: ex.id,
          title: ex.title,
          estimatedTime: ex.estimatedTime,
          moduleLabel: `Moduł ${mod.order}: ${mod.title}`,
          isGate: false,
          isInProgress: false,
        };
      }
    }
  }

  return null; // All done
}
