import type { SupabaseClient } from "@supabase/supabase-js";
import { courses } from "@/lib/courses";
import { courseCalendarDay } from "@/lib/course";
import {
  sendGroupTriggeredMail,
  REMINDER_GROUP_NAME,
  WINBACK_GROUP_NAME,
} from "@/lib/mailerlite";
import { SITE_HOSTS } from "@/lib/domains";

/**
 * Reminder policy (docs/content/kurs-niescrollowania.md): at most one mail
 * per day, sent when a new day unlocks; when the person goes quiet, one
 * win-back mail after a few silent days, then silence for good.
 */
const WINBACK_AFTER_DAYS = 3;

export interface ReminderEnrollmentState {
  enrolledAt: string;
  completedAt: string | null;
  lastRemindedDay: number | null;
  lastRemindedAt: string | null;
  winbackSentAt: string | null;
  /** completedAt per course day. */
  days: Record<number, string | null>;
  totalDays: number;
}

export type ReminderDecision =
  | { type: "day"; day: number }
  | { type: "winback"; day: number }
  | null;

/** Whole days between two timestamps, on the course's (Warsaw) calendar. */
function calendarDaysBetween(fromIso: string, now: Date): number {
  const from = new Date(`${courseCalendarDay(new Date(fromIso))}T00:00:00Z`);
  const to = new Date(`${courseCalendarDay(now)}T00:00:00Z`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export function decideReminder(
  state: ReminderEnrollmentState,
  now: Date = new Date()
): ReminderDecision {
  if (state.completedAt) return null;

  // The day worth reminding about: first uncompleted day whose anchor
  // (enrollment for day 1, the previous day's completion otherwise) lies on
  // an earlier calendar day — i.e. the day is unlocked and waiting.
  let dueDay: number | null = null;
  const today = courseCalendarDay(now);
  for (let day = 1; day <= state.totalDays; day++) {
    if (state.days[day]) continue;
    const anchor = day === 1 ? state.enrolledAt : state.days[day - 1];
    if (!anchor) return null;
    if (courseCalendarDay(new Date(anchor)) < today) dueDay = day;
    break;
  }
  if (dueDay === null) return null;

  // Never more than one mail per calendar day (also makes reruns idempotent).
  if (
    state.lastRemindedAt &&
    courseCalendarDay(new Date(state.lastRemindedAt)) === today
  ) {
    return null;
  }

  if (state.lastRemindedDay === dueDay && state.lastRemindedAt) {
    // Already reminded about this very day and nothing happened: the person
    // went quiet. One win-back after a few days, then we stop for good.
    if (state.winbackSentAt) return null;
    if (calendarDaysBetween(state.lastRemindedAt, now) >= WINBACK_AFTER_DAYS) {
      return { type: "winback", day: dueDay };
    }
    return null;
  }

  return { type: "day", day: dueDay };
}

interface EnrollmentRow {
  id: string;
  user_id: string;
  course_slug: string;
  enrolled_at: string;
  completed_at: string | null;
  last_reminded_day: number | null;
  last_reminded_at: string | null;
  winback_sent_at: string | null;
}

export interface ReminderRunStats {
  dayReminders: number;
  winbacks: number;
  skipped: number;
  failures: number;
}

/**
 * Daily job body: walk every reminder-enabled, unfinished enrollment, decide,
 * send via MailerLite and record the send. Runs on the service-role client.
 */
export async function runCourseReminders(
  admin: SupabaseClient,
  now: Date = new Date()
): Promise<ReminderRunStats> {
  const stats: ReminderRunStats = {
    dayReminders: 0,
    winbacks: 0,
    skipped: 0,
    failures: 0,
  };

  const { data: enrollments, error } = await admin
    .from("course_enrollments")
    .select(
      "id, user_id, course_slug, enrolled_at, completed_at, last_reminded_day, last_reminded_at, winback_sent_at"
    )
    .eq("reminders_enabled", true)
    .is("completed_at", null);

  if (error) throw new Error(`enrollments query failed: ${error.message}`);
  const rows = (enrollments ?? []) as EnrollmentRow[];
  if (rows.length === 0) return stats;

  const userIds = [...new Set(rows.map((r) => r.user_id))];

  const { data: progressRows, error: progressError } = await admin
    .from("course_day_progress")
    .select("user_id, course_slug, day, completed_at")
    .in("user_id", userIds);
  if (progressError) {
    throw new Error(`progress query failed: ${progressError.message}`);
  }

  // Emails live in auth.users; resolve them via the admin API.
  const emailByUserId = new Map<string, string>();
  let page = 1;
  for (;;) {
    const { data: userPage, error: usersError } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (usersError) throw new Error(`listUsers failed: ${usersError.message}`);
    for (const user of userPage.users) {
      if (user.email) emailByUserId.set(user.id, user.email);
    }
    if (userPage.users.length < 1000) break;
    page += 1;
  }

  const siteOrigin = `https://${SITE_HOSTS.pl}`;

  for (const row of rows) {
    const course = courses.find((c) => c.slug === row.course_slug);
    const email = emailByUserId.get(row.user_id);
    if (!course || !email) {
      stats.skipped += 1;
      continue;
    }

    const days: Record<number, string | null> = {};
    for (const progress of progressRows ?? []) {
      if (
        progress.user_id === row.user_id &&
        progress.course_slug === row.course_slug
      ) {
        days[progress.day] = progress.completed_at;
      }
    }

    const decision = decideReminder(
      {
        enrolledAt: row.enrolled_at,
        completedAt: row.completed_at,
        lastRemindedDay: row.last_reminded_day,
        lastRemindedAt: row.last_reminded_at,
        winbackSentAt: row.winback_sent_at,
        days,
        totalDays: course.days.length,
      },
      now
    );

    if (!decision) {
      stats.skipped += 1;
      continue;
    }

    const sent = await sendGroupTriggeredMail(
      email,
      decision.type === "day" ? REMINDER_GROUP_NAME : WINBACK_GROUP_NAME,
      {
        kurs_nazwa: course.name,
        kurs_dzien: decision.day,
        kurs_dni: course.days.length,
        kurs_link: `${siteOrigin}${course.path}/dzien/${decision.day}`,
      }
    );

    if (!sent) {
      stats.failures += 1;
      continue;
    }

    const update =
      decision.type === "day"
        ? {
            last_reminded_day: decision.day,
            last_reminded_at: now.toISOString(),
          }
        : {
            last_reminded_at: now.toISOString(),
            winback_sent_at: now.toISOString(),
          };
    await admin.from("course_enrollments").update(update).eq("id", row.id);

    if (decision.type === "day") stats.dayReminders += 1;
    else stats.winbacks += 1;
  }

  return stats;
}
