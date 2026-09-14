import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, computeDayMetrics, dayBoundsUtc, warsawToday } from "@/lib/analytics-aggregate";
import { courses, getDay, type Course } from "@/lib/courses";
import { getAllPosts } from "@/lib/posts";
import {
  STATS_MIN_GROUP,
  type AccountsStats,
  type Compared,
  type CourseFunnelStep,
  type CourseStats,
  type DailyPoint,
  type PostRow,
  type PostsStats,
  type StatsQuery,
  type StatsResponse,
} from "@/lib/analytics-types";

/**
 * Turns `analytics_daily_stats` rows (plus, for "today", the live numbers
 * from `computeDayMetrics`) into the `StatsResponse` the admin panel reads.
 * Spec: docs/specs/tracking-analytics.md, sections 7 and 10.
 */

const MAX_CUSTOM_RANGE_DAYS = 366;

export class StatsQueryError extends Error {}

function isValidCalendarDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return (
    parsed.getUTCFullYear() === y &&
    parsed.getUTCMonth() === m - 1 &&
    parsed.getUTCDate() === d
  );
}

/** Whole calendar days between two YYYY-MM-DD strings (>= 0 when to >= from). */
function calendarSpan(from: string, to: string): number {
  const fromMs = Date.parse(`${from}T00:00:00Z`);
  const toMs = Date.parse(`${to}T00:00:00Z`);
  return Math.round((toMs - fromMs) / 86_400_000);
}

/**
 * Parses `?range=` (and, for `custom`, `?from=&to=`) into a `StatsQuery`.
 * Throws `StatsQueryError` on anything malformed; the route handler turns
 * that into a 400.
 */
export function parseStatsQuery(
  searchParams: URLSearchParams,
  now: Date = new Date()
): StatsQuery {
  const range = searchParams.get("range") ?? "7d";
  const today = warsawToday(now);

  if (range === "today") return { range: "today", from: today, to: today };
  if (range === "7d") return { range: "7d", from: addDays(today, -6), to: today };
  if (range === "30d") return { range: "30d", from: addDays(today, -29), to: today };

  if (range !== "custom") {
    throw new StatsQueryError(`Unknown range: ${range}`);
  }

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to || !isValidCalendarDay(from) || !isValidCalendarDay(to)) {
    throw new StatsQueryError("custom range requires from and to as YYYY-MM-DD");
  }
  if (from > to) {
    throw new StatsQueryError("from must not be after to");
  }
  if (to > today) {
    throw new StatsQueryError("to must not be later than today");
  }
  if (calendarSpan(from, to) + 1 > MAX_CUSTOM_RANGE_DAYS) {
    throw new StatsQueryError(`custom range must not exceed ${MAX_CUSTOM_RANGE_DAYS} days`);
  }

  return { range: "custom", from, to };
}

/** Every YYYY-MM-DD from `from` to `to`, inclusive. */
function daysInRange(from: string, to: string): string[] {
  const days: string[] = [];
  for (let day = from; day <= to; day = addDays(day, 1)) {
    days.push(day);
  }
  return days;
}

/** The immediately preceding period of equal length, used for "Compared to". */
export function previousRange(query: StatsQuery): { from: string; to: string } {
  const spanDays = calendarSpan(query.from, query.to) + 1;
  const to = addDays(query.from, -1);
  const from = addDays(to, -(spanDays - 1));
  return { from, to };
}

// ---------------------------------------------------------------------------
// Pure aggregation over already-fetched rows — what the tests exercise.
// ---------------------------------------------------------------------------

export interface StoredStatsRow {
  day: string;
  metric: string;
  dimension: string;
  locale: string;
  extra: string;
  count: number;
  uniqueCount: number;
}

function sumMetric(rows: StoredStatsRow[], metric: string, useUnique = false): number {
  return rows
    .filter((r) => r.metric === metric)
    .reduce((acc, r) => acc + (useUnique ? r.uniqueCount : r.count), 0);
}

export function compareMetric(
  currentRows: StoredStatsRow[],
  previousRows: StoredStatsRow[],
  metric: string,
  useUnique = false
): Compared {
  return {
    current: sumMetric(currentRows, metric, useUnique),
    previous: sumMetric(previousRows, metric, useUnique),
  };
}

function dailySeries(rows: StoredStatsRow[], metric: string, days: string[]): DailyPoint[] {
  return days.map((day) => ({
    day,
    value: rows
      .filter((r) => r.day === day && r.metric === metric)
      .reduce((acc, r) => acc + r.count, 0),
  }));
}

/** The value of a snapshot metric (active_7d, active_30d) on one specific day. */
function snapshotOn(rows: StoredStatsRow[], metric: string, day: string): number {
  return rows
    .filter((r) => r.metric === metric && r.day === day)
    .reduce((acc, r) => acc + r.count, 0);
}

const DIMENSION_KEY_SEP = " ";

