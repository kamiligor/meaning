"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CourseCheckin as CourseCheckinContent } from "@/lib/courses";

interface CourseCheckinProps {
  courseSlug: string;
  /** The day whose page shows this check-in; it describes day - 1. */
  day: number;
  checkin: CourseCheckinContent;
  /** Evening note written the day before, prefilled for editing. */
  initialNote?: string | null;
  onDone: () => void;
}

export function CourseCheckin({
  courseSlug,
  day,
  checkin,
  initialNote,
  onDone,
}: CourseCheckinProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const [text, setText] = useState(initialNote ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const chosenOption = checkin.options.find((o) => o.value === choice);

  const handleSubmit = async () => {
    if (!choice) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/course/day", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          day,
          checkin: { day: day - 1, choice, text: text.trim() || undefined },
        }),
      });
      if (!res.ok) throw new Error("checkin failed");
      setSaved(true);
    } catch {
      setError("Nie udało się zapisać. Sprawdź połączenie i spróbuj ponownie.");
    }
    setSaving(false);
  };

  if (saved && chosenOption) {
    return (
      <section className="mb-10">
        <div className="bg-[#f0f7f2] border border-[#c5d8cc] rounded-xl p-6">
          <p className="text-[#4A5B6A] leading-relaxed mb-5">
            {chosenOption.response}
          </p>
          <Button onClick={onDone}>Przechodzę do dnia {day}</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="bg-white border border-[#e2e7eb] rounded-xl p-6">
        <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-3">
          Zanim ruszysz dalej
        </h2>
        <p className="text-lg font-medium text-[#1E2A36] mb-5">
          {checkin.question}
        </p>

        <div className="space-y-3 mb-4">
          {checkin.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setChoice(option.value)}
              aria-pressed={choice === option.value}
              className={`w-full text-left rounded-xl border-2 p-4 transition-colors ${
                choice === option.value
                  ? "border-[#7B9E8C] bg-[#e8f0eb]"
                  : "border-[#e2e7eb] bg-white hover:border-[#c5cdd4]"
              }`}
            >
              <span className="text-sm font-medium text-[#1E2A36]">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <label className="block mb-5">
          <span className="text-sm text-[#8A99A8]">{checkin.textLabel}</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            maxLength={2000}
            className="mt-1 w-full border border-[#e2e7eb] rounded-lg px-4 py-2.5 text-sm text-[#1E2A36] placeholder:text-[#8A99A8] focus:outline-none focus:ring-2 focus:ring-[#7B9E8C] focus:ring-offset-1 resize-none"
          />
          <span className="block text-xs text-[#8A99A8] mt-1">
            Ta notatka jest szyfrowana. Nikt jej nie przeczyta, nawet my.
          </span>
        </label>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <Button onClick={handleSubmit} disabled={!choice || saving} className="w-full">
          {saving ? "Zapisywanie..." : "Dalej"}
        </Button>
      </div>
    </section>
  );
}
