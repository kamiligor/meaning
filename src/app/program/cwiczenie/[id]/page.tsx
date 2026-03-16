import { notFound } from "next/navigation";
import { requireProgramUser } from "@/lib/program-auth";
import { loadExercise, getModules, getExerciseModuleInfo } from "@/lib/exercises";
import { decrypt } from "@/lib/encryption";
import { ExerciseView } from "@/components/program/exercise-view";
import { ExerciseHeader } from "@/components/program/exercise-header";
import type { GenderForm } from "@/lib/personalize";

interface Props {
  params: Promise<{ id: string }>;
}

function getNextExerciseUrl(
  exerciseId: string,
  genderForm: GenderForm
): string | null {
  const modules = getModules(genderForm);

  // Check gate exercise
  if (exerciseId === "gate_00") {
    const firstModule = modules[0];
    if (firstModule?.exercises[0]) {
      return `/program/cwiczenie/${firstModule.exercises[0].id}`;
    }
    return "/program/dashboard";
  }

  // Find current exercise in modules
  for (const mod of modules) {
    const idx = mod.exercises.findIndex((e) => e.id === exerciseId);
    if (idx === -1) continue;

    // Next exercise in same module
    if (idx < mod.exercises.length - 1) {
      return `/program/cwiczenie/${mod.exercises[idx + 1].id}`;
    }

    // First exercise of next module
    const nextModIdx = modules.indexOf(mod) + 1;
    if (nextModIdx < modules.length) {
      const nextMod = modules[nextModIdx];
      if (nextMod.exercises[0]) {
        return `/program/cwiczenie/${nextMod.exercises[0].id}`;
      }
    }

    // End of program
    return "/program/dashboard";
  }

  return "/program/dashboard";
}

export default async function ExercisePage({ params }: Props) {
  const { id } = await params;
  const { user, supabase } = await requireProgramUser();

  // Fetch user profile for gender form
  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("gender_form")
    .eq("user_id", user.id)
    .single();

  const genderForm: GenderForm =
    (profileData?.gender_form as GenderForm) || "neutral";

  const exercise = loadExercise(id, genderForm);

  if (!exercise) {
    notFound();
  }

  // Load saved responses
  const { data: responseData } = await supabase
    .from("exercise_responses")
    .select(
      "question_index, ciphertext, iv, salt, word_count, time_spent_sec, updated_at"
    )
    .eq("user_id", user.id)
    .eq("exercise_id", id)
    .order("question_index");

  const savedResponses = (responseData || []).map((row) => ({
    questionIndex: row.question_index as number,
    content: decrypt(
      row.ciphertext as string,
      row.iv as string,
      row.salt as string,
      user.id
    ),
    updatedAt: row.updated_at as string,
  }));

  // Mark as in_progress unless already completed/skipped
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("status")
    .eq("user_id", user.id)
    .eq("exercise_id", id)
    .single();

  const currentStatus = progressData?.status as string | undefined;
  if (currentStatus !== "completed" && currentStatus !== "skipped") {
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      exercise_id: id,
      status: "in_progress",
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,exercise_id" });
  }

  const nextExerciseUrl = getNextExerciseUrl(id, genderForm);
  const moduleInfo = getExerciseModuleInfo(id, genderForm);
  const isGate = id.startsWith("gate_");

  return (
    <>
      <ExerciseHeader
        moduleLabel={moduleInfo?.moduleLabel ?? ""}
        moduleSlug={moduleInfo?.moduleSlug ?? ""}
        exerciseLabel={isGate ? exercise.title : `Ćwiczenie ${moduleInfo?.exerciseNumber ?? ""}`}
        isGate={isGate}
      />
      <ExerciseView
        exercise={exercise}
        savedResponses={savedResponses}
        nextExerciseUrl={nextExerciseUrl}
      />
    </>
  );
}
