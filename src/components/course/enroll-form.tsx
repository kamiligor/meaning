"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EnrollFormProps {
  courseSlug: string;
  coursePath: string;
  /** Whether to ask for the screen-time baseline numbers (niescrollowanie). */
  askBaseline: boolean;
  /** Open the form immediately (arriving back from login). */
  initialOpen?: boolean;
}

/**
 * Enrollment for a logged-in user: optional baseline numbers (they come
 * back in the final-day summary), a reminders opt-out, and the activity
 * notice.
 */
export function EnrollForm({
  courseSlug,
  coursePath,
  askBaseline,
  initialOpen = false,
}: EnrollFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [screenTime, setScreenTime] = useState("");
  const [pickups, setPickups] = useState("");
  const [reminders, setReminders] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return (
      <Button size="lg" onClick={() => setOpen(true)}>
        Zapisz się za darmo
      </Button>
    );
  }

  // An untouched field means "not provided", never zero.
  const toNumber = (value: string): number | undefined => {
    if (!value.trim()) return undefined;
    const parsed = Number(value.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 0) return undefined;
    return Math.round(parsed);
  };

  const enroll = async (skipBaseline: boolean) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/course/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          baselineScreenTimeMin:
            askBaseline && !skipBaseline ? toNumber(screenTime) : undefined,
          baselinePickups:
            askBaseline && !skipBaseline ? toNumber(pickups) : undefined,
          remindersEnabled: reminders,
        }),
      });
      if (!res.ok) throw new Error("enroll failed");
      router.push(`${coursePath}/dzien/1`);
      router.refresh();
    } catch {
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void enroll(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white border border-[#e2e7eb] rounded-xl p-6 text-left"
    >
      {askBaseline ? (
        <>
          <h2 className="text-lg font-medium text-[#1E2A36] mb-1">
            Zanim zaczniesz: dwie liczby
          </h2>
          <p className="text-sm text-[#4A5B6A] mb-2 leading-relaxed">
            Zajrzyj do ustawień telefonu i przepisz dwie wartości z ostatnich
            dni. Znajdziesz je w: iPhone: Ustawienia → Czas przed ekranem;
            Android: Ustawienia → Cyfrowa równowaga. Wrócą do ciebie
            w bilansie piątego dnia.
          </p>
          <p className="text-sm text-[#8A99A8] mb-4 leading-relaxed">
            Jakiekolwiek są te liczby, są tylko punktem startu. Nikt ich nie
            ocenia.
          </p>

          <label className="block mb-3">
            <span className="text-sm text-[#1E2A36]">
              Czas ekranowy dziennie (minuty)
            </span>
            <input
              type="number"
              min={0}
              max={1440}
              value={screenTime}
              onChange={(e) => setScreenTime(e.target.value)}
              placeholder="np. 240"
              className="mt-1 w-full border border-[#e2e7eb] rounded-lg px-4 py-2.5 text-sm text-[#1E2A36] placeholder:text-[#8A99A8] focus:outline-none focus:ring-2 focus:ring-[#7B9E8C] focus:ring-offset-1"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm text-[#1E2A36]">
              Liczba podniesień telefonu dziennie
            </span>
            <input
              type="number"
              min={0}
              max={1000}
              value={pickups}
              onChange={(e) => setPickups(e.target.value)}
              placeholder="np. 120"
              className="mt-1 w-full border border-[#e2e7eb] rounded-lg px-4 py-2.5 text-sm text-[#1E2A36] placeholder:text-[#8A99A8] focus:outline-none focus:ring-2 focus:ring-[#7B9E8C] focus:ring-offset-1"
            />
          </label>
        </>
      ) : (
        <>
          <h2 className="text-lg font-medium text-[#1E2A36] mb-1">
            Jeszcze jedno kliknięcie
          </h2>
          <p className="text-sm text-[#4A5B6A] mb-4 leading-relaxed">
            Kurs jest darmowy i zaczyna się od razu. Zdecyduj tylko, czy chcesz
            dostawać przypomnienia o kolejnych dniach.
          </p>
        </>
      )}

      <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={reminders}
          onChange={(e) => setReminders(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#7B9E8C]"
        />
        <span className="text-sm text-[#4A5B6A] leading-relaxed">
          Przypomnij mi mailem, kiedy odblokuje się kolejny dzień (jedno
          krótkie przypomnienie dziennie, bez presji, można wyłączyć w każdej
          chwili).
        </span>
      </label>

      <p className="text-xs text-[#8A99A8] mb-4 leading-relaxed">
        Postęp w kursie (dni, quizy, check-iny) zapisuje się na twoim koncie.
        Osobiste notatki są szyfrowane. Wszystko możesz wyeksportować albo
        usunąć razem z kontem.
      </p>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Zapisywanie..." : "Zaczynam dzień 1"}
      </Button>

      {askBaseline && (
        <button
          type="button"
          onClick={() => void enroll(true)}
          disabled={loading}
          className="w-full mt-2 text-sm text-[#8A99A8] hover:text-[#7B9E8C] py-2"
        >
          Pomiń liczby i zacznij
        </button>
      )}
    </form>
  );
}
