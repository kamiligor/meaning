"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const RATING_OPTIONS = [
  { value: "worth_it", label: "Tak, było warte tych 5 dni" },
  { value: "mixed", label: "Częściowo" },
  { value: "not_for_me", label: "To nie było dla mnie" },
] as const;

interface FeedbackFormProps {
  courseSlug: string;
  onDone: () => void;
}

export function FeedbackForm({ courseSlug, onDone }: FeedbackFormProps) {
  const [rating, setRating] = useState<string | null>(null);
  const [hardest, setHardest] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/course/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          rating,
          hardest: hardest.trim() || undefined,
          suggestion: suggestion.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("feedback failed");
      onDone();
    } catch {
      setError("Nie udało się zapisać. Sprawdź połączenie i spróbuj ponownie.");
      setSaving(false);
    }
  };

  return (
    <section className="mb-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e2e7eb] rounded-xl p-6"
      >
        <h2 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider mb-3">
          Na koniec: dwa słowa od ciebie
        </h2>
        <p className="text-sm text-[#4A5B6A] leading-relaxed mb-5">
          Ten feedback trafia do twórcy kursu (w przeciwieństwie do twoich
          check-inów nie jest szyfrowany) i realnie wpływa na to, jak będzie
          wyglądała kolejna edycja.
        </p>

        <p className="font-medium text-[#1E2A36] mb-3">
          Czy kurs był wart tych pięciu dni?
        </p>
        <div className="space-y-2.5 mb-5">
          {RATING_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRating(option.value)}
              className={`w-full text-left rounded-xl border-2 p-3.5 transition-colors ${
                rating === option.value
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

        <label className="block mb-4">
          <span className="text-sm text-[#1E2A36]">
            Co było najtrudniejsze? (opcjonalnie)
          </span>
          <textarea
            value={hardest}
            onChange={(e) => setHardest(e.target.value)}
            rows={2}
            maxLength={2000}
            className="mt-1 w-full border border-[#e2e7eb] rounded-lg px-4 py-2.5 text-sm text-[#1E2A36] focus:outline-none focus:ring-2 focus:ring-[#7B9E8C] focus:ring-offset-1 resize-none"
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm text-[#1E2A36]">
            Co warto zmienić? (opcjonalnie)
          </span>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            rows={2}
            maxLength={2000}
            className="mt-1 w-full border border-[#e2e7eb] rounded-lg px-4 py-2.5 text-sm text-[#1E2A36] focus:outline-none focus:ring-2 focus:ring-[#7B9E8C] focus:ring-offset-1 resize-none"
          />
        </label>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <Button type="submit" className="w-full" disabled={!rating || saving}>
          {saving ? "Wysyłanie..." : "Wyślij i zakończ kurs"}
        </Button>
      </form>
    </section>
  );
}
