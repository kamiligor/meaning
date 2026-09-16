import { describe, it, expect } from "vitest";
import {
  TAG_PATTERN,
  isValidTag,
  computeCourseTags,
  computeReadingTags,
  diffAutoTags,
  type CourseTagEnrollment,
  type CourseTagDayProgress,
  type ReadingEvent,
} from "@/lib/tags";

const DAY_MS = 86_400_000;
const NOW = new Date("2026-09-14T12:00:00Z");

describe("TAG_PATTERN / isValidTag", () => {
  it("accepts lowercase-alnum-hyphen strings of 3 to 80 chars", () => {
    expect(isValidTag("ukonczyl-kurs-wdziecznosci")).toBe(true);
    expect(isValidTag("abc")).toBe(true);
    expect(isValidTag("a".repeat(80))).toBe(true);
  });

  it("rejects anything outside the allowlist shape", () => {
    expect(isValidTag("ab")).toBe(false); // too short
    expect(isValidTag("a".repeat(81))).toBe(false); // too long
    expect(isValidTag("Has-Caps")).toBe(false);
    expect(isValidTag("has_underscore")).toBe(false);
    expect(isValidTag("has space")).toBe(false);
    expect(isValidTag("")).toBe(false);
  });

  it("matches the CHECK constraint on tag_definitions.tag", () => {
    expect(TAG_PATTERN.source).toBe("^[a-z0-9-]{3,80}$");
  });
});

describe("computeCourseTags", () => {
  it("tags every enrollment as zapisany, regardless of progress", () => {
    const enrollments: CourseTagEnrollment[] = [
      { courseSlug: "kurs-x", enrolledAt: NOW.toISOString(), completedAt: null },
    ];
    const tags = computeCourseTags(enrollments, [], NOW);
    expect(tags.has("zapisany-na-kurs-x")).toBe(true);
  });

  it("tags a completed course as ukonczyl and never as porzucil", () => {
    const enrollments: CourseTagEnrollment[] = [
      {
        courseSlug: "kurs-x",
        enrolledAt: new Date(NOW.getTime() - 10 * DAY_MS).toISOString(),
        completedAt: NOW.toISOString(),
      },
    ];
    const dayProgress: CourseTagDayProgress[] = [
      { courseSlug: "kurs-x", day: 1, startedAt: new Date(NOW.getTime() - 10 * DAY_MS).toISOString() },
    ];
    const tags = computeCourseTags(enrollments, dayProgress, NOW);
    expect(tags.has("ukonczyl-kurs-x")).toBe(true);
    expect([...tags].some((t) => t.startsWith("porzucil-"))).toBe(false);
  });

  it("does not tag abandonment before the 3-day boundary", () => {
    const enrollments: CourseTagEnrollment[] = [
      { courseSlug: "kurs-x", enrolledAt: NOW.toISOString(), completedAt: null },
    ];
    const dayProgress: CourseTagDayProgress[] = [
      {
        courseSlug: "kurs-x",
        day: 2,
        startedAt: new Date(NOW.getTime() - (3 * DAY_MS - 1)).toISOString(),
      },
    ];
    const tags = computeCourseTags(enrollments, dayProgress, NOW);
    expect(tags.has("porzucil-kurs-x-dzien-2")).toBe(false);
  });

  it("tags abandonment right at and after the 3-day boundary", () => {
    const enrollments: CourseTagEnrollment[] = [
      { courseSlug: "kurs-x", enrolledAt: NOW.toISOString(), completedAt: null },
    ];
    const dayProgress: CourseTagDayProgress[] = [
      { courseSlug: "kurs-x", day: 2, startedAt: new Date(NOW.getTime() - 3 * DAY_MS).toISOString() },
    ];
    const tags = computeCourseTags(enrollments, dayProgress, NOW);
    expect(tags.has("porzucil-kurs-x-dzien-2")).toBe(true);
  });

  it("does not tag abandonment when the next day was already started", () => {
    const enrollments: CourseTagEnrollment[] = [
      { courseSlug: "kurs-x", enrolledAt: NOW.toISOString(), completedAt: null },
    ];
    const dayProgress: CourseTagDayProgress[] = [
      { courseSlug: "kurs-x", day: 2, startedAt: new Date(NOW.getTime() - 10 * DAY_MS).toISOString() },
      { courseSlug: "kurs-x", day: 3, startedAt: new Date(NOW.getTime() - 1 * DAY_MS).toISOString() },
    ];
    const tags = computeCourseTags(enrollments, dayProgress, NOW);
    expect(tags.has("porzucil-kurs-x-dzien-2")).toBe(false);
    // Day 3 itself is too recent to count as abandoned yet.
    expect(tags.has("porzucil-kurs-x-dzien-3")).toBe(false);
  });

  it("only tags the highest qualifying day, not every stale day", () => {
    const enrollments: CourseTagEnrollment[] = [
      { courseSlug: "kurs-x", enrolledAt: NOW.toISOString(), completedAt: null },
    ];
    const dayProgress: CourseTagDayProgress[] = [
      { courseSlug: "kurs-x", day: 1, startedAt: new Date(NOW.getTime() - 20 * DAY_MS).toISOString() },
      { courseSlug: "kurs-x", day: 2, startedAt: new Date(NOW.getTime() - 10 * DAY_MS).toISOString() },
    ];
    const tags = computeCourseTags(enrollments, dayProgress, NOW);
    const abandonTags = [...tags].filter((t) => t.startsWith("porzucil-"));
    expect(abandonTags).toEqual(["porzucil-kurs-x-dzien-2"]);
  });

  it("handles several enrollments independently", () => {
    const enrollments: CourseTagEnrollment[] = [
      { courseSlug: "kurs-a", enrolledAt: NOW.toISOString(), completedAt: NOW.toISOString() },
      { courseSlug: "kurs-b", enrolledAt: NOW.toISOString(), completedAt: null },
    ];
    const tags = computeCourseTags(enrollments, [], NOW);
    expect(tags.has("zapisany-na-kurs-a")).toBe(true);
    expect(tags.has("ukonczyl-kurs-a")).toBe(true);
    expect(tags.has("zapisany-na-kurs-b")).toBe(true);
    expect(tags.has("ukonczyl-kurs-b")).toBe(false);
  });
});

