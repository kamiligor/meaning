import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { requireProgramUser } from "@/lib/program-auth";
import { loadExercise, getExerciseModuleInfo } from "@/lib/exercises";
import { ExerciseView } from "@/components/program/exercise-view";
import { ExerciseHeader } from "@/components/program/exercise-header";
import { getUserGenderForm } from "@/lib/user-profile";
import { getNextExerciseUrl } from "@/lib/program-navigation";
import { getDecryptedResponses } from "@/lib/exercise-responses";
import { syncExerciseProgress } from "@/lib/progress";
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

  await syncExerciseProgress(supabase, user.id, id, savedResponses, {
    updateTimestamp: false,
    minCharsCheck: !isGate ? {
      questions: exercise.promptQuestions,
      getContent: (idx) => savedResponses.find((r) => r.questionIndex === idx)?.content ?? "",
    } : undefined,
  });

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
