import type { SupabaseClient } from "@supabase/supabase-js";
import { courseCalendarDay } from "@/lib/course";
import { ANALYTICS_RETENTION_DAYS } from "@/lib/analytics";

/**
 * Nightly analytics aggregate. Spec: docs/specs/tracking-analytics.md,
 * sections 5, 6, 7, and docs/specs/tracking-analytics/zalacznik-backend.md.
 *
 * Reads raw `analytics_events` plus the course/like tables that already hold
 * their own timestamps (no duplicate events for those, see the appendix's
 * "key decision"), groups everything by calendar day in Europe/Warsaw, and
 * upserts the result into `analytics_daily_stats`. `computeDayMetrics` is
 * exported on its own so `analytics-stats.ts` can reuse the exact same
 * logic to fill in "today", which never has a row in the aggregate table
 * yet (the cron only ever aggregates the day that just closed).
 */

const WARSAW_TZ = "Europe/Warsaw";

// ---------------------------------------------------------------------------
// Calendar-day helpers. `courseCalendarDay` (src/lib/course.ts) already turns
// an instant into a YYYY-MM-DD string for Europe/Warsaw; everything else
// here is about the reverse direction (day -> UTC instant), which the course
// module never needed.
// ---------------------------------------------------------------------------

/** Today's calendar day in Europe/Warsaw, as YYYY-MM-DD. */
export function warsawToday(now: Date = new Date()): string {
  return courseCalendarDay(now);
}

/** Add (or, with a negative delta, subtract) whole calendar days to YYYY-MM-DD. */
export function addDays(day: string, delta: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

/**
 * How far `timeZone` sits from UTC at `instant`, in milliseconds (positive
 * east of Greenwich). Standard technique: format the instant in the target
 * zone, reinterpret those wall-clock fields as if they were UTC, and diff
 * against the real instant.
 */
function offsetMsAt(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
  return asUtc - instant.getTime();
}

/**
 * The UTC instant of 00:00:00 on `day` (YYYY-MM-DD) in Europe/Warsaw. Exact
 * for day boundaries: Poland's DST transitions happen at 02:00/03:00 local
 * time, never at midnight, so the offset never changes between the guess and
 * the real instant here.
 */
export function dayStartUtc(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, 0, 0, 0);
  const offset = offsetMsAt(new Date(guess), WARSAW_TZ);
  return new Date(guess - offset);
}

