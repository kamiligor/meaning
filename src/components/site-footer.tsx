"use client";

import type { Locale } from "@/lib/i18n";
import { setLocaleCookieClient } from "@/lib/locale-cookie";

export function SiteFooter({ locale }: { locale: Locale }) {
  function switchLocale(code: Locale) {
    if (code === locale) return;
    localStorage.setItem("jh-locale", code);
    setLocaleCookieClient(code);
    window.location.reload();
  }

  return (
    <footer className="border-t border-[#F1F4F6] py-8">
      <div className="max-w-5xl mx-auto px-5 md:px-8 flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-0">
        {/* Left — Instagram */}
        <a
          href="https://instagram.com/justhavealittlemeaning"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#8A99A8] hover:text-[#7B9E8C] transition-colors duration-200 order-2 md:order-1"
        >
          @justhavealittlemeaning
        </a>

        {/* Center — tagline */}
        <p className="text-xs text-[#8A99A8] tracking-widest uppercase order-1 md:order-2">
          Just have a little meaning
        </p>

        {/* Right — language switcher */}
        <div className="flex items-center gap-1 order-3">
          {locale === "en" ? (
            <span className="text-xs font-semibold tracking-wider px-2 py-1 text-[#7B9E8C]">EN</span>
          ) : (
            <button
              onClick={() => switchLocale("en")}
              className="text-xs font-semibold tracking-wider px-2 py-1 rounded transition-colors duration-200 cursor-pointer text-[#8A99A8] hover:text-[#7B9E8C]"
            >
              EN
            </button>
          )}
          <span className="text-[#d1d8de] text-xs" aria-hidden="true">|</span>
          {locale === "pl" ? (
            <span className="text-xs font-semibold tracking-wider px-2 py-1 text-[#7B9E8C]">PL</span>
          ) : (
            <button
              onClick={() => switchLocale("pl")}
              className="text-xs font-semibold tracking-wider px-2 py-1 rounded transition-colors duration-200 cursor-pointer text-[#8A99A8] hover:text-[#7B9E8C]"
            >
              PL
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
