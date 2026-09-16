"use client";

/**
 * Browser side of first-party analytics. One function, no state, no storage:
 * nothing is written to cookies or localStorage, ever.
 *
 * The beacon is skipped for prerenders and automated browsers so that
 * speculative loads and test runs do not count as readers.
 */
export type ClientAnalyticsEvent = "post_view" | "post_read" | "login";

export function sendAnalyticsBeacon(
  event: ClientAnalyticsEvent,
  targetId?: string
): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  if (navigator.webdriver) return;
  const doc = document as Document & { prerendering?: boolean };
  if (doc.prerendering) return;

  const body = JSON.stringify(
    targetId === undefined ? { event } : { event, targetId }
  );

  try {
    // text/plain keeps sendBeacon simple (no CORS preflight); the server
    // accepts both this and application/json.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "text/plain" });
      if (navigator.sendBeacon("/api/t", blob)) return;
    }
    void fetch("/api/t", {
      method: "POST",
      body,
      headers: { "Content-Type": "text/plain" },
      keepalive: true,
      credentials: "same-origin",
    });
  } catch {
    // Analytics must never surface as an error to the reader.
  }
}
