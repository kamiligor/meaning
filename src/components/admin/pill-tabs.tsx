"use client";

export interface PillTabOption<T extends string> {
  key: T;
  label: string;
}

interface PillTabsProps<T extends string> {
  options: PillTabOption<T>[];
  active: T;
  onChange: (key: T) => void;
  ariaLabel?: string;
}

/**
 * Small pill-shaped tab switcher, same visual pattern as the filter tabs
 * in ModerationQueue. Reused for the locale filter on posts and the course
 * selector.
 */
export function PillTabs<T extends string>({
  options,
  active,
  onChange,
  ariaLabel,
}: PillTabsProps<T>) {
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={active === option.key}
          className={
            active === option.key
              ? "text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-[#1E2A36] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] focus-visible:ring-offset-2"
              : "text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded-lg bg-white text-[#6C7C8B] border border-[#e2e7eb] hover:text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] focus-visible:ring-offset-2"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
