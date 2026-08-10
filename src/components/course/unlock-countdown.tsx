"use client";

import { useSyncExternalStore } from "react";

/**
 * Countdown TO an unlock (the next day, opening at 06:00 Warsaw time —
 * mornings, not midnights). Deliberately one-directional: the platform bans
 * pressure timers, and counting toward something opening is anticipation,
 * not a deadline. Null on the server, before hydration and past the moment.
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

function formatLeft(): string | null {
  const target = 6 * 60;
  let diff = target - minutesNowInWarsaw();
  if (diff <= 0) diff += 24 * 60;
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
export function useCountdown(): string | null {
  return useSyncExternalStore(subscribeMinute, formatLeft, () => null);
}

export function UnlockCountdown() {
  const left = useCountdown();
  if (!left) return null;
  return <span> (za {left})</span>;
}
