/**
 * Shared contracts between the analytics API routes and the admin panel.
 * Spec: docs/specs/tracking-analytics.md, sections 7 and 10.
 * Only aggregated numbers travel through these types; never e-mails.
 */

export type StatsRange = "today" | "7d" | "30d" | "custom";

export interface StatsQuery {
  range: StatsRange;
  /** ISO dates (YYYY-MM-DD) in Europe/Warsaw, inclusive; used when range is custom. */
  from: string;
  to: string;
}

/** A number for the period and the same number for the previous period of equal length. */
export interface Compared {
  current: number;
  previous: number;
}

export interface DailyPoint {
  day: string;
  value: number;
}

export interface AccountsStats {
  newAccounts: Compared;
  logins: Compared;
  /** Snapshot at the end of the period, not a sum. */
  active7d: number;
  active30d: number;
  loginsByDay: DailyPoint[];
}

export interface CourseFunnelStep {
  day: number;
  title: string;
  started: number;
  completed: number;
}

export interface CourseStats {
  slug: string;
  name: string;
  /** Enrollments created inside the period. */
  enrolled: Compared;
  completed: Compared;
  /** Funnel over people enrolled inside the period. */
  funnel: CourseFunnelStep[];
  medianDaysToComplete: number | null;
  /** Ratings over all time: worth_it | mixed | not_for_me. */
  ratings: Record<string, number>;
}

export interface PostRow {
  slug: string;
  title: string;
  locale: string;
  views: number;
  uniqueViews: number;
  reads: number;
  /** reads / views, 0..1, or null when views is 0. */
  readRate: number | null;
  likes: number;
}

export interface PostsStats {
  views: Compared;
  uniqueViews: Compared;
  reads: Compared;
  likes: Compared;
  top: PostRow[];
}

export interface StatsResponse {
  query: StatsQuery;
  /** ISO timestamp of the last completed nightly aggregate, or null. */
  aggregatedAt: string | null;
  accounts: AccountsStats;
  courses: CourseStats[];
  posts: PostsStats;
}

/** Breakdown values below this are reported as `lessThanMin` instead of a number. */
export const STATS_MIN_GROUP = 5;

export interface TagSummary {
  tag: string;
  description: string;
  kind: "auto" | "manual";
  members: number;
  /** How many of the members have been pushed to MailerLite. */
  synced: number;
  lastSyncedAt: string | null;
}

export interface TagsResponse {
  tags: TagSummary[];
}

export interface TagMembersResponse {
  tag: string;
  emails: string[];
}

export interface TagSyncResponse {
  added: number;
  removed: number;
  skippedNoSubscription: number;
  failures: number;
}
