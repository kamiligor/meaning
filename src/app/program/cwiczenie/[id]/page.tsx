import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { requireProgramUser } from "@/lib/program-auth";
import { loadExercise, getExerciseModuleInfo } from "@/lib/exercises";
import { ExerciseView } from "@/components/program/exercise-view";
import { ExerciseHeader } from "@/components/program/exercise-header";
import { getUserGenderForm } from "@/lib/user-profile";
import { getNextExerciseUrl } from "@/lib/program-navigation";
import { getDecryptedResponses } from "@/lib/exercise-responses";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import { t } from "@/lib/i18n";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExercisePage({ params }: Props) {
  const { id } = await params;
  const { user, supabase } = await requireProgramUser();

  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore);
  const d = t(locale);

  const genderForm = await getUserGenderForm(supabase, user.id);

  const exercise = loadExercise(id, genderForm);

  if (!exercise) {
    notFound();
  }

  const savedResponses = await getDecryptedResponses(supabase, user.id, id);

  const isGate = id.startsWith("gate_");

  // Mark as in_progress unless already completed/skipped
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("status")
    .eq("user_id", user.id)
    .eq("exercise_id", id)
    .single();

  const currentStatus = progressData?.status as string | undefined;

  if (currentStatus === "completed" && !isGate) {
    // Re-validate: revert to in_progress if content no longer meets min_chars
    const belowMinimum = exercise.promptQuestions.some((q, idx) => {
      if (q.minChars === 0) return false;
      const resp = savedResponses.find((r) => r.questionIndex === idx);
      if (!resp) return true;
      const charCount = resp.content
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim().length;
      return charCount < q.minChars;
    });

    if (belowMinimum) {
      await supabase.from("user_progress").update({
        status: "in_progress",
        completed_at: null,
        updated_at: new Date().toISOString(),
      }).eq("user_id", user.id).eq("exercise_id", id);
    }
  } else if (currentStatus !== "completed" && currentStatus !== "skipped") {
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

  const exerciseLabel = isGate
    ? exercise.title
    : `${d.exerciseLabel} ${moduleInfo?.exerciseNumber ?? ""}`;

  return (
    <>
      <ExerciseHeader
        moduleLabel={moduleInfo?.moduleLabel ?? ""}
        moduleSlug={moduleInfo?.moduleSlug ?? ""}
        exerciseLabel={exerciseLabel}
        isGate={isGate}
        locale={locale}
      />
      <ExerciseView
        exercise={exercise}
        savedResponses={savedResponses}
        nextExerciseUrl={nextExerciseUrl}
        locale={locale}
      />
    </>
  );
}
