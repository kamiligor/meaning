import { describe, it, expect } from "vitest";
import {
  courseCalendarDay,
  currentDay,
  isDayUnlocked,
  unlockStatus,
  parseQuizAnswers,
  type CourseDayState,
} from "@/lib/course";
import { courses } from "@/lib/courses";

const TOTAL = 5;

function dayState(
  day: number,
  completedAt: string | null,
  quizPassed = false,
  startedAt: string | null = completedAt
): CourseDayState {
  return {
    day,
    startedAt,
    completedAt,
    checkinChoice: null,
    quizFirstAttempts: null,
    quizPassed,
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

  it("unlocks day 2 in the morning of the next calendar day", () => {
    // now is 12:00 in Warsaw, past the 06:00 gate.
    const days = { 1: dayState(1, "2026-08-09T18:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, now)).toBe(true);
  });

  it("stays locked through the night until 06:00 on the first morning", () => {
    // Completed 21:00 UTC Aug 9 (23:00 in Warsaw); at 22:30 UTC it is 00:30
    // Aug 10 in Warsaw — the next calendar day, but before the 06:00 gate.
    const days = { 1: dayState(1, "2026-08-09T21:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-09T22:30:00Z"))).toBe(
      false
    );
    // 04:30 UTC = 06:30 in Warsaw: morning has arrived.
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-10T04:30:00Z"))).toBe(
      true
    );
  });

  it("does not apply the morning gate beyond the first day after", () => {
    // Completed Aug 7; at 04:00 Warsaw on Aug 10 the day is long overdue.
    const days = { 1: dayState(1, "2026-08-07T10:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-10T02:00:00Z"))).toBe(
      true
    );
  });

  it("keeps a completed day viewable at any hour", () => {
    const days = {
      1: dayState(1, "2026-08-08T10:00:00Z"),
      2: dayState(2, "2026-08-09T10:00:00Z"),
    };
    // 03:00 in Warsaw: revisiting finished content is never blocked.
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-10T01:00:00Z"))).toBe(
      true
    );
  });

  it("a long break does not lock anything", () => {
    const days = { 1: dayState(1, "2026-07-01T10:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, now)).toBe(true);
  });

  it("anchors the unlock clock to when the day was started, not closed", () => {
    // Day 1 started Aug 9, closed the next morning at 08:00 Warsaw: day 2
    // opens right away — closing late must not cost a day.
    const days = {
      1: {
        ...dayState(1, "2026-08-10T06:00:00Z"),
        startedAt: "2026-08-09T10:00:00Z",
      },
    };
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-10T06:05:00Z"))).toBe(
      true
    );
    // But an unclosed day never unlocks the next one, whenever it started.
    const unclosed = {
      1: { ...dayState(1, null), startedAt: "2026-08-09T10:00:00Z" },
    };
    expect(isDayUnlocked(2, unclosed, TOTAL, now)).toBe(false);
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

describe("isDayUnlocked without closing the day", () => {
  const TOTAL = 5;

  it("a passed quiz is enough: the next morning opens day 2 even if day 1 was never closed", () => {
    const days = { 1: dayState(1, null, true, "2026-08-09T10:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-09T20:00:00Z"))).toBe(false);
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-10T03:00:00Z"))).toBe(false); // 05:00 in Warsaw
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-10T06:05:00+02:00"))).toBe(true);
  });

  it("a started day without a passed quiz still locks the next one", () => {
    const days = { 1: dayState(1, null, false, "2026-08-09T10:00:00Z") };
    expect(isDayUnlocked(2, days, TOTAL, new Date("2026-08-12T12:00:00Z"))).toBe(false);
  });

  it("never opens more than one day after a long break", () => {
    const days = { 1: dayState(1, "2026-08-01T10:00:00Z", true) };
    const later = new Date("2026-08-20T12:00:00Z");
    expect(isDayUnlocked(2, days, TOTAL, later)).toBe(true);
    expect(isDayUnlocked(3, days, TOTAL, later)).toBe(false);
  });
});

describe("unlockStatus", () => {
  const TOTAL = 5;

  it("reports why and when a day opens", () => {
    const started = "2026-08-09T10:00:00+02:00";
    const days = { 1: dayState(1, null, true, started) };
    expect(unlockStatus(2, days, TOTAL, new Date("2026-08-09T20:00:00+02:00"))).toBe("tomorrow");
    expect(unlockStatus(2, days, TOTAL, new Date("2026-08-10T04:00:00+02:00"))).toBe("today");
    expect(unlockStatus(2, days, TOTAL, new Date("2026-08-10T07:00:00+02:00"))).toBe("open");
    expect(unlockStatus(3, days, TOTAL, new Date("2026-08-10T07:00:00+02:00"))).toBe("previous_incomplete");
    expect(unlockStatus(2, {}, TOTAL)).toBe("previous_incomplete");
    expect(unlockStatus(6, days, TOTAL)).toBe("none");
  });
});
