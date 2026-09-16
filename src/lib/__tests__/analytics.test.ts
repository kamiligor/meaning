import { describe, it, expect } from "vitest";
import {
  dailyVisitorHash,
  isLikelyBot,
  isOwnOrigin,
  parseBeacon,
  clientIp,
} from "@/lib/analytics";

const SECRET = "test-secret";

describe("dailyVisitorHash", () => {
  it("is stable within a day and different across days", () => {
    const morning = new Date("2026-09-14T06:00:00+02:00");
    const evening = new Date("2026-09-14T23:30:00+02:00");
    const nextDay = new Date("2026-09-15T00:30:00+02:00");
    const a = dailyVisitorHash("1.2.3.4", "UA", morning, SECRET);
    const b = dailyVisitorHash("1.2.3.4", "UA", evening, SECRET);
    const c = dailyVisitorHash("1.2.3.4", "UA", nextDay, SECRET);
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it("depends on ip, user agent and secret", () => {
    const now = new Date("2026-09-14T12:00:00Z");
    const base = dailyVisitorHash("1.2.3.4", "UA", now, SECRET);
    expect(dailyVisitorHash("1.2.3.5", "UA", now, SECRET)).not.toBe(base);
    expect(dailyVisitorHash("1.2.3.4", "UB", now, SECRET)).not.toBe(base);
    expect(dailyVisitorHash("1.2.3.4", "UA", now, "other")).not.toBe(base);
  });

  it("never contains the ip or user agent", () => {
    const hash = dailyVisitorHash("203.0.113.9", "Mozilla/5.0 Test", new Date(), SECRET);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain("203.0.113.9");
  });

  it("throws without a secret", () => {
    expect(() => dailyVisitorHash("1.2.3.4", "UA", new Date(), undefined)).toThrow();
  });
});

describe("isLikelyBot", () => {
  it("flags crawlers, previews and empty agents", () => {
    expect(isLikelyBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isLikelyBot("facebookexternalhit/1.1")).toBe(true);
    expect(isLikelyBot("curl/8.0")).toBe(true);
    expect(isLikelyBot(null)).toBe(true);
    expect(isLikelyBot("")).toBe(true);
  });

  it("lets ordinary browsers through", () => {
    expect(
      isLikelyBot(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1"
      )
    ).toBe(false);
  });
});

describe("isOwnOrigin", () => {
  it("accepts both site hosts and localhost", () => {
    expect(isOwnOrigin(new Headers({ origin: "https://justmeaning.com" }))).toBe(true);
    expect(isOwnOrigin(new Headers({ origin: "https://www.poprostusens.pl" }))).toBe(true);
    expect(isOwnOrigin(new Headers({ referer: "http://pl.localhost:3000/post/x" }))).toBe(true);
  });

  it("rejects foreign or missing origins", () => {
    expect(isOwnOrigin(new Headers({ origin: "https://evil.example" }))).toBe(false);
    expect(isOwnOrigin(new Headers())).toBe(false);
    expect(isOwnOrigin(new Headers({ origin: "not a url" }))).toBe(false);
  });
});

describe("parseBeacon", () => {
  it("accepts allowed shapes only", () => {
    expect(parseBeacon({ event: "post_view", targetId: "moj-post" })).toEqual({
      event: "post_view",
      targetId: "moj-post",
    });
    expect(parseBeacon({ event: "login" })).toEqual({ event: "login", targetId: null });
  });

  it("rejects unknown events, bad slugs and extra identity", () => {
    expect(parseBeacon({ event: "click", targetId: "x" })).toBeNull();
    expect(parseBeacon({ event: "post_view" })).toBeNull();
    expect(parseBeacon({ event: "post_view", targetId: "../etc" })).toBeNull();
    expect(parseBeacon({ event: "login", targetId: "x" })).toBeNull();
    expect(parseBeacon(null)).toBeNull();
    expect(parseBeacon("post_view")).toBeNull();
  });
});

describe("clientIp", () => {
  it("takes the first forwarded address", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe("9.9.9.9");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
