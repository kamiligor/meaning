import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProgramUser } from "@/lib/program-auth";
import { getCourse, getDay } from "@/lib/courses";
import { getCourseState, isDayUnlocked } from "@/lib/course";
import { DayView } from "@/components/course/day-view";

/** Shared day page for every mini course: auth, unlock gate, then DayView. */
export async function CourseDayPage({
  slug,
  dayParam,
}: {
  slug: string;
  dayParam: string;
}) {
  const course = getCourse(slug);
  if (!course) notFound();

  const totalDays = course.days.length;
  const day = Number(dayParam);
  if (!Number.isInteger(day) || day < 1 || day > totalDays) {
    notFound();
  }

  const { user, supabase } = await getProgramUser();
  if (!user) {
    redirect(`/login?next=${course.path}/dzien/${day}`);
  }

  const state = await getCourseState(supabase, user.id, course.slug);
  if (!state.enrollment) {
    redirect(course.path);
  }

  const content = getDay(course, day);
  if (!content) notFound();

  if (!isDayUnlocked(day, state.days, totalDays)) {
    const previousDone = !!state.days[day - 1]?.completedAt;
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#e8f0eb] mb-6">
          <Lock className="h-5 w-5 text-[#7B9E8C]" />
        </span>
        <h1 className="text-2xl font-semibold text-[#1E2A36] mb-3">
          Dzień {day} jeszcze śpi
        </h1>
        <p className="text-[#4A5B6A] leading-relaxed mb-8">
          {previousDone
            ? `${course.challengeNoun === "wyzwanie" ? "Wyzwanie" : "Praktyka"} z poprzedniego dnia potrzebuje całego dnia, żeby się wydarzyć. Ten dzień odblokuje się jutro. Do zobaczenia.`
            : `Najpierw dzień ${day - 1}. Kurs idzie jeden dzień naraz, bez wyjątków, ale też bez pośpiechu.`}
        </p>
        <Link
          href={previousDone ? course.path : `${course.path}/dzien/${day - 1}`}
        >
          <Button variant="outline">
            {previousDone ? "Wróć na stronę kursu" : `Przejdź do dnia ${day - 1}`}
          </Button>
        </Link>
      </div>
    );
  }

  // The final day shows the feedback form after the challenge; check if done.
  let feedbackGiven = false;
  if (day === totalDays) {
    const { data } = await supabase
      .from("course_feedback")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", course.slug)
      .maybeSingle();
    feedbackGiven = !!data;
  }

  const dayState = state.days[day];
  const previousDayState = state.days[day - 1];

  return (
    <DayView
      courseSlug={course.slug}
      day={day}
      started={!!dayState?.startedAt}
      completed={!!dayState?.completedAt}
      savedQuizAnswers={dayState?.quizAnswers ?? null}
      checkinDone={day === 1 || !!previousDayState?.checkinChoice}
      feedbackGiven={feedbackGiven}
      nextDayUnlocked={isDayUnlocked(day + 1, state.days, totalDays)}
      baseline={{
        screenTimeMin: state.enrollment.baselineScreenTimeMin,
        pickups: state.enrollment.baselinePickups,
      }}
    />
  );
}
