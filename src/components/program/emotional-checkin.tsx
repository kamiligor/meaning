"use client";

import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface EmotionalCheckinProps {
  onOk: () => void;
  onBreak: () => void;
  locale: Locale;
}

export function EmotionalCheckin({
  onOk,
  onBreak,
  locale,
}: EmotionalCheckinProps) {
  const d = t(locale);

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="bg-white rounded-xl border border-[#e2e7eb] p-6 text-center">
        <h3 className="text-lg font-medium text-[#1E2A36] mb-6">
          {d.checkinQuestion}
        </h3>
        <div className="flex flex-col gap-3">
          <Button onClick={onOk} className="w-full">
            {d.checkinOk}
          </Button>
          <Button onClick={onBreak} variant="outline" className="w-full">
            {d.checkinBreak}
          </Button>
        </div>
      </div>
    </div>
  );
}