/** [start, end) instants in UTC that cover the whole calendar day in Warsaw. */
export function dayBoundsUtc(day: string): { startIso: string; endIso: string } {
  return {
    startIso: dayStartUtc(day).toISOString(),
    endIso: dayStartUtc(addDays(day, 1)).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Pure grouping. No DB, no dates beyond what the caller already filtered by —
// this is what the tests exercise directly.
// ---------------------------------------------------------------------------

export interface MetricRow {
  metric: string;
  dimension: string;
  locale: string;
  extra: string;
  count: number;
  uniqueCount: number;
}

/**
 * Groups `rows` by (dimension, locale, extra) and counts both the rows and
 * the distinct identities within each group. Rows whose identity is not
 * determinable (e.g. an anonymized event: account deleted, hash never
 * stored for a login) each count as their own, distinct visitor, so a
 * missing identity never collapses several different people into one.
 */
export function groupCounts<T>(
  metric: string,
  rows: T[],
  keyFn: (row: T) => { dimension: string; locale: string; extra: string },
  idFn: (row: T, index: number) => string | null
): MetricRow[] {
  const groups = new Map<
    string,
    { dimension: string; locale: string; extra: string; count: number; uniques: Set<string> }
  >();

  rows.forEach((row, index) => {
    const key = keyFn(row);
    const mapKey = `${key.dimension} ${key.locale} ${key.extra}`;
    let group = groups.get(mapKey);
    if (!group) {
      group = { ...key, count: 0, uniques: new Set() };
      groups.set(mapKey, group);
    }
    group.count += 1;
    group.uniques.add(idFn(row, index) ?? `anon-${index}`);
  });

  return [...groups.values()].map(({ dimension, locale, extra, count, uniques }) => ({
    metric,
    dimension,
    locale,
    extra,
    count,
    uniqueCount: uniques.size,
  }));
}

// ---------------------------------------------------------------------------
// DB reads for one calendar day.
// ---------------------------------------------------------------------------

interface AuthUserSummary {
  id: string;
  createdAt: string | null;
  lastSignInAt: string | null;
}

/** Every account, paginated like src/lib/course-reminders.ts. */
async function listAllUsers(admin: SupabaseClient): Promise<AuthUserSummary[]> {
  const users: AuthUserSummary[] = [];
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    for (const user of data.users) {
      users.push({
        id: user.id,
        createdAt: user.created_at ?? null,
        lastSignInAt: user.last_sign_in_at ?? null,
      });
    }
    if (data.users.length < 1000) break;
    page += 1;
  }
  return users;
}

interface EventRow {
  event_type: string;
  target_id: string | null;
  locale: string | null;
  user_id: string | null;
  visitor_hash: string | null;
}

interface CourseSlugRow {
  user_id: string;
  course_slug: string;
}

interface CourseDayRow {
  user_id: string;
  course_slug: string;
  day: number;
}

interface CourseFeedbackRow {
  user_id: string;
  course_slug: string;
  rating: string;
}

interface PostLikeRow {
  user_id: string;
  target_id: string;
}

/**
 * Every metric for a single calendar day, freshly computed from the source
 * tables. Used both by the nightly upsert (`runDailyAggregate`) and, live,
 * by `getStats` for "today" — the one day the aggregate table never has yet.
 */
export async function computeDayMetrics(
  admin: SupabaseClient,
  day: string
): Promise<MetricRow[]> {
  const { startIso, endIso } = dayBoundsUtc(day);
  const rows: MetricRow[] = [];
  const identity = (r: { user_id: string | null; visitor_hash: string | null }) =>
    r.user_id ?? r.visitor_hash ?? null;

  // post_view, post_read, login — raw beacon/server events.
  const { data: eventRows, error: eventsError } = await admin
    .from("analytics_events")
    .select("event_type, target_id, locale, user_id, visitor_hash")
    .in("event_type", ["post_view", "post_read", "login"])
    .gte("occurred_at", startIso)
    .lt("occurred_at", endIso);
  if (eventsError) throw new Error(`analytics_events query failed: ${eventsError.message}`);
  const events = (eventRows ?? []) as EventRow[];

  rows.push(
    ...groupCounts(
      "post_view",
      events.filter((r) => r.event_type === "post_view"),
      (r) => ({ dimension: r.target_id ?? "", locale: r.locale ?? "", extra: "" }),
      identity
    ),
    ...groupCounts(
      "post_read",
      events.filter((r) => r.event_type === "post_read"),
      (r) => ({ dimension: r.target_id ?? "", locale: r.locale ?? "", extra: "" }),
      identity
    ),
    // login without a user_id cannot happen (recordEvent requires a session
    // for it), but filter defensively rather than trust that invariant here.
    ...groupCounts(
      "login",
      events.filter((r) => r.event_type === "login" && r.user_id),
      () => ({ dimension: "", locale: "", extra: "" }),
      (r) => r.user_id
    )
  );

  // new_accounts, active_7d, active_30d — all read off auth.users once.
  const users = await listAllUsers(admin);
  const newAccounts = users.filter(
    (u) => u.createdAt !== null && u.createdAt >= startIso && u.createdAt < endIso
  );
  rows.push({
    metric: "new_accounts",
    dimension: "",
    locale: "",
    extra: "",
    count: newAccounts.length,
    uniqueCount: newAccounts.length,
  });

  const dayEndMs = new Date(endIso).getTime();
  const activeWindow = (windowDays: number) => {
    const start = new Date(dayEndMs - windowDays * 86_400_000).toISOString();
    return users.filter(
      (u) => u.lastSignInAt !== null && u.lastSignInAt >= start && u.lastSignInAt < endIso
    ).length;
  };
  const active7 = activeWindow(7);
  rows.push({
    metric: "active_7d",
    dimension: "",
    locale: "",
    extra: "",
    count: active7,
    uniqueCount: active7,
  });
  const active30 = activeWindow(30);
  rows.push({
    metric: "active_30d",
    dimension: "",
    locale: "",
    extra: "",
    count: active30,
    uniqueCount: active30,
  });

  // course_enroll / course_complete — from course_enrollments' own timestamps.
  const { data: enrolledRows, error: enrolledError } = await admin
    .from("course_enrollments")
    .select("user_id, course_slug")
    .gte("enrolled_at", startIso)
    .lt("enrolled_at", endIso);
  if (enrolledError) {
    throw new Error(`course_enrollments (enrolled) query failed: ${enrolledError.message}`);
  }
  rows.push(
    ...groupCounts(
      "course_enroll",
      (enrolledRows ?? []) as CourseSlugRow[],
      (r) => ({ dimension: r.course_slug, locale: "", extra: "" }),
      (r) => r.user_id
    )
  );

  const { data: completedRows, error: completedError } = await admin
    .from("course_enrollments")
    .select("user_id, course_slug")
    .gte("completed_at", startIso)
    .lt("completed_at", endIso);
  if (completedError) {
    throw new Error(`course_enrollments (completed) query failed: ${completedError.message}`);
  }
  rows.push(
    ...groupCounts(
      "course_complete",
      (completedRows ?? []) as CourseSlugRow[],
      (r) => ({ dimension: r.course_slug, locale: "", extra: "" }),
      (r) => r.user_id
    )
  );

  // course_day_start / course_day_complete — from course_day_progress.
  const { data: dayStartRows, error: dayStartError } = await admin
    .from("course_day_progress")
    .select("user_id, course_slug, day")
    .gte("started_at", startIso)
    .lt("started_at", endIso);
  if (dayStartError) {
    throw new Error(`course_day_progress (started) query failed: ${dayStartError.message}`);
  }
  rows.push(
    ...groupCounts(
      "course_day_start",
      (dayStartRows ?? []) as CourseDayRow[],
      (r) => ({ dimension: r.course_slug, locale: "", extra: String(r.day) }),
      (r) => r.user_id
    )
  );

  const { data: dayCompleteRows, error: dayCompleteError } = await admin
    .from("course_day_progress")
    .select("user_id, course_slug, day")
    .gte("completed_at", startIso)
    .lt("completed_at", endIso);
  if (dayCompleteError) {
    throw new Error(`course_day_progress (completed) query failed: ${dayCompleteError.message}`);
  }
  rows.push(
    ...groupCounts(
      "course_day_complete",
      (dayCompleteRows ?? []) as CourseDayRow[],
      (r) => ({ dimension: r.course_slug, locale: "", extra: String(r.day) }),
      (r) => r.user_id
    )
  );

  // course_feedback — one row per person, so extra=rating groups it directly.
  const { data: feedbackRows, error: feedbackError } = await admin
    .from("course_feedback")
    .select("user_id, course_slug, rating")
    .gte("created_at", startIso)
    .lt("created_at", endIso);
  if (feedbackError) throw new Error(`course_feedback query failed: ${feedbackError.message}`);
  rows.push(
    ...groupCounts(
      "course_feedback",
      (feedbackRows ?? []) as CourseFeedbackRow[],
      (r) => ({ dimension: r.course_slug, locale: "", extra: r.rating }),
      (r) => r.user_id
    )
  );

  // post_like — from user_interactions, the same table the like button uses.
  const { data: likeRows, error: likeError } = await admin
    .from("user_interactions")
    .select("user_id, target_id")
    .eq("interaction_type", "like")
    .eq("target_type", "post")
    .gte("created_at", startIso)
    .lt("created_at", endIso);
  if (likeError) throw new Error(`user_interactions query failed: ${likeError.message}`);
  rows.push(
    ...groupCounts(
      "post_like",
      (likeRows ?? []) as PostLikeRow[],
      (r) => ({ dimension: r.target_id, locale: "", extra: "" }),
      (r) => r.user_id
    )
  );

  return rows;
}

// ---------------------------------------------------------------------------
// Retention: delete raw events older than ANALYTICS_RETENTION_DAYS, in
// batches, after the aggregate for the day in question has been written.
// ---------------------------------------------------------------------------

async function purgeOldEvents(
  admin: SupabaseClient,
  now: Date,
  batchSize = 5000
): Promise<number> {
  const cutoff = new Date(now.getTime() - ANALYTICS_RETENTION_DAYS * 86_400_000).toISOString();
  let deleted = 0;
  for (;;) {
    const { data, error } = await admin
      .from("analytics_events")
      .select("id")
      .lt("occurred_at", cutoff)
      .limit(batchSize);
    if (error) throw new Error(`analytics_events purge select failed: ${error.message}`);
    const ids = (data ?? []).map((r: { id: number }) => r.id);
    if (ids.length === 0) break;
    const { error: deleteError } = await admin.from("analytics_events").delete().in("id", ids);
    if (deleteError) throw new Error(`analytics_events purge delete failed: ${deleteError.message}`);
    deleted += ids.length;
    if (ids.length < batchSize) break;
  }
  return deleted;
}

export interface AggregateRunStats {
  day: string;
  rowsWritten: number;
  eventsDeleted: number;
}

/**
 * The nightly job body: aggregate `day` (default: yesterday in Warsaw) into
 * `analytics_daily_stats`, then purge raw events past the retention window.
 * Upsert-by-primary-key makes a rerun for the same day produce the exact
 * same rows, so the job is safe to retry or to run twice for a backfill.
 */
export async function runDailyAggregate(
  admin: SupabaseClient,
  day?: string,
  now: Date = new Date()
): Promise<AggregateRunStats> {
  const targetDay = day ?? addDays(warsawToday(now), -1);
  const metrics = await computeDayMetrics(admin, targetDay);
  const updatedAt = now.toISOString();

  if (metrics.length > 0) {
    const { error } = await admin.from("analytics_daily_stats").upsert(
      metrics.map((m) => ({
        day: targetDay,
        metric: m.metric,
        dimension: m.dimension,
        locale: m.locale,
        extra: m.extra,
        count: m.count,
        unique_count: m.uniqueCount,
        updated_at: updatedAt,
      })),
      { onConflict: "day,metric,dimension,locale,extra" }
    );
    if (error) throw new Error(`analytics_daily_stats upsert failed: ${error.message}`);
  }

  const eventsDeleted = await purgeOldEvents(admin, now);

  return { day: targetDay, rowsWritten: metrics.length, eventsDeleted };
}
