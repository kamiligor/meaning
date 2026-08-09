"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCourse, getDay } from "@/lib/courses";
import { CourseQuiz } from "@/components/course/course-quiz";
import { CourseCheckin } from "@/components/course/course-checkin";
import { FeedbackForm } from "@/components/course/feedback-form";

interface DayViewProps {
  courseSlug: string;
  day: number;
  started: boolean;
  completed: boolean;
  savedQuizAnswers: number[] | null;
  checkinDone: boolean;
  feedbackGiven: boolean;
  nextDayUnlocked: boolean;
  baseline: { screenTimeMin: number | null; pickups: number | null };
}

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

export function DayView({
  courseSlug,
  day,
  started,
  completed: initialCompleted,
  savedQuizAnswers,
  checkinDone: initialCheckinDone,
  feedbackGiven: initialFeedbackGiven,
  nextDayUnlocked,
  baseline,
}: DayViewProps) {
  const router = useRouter();
  const course = getCourse(courseSlug);
  const content = course ? getDay(course, day) : null;

  const [checkinDone, setCheckinDone] = useState(initialCheckinDone);
  const [completed, setCompleted] = useState(initialCompleted);
  const [feedbackGiven, setFeedbackGiven] = useState(initialFeedbackGiven);
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
  const acceptLabel =
    content.challenge.acceptLabel ??
    (isChallenge ? "Przyjmuję wyzwanie na dziś" : "Przyjmuję praktykę na dziś");
  const doneLabel = isChallenge ? "Wyzwanie przyjęte" : "Praktyka przyjęta";

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

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      {/* Day header */}
      <div className="mb-8">
        <div
          className="flex items-center gap-2 mb-3"
          aria-label={`Dzień ${day} z ${totalDays}`}
        >
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
            <span
              key={d}
              className={`h-1.5 rounded-full transition-colors ${
                d < day
                  ? "w-6 bg-[#c5d8cc]"
                  : d === day
                    ? "w-10 bg-[#7B9E8C]"
                    : "w-6 bg-[#e2e7eb]"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[#7B9E8C] font-medium uppercase tracking-wider mb-1">
          Dzień {day} z {totalDays}
        </p>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1E2A36]">
            {content.title}
          </h1>
          <nav className="flex items-center gap-3 text-sm shrink-0">
            {day > 1 && (
              <Link
                href={`${course.path}/dzien/${day - 1}`}
                className="text-[#7B9E8C] hover:underline whitespace-nowrap"
              >
                ← Dzień {day - 1}
              </Link>
            )}
            {!isFinalDay && nextDayUnlocked && (
              <Link
                href={`${course.path}/dzien/${day + 1}`}
                className="text-[#7B9E8C] hover:underline whitespace-nowrap"
              >
                Dzień {day + 1} →
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Check-in about yesterday gates the rest of the day: one click, then everything opens. */}
      {!checkinDone && content.checkinAboutPrevious && (
        <CourseCheckin
          courseSlug={courseSlug}
          day={day}
          checkin={content.checkinAboutPrevious}
          onDone={() => setCheckinDone(true)}
        />
      )}

      {checkinDone && (
        <>
          {/* Knowledge */}
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

          {/* Quiz */}
          <section className="mb-10">
            <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-4">
              Szybki quiz (bez punktów, obiecujemy)
            </h2>
            <CourseQuiz
              questions={content.quiz}
              savedAnswers={savedQuizAnswers}
              onFinished={(answers) =>
                void putDay({ courseSlug, day, quizAnswers: answers })
              }
            />
          </section>

          {/* Final day: baseline summary (only for courses that collected one) */}
          {isFinalDay &&
            (baseline.screenTimeMin !== null || baseline.pickups !== null) && (
              <section className="mb-10">
                <div className="bg-[#f8faf9] border border-[#e2e7eb] rounded-xl p-5">
                  <h3 className="font-medium text-[#1E2A36] mb-2">
                    Twoje liczby z dnia zapisu
                  </h3>
                  <p className="text-sm text-[#4A5B6A] leading-relaxed">
                    {baseline.screenTimeMin !== null && (
                      <>
                        Czas ekranowy: około {baseline.screenTimeMin} minut
                        dziennie.{" "}
                      </>
                    )}
                    {baseline.pickups !== null && (
                      <>Podniesienia telefonu: około {baseline.pickups} dziennie. </>
                    )}
                    Zajrzyj teraz do ustawień i porównaj. Nie chodzi o ocenę,
                    tylko o to, czy coś się ruszyło.
                  </p>
                </div>
              </section>
            )}

          {/* Challenge */}
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
                  <Button
                    onClick={handleComplete}
                    disabled={completing}
                    className="w-full"
                  >
                    {completing ? "Zapisywanie..." : acceptLabel}
                  </Button>
                  {error && (
                    <p className="text-red-500 text-xs mt-2">{error}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-[#7B9E8C] font-medium">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                  <span>{isFinalDay ? "Kurs ukończony" : doneLabel}</span>
                </div>
              )}
            </div>
          </section>

          {/* After completing the day */}
          {completed && (
            <>
              {content.challenge.evening && (
                <section className="mb-10">
                  <div className="flex items-start gap-3 bg-[#f8faf9] border border-[#e2e7eb] rounded-xl p-5">
                    <Moon className="h-5 w-5 text-[#7B9E8C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#4A5B6A] leading-relaxed">
                      {content.challenge.evening}
                    </p>
                  </div>
                </section>
              )}

              {!isFinalDay &&
                (nextDayUnlocked ? (
                  <section className="mb-10 text-center">
                    <Link href={`${course.path}/dzien/${day + 1}`}>
                      <Button variant="outline">
                        Przejdź do dnia {day + 1}
                      </Button>
                    </Link>
                  </section>
                ) : (
                  <section className="mb-10 text-center">
                    <p className="text-[#4A5B6A] leading-relaxed">
                      Dzień {day + 1} odblokuje się jutro.{" "}
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
                  onDone={() => {
                    setFeedbackGiven(true);
                    router.refresh();
                  }}
                />
              )}

              {isFinalDay && feedbackGiven && (
                <section className="text-center bg-[#f0f7f2] border border-[#c5d8cc] rounded-xl p-8">
                  <h3 className="text-lg font-semibold text-[#1E2A36] mb-2">
                    Dziękujemy za te {totalDays === 5 ? "pięć" : "siedem"} dni
                  </h3>
                  <p className="text-[#4A5B6A] leading-relaxed mb-6 max-w-md mx-auto">
                    Jeśli w trakcie kursu wypłynęło coś, co chcesz naprawdę
                    rozpakować, od tego jest The Life Writing Program: ta sama
                    uważność na własne życie, tylko rozpisana na konkretne
                    pytania, z piórem w ręku.
                  </p>
                  <Link href="/program">
                    <Button>Zobacz The Life Writing Program</Button>
                  </Link>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
