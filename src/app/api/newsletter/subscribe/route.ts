import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
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

  const dc = apiKey.split("-").pop();
  const subscriberHash = crypto
    .createHash("md5")
    .update(email)
    .digest("hex");

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "pending",
      language: locale,
      tags: [locale === "pl" ? "polish" : "english"],
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data.title === "Member Exists") {
      return NextResponse.json(
        { error: "already_subscribed" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "subscription_failed" },
      { status: 500 }
    );
  }

  const data = await res.json();

  if (data.status === "subscribed") {
    return NextResponse.json(
      { error: "already_subscribed" },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true });
}
