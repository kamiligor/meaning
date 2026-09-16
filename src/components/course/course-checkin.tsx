"use client";

import { useState } from "react";
import type { CourseCheckin as CourseCheckinContent } from "@/lib/courses";

interface CourseCheckinProps {
  courseSlug: string;
  /** The day whose page shows this check-in; it describes day - 1. */
  day: number;
  checkin: CourseCheckinContent;
}

/**
 * One-tap check-in about yesterday's challenge, sitting inline above the day
 * rather than gating it: the day is readable straight away, and picking an
 * option swaps the choices for the matching response in place. Free text lives
 * in the previous day's notebook (same data, editable there any time), so this
 * stays a single click.
 */
export function CourseCheckin({ courseSlug, day, checkin }: CourseCheckinProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const [error, setError] = useState("");

  const chosenOption = checkin.options.find((o) => o.value === choice);

  const handlePick = async (value: string) => {
    if (choice) return;
    // Optimistic: the response shows at once, the save happens behind it.
    setChoice(value);
    setError("");
    try {
      const res = await fetch("/api/course/day", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          day,
          checkin: { day: day - 1, choice: value },
        }),
      });
      if (!res.ok) throw new Error("checkin failed");
    } catch {
      setChoice(null);
      setError("Nie udało się zapisać. Sprawdź połączenie i spróbuj ponownie.");
    }
  };

  return (
    <section className="mb-10">
      <div className="bg-white border border-[#e2e7eb] rounded-xl p-5">
        <p className="text-sm font-medium text-[#1E2A36] mb-3">
          {checkin.question}
        </p>

        {chosenOption ? (
          <p className="text-sm text-[#4A5B6A] leading-relaxed">
            {chosenOption.response}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {checkin.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePick(option.value)}
                className="rounded-full border border-[#e2e7eb] bg-white px-3.5 py-1.5 text-sm text-[#1E2A36] transition-colors hover:border-[#7B9E8C] hover:bg-[#f0f7f2]"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
      </div>
    </section>
  );
}