function groupByDimension(
  rows: StoredStatsRow[],
  metric: string,
  useUnique = false
): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    if (row.metric !== metric) continue;
    const key = `${row.dimension}${DIMENSION_KEY_SEP}${row.locale}`;
    map.set(key, (map.get(key) ?? 0) + (useUnique ? row.uniqueCount : row.count));
  }
  return map;
}

function filterDimension(rows: StoredStatsRow[], dimension: string): StoredStatsRow[] {
  return rows.filter((r) => r.dimension === dimension);
}

/** Median of a list of numbers, rounded to one decimal place. */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const middle =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return Math.round(middle * 10) / 10;
}

export function medianDaysToComplete(
  pairs: { enrolledAt: string; completedAt: string }[]
): number | null {
  const days = pairs.map(
    (p) => (Date.parse(p.completedAt) - Date.parse(p.enrolledAt)) / 86_400_000
  );
  return median(days);
}

export interface FunnelProgressRow {
  day: number;
  completedAt: string | null;
}

/**
 * Per-day started/completed counts for the funnel, given progress rows
 * already restricted to people enrolled inside the requested range (the
 * caller does that join — see docs/specs, section 10, "Lejek kursu").
 */
export function buildFunnel(rows: FunnelProgressRow[], course: Course): CourseFunnelStep[] {
  return course.days.map(({ day }) => {
    const dayRows = rows.filter((r) => r.day === day);
    return {
      day,
      title: getDay(course, day)?.title ?? "",
      started: dayRows.length,
      completed: dayRows.filter((r) => r.completedAt !== null).length,
    };
  });
}

/** Removes the `{...}` accent markers slides use, for plain-text display. */
export function stripAccentMarkers(headline: string): string {
  return headline.replace(/[{}]/g, "");
}

/** Below this many people, report "<N" instead of the real count in the panel. */
export function maskSmall(n: number): string {
  return n > 0 && n < STATS_MIN_GROUP ? `<${STATS_MIN_GROUP}` : String(n);
}

/**
 * Splits already-fetched daily-stats rows into the current and previous
 * period buckets a `StatsQuery` describes. Exported for tests: no DB.
 */
export function summarizeDaily(
  rows: StoredStatsRow[],
  query: StatsQuery
): { current: StoredStatsRow[]; previous: StoredStatsRow[] } {
  const prev = previousRange(query);
  const currentDays = new Set(daysInRange(query.from, query.to));
  const previousDays = new Set(daysInRange(prev.from, prev.to));
  return {
    current: rows.filter((r) => currentDays.has(r.day)),
    previous: rows.filter((r) => previousDays.has(r.day)),
  };
}

// ---------------------------------------------------------------------------
// DB-backed assembly.
// ---------------------------------------------------------------------------

async function fetchDailyStats(
  admin: SupabaseClient,
  fromDay: string,
  toDay: string
): Promise<StoredStatsRow[]> {
  const { data, error } = await admin
    .from("analytics_daily_stats")
    .select("day, metric, dimension, locale, extra, count, unique_count")
    .gte("day", fromDay)
    .lte("day", toDay);
  if (error) throw new Error(`analytics_daily_stats query failed: ${error.message}`);
  return (data ?? []).map((r) => ({
    day: r.day,
    metric: r.metric,
    dimension: r.dimension,
    locale: r.locale,
    extra: r.extra,
    count: r.count,
    uniqueCount: r.unique_count,
  }));
}

