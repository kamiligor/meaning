"use client";

import { useSyncExternalStore } from "react";

/**
 * Countdown TO an unlock (evening note at 18:00, next day at midnight),
 * Warsaw clock. Deliberately one-directional: the platform bans pressure
 * timers, and counting toward something opening is anticipation, not a
 * deadline. Returns null once the moment has passed (and on the server).
 */

function minutesNowInWarsaw(): number {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  const [hours, minutes] = formatted.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatLeft(until: "evening" | "midnight"): string | null {
  const target = until === "evening" ? 18 * 60 : 24 * 60;
  const diff = target - minutesNowInWarsaw();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} godz.` : `${hours} godz. ${minutes} min`;
}

function subscribeMinute(onTick: () => void): () => void {
  const id = setInterval(onTick, 60_000);
  return () => clearInterval(id);
}

/** Re-renders every minute; null before hydration and after the unlock. */
export function useCountdown(until: "evening" | "midnight"): string | null {
  return useSyncExternalStore(
    subscribeMinute,
    () => formatLeft(until),
    () => null
  );
}

export function UnlockCountdown({ until }: { until: "evening" | "midnight" }) {
  const left = useCountdown(until);
  if (!left) return null;
  return <span> (za {left})</span>;
}
