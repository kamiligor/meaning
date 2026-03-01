import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../rate-limit";

describe("rate limiter", () => {
  it("allows requests within limit", () => {
    const config = { maxRequests: 3, windowMs: 10_000 };
    const key = "test-allow-" + Date.now();

    expect(checkRateLimit(key, config).allowed).toBe(true);
    expect(checkRateLimit(key, config).allowed).toBe(true);
    expect(checkRateLimit(key, config).allowed).toBe(true);
  });

  it("blocks requests over limit", () => {
    const config = { maxRequests: 2, windowMs: 10_000 };
    const key = "test-block-" + Date.now();

    expect(checkRateLimit(key, config).allowed).toBe(true);
    expect(checkRateLimit(key, config).allowed).toBe(true);

    const result = checkRateLimit(key, config);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("different keys have independent limits", () => {
    const config = { maxRequests: 1, windowMs: 10_000 };
    const key1 = "test-indep-a-" + Date.now();
    const key2 = "test-indep-b-" + Date.now();

    expect(checkRateLimit(key1, config).allowed).toBe(true);
    expect(checkRateLimit(key2, config).allowed).toBe(true);
  });
});
