import Link from "next/link";
import { cookies } from "next/headers";
import { requireProgramUser } from "@/lib/program-auth";
import { getModules, getGateExercise } from "@/lib/exercises";
import { ProgramHeader } from "@/components/program/program-header";
import { ProgressBar } from "@/components/program/progress-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Play, BookOpen } from "lucide-react";
import { ProfileInitializer } from "@/components/program/profile-initializer";
import { getUserGenderForm } from "@/lib/user-profile";
import { getUserProgress, getModuleStatus, findNextExercise } from "@/lib/progress";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import { t } from "@/lib/i18n";

export default async function DashboardPage() {
  const { user, supabase } = await requireProgramUser();

  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore);
  const d = t(locale);

  const genderForm = await getUserGenderForm(supabase, user.id);

  const modules = getModules(genderForm);
  const gate = getGateExercise(genderForm);
  const progress = await getUserProgress(supabase, user.id);

  const gateStatus = progress["gate_00"] || "not_started";
  const gateCompleted =
    gateStatus === "completed" || gateStatus === "skipped";

  const nextExercise = findNextExercise(gate, modules, progress, gateCompleted);

  return (
    <>
    <ProgramHeader />
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ProfileInitializer />
      <h1 className="text-2xl font-semibold text-[#1E2A36] mb-2">
        {d.dashboardTitle}
      </h1>
      <p className="text-[#4A5B6A] mb-8">
        {d.dashboardSubtext}
      </p>

      {/* Next exercise CTA */}
      {nextExercise && (
        <Card className="mb-8 border-[#7B9E8C] bg-[#f8fbf9]">
          <CardContent className="pt-6">
            <p className="text-xs text-[#7B9E8C] font-medium uppercase tracking-wider mb-1">
              {nextExercise.isInProgress ? d.dashboardContinueLabel : d.dashboardNextExercise}
            </p>
            <h3 className="text-lg font-semibold text-[#1E2A36] mb-1">
              {nextExercise.title}
            </h3>
            <p className="text-sm text-[#8A99A8] mb-4">
              {nextExercise.moduleLabel && <span>{nextExercise.moduleLabel} · </span>}
              {nextExercise.estimatedTime}
            </p>
            <Link href={`/program/cwiczenie/${nextExercise.id}`}>
              <Button className="w-full">
                {nextExercise.isInProgress ? d.dashboardContinueWriting : d.dashboardStart}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Gate exercise — inline like other exercises */}
      {gate && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-3">
            {d.dashboardGateLabel}
          </h2>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#F1F4F6] transition-colors">
            <div className="flex items-center gap-3">
              {gateCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-[#7B9E8C]" />
              ) : gateStatus === "in_progress" ? (
                <Play className="h-4 w-4 text-[#7B9E8C]" />
              ) : (
                <BookOpen className="h-4 w-4 text-[#8A99A8]" />
              )}
              <span className={`text-sm ${gateCompleted ? "text-[#8A99A8]" : "text-[#1E2A36]"}`}>
                {gate.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A99A8]">{gate.estimatedTime}</span>
              <Link href={`/program/cwiczenie/${gate.id}`}>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  {gateCompleted
                    ? d.dashboardReturn
                    : gateStatus === "in_progress"
                      ? d.dashboardContinue
                      : d.dashboardBegin}
                </Button>
              </Link>
            </div>
          </div>
        </div>
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
                      {d.dashboardModule} {mod.order}: {mod.title}
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
                  locale={locale}
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
                                  ? d.dashboardReturn
                                  : exStatus === "in_progress"
                                    ? d.dashboardContinue
                                    : d.dashboardBegin}
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
                      {d.dashboardReadIntro}
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
          {d.dashboardProfile}
        </Link>
        <a href="/api/program/data-export" className="text-sm text-[#8A99A8] hover:underline">
          {d.dashboardExport}
        </a>
      </div>
    </div>
    </>
  );
}
