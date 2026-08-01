import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { logoSvgPath, logoAlt } from "@/lib/brand";
import { isProgramAdmin } from "@/lib/admin-email";
import type { ReactNode } from "react";

interface SiteHeaderProps {
  locale: Locale;
  variant?: "default" | "compact";
  backHref?: string;
  backLabel?: string;
  langSwitcher?: ReactNode;
}

export async function SiteHeader({
  locale,
  variant = "default",
  backHref,
  backLabel,
  langSwitcher,
}: SiteHeaderProps) {
  let isLoggedIn = false;
  let showProgramLink = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
    showProgramLink = isProgramAdmin(user?.email);
  } catch {
    // Supabase unreachable — continue as logged out
  }
  const d = t(locale);
  const isCompact = variant === "compact";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F1F4F6]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between gap-4">

        {/* Left zone — back slot (always reserved) + logo */}
        <div className="flex items-center gap-3">

          {/* Back button slot — always takes space so logo never shifts */}
          <div className="w-5 sm:w-14 shrink-0 flex items-center">
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

          {/* Logo */}
          <a
            href="/"
            className="shrink-0 block h-12 md:h-14"
            aria-label={`${logoAlt(locale)} — home`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSvgPath(locale)}
              alt={logoAlt(locale)}
              className="h-full w-auto"
            />
          </a>


        </div>

        {/* Right zone — nav links + auth + lang switcher */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Nav links — visible on mobile too (compact short labels) */}
          <nav className="flex items-center gap-3 md:gap-5" aria-label="Main navigation">
            {showProgramLink && (
              <Link
                href="/program"
                className="text-[11px] font-medium tracking-widest uppercase text-[#8A99A8] hover:text-[#1E2A36] transition-colors duration-200 whitespace-nowrap"
              >
                <span className="hidden lg:inline">{d.navProgram}</span>
                <span className="lg:hidden">{d.navProgramShort}</span>
              </Link>
            )}
            <Link
              href={locale === "pl" ? "/misja" : "/mission"}
              className="text-[11px] font-medium tracking-widest uppercase text-[#8A99A8] hover:text-[#1E2A36] transition-colors duration-200 whitespace-nowrap"
            >
              <span className="hidden lg:inline">{d.navMission}</span>
              <span className="lg:hidden">{d.navMissionShort}</span>
            </Link>
          </nav>

          {/* Vertical divider — desktop only, between nav and auth */}
          <div className="hidden md:block w-px h-5 bg-[#e2e7eb]" aria-hidden="true" />

          {/* Auth label — logged in: "My Account" (green, semibold); logged out: "Log In" (muted) */}
          <Link
            href={isLoggedIn ? "/profil" : "/login"}
            className={
              isLoggedIn
                ? "text-[11px] font-semibold tracking-widest uppercase text-[#7B9E8C] hover:text-[#6a8d7b] transition-colors duration-200 whitespace-nowrap"
                : "text-[11px] font-medium tracking-widest uppercase text-[#8A99A8] hover:text-[#7B9E8C] transition-colors duration-200 whitespace-nowrap"
            }
          >
            {isLoggedIn ? d.navMyAccount : d.navLogIn}
          </Link>

          {/* Language switcher (post/mission translation switcher) */}
          {langSwitcher}

        </div>

      </div>
    </header>
  );
}
