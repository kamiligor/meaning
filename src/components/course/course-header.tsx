import Link from "next/link";
import { logoSvgPath, logoAlt } from "@/lib/brand";
import { PROGRAM_LOCALE } from "@/lib/domains";
import { courses } from "@/lib/courses";

/** Logo + all mini courses, with the current one highlighted. */
export function CourseHeader({ currentSlug }: { currentSlug: string }) {
  return (
    <header className="border-b border-[#e2e7eb] bg-white">
      <nav className="max-w-5xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center gap-4 overflow-x-auto">
        <Link
          href="/"
          className="shrink-0 block h-12 md:h-14"
          aria-label={`${logoAlt(PROGRAM_LOCALE)} — strona główna`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSvgPath(PROGRAM_LOCALE)}
            alt={logoAlt(PROGRAM_LOCALE)}
            className="h-full w-auto"
          />
        </Link>
        <div className="hidden md:block w-px h-5 bg-[#e2e7eb]" aria-hidden="true" />
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={course.path}
            className={`text-sm whitespace-nowrap transition-colors ${
              course.slug === currentSlug
                ? "font-semibold text-[#1E2A36]"
                : "text-[#8A99A8] hover:text-[#7B9E8C]"
            }`}
          >
            {course.name}
          </Link>
        ))}
        <Link
          href="/profil"
          className="ml-auto text-sm text-[#8A99A8] hover:text-[#7B9E8C] whitespace-nowrap transition-colors"
        >
          Moje konto
        </Link>
      </nav>
    </header>
  );
}
