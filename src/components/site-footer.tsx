"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { equivalentPath, urlForLocale, standardsPath } from "@/lib/domains";
import { t } from "@/lib/i18n";
import { logoAlt } from "@/lib/brand";

export function SiteFooter({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [host, setHost] = useState<string | null>(null);

  // Host is only known in the browser; until then fall back to the
  // production domains, which is what server-rendered HTML should contain.
  useEffect(() => setHost(window.location.host), []);

  function otherLocaleUrl(code: Locale): string {
    return urlForLocale(code, equivalentPath(pathname, code), host);
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

        {/* Center — wordmark, in the language of this domain */}
        <div className="flex flex-col items-center gap-1 order-1 md:order-2">
          <p className="text-xs text-[#8A99A8] tracking-widest uppercase">
            {logoAlt(locale)}
          </p>
          <a
            href={standardsPath(locale)}
            className="text-[11px] text-[#b3bec8] hover:text-[#7B9E8C] transition-colors"
          >
            {t(locale).navStandards}
          </a>
        </div>

        {/* Right — language switcher */}
        <div className="flex items-center gap-1 order-3">
          {locale === "en" ? (
            <span className="text-xs font-semibold tracking-wider px-2 py-1 text-[#7B9E8C]">EN</span>
          ) : (
            <a
              href={otherLocaleUrl("en")}
              hrefLang="en"
              className="text-xs font-semibold tracking-wider px-2 py-1 rounded transition-colors duration-200 cursor-pointer text-[#8A99A8] hover:text-[#7B9E8C]"
            >
              EN
            </a>
          )}
          <span className="text-[#d1d8de] text-xs" aria-hidden="true">|</span>
          {locale === "pl" ? (
            <span className="text-xs font-semibold tracking-wider px-2 py-1 text-[#7B9E8C]">PL</span>
          ) : (
            <a
              href={otherLocaleUrl("pl")}
              hrefLang="pl"
              className="text-xs font-semibold tracking-wider px-2 py-1 rounded transition-colors duration-200 cursor-pointer text-[#8A99A8] hover:text-[#7B9E8C]"
            >
              PL
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
