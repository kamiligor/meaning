"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Lock, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCourse, getDay } from "@/lib/courses";
import { useCountdown } from "@/components/course/unlock-countdown";
import { CourseQuiz } from "@/components/course/course-quiz";
import { CourseCheckin } from "@/components/course/course-checkin";
import { FeedbackForm } from "@/components/course/feedback-form";
import {
  CourseOutline,
  type OutlineDayEntry,
} from "@/components/course/course-outline";

export type DayNavEntry = OutlineDayEntry;

export interface OtherCourseEntry {
  name: string;
  path: string;
  continueDay: number;
  completedDays: number;
  totalDays: number;
  finished: boolean;
}

export interface CourseSummaryDay {
  day: number;
  title: string;
  checkinLabel: string | null;
  note: string | null;
}

interface DayViewProps {
  courseSlug: string;
  day: number;
  started: boolean;
  completed: boolean;
  quizPassed: boolean;
  checkinDone: boolean;
  feedbackGiven: boolean;
  nextDayUnlocked: boolean;
  baseline: { screenTimeMin: number | null; pickups: number | null };
  daysNav: DayNavEntry[];
  otherCourses: OtherCourseEntry[];
  /** "Mirror" data for the completed final day. */
  summary: CourseSummaryDay[] | null;
  /** The day's own saved note (decrypted server-side). */
  savedNote: string | null;
  /** Previous day's note, prefilled into the check-in textarea. */
  previousNote: string | null;
}

type Step = "knowledge" | "quiz" | "challenge";

