import { describe, it, expect } from "vitest";
import {
  buildReminderMail,
  reminderOptOutToken,
  verifyReminderOptOutToken,
} from "@/lib/course-mail";
import { getCourse } from "@/lib/courses";

const SECRET = "test-secret";
const course = getCourse("kurs-wdziecznosci")!;

describe("buildReminderMail", () => {
  it("names the day, links to it and offers a one-click opt-out", () => {
    const mail = buildReminderMail({
      course,
      day: 3,
      kind: "day",
      dayUrl: "https://poprostusens.pl/kurs-wdziecznosci/dzien/3",
      optOutUrl: "https://poprostusens.pl/api/course/reminders/off?e=x&t=y",
    });
    expect(mail.subject).toBe("Dzień 3 czeka");
    expect(mail.text).toContain("dzień 3 z 7");
    expect(mail.text).toContain("/dzien/3");
    expect(mail.text).toContain("/reminders/off");
    expect(mail.html).toContain('href="https://poprostusens.pl/kurs-wdziecznosci/dzien/3"');
    expect(mail.text).not.toContain("—");
  });

  it("uses the win-back wording for the last message", () => {
    const mail = buildReminderMail({
      course,
      day: 2,
      kind: "winback",
      dayUrl: "https://x/dzien/2",
      optOutUrl: "https://x/off",
    });
    expect(mail.subject).toBe("Kurs czeka, nic nie przepadło");
    expect(mail.text).toContain("ostatnia wiadomość");
  });
});

describe("reminder opt-out token", () => {
  it("verifies its own token and rejects tampering", () => {
    const id = "0b6c4a8e-1b2c-4d5e-8f90-123456789abc";
    const token = reminderOptOutToken(id, SECRET);
    expect(token).toMatch(/^[0-9a-f]{32}$/);
    expect(verifyReminderOptOutToken(id, token, SECRET)).toBe(true);
    expect(verifyReminderOptOutToken(id, token.replace(/.$/, "0"), SECRET)).toBe(false);
    expect(verifyReminderOptOutToken("another-id", token, SECRET)).toBe(false);
    expect(verifyReminderOptOutToken(id, "short", SECRET)).toBe(false);
  });
});
