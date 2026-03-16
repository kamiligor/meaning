"use client";

import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface DisclaimerGateProps {
  onAccept: () => void;
  locale: Locale;
}

export function DisclaimerGate({ onAccept, locale }: DisclaimerGateProps) {
  const d = t(locale);

  return (
    <div className="max-w-lg mx-auto text-center py-12 px-4">
      <div className="bg-white rounded-xl border border-[#e2e7eb] p-8 shadow-sm">
        <p className="text-[#1E2A36] leading-relaxed mb-2">
          {d.disclaimerBody}
        </p>
        <p className="text-[#4A5B6A] text-sm leading-relaxed mb-2">
          {d.disclaimerCrisis}
        </p>
        <p className="text-sm text-[#7B9E8C] mb-6">
          {d.disclaimerHotlines}
        </p>
        <Button onClick={onAccept} className="w-full">
          {d.disclaimerAcceptButton}
        </Button>
      </div>
    </div>
  );
}
