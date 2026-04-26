import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const apiToken = process.env.MAILERLITE_API_TOKEN;

  if (!apiToken) {
    return NextResponse.json(
      { error: "Newsletter service not configured" },
      { status: 500 }
    );
  }

  let body: { email?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const locale = body.locale === "pl" ? "pl" : "en";

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const { allowed, retryAfterMs } = checkRateLimit(
    `newsletter:${email}`,
    RATE_LIMITS.newsletter
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    );
  }

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      fields: { language: locale },
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.ok) {
    if (data.data?.status === "active") {
      return NextResponse.json(
        { error: "already_subscribed" },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: true });
  }

  if (res.status === 422) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  return NextResponse.json(
    { error: "subscription_failed" },
    { status: 500 }
  );
}
