import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { LanguageDropdown } from "@/components/feed/language-dropdown";
import type { ReactNode } from "react";

interface SiteHeaderProps {
  locale: Locale;
  variant?: "default" | "compact";
  backHref?: string;
  backLabel?: string;
  langSwitcher?: ReactNode;
}

export function SiteHeader({
  locale,
  variant = "default",
  backHref,
  backLabel,
  langSwitcher,
}: SiteHeaderProps) {
  const d = t(locale);
  const isCompact = variant === "compact";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F1F4F6]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 md:h-16 relative flex items-center justify-center">

        {/* Left slot — back button */}
        <div className="absolute left-5 md:left-8 flex items-center">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center gap-1.5 text-[#8A99A8] hover:text-[#7B9E8C] transition-colors duration-200"
              aria-label={backLabel ?? d.back}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 2L4 7L9 12"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline text-xs font-medium tracking-wide">
                {backLabel ?? d.back}
              </span>
            </Link>
          )}
        </div>

        {/* Center — logo */}
        <a
          href={`/?lang=${locale}`}
          className="flex flex-col items-center group"
          aria-label="just have a little meaning — home"
        >
          <span
            className={
              isCompact
                ? "text-sm font-extrabold text-[#1E2A36] leading-none tracking-tight group-hover:text-[#2d3f4e] transition-colors duration-200"
                : "text-base md:text-[17px] font-extrabold text-[#1E2A36] leading-none tracking-tight group-hover:text-[#2d3f4e] transition-colors duration-200"
            }
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            just
          </span>
          <span
            className={
              isCompact
                ? "text-[7px] italic text-[#8A99A8] leading-none mt-[3px] tracking-wide"
                : "text-[8px] md:text-[9px] italic text-[#8A99A8] leading-none mt-[3px] tracking-wide"
            }
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            have a little
          </span>
          <span
            className={
              isCompact
                ? "text-sm font-extrabold text-[#7B9E8C] leading-none mt-[3px] tracking-tight group-hover:text-[#6a8d7b] transition-colors duration-200"
                : "text-base md:text-[17px] font-extrabold text-[#7B9E8C] leading-none mt-[3px] tracking-tight group-hover:text-[#6a8d7b] transition-colors duration-200"
            }
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            meaning
          </span>
        </a>

        {/* Right slot — nav + actions */}
        <div className="absolute right-5 md:right-8 flex items-center gap-5 md:gap-6">

          {/* Nav links — desktop only */}
          <nav className="hidden md:flex items-center gap-5" aria-label="Main navigation">
            <Link
              href="/program"
              className="text-[11px] font-medium tracking-widest uppercase text-[#8A99A8] hover:text-[#1E2A36] transition-colors duration-200 whitespace-nowrap"
            >
              <span className="hidden lg:inline">{d.navProgram}</span>
              <span className="lg:hidden">{d.navProgramShort}</span>
            </Link>
            <Link
              href="/mission"
              className="text-[11px] font-medium tracking-widest uppercase text-[#8A99A8] hover:text-[#1E2A36] transition-colors duration-200 whitespace-nowrap"
            >
              <span className="hidden lg:inline">{d.navMission}</span>
              <span className="lg:hidden">{d.navMissionShort}</span>
            </Link>
          </nav>

          {/* Log In */}
          <Link
            href="/program/login"
            className="text-[#8A99A8] hover:text-[#7B9E8C] transition-colors duration-200"
            aria-label={d.navLogIn}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M3 16.5C3 13.5 5.5 12 9 12C12.5 12 15 13.5 15 16.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          {/* Language switcher */}
          {langSwitcher ?? <LanguageDropdown current={locale} />}
        </div>

      </div>
    </header>
  );
}
