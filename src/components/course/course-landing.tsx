import Link from "next/link";
import { Check, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProgramUser } from "@/lib/program-auth";
import { getCourse } from "@/lib/courses";
import { getCourseState, currentDay, isDayUnlocked } from "@/lib/course";
import { EnrollForm } from "@/components/course/enroll-form";

/** Shared landing page for every mini course; content comes from the registry. */
export async function CourseLanding({
  slug,
  autoOpenEnroll = false,
}: {
  slug: string;
  /** Open the enrollment form right away (returning from login). */
  autoOpenEnroll?: boolean;
}) {
  const course = getCourse(slug);
  if (!course) return null;

  const { user, supabase } = await getProgramUser();

  const state = user ? await getCourseState(supabase, user.id, course.slug) : null;
  const enrollment = state?.enrollment ?? null;
  const totalDays = course.days.length;
  const continueDay = state ? currentDay(state.days, totalDays) : 1;
  const completedDays = state
    ? Object.values(state.days).filter((d) => d.completedAt).length
    : 0;

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#f0f7f2] to-white">
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-20 text-center">
          <p className="text-sm text-[#7B9E8C] font-medium tracking-widest uppercase mb-4">
            Darmowy mini kurs
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1E2A36] leading-tight mb-4">
            {course.name}
          </h1>
          <p className="text-lg text-[#4A5B6A] max-w-xl mx-auto mb-2 leading-relaxed">
            {course.tagline}
          </p>
          <p className="text-[#4A5B6A] max-w-xl mx-auto mb-8 leading-relaxed">
            {course.heroDescription}
          </p>

          {!user && (
            <>
              <Link
                href={`/login?next=${encodeURIComponent(`${course.path}?zapisz=1`)}`}
              >
                <Button size="lg">Zapisz się za darmo</Button>
              </Link>
              <p className="text-sm text-[#8A99A8] mt-3">
                Kurs wymaga darmowego konta, żeby pamiętać twój postęp.
              </p>
            </>
          )}

          {user && !enrollment && (
            <EnrollForm
              courseSlug={course.slug}
              coursePath={course.path}
              askBaseline={course.askBaseline}
              initialOpen={autoOpenEnroll}
            />
          )}

          {user && enrollment && (
            <>
              <Link href={`${course.path}/dzien/${continueDay}`}>
                <Button size="lg">
                  {completedDays >= totalDays
                    ? "Wróć do kursu"
                    : completedDays === 0
                      ? "Zacznij dzień 1"
                      : `Kontynuuj: dzień ${continueDay}`}
                </Button>
              </Link>
              <p className="text-sm text-[#8A99A8] mt-3">
                Ukończone dni: {completedDays} z {totalDays}
                {completedDays >= totalDays && ". Cały kurs za tobą."}
              </p>
            </>
          )}
        </section>
      </div>

      {/* How it works */}
      <div className="bg-white">
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-14">
          <h2 className="text-2xl font-semibold text-[#1E2A36] mb-6">
            Jak to działa
          </h2>
          <ul className="space-y-4">
            {course.howItWorks.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[#4A5B6A]">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-[#7B9E8C] shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Days preview */}
      <div className="bg-[#f8faf9]">
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-14">
          <h2 className="text-2xl font-semibold text-[#1E2A36] mb-6">
            {totalDays} dni, {totalDays} kroków
          </h2>
          <div className="space-y-3">
            {course.days.map((day) => {
              const done = !!state?.days[day.day]?.completedAt;
              const clickable =
                !!enrollment &&
                (done || (state ? isDayUnlocked(day.day, state.days, totalDays) : false));

              const inner = (
                <>
                  <span
                    className={`flex items-center justify-center h-9 w-9 rounded-full font-semibold text-sm shrink-0 ${
                      done
                        ? "bg-[#7B9E8C] text-white"
                        : "bg-[#e8f0eb] text-[#7B9E8C]"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : day.day}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1E2A36]">{day.title}</h3>
                    <p className="text-sm text-[#8A99A8]">{day.challenge.lead}</p>
                  </div>
                  {clickable && (
                    <ChevronRight className="h-4 w-4 text-[#8A99A8] shrink-0" />
                  )}
                </>
              );

              return clickable ? (
                <Link
                  key={day.day}
                  href={`${course.path}/dzien/${day.day}`}
                  className="flex items-center gap-4 bg-white border border-[#e2e7eb] rounded-xl px-5 py-4 transition-colors hover:border-[#7B9E8C]"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={day.day}
                  className="flex items-center gap-4 bg-white border border-[#e2e7eb] rounded-xl px-5 py-4"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Honesty + privacy */}
      <div className="bg-white">
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-14">
          <h2 className="text-2xl font-semibold text-[#1E2A36] mb-6">
            {course.aboutHeading}
          </h2>
          <div className="space-y-4 text-[#4A5B6A] leading-relaxed">
            <p>{course.aboutParagraph}</p>
            <div className="flex items-start gap-3 bg-[#f8faf9] border border-[#e2e7eb] rounded-xl p-5">
              <Lock className="h-5 w-5 text-[#7B9E8C] shrink-0 mt-0.5" />
              <p className="text-sm">
                Twój postęp w kursie (ukończone dni, odpowiedzi w quizach
                i check-inach) zapisuje się na twoim koncie, żeby kurs pamiętał,
                gdzie jesteś, a my wiedzieli, które dni działają. Osobiste
                notatki z check-inów są szyfrowane tak samo jak teksty
                w programie pisania. Żadnych narzędzi śledzących, wszystko
                możesz wyeksportować albo usunąć razem z kontem.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
