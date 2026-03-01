"use client";

import { Button } from "@/components/ui/button";

interface EmotionalCheckinProps {
  onOk: () => void;
  onBreak: () => void;
  onNeedHelp: () => void;
}

export function EmotionalCheckin({
  onOk,
  onBreak,
  onNeedHelp,
}: EmotionalCheckinProps) {
  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="bg-white rounded-xl border border-[#e2e7eb] p-6 text-center">
        <h3 className="text-lg font-medium text-[#1E2A36] mb-6">
          Jak sie teraz czujesz?
        </h3>
        <div className="flex flex-col gap-3">
          <Button onClick={onOk} className="w-full">
            W porzadku — chce kontynuowac
          </Button>
          <Button onClick={onBreak} variant="outline" className="w-full">
            Potrzebuje przerwy
          </Button>
          <Button
            onClick={onNeedHelp}
            variant="ghost"
            className="w-full text-[#7B9E8C]"
          >
            Czuje sie zle i potrzebuje wsparcia
          </Button>
        </div>
      </div>
    </div>
  );
}
