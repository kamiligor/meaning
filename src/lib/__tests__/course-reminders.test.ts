import { describe, it, expect } from "vitest";
import {
  decideReminder,
  type ReminderEnrollmentState,
} from "@/lib/course-reminders";

// 10:00 UTC = 12:00 in Warsaw (summer): safely inside a calendar day.
const NOW = new Date("2026-08-10T10:00:00Z");

function state(over: Partial<ReminderEnrollmentState>): ReminderEnrollmentState {
  return {
    enrolledAt: "2026-08-01T10:00:00Z",
    completedAt: null,
    lastRemindedDay: null,
    lastRemindedAt: null,
    winbackSentAt: null,
    days: {},
    totalDays: 5,
    ...over,
  };
}

describe("decideReminder", () => {
  it("skips finished courses", () => {
    expect(
      decideReminder(state({ completedAt: "2026-08-09T10:00:00Z" }), NOW)
    ).toBeNull();
  });

  it("reminds about day 1 when enrollment happened on an earlier day", () => {
    expect(decideReminder(state({}), NOW)).toEqual({ type: "day", day: 1 });
  });

  it("stays quiet on the enrollment day itself", () => {
    expect(
      decideReminder(state({ enrolledAt: "2026-08-10T06:00:00Z" }), NOW)
    ).toBeNull();
  });

  it("reminds about the newly unlocked day", () => {
    const s = state({ days: { 1: "2026-08-09T18:00:00Z" } });
    expect(decideReminder(s, NOW)).toEqual({ type: "day", day: 2 });
  });

  it("stays quiet while the next day is still time-locked", () => {
    const s = state({ days: { 1: "2026-08-10T06:00:00Z" } });
    expect(decideReminder(s, NOW)).toBeNull();
  });

  it("sends at most one mail per calendar day", () => {
    const s = state({
      days: { 1: "2026-08-09T18:00:00Z" },
      lastRemindedDay: 2,
      lastRemindedAt: "2026-08-10T05:00:00Z",
    });
    expect(decideReminder(s, NOW)).toBeNull();
  });

  it("does not repeat the reminder for the same stuck day", () => {
    const s = state({
      days: { 1: "2026-08-07T18:00:00Z" },
      lastRemindedDay: 2,
      lastRemindedAt: "2026-08-08T08:00:00Z",
    });
    // 2 quiet days: not yet win-back time, and no re-reminder either.
    expect(decideReminder(s, NOW)).toBeNull();
  });

  it("sends one win-back after three quiet days, then goes silent", () => {
    const stuck = state({
      days: { 1: "2026-08-05T18:00:00Z" },
      lastRemindedDay: 2,
      lastRemindedAt: "2026-08-06T08:00:00Z",
    });
    expect(decideReminder(stuck, NOW)).toEqual({ type: "winback", day: 2 });

    const afterWinback = state({
      ...stuck,
      winbackSentAt: "2026-08-09T08:00:00Z",
      lastRemindedAt: "2026-08-09T08:00:00Z",
    });
    expect(decideReminder(afterWinback, NOW)).toBeNull();
  });

  it("wakes up again when the person moves to the next day", () => {
    // Reminded about day 2 long ago, person finally did day 2 yesterday.
    const s = state({
      days: { 1: "2026-08-05T18:00:00Z", 2: "2026-08-09T18:00:00Z" },
      lastRemindedDay: 2,
      lastRemindedAt: "2026-08-06T08:00:00Z",
      winbackSentAt: "2026-08-09T08:00:00Z",
    });
    expect(decideReminder(s, NOW)).toEqual({ type: "day", day: 3 });
  });
});