async function fetchAggregatedAt(admin: SupabaseClient): Promise<string | null> {
  const { data, error } = await admin
    .from("analytics_daily_stats")
    .select("updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`analytics_daily_stats (aggregatedAt) query failed: ${error.message}`);
  return data?.updated_at ?? null;
}

async function buildCourseStats(
  admin: SupabaseClient,
  course: Course,
  query: StatsQuery,
  currentRows: StoredStatsRow[],
  previousRows: StoredStatsRow[]
): Promise<CourseStats> {
  const enrolled = compareMetric(
    filterDimension(currentRows, course.slug),
    filterDimension(previousRows, course.slug),
    "course_enroll"
  );
  const completed = compareMetric(
    filterDimension(currentRows, course.slug),
    filterDimension(previousRows, course.slug),
    "course_complete"
  );

  // The funnel and the median need a real join (enrollment -> its own day
  // rows), which the daily aggregate cannot give back — it only knows totals
  // per absolute calendar day, not per enrollment cohort. So this part reads
  // course_enrollments/course_day_progress directly, restricted to people
  // who enrolled inside the requested range (docs/specs, section 10).
  const { startIso: fromStartIso } = dayBoundsUtc(query.from);
  const { endIso: toEndIso } = dayBoundsUtc(query.to);

  const { data: enrollmentRows, error: enrollError } = await admin
    .from("course_enrollments")
    .select("user_id, enrolled_at, completed_at")
    .eq("course_slug", course.slug)
    .gte("enrolled_at", fromStartIso)
    .lt("enrolled_at", toEndIso);
  if (enrollError) throw new Error(`course_enrollments query failed: ${enrollError.message}`);

  const enrolledUserIds = (enrollmentRows ?? []).map((r) => r.user_id as string);

  let progressRows: { day: number; completed_at: string | null }[] = [];
  if (enrolledUserIds.length > 0) {
    const { data, error: progressError } = await admin
      .from("course_day_progress")
      .select("user_id, day, completed_at")
      .eq("course_slug", course.slug)
      .in("user_id", enrolledUserIds);
    if (progressError) {
      throw new Error(`course_day_progress query failed: ${progressError.message}`);
    }
    progressRows = data ?? [];
  }

  const funnel = buildFunnel(
    progressRows.map((r) => ({ day: r.day, completedAt: r.completed_at })),
    course
  );

  const completedPairs = (enrollmentRows ?? [])
    .filter((r) => r.completed_at)
    .map((r) => ({ enrolledAt: r.enrolled_at as string, completedAt: r.completed_at as string }));

  const { data: feedbackRows, error: feedbackError } = await admin
    .from("course_feedback")
    .select("rating")
    .eq("course_slug", course.slug);
  if (feedbackError) throw new Error(`course_feedback query failed: ${feedbackError.message}`);

  const ratings = (feedbackRows ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.rating] = (acc[r.rating] ?? 0) + 1;
    return acc;
  }, {});

  return {
    slug: course.slug,
    name: course.name,
    enrolled,
    completed,
    funnel,
    medianDaysToComplete: medianDaysToComplete(completedPairs),
    ratings,
  };
}

function buildPostsStats(currentRows: StoredStatsRow[], previousRows: StoredStatsRow[]): PostsStats {
  const views = compareMetric(currentRows, previousRows, "post_view");
  const uniqueViews = compareMetric(currentRows, previousRows, "post_view", true);
  const reads = compareMetric(currentRows, previousRows, "post_read");
  const likes = compareMetric(currentRows, previousRows, "post_like");

  const viewsByPost = groupByDimension(currentRows, "post_view");
  const uniqueByPost = groupByDimension(currentRows, "post_view", true);
  const readsByPost = groupByDimension(currentRows, "post_read");
  // post_like has no locale dimension — likes are not tracked per translation.
  const likesBySlug = groupByDimension(currentRows, "post_like");

  const posts = getAllPosts();

  const top: PostRow[] = [...viewsByPost.entries()]
    .map(([key, views_]) => {
      const [slug, locale] = key.split(DIMENSION_KEY_SEP);
      const post = posts.find((p) => p.slug === slug && p.locale === locale);
      const reads_ = readsByPost.get(key) ?? 0;
      return {
        slug,
        title: post ? stripAccentMarkers(post.headline) : slug,
        locale,
        views: views_,
        uniqueViews: uniqueByPost.get(key) ?? 0,
        reads: reads_,
        readRate: views_ > 0 ? reads_ / views_ : null,
        likes: likesBySlug.get(`${slug}${DIMENSION_KEY_SEP}`) ?? 0,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return { views, uniqueViews, reads, likes, top };
}

/**
 * Assembles the full panel payload for `query`. Days already in
 * `analytics_daily_stats` are read straight from the table; "today" (which
 * the nightly job never has yet, see analytics-aggregate.ts) is computed
 * live with the exact same logic, so the numbers never read as zero and
 * never disagree with tomorrow's aggregate.
 */
export async function getStats(admin: SupabaseClient, query: StatsQuery): Promise<StatsResponse> {
  const now = new Date();
  const today = warsawToday(now);
  const prev = previousRange(query);

  let rows = await fetchDailyStats(admin, prev.from, query.to);

  const includesToday = query.from <= today && today <= query.to;
  if (includesToday) {
    const live = await computeDayMetrics(admin, today);
    rows = rows.concat(live.map((m) => ({ day: today, ...m })));
  }

  const { current: currentRows, previous: previousRows } = summarizeDaily(rows, query);

  const accounts: AccountsStats = {
    newAccounts: compareMetric(currentRows, previousRows, "new_accounts"),
    logins: compareMetric(currentRows, previousRows, "login"),
    active7d: snapshotOn(currentRows, "active_7d", query.to),
    active30d: snapshotOn(currentRows, "active_30d", query.to),
    loginsByDay: dailySeries(currentRows, "login", daysInRange(query.from, query.to)),
  };

  const courseStats = await Promise.all(
    courses.map((course) => buildCourseStats(admin, course, query, currentRows, previousRows))
  );

  const posts = buildPostsStats(currentRows, previousRows);
  const aggregatedAt = await fetchAggregatedAt(admin);

  return { query, aggregatedAt, accounts, courses: courseStats, posts };
}
