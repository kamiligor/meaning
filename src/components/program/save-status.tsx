"use client";

import type { SaveStatus } from "@/hooks/use-autosave";
import { Check, Loader2, WifiOff, AlertCircle } from "lucide-react";

const statusConfig: Record<
  SaveStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  idle: {
    label: "",
    icon: null,
    className: "text-transparent",
  },
  saving: {
    label: "Zapisywanie...",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    className: "text-[#8A99A8]",
  },
  saved: {
    label: "Zapisano",
    icon: <Check className="h-3.5 w-3.5" />,
    className: "text-[#7B9E8C]",
  },
  offline: {
    label: "Offline — zapisano lokalnie",
    icon: <WifiOff className="h-3.5 w-3.5" />,
    className: "text-amber-600",
  },
  error: {
    label: "Blad zapisu — zapisano lokalnie",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    className: "text-red-500",
  },
};

interface SaveStatusIndicatorProps {
  status: SaveStatus;
}

export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`flex items-center gap-1.5 text-xs ${config.className} transition-colors`}
      aria-live="polite"
      role="status"
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}
