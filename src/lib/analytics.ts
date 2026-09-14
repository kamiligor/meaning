import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { courseCalendarDay } from "@/lib/course";
import { SITE_HOSTS } from "@/lib/domains";
import type { Locale } from "@/lib/i18n";

/**
 * First-party analytics, server side. Spec: docs/specs/tracking-analytics.md
 *
 * Nothing here ever stores an IP address or a user agent. An anonymous
 * visitor is `sha256(secret | calendar day | ip | user agent)`: the same
 * person gets a different hash tomorrow, so days cannot be linked, and the
 * hash cannot be reversed without APP_SECRET plus the original request.
 */

export const ANALYTICS_EVENT_TYPES = ["post_view", "post_read", "login"] as const;
export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

/** Raw events are deleted after this many days; aggregates stay. */
export const ANALYTICS_RETENTION_DAYS = 90;

export interface AnalyticsEventInput {
  eventType: AnalyticsEventType;
  userId?: string | null;
  visitorHash?: string | null;
  locale?: Locale | null;
  targetId?: string | null;
  occurredAt?: Date;
}

export function isAnalyticsEventType(value: unknown): value is AnalyticsEventType {
  return (
    typeof value === "string" &&
    (ANALYTICS_EVENT_TYPES as readonly string[]).includes(value)
  );
}

/**
 * Day-scoped visitor identifier. The salt is derived, never stored, so
 * rotation is automatic and there is nothing to leak from the database.
 */
export function dailyVisitorHash(
  ip: string,
  userAgent: string,
  now: Date = new Date(),
  secret: string | undefined = process.env.APP_SECRET
): string {
  if (!secret) throw new Error("APP_SECRET is not set");
  const day = courseCalendarDay(now);
  const salt = createHash("sha256").update(`${secret}|${day}`).digest("hex");
  return createHash("sha256")
    .update(`${salt}|${ip}|${userAgent}`)
    .digest("hex");
}

/** First address in x-forwarded-for (Coolify sits behind a proxy). */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "unknown";
}

const BOT_UA =
  /bot|crawl|spider|slurp|preview|fetch|monitor|headless|lighthouse|pingdom|facebookexternalhit|whatsapp|telegram|discord|skype|slack|curl\/|wget\/|python-requests|go-http-client|java\/|okhttp/i;

/**
 * Cheap user-agent filter. Catches declared crawlers and link previews,
 * not browsers pretending to be browsers; requiring JavaScript for the
 * beacon does the rest.
 */
export function isLikelyBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.length < 10) return true;
  return BOT_UA.test(userAgent);
}

/**
 * Origin/Referer must belong to one of our own hosts. Localhost is allowed
 * so the beacon can be exercised in development.
 */
export function isOwnOrigin(headers: Headers): boolean {
  const raw = headers.get("origin") ?? headers.get("referer");
  if (!raw) return false;
  let hostname: string;
  try {
    hostname = new URL(raw).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return false;
  }
  if (hostname === "localhost" || hostname.endsWith(".localhost")) return true;
  return hostname === SITE_HOSTS.en || hostname === SITE_HOSTS.pl;
}

export interface BeaconPayload {
  event: AnalyticsEventType;
  targetId: string | null;
}

/** Hand-rolled validation: the repo does not use zod, and the shape is tiny. */
export function parseBeacon(body: unknown): BeaconPayload | null {
  if (!body || typeof body !== "object") return null;
  const { event, targetId } = body as Record<string, unknown>;
  if (!isAnalyticsEventType(event)) return null;

  if (event === "login") {
    return targetId === undefined || targetId === null
      ? { event, targetId: null }
      : null;
  }

  if (typeof targetId !== "string" || !/^[a-z0-9-]{1,200}$/.test(targetId)) {
    return null;
  }
  return { event, targetId };
}

export async function recordEvent(
  admin: SupabaseClient,
  input: AnalyticsEventInput
): Promise<void> {
  const { error } = await admin.from("analytics_events").insert({
    event_type: input.eventType,
    user_id: input.userId ?? null,
    visitor_hash: input.userId ? null : input.visitorHash ?? null,
    locale: input.locale ?? null,
    target_id: input.targetId ?? null,
    occurred_at: (input.occurredAt ?? new Date()).toISOString(),
  });
  if (error) throw new Error(`analytics insert failed: ${error.message}`);
}
