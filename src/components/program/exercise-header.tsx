import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface ExerciseHeaderProps {
  /** e.g. "Moduł I" */
  moduleLabel: string;
  /** e.g. "przeszlosc" */
  moduleSlug: string;
  /** e.g. "Ćwiczenie 3" */
  exerciseLabel: string;
  /** Is it the gate exercise (no module link) */
  isGate?: boolean;
  locale: Locale;
}

export function ExerciseHeader({
  moduleLabel,
  moduleSlug,
  exerciseLabel,
  isGate = false,
  locale,
}: ExerciseHeaderProps) {
  const d = t(locale);
  const backHref = "/program/dashboard";
  const backLabel = d.programDashboard;

  return (
    <header className="border-b border-[#e2e7eb] bg-white">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: back */}
        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-sm text-[#4A5B6A] hover:text-[#7B9E8C] transition-colors"
          aria-label={`${d.back}: ${backLabel}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>

        {/* Center: breadcrumb */}
        <span className="text-sm text-[#8A99A8]">
          <span className="hidden sm:inline">
            {isGate ? exerciseLabel : `${moduleLabel} · ${exerciseLabel}`}
          </span>
          <span className="sm:hidden">{exerciseLabel}</span>
        </span>

        {/* Right: empty slot for layout balance */}
        <span className="w-16" aria-hidden="true" />
      </nav>
    </header>
  );
}
