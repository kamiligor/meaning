import { describe, it, expect } from "vitest";
import {
  courseCalendarDay,
  currentDay,
  isDayUnlocked,
  isEveningNoteOpen,
  parseQuizAnswers,
  type CourseDayState,
} from "@/lib/course";
import { courses } from "@/lib/courses";

const TOTAL = 5;

function dayState(day: number, completedAt: string | null): CourseDayState {
  return {
    day,
    startedAt: completedAt,
    completedAt,
    checkinChoice: null,
    quizFirstAttempts: null,
    quizPassed: false,
  };
}

describe("parseQuizAnswers", () => {
  it("treats the legacy array shape as passed", () => {
    expect(parseQuizAnswers([0, 2, 1])).toEqual({ first: [0, 2, 1], passed: true });
  });

  it("parses the current object shape", () => {
    expect(parseQuizAnswers({ first: [1, 0], passed: false })).toEqual({
      first: [1, 0],
      passed: false,
    });
    expect(parseQuizAnswers({ first: [1, 0], passed: true })).toEqual({
      first: [1, 0],
      passed: true,
    });
  });

  it("handles empty and malformed values", () => {
    expect(parseQuizAnswers(null)).toEqual({ first: null, passed: false });
    expect(parseQuizAnswers(undefined)).toEqual({ first: null, passed: false });
    expect(parseQuizAnswers({ passed: "yes" })).toEqual({ first: null, passed: false });
  });
});

describe("courseCalendarDay", () => {
  it("uses the Warsaw calendar, not UTC", () => {
    // 23:30 UTC on Jan 1 is already Jan 2 in Warsaw (UTC+1 in winter).
    expect(courseCalendarDay(new Date("2026-01-01T23:30:00Z"))).toBe(
      "2026-01-02"
    );
    expect(courseCalendarDay(new Date("2026-01-01T22:30:00Z"))).toBe(
      "2026-01-01"
    );
  });
});

describe("isEveningNoteOpen", () => {
  // Summer: Warsaw = UTC+2. Challenge accepted 08:00 local.
  const completed = "2026-08-10T06:00:00Z";

  it("stays locked before 18:00 on the completion day", () => {
    expect(isEveningNoteOpen(completed, new Date("2026-08-10T13:00:00Z"))).toBe(
      false
    );
  });

  it("opens at 18:00 Warsaw on the completion day", () => {
    expect(isEveningNoteOpen(completed, new Date("2026-08-10T16:30:00Z"))).toBe(
      true
    );
  });

  it("stays open on every later day", () => {
    expect(isEveningNoteOpen(completed, new Date("2026-08-12T07:00:00Z"))).toBe(
      true
    );
  });

  it("opens immediately when the day was completed in the evening", () => {
    expect(
      isEveningNoteOpen("2026-08-10T18:30:00Z", new Date("2026-08-10T18:35:00Z"))
    ).toBe(true);
  });
});

describe("isDayUnlocked", () => {
  const now = new Date("2026-08-10T10:00:00Z");

  it("always unlocks day 1", () => {
    expect(isDayUnlocked(1, {}, TOTAL, now)).toBe(true);
  });

  it("keeps day 2 locked until day 1 is completed", () => {
    expect(isDayUnlocked(2, {}, TOTAL, now)).toBe(false);
    expect(isDayUnlocked(2, { 1: dayState(1, null) }, TOTAL, now)).toBe(false);
  });

  it("keeps day 2 locked on the same calendar day day 1 was completed", () => {
    const days = { 1: dayState(1, "2026-08-10T06:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, now)).toBe(false);
  });

  it("unlocks day 2 on the next calendar day", () => {
    const days = { 1: dayState(1, "2026-08-09T18:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, now)).toBe(true);
  });

  it("unlocks right after Warsaw midnight even when UTC date has not changed", () => {
    // Completed 21:00 UTC Aug 9 (23:00 in Warsaw); at 22:30 UTC it is 00:30
    // Aug 10 in Warsaw — next calendar day locally, same day in UTC.
    const days = { 1: dayState(1, "2026-08-09T21:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-09T22:30:00Z"))).toBe(
      true
    );
  });

  it("a long break does not lock anything", () => {
    const days = { 1: dayState(1, "2026-07-01T10:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, now)).toBe(true);
  });

  it("rejects days outside the course", () => {
    expect(isDayUnlocked(0, {}, TOTAL, now)).toBe(false);
    expect(isDayUnlocked(6, {}, TOTAL, now)).toBe(false);
    expect(isDayUnlocked(6, {}, 7, now)).toBe(false);
  });

  it("respects a longer course length", () => {
    const days = { 5: dayState(5, "2026-08-09T10:00:00Z") };
    expect(isDayUnlocked(6, days, 7, now)).toBe(true);
  });
});

describe("currentDay", () => {
  const now = new Date("2026-08-10T10:00:00Z");

  it("starts at day 1", () => {
    expect(currentDay({}, TOTAL, now)).toBe(1);
  });

  it("points at the freshly unlocked day", () => {
    const days = { 1: dayState(1, "2026-08-09T18:00:00Z") };
    expect(currentDay(days, TOTAL, now)).toBe(2);
  });

  it("stays on the completed day while the next one is time-locked", () => {
    const days = { 1: dayState(1, "2026-08-10T08:00:00Z") };
    expect(currentDay(days, TOTAL, now)).toBe(1);
  });

  it("returns the final day when everything is completed", () => {
    const days = Object.fromEntries(
      [1, 2, 3, 4, 5].map((d) => [d, dayState(d, "2026-08-01T10:00:00Z")])
    );
    expect(currentDay(days, TOTAL, now)).toBe(5);
  });
});

describe("course content sanity", () => {
  it("registers courses with unique slugs and paths", () => {
    const slugs = courses.map((c) => c.slug);
    const paths = courses.map((c) => c.path);
    expect(new Set(slugs).size).toBe(courses.length);
    expect(new Set(paths).size).toBe(courses.length);
  });

  for (const course of courses) {
    describe(course.slug, () => {
      it("numbers days sequentially from 1", () => {
        expect(course.days.map((d) => d.day)).toEqual(
          course.days.map((_, i) => i + 1)
        );
      });

      it("has a check-in on every day except the first", () => {
        for (const day of course.days) {
          if (day.day === 1) {
            expect(day.checkinAboutPrevious).toBeUndefined();
          } else {
            expect(day.checkinAboutPrevious).toBeDefined();
            expect(day.checkinAboutPrevious!.options.length).toBeGreaterThanOrEqual(2);
          }
        }
      });

      it("gives every quiz question exactly one correct answer and explanations", () => {
        for (const day of course.days) {
          expect(day.quiz.length).toBeGreaterThanOrEqual(1);
          for (const question of day.quiz) {
            const correct = question.options.filter((o) => o.correct);
            expect(correct).toHaveLength(1);
            for (const option of question.options) {
              expect(option.explanation.length).toBeGreaterThan(0);
            }
          }
        }
      });

      it("contains no em dashes (project style rule)", () => {
        const text = JSON.stringify(course);
        expect(text.includes("—")).toBe(false);
      });
    });
  }
});
