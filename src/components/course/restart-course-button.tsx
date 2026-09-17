"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * "Take the course again": archives the finished run and opens day 1.
 * Shown only when the course is completed; the API refuses otherwise.
 */
export function RestartCourseButton({
  courseSlug,
  coursePath,
  variant = "outline",
}: {
  courseSlug: string;
  coursePath: string;
  variant?: "outline" | "default";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    const sure = window.confirm(
      "Zacząć kurs od dnia 1? Twoje dotychczasowe notatki i odpowiedzi zostają zapisane w archiwum, a dni otwierają się od nowa, jeden dziennie."
    );
    if (!sure) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/course/restart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      if (!res.ok) throw new Error(String(res.status));
      router.push(`${coursePath}/dzien/1`);
      router.refresh();
    } catch {
      setError("Nie udało się zacząć od nowa. Spróbuj za chwilę.");
      setBusy(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <Button variant={variant} onClick={handleClick} disabled={busy}>
        {busy ? "Chwila..." : "Przejdź kurs jeszcze raz"}
      </Button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
