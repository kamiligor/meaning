import { describe, it, expect } from "vitest";
import {
  addDays,
  dayBoundsUtc,
  dayStartUtc,
  groupCounts,
  warsawToday,
} from "@/lib/analytics-aggregate";

describe("warsawToday", () => {
  it("uses the Warsaw calendar, not UTC", () => {
    // 23:30 UTC on Jan 1 is already Jan 2 in Warsaw (UTC+1 in winter).
    expect(warsawToday(new Date("2026-01-01T23:30:00Z"))).toBe("2026-01-02");
  });
});

describe("addDays", () => {
  it("adds and subtracts whole days, crossing month and year boundaries", () => {
    expect(addDays("2026-09-14", 1)).toBe("2026-09-15");
    expect(addDays("2026-09-30", 1)).toBe("2026-10-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
    expect(addDays("2026-09-14", -6)).toBe("2026-09-08");
  });
});

describe("dayStartUtc / dayBoundsUtc", () => {
  it("converts a winter (CET, UTC+1) day boundary correctly", () => {
    // 2026-01-15 00:00 Warsaw = 2026-01-14 23:00 UTC.
    expect(dayStartUtc("2026-01-15").toISOString()).toBe("2026-01-14T23:00:00.000Z");
  });

  it("converts a summer (CEST, UTC+2) day boundary correctly", () => {
    // 2026-07-15 00:00 Warsaw = 2026-07-14 22:00 UTC.
    expect(dayStartUtc("2026-07-15").toISOString()).toBe("2026-07-14T22:00:00.000Z");
  });

  it("returns a [start, end) pair spanning exactly 24 hours", () => {
    const { startIso, endIso } = dayBoundsUtc("2026-09-14");
    const spanMs = new Date(endIso).getTime() - new Date(startIso).getTime();
    expect(spanMs).toBe(24 * 60 * 60 * 1000);
    expect(startIso).toBe("2026-09-13T22:00:00.000Z");
    expect(endIso).toBe("2026-09-14T22:00:00.000Z");
  });

  it("handles the DST transition without shifting midnight", () => {
    // Poland switches CEST -> CET at 03:00 local on the last Sunday of
    // October (2026-10-25). Midnight boundaries on either side must still
    // be exactly 24h and 1h/23h apart around the transition day.
    const before = dayBoundsUtc("2026-10-24"); // still CEST (UTC+2)
    const transition = dayBoundsUtc("2026-10-25"); // the day the clocks fall back
    const after = dayBoundsUtc("2026-10-26"); // already CET (UTC+1)

    expect(before.endIso).toBe(transition.startIso);
    expect(transition.endIso).toBe(after.startIso);
    // The transition day itself is 25 hours long in real time.
    const transitionSpanMs =
      new Date(transition.endIso).getTime() - new Date(transition.startIso).getTime();
    expect(transitionSpanMs).toBe(25 * 60 * 60 * 1000);
  });
});

describe("groupCounts", () => {
  interface Row {
    slug: string;
    locale: string;
    userId: string | null;
    visitorHash: string | null;
  }

  const identity = (r: Row) => r.userId ?? r.visitorHash;

  it("counts rows and distinct identities per (dimension, locale, extra)", () => {
    const rows: Row[] = [
      { slug: "a", locale: "pl", userId: "u1", visitorHash: null },
      { slug: "a", locale: "pl", userId: "u1", visitorHash: null }, // same user twice
      { slug: "a", locale: "pl", userId: "u2", visitorHash: null },
      { slug: "a", locale: "en", userId: "u3", visitorHash: null }, // different locale
      { slug: "b", locale: "pl", userId: null, visitorHash: "h1" },
    ];

    const result = groupCounts(
      "post_view",
      rows,
      (r) => ({ dimension: r.slug, locale: r.locale, extra: "" }),
      identity
    );

    const byKey = new Map(result.map((r) => [`${r.dimension}:${r.locale}`, r]));

    expect(byKey.get("a:pl")).toMatchObject({ metric: "post_view", count: 3, uniqueCount: 2 });
    expect(byKey.get("a:en")).toMatchObject({ metric: "post_view", count: 1, uniqueCount: 1 });
    expect(byKey.get("b:pl")).toMatchObject({ metric: "post_view", count: 1, uniqueCount: 1 });
  });

  it("treats rows with no resolvable identity as distinct visitors, never merged", () => {
    const rows: Row[] = [
      { slug: "a", locale: "pl", userId: null, visitorHash: null },
      { slug: "a", locale: "pl", userId: null, visitorHash: null },
    ];
    const result = groupCounts(
      "login",
      rows,
      () => ({ dimension: "", locale: "", extra: "" }),
      identity
    );
    expect(result).toEqual([{ metric: "login", dimension: "", locale: "", extra: "", count: 2, uniqueCount: 2 }]);
  });

  it("returns nothing for an empty input", () => {
    expect(groupCounts("post_view", [], () => ({ dimension: "", locale: "", extra: "" }), identity)).toEqual([]);
  });
});
