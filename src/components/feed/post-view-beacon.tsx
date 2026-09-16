"use client";

import { useEffect } from "react";
import { sendAnalyticsBeacon } from "@/lib/analytics-client";

/**
 * Counts one view of a post. Post pages are statically prerendered, so the
 * server never sees the request; the count has to come from the browser.
 * Fires once per mount; the server deduplicates per visitor and post anyway.
 */
export function PostViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    sendAnalyticsBeacon("post_view", slug);
  }, [slug]);
  return null;
}
