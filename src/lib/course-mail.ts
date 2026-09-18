import { createHmac, timingSafeEqual } from "crypto";
import type { Course } from "@/lib/courses";

/**
 * Course reminder mail: content and the signed opt-out link. Text first,
 * HTML second; both carry the same words. Tone follows the course: one
 * reminder a day, no pressure, easy to turn off.
 */

export type ReminderKind = "day" | "winback";

export interface ReminderMailInput {
  course: Course;
  day: number;
  kind: ReminderKind;
  dayUrl: string;
  optOutUrl: string;
}

export interface ReminderMail {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildReminderMail(input: ReminderMailInput): ReminderMail {
  const { course, day, kind, dayUrl, optOutUrl } = input;
  const total = course.days.length;
  const noun = course.challengeNoun === "wyzwanie" ? "wyzwanie" : "praktyka";

  const subject =
    kind === "day" ? `Dzień ${day} czeka` : "Kurs czeka, nic nie przepadło";

  const body =
    kind === "day"
      ? [
          "Cześć,",
          "",
          `w kursie „${course.name}” odblokował się dzień ${day} z ${total}. To kilka minut czytania, a ${noun} dzieje się poza ekranem.`,
          "",
          dayUrl,
          "",
          "Jedno przypomnienie dziennie, zero presji.",
        ]
      : [
          "Cześć,",
          "",
          `kilka dni ciszy to normalna rzecz. W kursie „${course.name}” nic nie przepadło: dzień ${day} z ${total} dalej czeka, bez licznika i bez spóźnienia.`,
          "",
          dayUrl,
          "",
          "To ostatnia wiadomość od nas w tej sprawie. Wracasz, kiedy chcesz.",
        ];

  const footer = `Nie chcesz przypomnień o tym kursie? Wyłącz je jednym kliknięciem: ${optOutUrl}`;
  const text = [...body, "", footer].join("\n");

  const paragraphs = body
    .filter((line) => line !== "")
    .map((line) =>
      line === dayUrl
        ? `<p><a href="${escapeHtml(dayUrl)}" style="color:#7B9E8C">${escapeHtml(dayUrl)}</a></p>`
        : `<p>${escapeHtml(line)}</p>`
    )
    .join("\n");
  const html = [
    `<div style="font-family:Georgia,serif;color:#1E2A36;line-height:1.6;max-width:560px">`,
    paragraphs,
    `<p style="font-size:12px;color:#8A99A8;margin-top:24px">Nie chcesz przypomnień o tym kursie? <a href="${escapeHtml(optOutUrl)}" style="color:#8A99A8">Wyłącz je jednym kliknięciem</a>.</p>`,
    `</div>`,
  ].join("\n");

  return { subject, text, html };
}

/**
 * Opt-out links work without logging in, so they are signed: the token is
 * an HMAC of the enrollment id under APP_SECRET, and nothing else is needed
 * to turn reminders off for that one enrollment.
 */
export function reminderOptOutToken(
  enrollmentId: string,
  secret: string | undefined = process.env.APP_SECRET
): string {
  if (!secret) throw new Error("APP_SECRET is not set");
  return createHmac("sha256", secret)
    .update(`course-reminders-off|${enrollmentId}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyReminderOptOutToken(
  enrollmentId: string,
  token: string,
  secret: string | undefined = process.env.APP_SECRET
): boolean {
  if (!/^[0-9a-f]{32}$/.test(token)) return false;
  const expected = reminderOptOutToken(enrollmentId, secret);
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function reminderOptOutUrl(origin: string, enrollmentId: string): string {
  const token = reminderOptOutToken(enrollmentId);
  return `${origin}/api/course/reminders/off?e=${encodeURIComponent(enrollmentId)}&t=${token}`;
}
