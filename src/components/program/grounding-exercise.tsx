"use client";

import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface GroundingExerciseProps {
  onDashboard: () => void;
  onContinue: () => void;
  locale: Locale;
}

export function GroundingExercise({
  onDashboard,
  onContinue,
  locale,
}: GroundingExerciseProps) {
  const d = t(locale);

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="bg-[#e8f0eb] rounded-xl p-6">
        <h3 className="text-lg font-medium text-[#1E2A36] mb-4">
          {d.groundingTitle}
        </h3>
        <p className="text-[#4A5B6A] mb-4">
          {d.groundingIntro}
        </p>
        <p className="text-[#4A5B6A] mb-3">
          {d.groundingInstruction}
        </p>
        <ul className="space-y-2 text-[#1E2A36] mb-6">
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">5</span>
            {d.groundingSee}
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">4</span>
            {d.groundingHear}
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">3</span>
            {d.groundingTouch}
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">2</span>
            {d.groundingSmell}
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">1</span>
            {d.groundingTaste}
          </li>
        </ul>
        <p className="text-[#4A5B6A] mb-6">
          {d.groundingClose}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onDashboard} variant="outline" className="flex-1">
            {d.groundingDashboard}
          </Button>
          <Button onClick={onContinue} className="flex-1">
            {d.groundingContinue}
          </Button>
        </div>
      </div>
    </div>
  );
}
