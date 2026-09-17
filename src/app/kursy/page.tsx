import Link from "next/link";
import { PROGRAM_LAUNCHED } from "@/lib/launch";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getProgramUser } from "@/lib/program-auth";
import { visibleCourses } from "@/lib/courses";
import { getCourseState, currentDay } from "@/lib/course";
import { getLocale } from "@/lib/locale";

export const metadata = {
  title: "Darmowe mini kursy | po prostu sens",
  description:
    "Darmowe kursy rozłożone na kilka dni, po kilka minut dziennie. Każdy dzień kończy się jednym zadaniem do zrobienia w realnym życiu.",
};

export default async function CoursesHubPage() {
  const locale = await getLocale();
  const { user, supabase } = await getProgramUser();

  const tiles = [];
  for (const course of visibleCourses(user?.email)) {
    const state = user
      ? await getCourseState(supabase, user.id, course.slug)
      : null;
    const enrollment = state?.enrollment ?? null;
    const totalDays = course.days.length;
    const completedDays = state
      ? Object.values(state.days).filter((d) => d.completedAt).length
      : 0;
    tiles.push({
      course,
      enrolled: !!enrollment,
      completedDays,
      totalDays,
      finished: completedDays >= totalDays,
      continueDay: state ? currentDay(state.days, totalDays) : 1,
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <SiteHeader locale={locale} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 md:px-8 py-12">
        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl font-semibold text-[#1E2A36] mb-3">
            Mini kursy
          </h1>
          <p className="text-[#4A5B6A] leading-relaxed">
            Każdy kurs tutaj jest darmowy i rozłożony na kilka dni, po kilka
            minut dziennie, nie więcej. Dzień po dniu dostajesz krótkie
            wyjaśnienie, mały quiz i jedno konkretne zadanie do zrobienia
            w realnym życiu, nie tylko na papierze. Jeśli zdarzy się przerwa,
            nic się nie psuje i nikt nie liczy zaległości. Kurs po prostu
            czeka, aż wrócisz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tiles.map(({ course, enrolled, completedDays, totalDays, finished, continueDay }) => (
            <div
              key={course.slug}
              className="relative flex flex-col bg-white border border-[#e2e7eb] border-t-2 border-t-[#7B9E8C] rounded-xl p-6 transition-shadow duration-150 hover:shadow-[0_4px_16px_rgba(123,158,140,0.10)]"
            >
              {/* Free badge, always visible in the corner */}
              <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-[#e8f0eb] px-3 py-1 text-xs font-semibold text-[#7B9E8C]">
                Darmowy
              </span>

              <h2 className="text-xl font-semibold text-[#1E2A36] mb-1 pr-24">
                {course.name}
              </h2>
              <p className="text-sm text-[#7B9E8C] font-medium mb-3">
                {course.tagline}
              </p>
              <p className="text-sm text-[#4A5B6A] leading-relaxed mb-4 flex-1">
                {course.heroDescription}
              </p>
              <p className="text-xs text-[#8A99A8] mb-5">
                {totalDays} dni · kilka minut dziennie
              </p>

              {enrolled ? (
                <div>
                  {/* Progress bar: where the participant actually is, before the CTA */}
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="text-xs text-[#8A99A8]">
                      Ukończone dni: {completedDays} z {totalDays}
                    </span>
                    {finished && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B9E8C]">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Ukończony
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#e8f0eb] overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full bg-[#7B9E8C]"
                      style={{
                        width: `${Math.round((completedDays / totalDays) * 100)}%`,
                      }}
                    />
                  </div>

                  {finished ? (
                    <Link href={course.path} className="block">
                      <Button variant="outline" className="w-full">
                        Wróć do kursu
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`${course.path}/dzien/${continueDay}`}
                      className="block"
                    >
                      <Button className="w-full">Kontynuuj</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Link href={course.path} className="block">
                  <Button className="w-full">Zobacz kurs</Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-[#8A99A8] mt-10 max-w-2xl leading-relaxed">
          Kursy są darmowe i wymagają tylko darmowego konta, żeby pamiętać
          twój postęp.
          {PROGRAM_LAUNCHED && (
            <>
              {" "}
              Jeśli po którymś z nich zechcesz pójść głębiej, od tego jest{" "}
              <Link href="/program" className="text-[#7B9E8C] hover:underline">
                The Life Writing Program
              </Link>
              .
            </>
          )}
        </p>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
