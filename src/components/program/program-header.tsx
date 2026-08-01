import Link from "next/link";
import { getProgramUser } from "@/lib/program-auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { logoSvgPath, logoAlt } from "@/lib/brand";

export async function ProgramHeader() {
  let isLoggedIn = false;
  try {
    const { user } = await getProgramUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }
  const locale = await getLocale();
  const d = t(locale);

  return (
    <header className="border-b border-[#e2e7eb] bg-white">
      <nav className="max-w-5xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Left: logo + program name */}
        <div className="flex items-center gap-4">
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

          <div className="hidden md:block w-px h-5 bg-[#e2e7eb]" aria-hidden="true" />

          <Link
            href={isLoggedIn ? "/program/dashboard" : "/program"}
            className="hidden md:block text-sm font-semibold text-[#1E2A36] hover:text-[#7B9E8C] transition-colors whitespace-nowrap"
          >
            The Life Writing Program
          </Link>
        </div>

        {/* Right: nav */}
        <div className="flex items-center gap-5 text-sm">
          {isLoggedIn ? (
            <>
              <Link
                href="/program/dashboard"
                className="text-[#4A5B6A] hover:text-[#7B9E8C] transition-colors"
              >
                {d.programDashboard}
              </Link>
              <Link
                href="/profil"
                className="text-[#7B9E8C] hover:text-[#6a8d7b] font-semibold transition-colors"
              >
                {d.navMyAccount}
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="text-[#8A99A8] hover:text-[#7B9E8C] transition-colors"
            >
              {d.navLogIn}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
