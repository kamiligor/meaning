import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Course pacing: a day unlocks on the next calendar day after the previous
 * one was completed. The gate is content-driven (the challenge needs a day
 * to happen), not gamification — nothing ever resets and no day expires.
 *
 * Calendar days are compared in the courses' home timezone. The courses are
 * Polish-only, so Europe/Warsaw is the least surprising choice.
 */
const COURSE_TIMEZONE = "Europe/Warsaw";

export interface CourseDayState {
  day: number;
  startedAt: string | null;
  completedAt: string | null;
  checkinChoice: string | null;
  /** First pick per quiz question — the interesting analytics signal. */
  quizFirstAttempts: number[] | null;
  /** The quiz gates day completion: true once every question was answered correctly. */
  quizPassed: boolean;
}

/**
 * quiz_answers is a JSONB column that changed shape: originally a plain
 * array of picks (quizzes could not be failed then, so an array counts as
 * passed), now `{ first: number[], passed: boolean }`.
 */
export function parseQuizAnswers(raw: unknown): {
  first: number[] | null;
  passed: boolean;
} {
  if (Array.isArray(raw)) {
    return { first: raw as number[], passed: true };
  }
  if (raw && typeof raw === "object") {
    const obj = raw as { first?: unknown; passed?: unknown };
    return {
      first: Array.isArray(obj.first) ? (obj.first as number[]) : null,
      passed: obj.passed === true,
    };
  }
  return { first: null, passed: false };
}

export interface CourseEnrollmentState {
  id: string;
  enrolledAt: string;
  completedAt: string | null;
  baselineScreenTimeMin: number | null;
  baselinePickups: number | null;
  remindersEnabled: boolean;
}

export interface CourseState {
  enrollment: CourseEnrollmentState | null;
  days: Record<number, CourseDayState>;
}

/** YYYY-MM-DD of a date in the course timezone. */
export function courseCalendarDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: COURSE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * The evening note opens at 18:00 (course timezone) on the day the challenge
 * was accepted — late enough for the day to have happened, fresh enough to
 * remember it — and stays open afterwards.
 */
export function isEveningNoteOpen(
  completedAt: string,
  now: Date = new Date()
): boolean {
  const completedDay = courseCalendarDay(new Date(completedAt));
  const today = courseCalendarDay(now);
  if (today > completedDay) return true;
  if (today < completedDay) return false;

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: COURSE_TIMEZONE,
      hour: "2-digit",
      hour12: false,
    }).format(now)
  );
  return hour >= 18;
}

export function isDayUnlocked(
  day: number,
  days: Record<number, CourseDayState>,
  totalDays: number,
  now: Date = new Date()
): boolean {
  if (day < 1 || day > totalDays) return false;
  if (day === 1) return true;

  const previous = days[day - 1];
  if (!previous?.completedAt) return false;

  return (
    courseCalendarDay(new Date(previous.completedAt)) < courseCalendarDay(now)
  );
}

/**
 * The day the participant should land on: the first unlocked, uncompleted
 * day. When everything is completed, the final day (it holds the summary).
 * When the next day exists but is still time-locked, the last completed day.
 */
export function currentDay(
  days: Record<number, CourseDayState>,
  totalDays: number,
  now: Date = new Date()
): number {
  for (let day = 1; day <= totalDays; day++) {
    if (!days[day]?.completedAt) {
      return isDayUnlocked(day, days, totalDays, now) ? day : Math.max(1, day - 1);
    }
  }
  return totalDays;
}

export async function getCourseState(
  supabase: SupabaseClient,
  userId: string,
  courseSlug: string
): Promise<CourseState> {
  const [enrollmentResult, daysResult] = await Promise.all([
    supabase
      .from("course_enrollments")
      .select(
        "id, enrolled_at, completed_at, baseline_screen_time_min, baseline_pickups, reminders_enabled"
      )
      .eq("user_id", userId)
      .eq("course_slug", courseSlug)
      .maybeSingle(),
    supabase
      .from("course_day_progress")
      .select("day, started_at, completed_at, checkin_choice, quiz_answers")
      .eq("user_id", userId)
      .eq("course_slug", courseSlug)
      .order("day"),
  ]);

  const enrollment = enrollmentResult.data
    ? {
        id: enrollmentResult.data.id,
        enrolledAt: enrollmentResult.data.enrolled_at,
        completedAt: enrollmentResult.data.completed_at,
        baselineScreenTimeMin: enrollmentResult.data.baseline_screen_time_min,
        baselinePickups: enrollmentResult.data.baseline_pickups,
        remindersEnabled: enrollmentResult.data.reminders_enabled,
      }
    : null;

  const days: Record<number, CourseDayState> = {};
  for (const row of daysResult.data ?? []) {
    const quiz = parseQuizAnswers(row.quiz_answers);
    days[row.day] = {
      day: row.day,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      checkinChoice: row.checkin_choice,
      quizFirstAttempts: quiz.first,
      quizPassed: quiz.passed,
    };
  }

  return { enrollment, days };
}