describe("computeReadingTags", () => {
  const slugToCategory = new Map<string, string>([
    ["post-a", "habits-routines"],
    ["post-b", "habits-routines"],
    ["post-c", "emotional-intelligence"],
    ["post-d", "not-allowlisted-category"],
  ]);
  const allowedCategories = new Set(["habits-routines", "emotional-intelligence"]);

  function eventsAt(userId: string, targetId: string, count: number, daysAgo: number): ReadingEvent[] {
    return Array.from({ length: count }, () => ({
      userId,
      targetId,
      occurredAt: new Date(NOW.getTime() - daysAgo * DAY_MS).toISOString(),
    }));
  }

  it("requires at least 3 events in the same category within 30 days", () => {
    const events = eventsAt("u1", "post-a", 2, 1);
    const result = computeReadingTags(events, slugToCategory, allowedCategories, NOW);
    expect(result.has("u1")).toBe(false);
  });

  it("tags once the threshold of 3 is reached, across posts in the same category", () => {
    const events = [...eventsAt("u1", "post-a", 2, 1), ...eventsAt("u1", "post-b", 1, 2)];
    const result = computeReadingTags(events, slugToCategory, allowedCategories, NOW);
    expect(result.get("u1")?.has("czyta-habits-routines")).toBe(true);
  });

  it("ignores events older than the 30-day window", () => {
    const events = eventsAt("u1", "post-a", 3, 31);
    const result = computeReadingTags(events, slugToCategory, allowedCategories, NOW);
    expect(result.has("u1")).toBe(false);
  });

  it("ignores categories outside the allowlist", () => {
    const events = eventsAt("u1", "post-d", 5, 1);
    const result = computeReadingTags(events, slugToCategory, allowedCategories, NOW);
    expect(result.has("u1")).toBe(false);
  });

  it("ignores events for slugs with no known category", () => {
    const events = eventsAt("u1", "unknown-post", 5, 1);
    const result = computeReadingTags(events, slugToCategory, allowedCategories, NOW);
    expect(result.has("u1")).toBe(false);
  });

  it("keeps users and categories separate", () => {
    const events = [
      ...eventsAt("u1", "post-a", 3, 1),
      ...eventsAt("u2", "post-c", 3, 1),
      ...eventsAt("u1", "post-c", 2, 1),
    ];
    const result = computeReadingTags(events, slugToCategory, allowedCategories, NOW);
    expect(result.get("u1")).toEqual(new Set(["czyta-habits-routines"]));
    expect(result.get("u2")).toEqual(new Set(["czyta-emotional-intelligence"]));
  });
});

describe("diffAutoTags", () => {
  it("adds newly desired tags and removes ones no longer desired", () => {
    const desired = new Set(["zapisany-na-kurs-x", "czyta-habits-routines"]);
    const existingAuto = new Set(["zapisany-na-kurs-x", "porzucil-kurs-x-dzien-2"]);
    const diff = diffAutoTags(desired, existingAuto);
    expect(diff.toAdd).toEqual(["czyta-habits-routines"]);
    expect(diff.toRemove).toEqual(["porzucil-kurs-x-dzien-2"]);
  });

  it("adds nothing and removes nothing when already in sync", () => {
    const set = new Set(["ukonczyl-kurs-x"]);
    const diff = diffAutoTags(set, set);
    expect(diff.toAdd).toEqual([]);
    expect(diff.toRemove).toEqual([]);
  });

  it("never proposes removing a manual tag, because manual tags are never passed in", () => {
    // The caller (applyAutoTags) only ever builds `existingAuto` from rows
    // where source = 'auto'; a manual tag simply never reaches this
    // function, so it can never show up in `toRemove`.
    const desired = new Set<string>([]);
    const existingAutoOnly = new Set(["porzucil-kurs-x-dzien-2"]); // manual tag excluded by the caller
    const diff = diffAutoTags(desired, existingAutoOnly);
    expect(diff.toRemove).toEqual(["porzucil-kurs-x-dzien-2"]);
    expect(diff.toRemove).not.toContain("nadany-recznie");
  });
});