async function putDay(body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/api/course/day", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * The day's notebook: open as soon as the challenge is accepted, so moments
 * can be jotted down live during the day (or in the evening, both work).
 */
function DayNote({
  courseSlug,
  day,
  savedNote,
  eveningPrompt,
}: {
  courseSlug: string;
  day: number;
  savedNote: string | null;
  eveningPrompt?: string;
}) {
  const [note, setNote] = useState(savedNote ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const ok = await putDay({ courseSlug, day, note });
    if (ok) {
      setSavedAt(1);
    } else {
      setError("Nie udało się zapisać. Sprawdź połączenie i spróbuj ponownie.");
    }
    setSaving(false);
  };

  return (
    <section className="mb-10">
      <div className="bg-[#f8faf9] border border-[#e2e7eb] rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Moon className="h-5 w-5 text-[#7B9E8C] shrink-0 mt-0.5" />
          <div className="flex-1">
            {eveningPrompt && (
              <p className="text-sm text-[#4A5B6A] leading-relaxed mb-3">
                {eveningPrompt}
              </p>
            )}
            <label className="block">
              <span className="text-sm font-medium text-[#1E2A36]">
                Notatnik tego dnia (opcjonalnie)
              </span>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setSavedAt(null);
                }}
                rows={3}
                maxLength={2000}
                placeholder="Dopisuj w ciągu dnia, kiedy coś zauważysz, albo wróć wieczorem."
                className="mt-2 w-full border border-[#e2e7eb] rounded-lg px-4 py-2.5 text-sm text-[#1E2A36] placeholder:text-[#8A99A8] bg-white focus:outline-none focus:ring-2 focus:ring-[#7B9E8C] focus:ring-offset-1 resize-none"
              />
            </label>
            <div className="flex items-center justify-between gap-3 mt-2">
              <span className="text-xs text-[#8A99A8]">
                Ta notatka jest szyfrowana i wraca do ciebie w podsumowaniu
                kursu.
              </span>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || (note === (savedNote ?? "") && !savedAt)}
              >
                {saving ? "Zapisywanie..." : savedAt ? "Zapisano" : "Zapisz"}
              </Button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Clickable day navigation: done and unlocked days link, locked ones don't. */
function DayChips({
  coursePath,
  current,
  daysNav,
}: {
  coursePath: string;
  current: number;
  daysNav: DayNavEntry[];
}) {
  return (
    <nav aria-label="Dni kursu" className="flex items-center gap-2 mb-4 flex-wrap">
      {daysNav.map(({ day, completed, unlocked }) => {
        const isCurrent = day === current;
        const clickable = (completed || unlocked) && !isCurrent;

        const chip = (
          <span
            className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold transition-colors ${
              isCurrent
                ? "bg-[#1E2A36] text-white"
                : completed
                  ? "bg-[#7B9E8C] text-white"
                  : unlocked
                    ? "bg-[#e8f0eb] text-[#7B9E8C]"
                    : "bg-[#F1F4F6] text-[#c5cdd4]"
            } ${clickable ? "hover:ring-2 hover:ring-[#7B9E8C]" : ""}`}
            aria-label={`Dzień ${day}${completed ? ", ukończony" : unlocked ? "" : ", zablokowany"}`}
          >
            {completed && !isCurrent ? (
              <Check className="h-4 w-4" strokeWidth={2.5} />
            ) : !unlocked && !completed ? (
              <Lock className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              day
            )}
          </span>
        );

        return clickable ? (
          <Link key={day} href={`${coursePath}/dzien/${day}`}>
            {chip}
          </Link>
        ) : (
          <span key={day}>{chip}</span>
        );
      })}
    </nav>
  );
}

/** Breadcrumb of the in-day steps; earlier steps are clickable to go back. */
function StepIndicator({
  labels,
  step,
  onStepClick,
}: {
  labels: Record<Step, string>;
  step: Step;
  onStepClick: (step: Step) => void;
}) {
  const order: Step[] = ["knowledge", "quiz", "challenge"];
  const activeIdx = order.indexOf(step);

  return (
    <ol className="flex items-center gap-2 text-sm mb-8">
      {order.map((s, idx) => (
        <li key={s} className="flex items-center gap-2">
          {idx > 0 && <span className="text-[#c5cdd4]">→</span>}
          {idx < activeIdx ? (
            <button
              type="button"
              onClick={() => onStepClick(s)}
              className="text-[#7B9E8C] hover:underline"
            >
              {labels[s]}
            </button>
          ) : (
            <span
              className={
                idx === activeIdx ? "font-semibold text-[#1E2A36]" : "text-[#8A99A8]"
              }
            >
              {labels[s]}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function DayView({
  courseSlug,
  day,
  started,
  completed: initialCompleted,
  quizPassed: initialQuizPassed,
  checkinDone: initialCheckinDone,
  feedbackGiven: initialFeedbackGiven,
  nextDayUnlocked,
  baseline,
  daysNav,
  otherCourses,
  summary,
  savedNote,
  previousNote,
}: DayViewProps) {
  const router = useRouter();
  const course = getCourse(courseSlug);
  const content = course ? getDay(course, day) : null;

  const [checkinDone, setCheckinDone] = useState(initialCheckinDone);
  const [completed, setCompleted] = useState(initialCompleted);
  const midnightLeft = useCountdown();
  const [quizPassed, setQuizPassed] = useState(initialQuizPassed);
  const [feedbackGiven, setFeedbackGiven] = useState(initialFeedbackGiven);
  const [step, setStep] = useState<Step>(initialQuizPassed ? "challenge" : "knowledge");
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");
  const startSent = useRef(started);

  useEffect(() => {
    if (!startSent.current) {
      startSent.current = true;
      void putDay({ courseSlug, day, start: true });
    }
  }, [courseSlug, day]);

  if (!course || !content) return null;

  const totalDays = course.days.length;
  const isFinalDay = day === totalDays;
  const isChallenge = course.challengeNoun === "wyzwanie";
  const challengeHeading = isChallenge ? "Wyzwanie dnia" : "Praktyka dnia";
  const stepLabels: Record<Step, string> = {
    knowledge: "Wiedza",
    quiz: "Quiz",
    challenge: isChallenge ? "Wyzwanie" : "Praktyka",
  };
  const acceptLabel =
    content.challenge.acceptLabel ??
    (isChallenge ? "Przyjmuję wyzwanie na dziś" : "Przyjmuję praktykę na dziś");
  const doneLabel = isChallenge ? "Wyzwanie przyjęte" : "Praktyka przyjęta";

  const handleQuizPassed = (firstAttempts: number[]) => {
    setQuizPassed(true);
    void putDay({ courseSlug, day, quizAnswers: firstAttempts, quizPassed: true });
  };

  const handleComplete = async () => {
    setCompleting(true);
    setError("");
    const ok = await putDay({ courseSlug, day, complete: true });
    if (ok) {
      setCompleted(true);
    } else {
      setError("Nie udało się zapisać. Sprawdź połączenie i spróbuj ponownie.");
    }
    setCompleting(false);
  };

  const knowledgeSection = (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-4">
        Dawka wiedzy
      </h2>
      <div className="space-y-4">
        {content.knowledge.map((paragraph, idx) => (
          <p key={idx} className="text-[#4A5B6A] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );

  const baselineSection = isFinalDay &&
    (baseline.screenTimeMin !== null || baseline.pickups !== null) && (
      <section className="mb-10">
        <div className="bg-[#f8faf9] border border-[#e2e7eb] rounded-xl p-5">
          <h3 className="font-medium text-[#1E2A36] mb-2">
            Twoje liczby z dnia zapisu
          </h3>
          <p className="text-sm text-[#4A5B6A] leading-relaxed">
            {baseline.screenTimeMin !== null && (
              <>Czas ekranowy: około {baseline.screenTimeMin} minut dziennie. </>
            )}
            {baseline.pickups !== null && (
              <>Podniesienia telefonu: około {baseline.pickups} dziennie. </>
            )}
            Zajrzyj teraz do ustawień i porównaj. Nie chodzi o ocenę, tylko
            o to, czy coś się ruszyło.
          </p>
        </div>
      </section>
    );

  const challengeSection = (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-4">
        {challengeHeading}
      </h2>
      <div className="bg-white border border-[#e2e7eb] border-t-2 border-t-[#7B9E8C] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#1E2A36] mb-4">
          {content.challenge.lead}
        </h3>
        <div className="space-y-3 mb-4">
          {content.challenge.body.map((paragraph, idx) => (
            <p key={idx} className="text-[#4A5B6A] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="text-sm text-[#8A99A8] leading-relaxed mb-6">
          {content.challenge.minimal}
        </p>

        {!completed ? (
          <>
            <Button onClick={handleComplete} disabled={completing} className="w-full">
              {completing ? "Zapisywanie..." : acceptLabel}
            </Button>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </>
        ) : (
          <div className="flex items-center gap-2 text-[#7B9E8C] font-medium">
            <Check className="h-5 w-5" strokeWidth={2.5} />
            <span>{isFinalDay ? "Kurs ukończony" : doneLabel}</span>
          </div>
        )}
      </div>
    </section>
  );

  const afterCompletion = completed && (
    <>
      <DayNote
        courseSlug={courseSlug}
        day={day}
        savedNote={savedNote}
        eveningPrompt={content.challenge.evening}
      />

      {!isFinalDay &&
        (nextDayUnlocked ? (
          <section className="mb-10 text-center">
            <p className="text-[#1E2A36] font-medium mb-4">
              Dzień {day} z {totalDays} za tobą.
            </p>
            <Link href={`${course.path}/dzien/${day + 1}`}>
              <Button variant="outline">Przejdź do dnia {day + 1}</Button>
            </Link>
          </section>
        ) : (
          <section className="mb-10 text-center">
            <p className="text-[#1E2A36] font-medium mb-2">
              Dzień {day} z {totalDays} za tobą.
            </p>
            <p className="text-[#4A5B6A] leading-relaxed">
              Dzień {day + 1} odblokuje się jutro
              {midnightLeft ? ` (za ${midnightLeft})` : ""}.{" "}
              {isChallenge
                ? "Dziś zostało już tylko wyzwanie"
                : "Dziś została już tylko praktyka"}
              , reszta dzieje się poza ekranem.
            </p>
          </section>
        ))}

      {isFinalDay && !feedbackGiven && (
        <FeedbackForm
          courseSlug={courseSlug}
          totalDays={totalDays}
          onDone={() => {
            setFeedbackGiven(true);
            router.refresh();
          }}
        />
      )}

      {isFinalDay && feedbackGiven && (
        <section className="text-center bg-[#f0f7f2] border border-[#c5d8cc] rounded-xl p-8 mb-10">
          <h3 className="text-lg font-semibold text-[#1E2A36] mb-2">
            Dziękujemy za te {totalDays === 5 ? "pięć" : "siedem"} dni
          </h3>
          {otherCourses.some((c) => !c.finished) ? (
            <>
              <p className="text-[#4A5B6A] leading-relaxed mb-6 max-w-md mx-auto">
                Masz jeszcze w toku drugi kurs. Najlepszy następny krok to
                dokończyć to, co już się zaczęło.
              </p>
              <div className="flex flex-col items-center gap-3">
                {otherCourses
                  .filter((c) => !c.finished)
                  .map((c) => (
                    <Link key={c.path} href={`${c.path}/dzien/${c.continueDay}`}>
                      <Button>
                        {c.name}: dzień {c.continueDay} z {c.totalDays}
                      </Button>
                    </Link>
                  ))}
                <Link
                  href="/program"
                  className="text-sm text-[#7B9E8C] hover:underline"
                >
                  Albo zobacz The Life Writing Program
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-[#4A5B6A] leading-relaxed mb-6 max-w-md mx-auto">
                Jeśli w trakcie kursu wypłynęło coś, co chcesz naprawdę
                rozpakować, od tego jest The Life Writing Program: ta sama
                uważność na własne życie, tylko rozpisana na konkretne pytania,
                z piórem w ręku.
              </p>
              <Link href="/program">
                <Button>Zobacz The Life Writing Program</Button>
              </Link>
            </>
          )}
        </section>
      )}

      {/* Mirror, not medal: the person's own week, handed back */}
      {isFinalDay && summary && summary.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-4">
            Twój tydzień w tym kursie
          </h2>
          <div className="space-y-3">
            {summary.map((entry) => (
              <div
                key={entry.day}
                className="bg-white border border-[#e2e7eb] rounded-xl px-5 py-4"
              >
                <p className="font-medium text-[#1E2A36]">
                  Dzień {entry.day}: {entry.title}
                </p>
                {entry.checkinLabel && (
                  <p className="text-sm text-[#4A5B6A] mt-1">
                    Jak poszło: {entry.checkinLabel}
                  </p>
                )}
                {entry.note && (
                  <p className="text-sm text-[#4A5B6A] italic mt-1.5 border-l-2 border-[#c5d8cc] pl-3">
                    {entry.note}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#8A99A8] mt-3 leading-relaxed">
            Notatki widzisz tylko ty, są odszyfrowywane na twoje konto.
            Zostają tu, możesz wracać.
          </p>
        </section>
      )}
    </>
  );

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 lg:items-start">
      {/* Sticky course outline (desktop) */}
      <aside className="hidden lg:block sticky top-8">
        <CourseOutline
          course={course}
          currentDay={day}
          daysNav={daysNav}
          live={{ quizPassed, completed, step }}
          onStepSelect={(s) => !completed && setStep(s)}
          otherCourses={otherCourses}
        />
      </aside>

      <div className="max-w-2xl">
      {/* Day header; compact day chips only where the sidebar is hidden */}
      <div className="mb-8">
        <div className="lg:hidden">
          <DayChips coursePath={course.path} current={day} daysNav={daysNav} />
        </div>
        <p className="text-xs text-[#7B9E8C] font-medium uppercase tracking-wider mb-1">
          Dzień {day} z {totalDays}
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1E2A36]">
          {content.title}
        </h1>
      </div>

      {/* Check-in about yesterday gates the rest of the day. */}
      {!checkinDone && content.checkinAboutPrevious && (
        <CourseCheckin
          courseSlug={courseSlug}
          day={day}
          checkin={content.checkinAboutPrevious}
          initialNote={previousNote}
          onDone={() => setCheckinDone(true)}
        />
      )}

      {checkinDone && completed && (
        /* A finished day reads as one page — no steps on revisits. */
        <>
          {knowledgeSection}
          <section className="mb-10">
            <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-4">
              Quiz (zaliczony)
            </h2>
            <CourseQuiz questions={content.quiz} mode="review" />
          </section>
          {baselineSection}
          {challengeSection}
          {afterCompletion}
        </>
      )}

      {checkinDone && !completed && (
        <>
          <div className="lg:hidden">
            <StepIndicator labels={stepLabels} step={step} onStepClick={setStep} />
          </div>

          {step === "knowledge" && (
            <>
              {knowledgeSection}
              <Button onClick={() => setStep("quiz")} className="w-full">
                Przejdź do quizu
              </Button>
            </>
          )}

          {step === "quiz" && (
            <>
              <section className="mb-8">
                <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-4">
                  {day === 1 ? "Szybki quiz (bez punktów, obiecujemy)" : "Szybki quiz"}
                </h2>
                {quizPassed ? (
                  <CourseQuiz questions={content.quiz} mode="review" />
                ) : (
                  <CourseQuiz
                    questions={content.quiz}
                    mode="solve"
                    onPassed={handleQuizPassed}
                  />
                )}
              </section>
              {quizPassed && (
                <div className="text-center mb-8">
                  <p className="text-[#7B9E8C] font-medium mb-4 flex items-center justify-center gap-2">
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                    Quiz zaliczony
                  </p>
                  <Button onClick={() => setStep("challenge")} className="w-full">
                    {isChallenge
                      ? "Przejdź do wyzwania"
                      : "Przejdź do praktyki"}
                  </Button>
                </div>
              )}
            </>
          )}

          {step === "challenge" && (
            <>
              {baselineSection}
              {challengeSection}
              {afterCompletion}
            </>
          )}
        </>
      )}
      </div>
    </div>
  );
}
