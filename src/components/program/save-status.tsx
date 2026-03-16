"use client";

import type { ReactNode } from "react";
import type { SaveStatus } from "@/hooks/use-autosave";
import { Check, Loader2, WifiOff, AlertCircle } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface StatusConfig {
  label: string;
  icon: ReactNode;
  className: string;
}

function getStatusConfig(locale: Locale): Record<SaveStatus, StatusConfig> {
  const d = t(locale);
  return {
    idle: {
      label: "",
      icon: null,
      className: "text-transparent",
    },
    saving: {
      label: d.saveStatusSaving,
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      className: "text-[#8A99A8]",
    },
    saved: {
      label: d.saveStatusSaved,
      icon: <Check className="h-3.5 w-3.5" />,
      className: "text-[#7B9E8C]",
    },
    offline: {
      label: d.saveStatusOffline,
      icon: <WifiOff className="h-3.5 w-3.5" />,
      className: "text-amber-600",
    },
    error: {
      label: d.saveStatusError,
      icon: <AlertCircle className="h-3.5 w-3.5" />,
      className: "text-red-500",
    },
  };
}

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  locale: Locale;
}

export function SaveStatusIndicator({ status, locale }: SaveStatusIndicatorProps) {
  const config = getStatusConfig(locale)[status];

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
