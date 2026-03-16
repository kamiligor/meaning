import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExerciseStatus } from "./program-types";

export interface NextExercise {
  id: string;
  title: string;
  estimatedTime: string;
  moduleLabel: string | null;
  isGate: boolean;
  isInProgress: boolean;
}

export async function getUserProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<Record<string, ExerciseStatus>> {
  const { data } = await supabase
    .from("user_progress")
    .select("exercise_id, status")
    .eq("user_id", userId);

  const progress: Record<string, ExerciseStatus> = {};
  if (data) {
    for (const row of data) {
      progress[row.exercise_id as string] = row.status as ExerciseStatus;
    }
  }
  return progress;
}

export function getModuleStatus(
  exercises: { id: string }[],
  progress: Record<string, ExerciseStatus>
): "locked" | "available" | "in_progress" | "completed" {
  const statuses = exercises.map((e) => progress[e.id] || "not_started");
  const completed = statuses.filter(
    (s) => s === "completed" || s === "skipped"
  ).length;

  if (completed === exercises.length) return "completed";
  if (statuses.some((s) => s === "in_progress" || s === "completed"))
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
  progress: Record<string, ExerciseStatus>,
  gateCompleted: boolean
): NextExercise | null {
  // Gate not done yet
  if (gate && !gateCompleted) {
    const gateStatus = progress["gate_00"] || "not_started";
    return {
      id: gate.id,
      title: gate.title,
      estimatedTime: gate.estimatedTime,
      moduleLabel: null,
      isGate: true,
      isInProgress: gateStatus === "in_progress",
    };
  }

  // Find first in-progress exercise across modules
  for (const mod of modules) {
    for (const ex of mod.exercises) {
      const status = progress[ex.id] || "not_started";
      if (status === "in_progress") {
        return {
          id: ex.id,
          title: ex.title,
          estimatedTime: ex.estimatedTime,
          moduleLabel: `Moduł ${mod.order}: ${mod.title}`,
          isGate: false,
          isInProgress: true,
        };
      }
    }
  }

  // Find first not-started exercise across modules
  for (const mod of modules) {
    for (const ex of mod.exercises) {
      const status = progress[ex.id] || "not_started";
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
