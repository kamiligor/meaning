"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentWarningProps {
  warning: string;
  onContinue: () => void;
  onSkip: () => void;
  onGoBack: () => void;
}

export function ContentWarning({
  warning,
  onContinue,
  onSkip,
  onGoBack,
}: ContentWarningProps) {
  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[#1E2A36] leading-relaxed">
              {warning.replace(/\n(?!\n)/g, " ").trim()}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button onClick={onContinue} className="flex-1">
            Kontynuuj
          </Button>
          <Button onClick={onSkip} variant="outline" className="flex-1">
            Pomiń to ćwiczenie
          </Button>
          <Button onClick={onGoBack} variant="ghost" className="flex-1">
            Wróć później
          </Button>
        </div>
      </div>
    </div>
  );
}
