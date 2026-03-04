import Link from "next/link";
import { getProgramUser } from "@/lib/program-auth";

const logoStyle = { fontFamily: "Georgia, 'Times New Roman', serif" };

export async function ProgramHeader() {
  let isLoggedIn = false;
  try {
    const { user } = await getProgramUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }

  return (
    <header className="border-b border-[#e2e7eb] bg-white">
      <nav className="max-w-5xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: logo + program name */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex flex-col items-start group shrink-0"
            aria-label="just have a little meaning — home"
          >
            <span
              className="text-sm font-extrabold text-[#1E2A36] leading-none tracking-tight group-hover:text-[#2d3f4e] transition-colors duration-200"
              style={logoStyle}
            >
              just
            </span>
            <span
              className="text-[7px] italic text-[#8A99A8] leading-none mt-[3px] tracking-wide"
              style={logoStyle}
            >
              have a little
            </span>
            <span
              className="text-sm font-extrabold text-[#7B9E8C] leading-none mt-[3px] tracking-tight group-hover:text-[#6a8d7b] transition-colors duration-200"
              style={logoStyle}
            >
              meaning
            </span>
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
        {isLoggedIn && (
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/program/dashboard"
              className="text-[#4A5B6A] hover:text-[#7B9E8C] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/program/zasoby"
              className="hidden sm:block text-[#4A5B6A] hover:text-[#7B9E8C] transition-colors"
            >
              Zasoby
            </Link>
            <Link
              href="/profil"
              className="text-[#8A99A8] hover:text-[#7B9E8C] transition-colors"
            >
              Moje konto
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
