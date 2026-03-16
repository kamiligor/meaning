import { notFound } from "next/navigation";
import Link from "next/link";
import { getModules } from "@/lib/exercises";
import { requireProgramUser } from "@/lib/program-auth";
import { ProgramHeader } from "@/components/program/program-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GenderForm } from "@/lib/personalize";
import { cookies } from "next/headers";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale: Locale = getLocaleFromCookies(cookieStore);
  const { user, supabase } = await requireProgramUser();

  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("gender_form")
    .eq("user_id", user.id)
    .single();

  const genderForm: GenderForm =
    (profileData?.gender_form as GenderForm) || "neutral";

  const modules = getModules(genderForm);
  const mod = modules.find((m) => m.slug === slug);

  if (!mod) {
    notFound();
  }

  return (
    <>
    <ProgramHeader />
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/program/dashboard"
        className="text-sm text-[#7B9E8C] hover:underline mb-4 inline-block"
      >
        &larr; Wróć do dashboardu
      </Link>

      <h1 className="text-2xl font-semibold text-[#1E2A36] mb-2">
        Moduł {mod.order}: {mod.title}
      </h1>
      <p className="text-[#7B9E8C] font-medium mb-8">{mod.subtitle}</p>

      {/* Introduction */}
      {mod.introduction && (
        <div
          className="prose prose-sm max-w-none text-[#4A5B6A] mb-10 leading-relaxed prose-headings:text-[#1E2A36] prose-h1:text-xl prose-h2:text-lg prose-strong:text-[#1E2A36]"
          dangerouslySetInnerHTML={{ __html: mod.introduction.content }}
        />
      )}

      {/* Exercise list */}
      <h2 className="text-lg font-semibold text-[#1E2A36] mb-4">
        Ćwiczenia w tym module
      </h2>
      <div className="space-y-3">
        {mod.exercises.map((exercise, idx) => (
          <div
            key={exercise.id}
            className="bg-white border border-[#e2e7eb] rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[#1E2A36] mb-1">
                  {idx + 1}. {exercise.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#8A99A8]">
                  <span>{exercise.estimatedTime}</span>
                  <span>·</span>
                  <span>Poziom {exercise.difficulty}/5</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {exercise.contentWarning && (
                  <Badge variant="outline" className="text-xs">
                    Trudniejsze
                  </Badge>
                )}
                <Link href={`/program/cwiczenie/${exercise.id}`}>
                  <Button size="sm" variant="outline">
                    Otwórz
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <SiteFooter locale={locale} />
    </>
  );
}
