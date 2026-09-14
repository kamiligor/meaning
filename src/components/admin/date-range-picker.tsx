"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StatsRange } from "@/lib/analytics-types";

interface DateRangePickerProps {
  range: StatsRange;
  from: string;
  to: string;
  basePath: string;
}

const PRESETS: { key: StatsRange; label: string }[] = [
  { key: "today", label: "Dziś" },
  { key: "7d", label: "7 dni" },
  { key: "30d", label: "30 dni" },
  { key: "custom", label: "Własny" },
];

/**
 * Range control for the whole /admin/statystyki page. Drives the URL query
 * string (?range=...) instead of local state, so a chosen range survives a
 * refresh and can be linked directly.
 */
export function DateRangePicker({
  range,
  from,
  to,
  basePath,
}: DateRangePickerProps) {
  const router = useRouter();
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);

  function go(nextRange: StatsRange, f?: string, t?: string) {
    const params = new URLSearchParams();
    params.set("range", nextRange);
    if (nextRange === "custom" && f && t) {
      params.set("from", f);
      params.set("to", t);
    }
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="sticky top-[65px] z-10 -mx-6 px-6 py-3 bg-[#F1F4F6]/95 backdrop-blur-sm">
      <div
        className="flex flex-wrap items-center gap-2 overflow-x-auto"
        role="group"
        aria-label="Zakres czasu"
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() =>
              preset.key === "custom"
                ? go("custom", customFrom, customTo)
                : go(preset.key)
            }
            aria-pressed={range === preset.key}
            className={
              range === preset.key
                ? "shrink-0 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-[#1E2A36] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] focus-visible:ring-offset-2"
                : "shrink-0 text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded-lg bg-white text-[#6C7C8B] border border-[#e2e7eb] hover:text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] focus-visible:ring-offset-2"
            }
          >
            {preset.label}
          </button>
        ))}
      </div>

      {range === "custom" && (
        <form
          className="mt-3 flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            go("custom", customFrom, customTo);
          }}
        >
          <label className="flex flex-col text-xs text-[#4A5B6A]">
            Od
            <input
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={(e) => setCustomFrom(e.target.value)}
              required
              className="mt-1 rounded-lg border border-[#e2e7eb] px-2 py-1.5 text-sm text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C]"
            />
          </label>
          <label className="flex flex-col text-xs text-[#4A5B6A]">
            Do
            <input
              type="date"
              value={customTo}
              min={customFrom || undefined}
              onChange={(e) => setCustomTo(e.target.value)}
              required
              className="mt-1 rounded-lg border border-[#e2e7eb] px-2 py-1.5 text-sm text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C]"
            />
          </label>
          <button
            type="submit"
            className="h-9 px-4 rounded-lg bg-[#7B9E8C] text-white text-sm font-medium hover:bg-[#6a8d7b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] focus-visible:ring-offset-2"
          >
            Zastosuj
          </button>
        </form>
      )}
    </div>
  );
}
