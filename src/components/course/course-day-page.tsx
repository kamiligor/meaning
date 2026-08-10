import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProgramUser } from "@/lib/program-auth";
import { courses, getCourse, getDay } from "@/lib/courses";
import { getCourseState, currentDay, isDayUnlocked } from "@/lib/course";
import { decrypt } from "@/lib/encryption";
import {
  DayView,
  type OtherCourseEntry,
  type CourseSummaryDay,
} from "@/components/course/day-view";

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
          {previousDone ? (
            <>
              {course.challengeNoun === "wyzwanie" ? "Wyzwanie" : "Praktyka"}{" "}
              z poprzedniego dnia potrzebuje całego dnia, żeby się wydarzyć.
              Ten dzień odblokuje się o 6:00 rano. Do zobaczenia.
            </>
          ) : (
            `Najpierw dzień ${day - 1}. Kurs idzie jeden dzień naraz, bez wyjątków, ale też bez pośpiechu.`
          )}
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

  // Encrypted notes: the day's own evening note and the previous day's note
  // (prefilled into the check-in textarea).
  const { data: noteRows } = await supabase
    .from("course_day_progress")
    .select("day, checkin_ciphertext, checkin_iv, checkin_salt")
    .eq("user_id", user.id)
    .eq("course_slug", course.slug)
    .in("day", [day - 1, day]);

  const noteFor = (d: number): string | null => {
    const row = noteRows?.find((r) => r.day === d);
    if (!row?.checkin_ciphertext || !row.checkin_iv || !row.checkin_salt) {
      return null;
    }
    try {
      return decrypt(row.checkin_ciphertext, row.checkin_iv, row.checkin_salt, user.id);
    } catch {
      return null;
    }
  };

  const daysNav = course.days.map(({ day: d }) => ({
    day: d,
    completed: !!state.days[d]?.completedAt,
    unlocked: isDayUnlocked(d, state.days, totalDays),
    quizPassed: !!state.days[d]?.quizPassed,
  }));

  // The person's other enrolled courses, for the sidebar shortcut and the
  // completion screen ("finish the course you already started" beats
  // "buy the program").
  const otherCourses: OtherCourseEntry[] = [];
  for (const other of courses) {
    if (other.slug === course.slug) continue;
    const otherState = await getCourseState(supabase, user.id, other.slug);
    if (!otherState.enrollment) continue;
    const otherTotal = other.days.length;
    const completedDays = Object.values(otherState.days).filter(
      (d) => d.completedAt
    ).length;
    otherCourses.push({
      name: other.name,
      path: other.path,
      continueDay: currentDay(otherState.days, otherTotal),
      completedDays,
      totalDays: otherTotal,
      finished: completedDays >= otherTotal,
    });
  }

  // "Mirror, not medal": on the completed final day, hand the person their
  // own week back — check-in answers and decrypted notes.
  let summary: CourseSummaryDay[] | null = null;
  if (day === totalDays && dayState?.completedAt) {
    const { data: rows } = await supabase
      .from("course_day_progress")
      .select("day, checkin_choice, checkin_ciphertext, checkin_iv, checkin_salt")
      .eq("user_id", user.id)
      .eq("course_slug", course.slug)
      .order("day");

    summary = (rows ?? []).map((row) => {
      const followingDay = getDay(course, row.day + 1);
      const checkinLabel =
        followingDay?.checkinAboutPrevious?.options.find(
          (o) => o.value === row.checkin_choice
        )?.label ?? null;
      let note: string | null = null;
      if (row.checkin_ciphertext && row.checkin_iv && row.checkin_salt) {
        try {
          note = decrypt(
            row.checkin_ciphertext,
            row.checkin_iv,
            row.checkin_salt,
            user.id
          );
        } catch {
          note = null;
        }
      }
      return {
        day: row.day,
        title: getDay(course, row.day)?.title ?? "",
        checkinLabel,
        note,
      };
    });
  }

  return (
    <DayView
      courseSlug={course.slug}
      day={day}
      started={!!dayState?.startedAt}
      completed={!!dayState?.completedAt}
      quizPassed={!!dayState?.quizPassed}
      checkinDone={day === 1 || !!previousDayState?.checkinChoice}
      feedbackGiven={feedbackGiven}
      nextDayUnlocked={isDayUnlocked(day + 1, state.days, totalDays)}
      baseline={{
        screenTimeMin: state.enrollment.baselineScreenTimeMin,
        pickups: state.enrollment.baselinePickups,
      }}
      daysNav={daysNav}
      otherCourses={otherCourses}
      summary={summary}
      savedNote={noteFor(day)}
    />
  );
}
