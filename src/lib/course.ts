import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Course pacing: a day unlocks at 06:00 on the day after the previous one
 * was STARTED (and only once that day is closed) — mornings, not midnights,
 * because a course about healthy phone habits should not invite opening it
 * at 00:01, and anchoring to the start means closing a day the next morning
 * (after a full day of practice) never pushes the course back. The gate is
 * content-driven (the challenge needs a day to happen), not gamification —
 * nothing ever resets and no day expires. The 06:00 gate applies only to
 * that first morning; once a day has been open, it never re-locks.
 *
 * Calendar days are compared in the courses' home timezone. The courses are
 * Polish-only, so Europe/Warsaw is the least surprising choice.
 */
const COURSE_TIMEZONE = "Europe/Warsaw";

export const COURSE_UNLOCK_HOUR = 6;

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

function hourInCourseTimezone(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: COURSE_TIMEZONE,
      hour: "2-digit",
      hour12: false,
    }).format(date)
  );
}

/** Whole calendar days between two YYYY-MM-DD strings. */
function calendarDaysApart(from: string, to: string): number {
  return Math.round(
    (new Date(`${to}T00:00:00Z`).getTime() -
      new Date(`${from}T00:00:00Z`).getTime()) /
      86_400_000
  );
}

/**
 * Whether "the morning after" an anchor moment has arrived: at least the
 * next calendar day, and past 06:00 if it is that first day. Shared by the
 * unlock logic and the reminder job so mail never points at a sleeping day.
 */
export function isMorningGateOpen(
  anchorIso: string,
  now: Date = new Date()
): boolean {
  const anchorDay = courseCalendarDay(new Date(anchorIso));
  const today = courseCalendarDay(now);
  const daysApart = calendarDaysApart(anchorDay, today);

  if (daysApart < 1) return false;
  // First morning after the anchor: the gate opens at 06:00, not at midnight.
  if (daysApart === 1 && hourInCourseTimezone(now) < COURSE_UNLOCK_HOUR) {
    return false;
  }
  return true;
}

export function isDayUnlocked(
  day: number,
  days: Record<number, CourseDayState>,
  totalDays: number,
  now: Date = new Date()
): boolean {
  if (day < 1 || day > totalDays) return false;
  // A finished day stays viewable at any hour.
  if (days[day]?.completedAt) return true;
  if (day === 1) return true;

  const previous = days[day - 1];
  // The previous day is "ready" once its quiz is passed. Closing it with the
  // "Zakończ dzień" button is a nice ending, not a gate: people practise in
  // the evening and go to sleep, and the next morning must not greet them
  // with a locked day because of a button they did not press.
  if (!previous || !(previous.completedAt || previous.quizPassed)) return false;

  // The clock hangs off when the previous day was STARTED, not closed:
  // its challenge runs during that day, so closing it the next morning
  // (after the night's worth of practice) must not push everything back.
  const anchor = previous.startedAt ?? previous.completedAt;
  if (!anchor) return false;
  return isMorningGateOpen(anchor, now);
}

export type UnlockStatus =
  | "open"
  | "today"
  | "tomorrow"
  | "previous_incomplete"
  | "none";

/**
 * When a given day opens, for copy like "otworzy się jutro o 6:00".
 * "today" means the gate is the coming 06:00 of the current calendar day;
 * "tomorrow" means 06:00 on the next one.
 */
export function unlockStatus(
  day: number,
  days: Record<number, CourseDayState>,
  totalDays: number,
  now: Date = new Date()
): UnlockStatus {
  if (day < 1 || day > totalDays) return "none";
  if (isDayUnlocked(day, days, totalDays, now)) return "open";

  const previous = days[day - 1];
  const anchor = previous?.startedAt ?? previous?.completedAt ?? null;
  if (!previous || !(previous.completedAt || previous.quizPassed) || !anchor) {
    return "previous_incomplete";
  }
  const anchorDay = courseCalendarDay(new Date(anchor));
  return anchorDay === courseCalendarDay(now) ? "tomorrow" : "today";
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
