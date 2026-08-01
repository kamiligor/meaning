import { notFound, redirect } from "next/navigation";
import { getModules, getIntroExerciseId } from "@/lib/exercises";
import { requireProgramUser } from "@/lib/program-auth";
import { getUserProgress } from "@/lib/progress";
import { ProgramHeader } from "@/components/program/program-header";
import { SiteFooter } from "@/components/site-footer";
import { IntroductionLesson } from "@/components/program/introduction-lesson";
import { getLocale } from "@/lib/locale";
import { getUserGenderForm } from "@/lib/user-profile";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const locale: Locale = await getLocale();
  const { user, supabase } = await requireProgramUser();

  const genderForm = await getUserGenderForm(supabase, user.id);

  const modules = getModules(genderForm);
  const mod = modules.find((m) => m.slug === slug);

  if (!mod) {
    notFound();
  }

  if (!mod.introduction) {
    redirect("/program/dashboard");
  }

  const introId = getIntroExerciseId(mod.slug);
  const progress = await getUserProgress(supabase, user.id);
  const introStatus = progress[introId]?.status || "not_started";
  const introCompleted = introStatus === "completed";

  return (
    <>
      <ProgramHeader />
      <IntroductionLesson
        introId={introId}
        moduleSlug={slug}
        moduleOrder={mod.order}
        moduleTitle={mod.title}
        introTitle={mod.introduction.title}
        content={mod.introduction.content}
        isCompleted={introCompleted}
        locale={locale}
      />
      <SiteFooter locale={locale} />
    </>
  );
}
