import { describe, it, expect } from "vitest";
import { courses } from "@/lib/courses";
import {
  StatsQueryError,
  buildFunnel,
  compareMetric,
  maskSmall,
  median,
  medianDaysToComplete,
  parseStatsQuery,
  previousRange,
  stripAccentMarkers,
  summarizeDaily,
  type StoredStatsRow,
} from "@/lib/analytics-stats";

const NOW = new Date("2026-09-14T10:00:00Z"); // 12:00 in Warsaw, well inside 2026-09-14

describe("parseStatsQuery", () => {
  it("defaults to the last 7 days when range is missing", () => {
    const query = parseStatsQuery(new URLSearchParams(), NOW);
    expect(query).toEqual({ range: "7d", from: "2026-09-08", to: "2026-09-14" });
  });

  it("resolves today, 7d and 30d against the Warsaw calendar day", () => {
    expect(parseStatsQuery(new URLSearchParams("range=today"), NOW)).toEqual({
      range: "today",
      from: "2026-09-14",
      to: "2026-09-14",
    });
    expect(parseStatsQuery(new URLSearchParams("range=30d"), NOW)).toEqual({
      range: "30d",
      from: "2026-08-16",
      to: "2026-09-14",
    });
  });

  it("accepts a valid custom range", () => {
    const query = parseStatsQuery(
      new URLSearchParams("range=custom&from=2026-08-01&to=2026-08-31"),
      NOW
    );
    expect(query).toEqual({ range: "custom", from: "2026-08-01", to: "2026-08-31" });
  });

  it("rejects a custom range without from/to, or with a bad format", () => {
    expect(() => parseStatsQuery(new URLSearchParams("range=custom"), NOW)).toThrow(
      StatsQueryError
    );
    expect(() =>
      parseStatsQuery(new URLSearchParams("range=custom&from=01-08-2026&to=2026-08-31"), NOW)
    ).toThrow(StatsQueryError);
    expect(() =>
      parseStatsQuery(new URLSearchParams("range=custom&from=2026-02-30&to=2026-08-31"), NOW)
    ).toThrow(StatsQueryError);
  });

  it("rejects from after to", () => {
    expect(() =>
      parseStatsQuery(new URLSearchParams("range=custom&from=2026-08-31&to=2026-08-01"), NOW)
    ).toThrow(StatsQueryError);
  });

  it("rejects a custom range ending after today", () => {
    expect(() =>
      parseStatsQuery(new URLSearchParams("range=custom&from=2026-09-01&to=2026-09-20"), NOW)
    ).toThrow(StatsQueryError);
  });

  it("rejects a custom range longer than 366 days", () => {
    expect(() =>
      parseStatsQuery(new URLSearchParams("range=custom&from=2024-01-01&to=2026-09-14"), NOW)
    ).toThrow(StatsQueryError);
  });

  it("accepts a custom range of exactly 366 days", () => {
    expect(() =>
      parseStatsQuery(new URLSearchParams("range=custom&from=2025-09-15&to=2026-09-14"), NOW)
    ).not.toThrow();
  });

  it("rejects an unknown range", () => {
    expect(() => parseStatsQuery(new URLSearchParams("range=90d"), NOW)).toThrow(StatsQueryError);
  });
});

describe("previousRange", () => {
  it("shifts a 7-day range back by 7 days", () => {
    expect(previousRange({ range: "7d", from: "2026-09-08", to: "2026-09-14" })).toEqual({
      from: "2026-09-01",
      to: "2026-09-07",
    });
  });

  it("shifts a single day (today) back by one day", () => {
    expect(previousRange({ range: "today", from: "2026-09-14", to: "2026-09-14" })).toEqual({
      from: "2026-09-13",
      to: "2026-09-13",
    });
  });

  it("preserves the exact length of a custom range", () => {
    const prev = previousRange({ range: "custom", from: "2026-08-01", to: "2026-08-31" });
    expect(prev).toEqual({ from: "2026-07-01", to: "2026-07-31" });
  });
});

describe("summarizeDaily", () => {
  const query = { range: "7d" as const, from: "2026-09-08", to: "2026-09-14" };

  function row(day: string, count: number): StoredStatsRow {
    return { day, metric: "post_view", dimension: "s", locale: "pl", extra: "", count, uniqueCount: count };
  }

  it("splits rows into the current and previous period, discarding the rest", () => {
    const rows = [
      row("2026-08-20", 99), // well before previous, dropped
      row("2026-09-01", 5), // inside the previous 7 days
      row("2026-09-10", 3), // inside the current range
      row("2026-09-14", 1), // last day of the current range
      row("2026-09-15", 42), // after the range, dropped
    ];
    const { current, previous } = summarizeDaily(rows, query);
    expect(current.map((r) => r.day)).toEqual(["2026-09-10", "2026-09-14"]);
    expect(previous.map((r) => r.day)).toEqual(["2026-09-01"]);
  });
});

