"use client";

import { Progress } from "@/components/ui/progress";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface ProgressBarProps {
  completed: number;
  total: number;
  locale: Locale;
}

export function ProgressBar({ completed, total, locale }: ProgressBarProps) {
  const d = t(locale);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#4A5B6A]">
          {d.progressCompleted}: {completed}/{total} {d.progressExercises}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
