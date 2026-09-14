import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getPostBySlug } from "@/lib/posts";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  clientIp,
  dailyVisitorHash,
  isLikelyBot,
  isOwnOrigin,
  parseBeacon,
  recordEvent,
} from "@/lib/analytics";

/**
 * Analytics beacon. Spec: docs/specs/tracking-analytics.md
 *
 * Deliberately narrow and quiet: every outcome is an empty 204, so the
 * endpoint cannot be used to enumerate slugs or to tell "saved" from
 * "dropped". Exempt from the admin gate in src/proxy.ts (exact path).
 */

const MAX_BODY_BYTES = 1024;
const PER_IP = { maxRequests: 30, windowMs: 60_000 };
const DEDUP = { maxRequests: 1, windowMs: 60_000 };

function noContent(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}

/** Only ask Supabase for the user when auth cookies are present at all. */
async function currentUserId(): Promise<string | null> {
  const store = await cookies();
  if (!store.getAll().some((c) => c.name.startsWith("sb-"))) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (
      !contentType.startsWith("text/plain") &&
      !contentType.startsWith("application/json")
    ) {
      return noContent();
    }
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (declared > MAX_BODY_BYTES) return noContent();
    if (!isOwnOrigin(request.headers)) return noContent();

    const userAgent = request.headers.get("user-agent");
    if (isLikelyBot(userAgent)) return noContent();
    if (request.headers.get("sec-purpose")?.includes("prefetch")) return noContent();

    const ip = clientIp(request.headers);
    if (!checkRateLimit(`beacon:${ip}`, PER_IP).allowed) return noContent();

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return noContent();
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return noContent();
    }
    const payload = parseBeacon(body);
    if (!payload) return noContent();

    const userId = await currentUserId();
    let locale: Locale | null = null;

    if (payload.event === "login") {
      // A login event without a session is worthless and easy to forge.
      if (!userId) return noContent();
    } else {
      const post = getPostBySlug(payload.targetId!);
      if (!post || post.status !== "published") return noContent();
      locale = isLocale(post.locale) ? post.locale : null;
    }

    const visitorHash = userId
      ? null
      : dailyVisitorHash(ip, userAgent ?? "", new Date());
    const identity = userId ?? visitorHash;
    const dedupKey = `beacon:${payload.event}:${identity}:${payload.targetId ?? ""}`;
    if (!checkRateLimit(dedupKey, DEDUP).allowed) return noContent();

    await recordEvent(getSupabaseAdmin(), {
      eventType: payload.event,
      userId,
      visitorHash,
      locale,
      targetId: payload.targetId,
    });
  } catch (err) {
    // Never let analytics surface to the reader; log without the payload.
    console.error("[analytics beacon] failed:", err instanceof Error ? err.message : err);
  }
  return noContent();
}