describe("compareMetric", () => {
  it("sums count (or unique_count) per period", () => {
    const current: StoredStatsRow[] = [
      { day: "2026-09-14", metric: "post_view", dimension: "a", locale: "pl", extra: "", count: 3, uniqueCount: 2 },
      { day: "2026-09-13", metric: "post_view", dimension: "b", locale: "pl", extra: "", count: 4, uniqueCount: 4 },
      { day: "2026-09-13", metric: "post_read", dimension: "b", locale: "pl", extra: "", count: 10, uniqueCount: 9 },
    ];
    const previous: StoredStatsRow[] = [
      { day: "2026-09-01", metric: "post_view", dimension: "a", locale: "pl", extra: "", count: 1, uniqueCount: 1 },
    ];
    expect(compareMetric(current, previous, "post_view")).toEqual({ current: 7, previous: 1 });
    expect(compareMetric(current, previous, "post_view", true)).toEqual({ current: 6, previous: 1 });
    expect(compareMetric(current, previous, "post_read")).toEqual({ current: 10, previous: 0 });
  });
});

describe("median / medianDaysToComplete", () => {
  it("returns null for an empty list", () => {
    expect(median([])).toBeNull();
    expect(medianDaysToComplete([])).toBeNull();
  });

  it("averages the two middle values for an even-length list", () => {
    expect(median([1, 3, 5, 7])).toBe(4);
  });

  it("picks the middle value for an odd-length list", () => {
    expect(median([5, 1, 3])).toBe(3);
  });

  it("computes whole days between enrolment and completion", () => {
    const pairs = [
      { enrolledAt: "2026-08-01T10:00:00Z", completedAt: "2026-08-06T10:00:00Z" }, // 5
      { enrolledAt: "2026-08-01T10:00:00Z", completedAt: "2026-08-04T10:00:00Z" }, // 3
      { enrolledAt: "2026-08-01T10:00:00Z", completedAt: "2026-08-11T10:00:00Z" }, // 10
    ];
    expect(medianDaysToComplete(pairs)).toBe(5);
  });
});

describe("buildFunnel", () => {
  const course = courses[0]; // kurs-niescrollowania, 5 days

  it("counts started (any row) and completed (completed_at set) per day", () => {
    const rows = [
      { day: 1, completedAt: "2026-08-01T10:00:00Z" },
      { day: 1, completedAt: "2026-08-01T11:00:00Z" },
      { day: 1, completedAt: null },
      { day: 2, completedAt: null },
    ];
    const funnel = buildFunnel(rows, course);
    expect(funnel[0]).toMatchObject({ day: 1, started: 3, completed: 2 });
    expect(funnel[1]).toMatchObject({ day: 2, started: 1, completed: 0 });
    expect(funnel[2]).toMatchObject({ day: 3, started: 0, completed: 0 });
    expect(funnel).toHaveLength(course.days.length);
  });

  it("fills in the real day titles", () => {
    const funnel = buildFunnel([], course);
    expect(funnel[0].title).toBe(course.days[0].title);
  });
});

describe("stripAccentMarkers", () => {
  it("removes brace accent markers without touching the enclosed words", () => {
    expect(stripAccentMarkers("Największym {prezentem} jest uwaga")).toBe(
      "Największym prezentem jest uwaga"
    );
    expect(stripAccentMarkers("Zwykły tytuł")).toBe("Zwykły tytuł");
  });
});

describe("maskSmall", () => {
  it("masks small positive counts, leaves zero and large counts alone", () => {
    expect(maskSmall(0)).toBe("0");
    expect(maskSmall(1)).toBe("<5");
    expect(maskSmall(4)).toBe("<5");
    expect(maskSmall(5)).toBe("5");
    expect(maskSmall(120)).toBe("120");
  });
});

describe("replaceDay", () => {
  it("drops stored rows for the given day before adding live ones", async () => {
    const { replaceDay } = await import("@/lib/analytics-stats");
    const rows = [
      { day: "2026-09-13", metric: "post_view", count: 3 },
      { day: "2026-09-14", metric: "post_view", count: 1 },
    ];
    const live = [{ day: "2026-09-14", metric: "post_view", count: 2 }];
    const merged = replaceDay(rows, "2026-09-14", live);
    expect(merged).toEqual([
      { day: "2026-09-13", metric: "post_view", count: 3 },
      { day: "2026-09-14", metric: "post_view", count: 2 },
    ]);
  });
});
