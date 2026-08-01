"use client";

import { useState, useRef, useEffect } from "react";

interface Translation {
  locale: string;
  /** Absolute URL — translations live on the other language's domain. */
  href: string;
}

const LANG_LABELS: Record<string, { flag: string; label: string }> = {
  en: { flag: "EN", label: "English" },
  pl: { flag: "PL", label: "Polski" },
};

export function PostLangSwitcher({
  current,
  translations,
}: {
  current: string;
  translations: Translation[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (translations.length < 2) return null;

  const currentLang = LANG_LABELS[current] || { flag: current.toUpperCase(), label: current };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#8A99A8] hover:text-[#7B9E8C] transition px-2.5 py-1.5 rounded-lg border border-[#F1F4F6] hover:border-[#d1d8de]"
      >
        {currentLang.flag}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-[#F1F4F6] shadow-lg overflow-hidden min-w-[120px] z-50">
          {translations.map((t) => {
            const lang = LANG_LABELS[t.locale] || { flag: t.locale.toUpperCase(), label: t.locale };
            return (
              <button
                key={t.locale}
                onClick={() => {
                  setOpen(false);
                  window.location.href = t.href;
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition hover:bg-[#F5F7F9] ${
                  t.locale === current
                    ? "text-[#7B9E8C] font-semibold"
                    : "text-[#5A6875]"
                }`}
              >
                <span className="font-semibold tracking-wider">{lang.flag}</span>
                <span>{lang.label}</span>
                {t.locale === current && (
                  <svg className="w-3 h-3 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
