import Link from "next/link";
import { requireProgramUser } from "@/lib/program-auth";
import { getModules, getGateExercise } from "@/lib/exercises";
import { ProgramHeader } from "@/components/program/program-header";
import { ProgressBar } from "@/components/program/progress-bar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Play, BookOpen } from "lucide-react";
import type { GenderForm } from "@/lib/personalize";
import { ProfileInitializer } from "@/components/program/profile-initializer";

type ExerciseStatus = "not_started" | "in_progress" | "completed" | "skipped";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getUserProgress(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_progress")
    .select("exercise_id, status")
    .eq("user_id", userId);

  const progress: Record<string, ExerciseStatus> = {};
  if (data) {
    for (const row of data) {
      progress[row.exercise_id] = row.status as ExerciseStatus;
    }
  }
  return progress;
}

function getModuleStatus(
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

export default async function DashboardPage() {
  const { user, supabase } = await requireProgramUser();

  // Fetch user profile for gender form
  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("gender_form")
    .eq("user_id", user.id)
    .single();

  const genderForm: GenderForm =
    (profileData?.gender_form as GenderForm) || "neutral";

  const modules = getModules(genderForm);
  const gate = getGateExercise(genderForm);
  const progress = await getUserProgress(supabase, user.id);

  const gateStatus = progress["gate_00"] || "not_started";
  const gateCompleted =
    gateStatus === "completed" || gateStatus === "skipped";

  return (
    <>
    <ProgramHeader />
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ProfileInitializer />
      <h1 className="text-2xl font-semibold text-[#1E2A36] mb-2">
        Twoj program
      </h1>
      <p className="text-[#4A5B6A] mb-8">
        Twoje teksty sa zapisywane i szyfrowane. Program czeka — wracasz kiedy chcesz.
      </p>

      {/* Gate exercise */}
      {gate && (
        <Card className="mb-8 border-[#7B9E8C]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{gate.title}</CardTitle>
                <CardDescription>{gate.estimatedTime}</CardDescription>
              </div>
              {gateCompleted ? (
                <CheckCircle2 className="h-6 w-6 text-[#7B9E8C]" />
              ) : (
                <Badge variant="secondary">Start</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Link href={`/program/cwiczenie/${gate.id}`}>
              <Button
                variant={gateCompleted ? "outline" : "default"}
                className="w-full"
              >
                {gateCompleted ? "Wróć do ćwiczenia" : "Rozpocznij"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((mod) => {
          const moduleStatus = gateCompleted
            ? getModuleStatus(mod.exercises, progress)
            : "locked";

          const completedCount = mod.exercises.filter(
            (e) =>
              progress[e.id] === "completed" || progress[e.id] === "skipped"
          ).length;

          const isLocked = moduleStatus === "locked";

          return (
            <Card
              key={mod.slug}
              className={isLocked ? "opacity-60" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {isLocked && <Lock className="h-4 w-4 text-[#8A99A8]" />}
                      Moduł {mod.order}: {mod.title}
                    </CardTitle>
                    <CardDescription>{mod.subtitle}</CardDescription>
                  </div>
                  {moduleStatus === "completed" && (
                    <CheckCircle2 className="h-6 w-6 text-[#7B9E8C]" />
                  )}
                  {moduleStatus === "in_progress" && (
                    <Play className="h-5 w-5 text-[#7B9E8C]" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ProgressBar
                  completed={completedCount}
                  total={mod.exercises.length}
                />
                <div className="mt-4 space-y-2">
                  {mod.exercises.map((exercise) => {
                    const exStatus = progress[exercise.id] || "not_started";
                    const isDone =
                      exStatus === "completed" || exStatus === "skipped";

                    return (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#F1F4F6] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-[#7B9E8C]" />
                          ) : exStatus === "in_progress" ? (
                            <Play className="h-4 w-4 text-[#7B9E8C]" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-[#8A99A8]" />
                          )}
                          <span
                            className={`text-sm ${
                              isDone
                                ? "text-[#8A99A8]"
                                : "text-[#1E2A36]"
                            }`}
                          >
                            {exercise.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8A99A8]">
                            {exercise.estimatedTime}
                          </span>
                          {!isLocked && (
                            <Link href={`/program/cwiczenie/${exercise.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7"
                              >
                                {isDone
                                  ? "Wróć"
                                  : exStatus === "in_progress"
                                    ? "Kontynuuj"
                                    : "Zacznij"}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!isLocked && mod.introduction && (
                  <Link href={`/program/modul/${mod.slug}`}>
                    <Button variant="ghost" size="sm" className="mt-3 text-xs">
                      Przeczytaj wprowadzenie do modułu
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer links */}
      <div className="mt-12 pt-8 border-t border-[#e2e7eb] flex items-center justify-between">
        <Link href="/profil" className="text-sm text-[#7B9E8C] hover:underline">
          Profil i ustawienia
        </Link>
        <a href="/api/program/data-export" className="text-sm text-[#8A99A8] hover:underline">
          Eksportuj dane
        </a>
      </div>
    </div>
    </>
  );
}
