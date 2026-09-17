import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCourse, isCourseVisible } from "@/lib/courses";

/**
 * One quiet card above the Polish feed pointing at the free course. Reads
 * the course registry, so name and tagline stay in one place.
 */
export function CourseBanner({ slug }: { slug: string }) {
  const course = getCourse(slug);
  if (!course || !isCourseVisible(course, null)) return null;

  return (
    <Link
      href={course.path}
      className="group mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#c5d8cc] bg-[#f0f7f2] px-5 py-4 transition hover:border-[#7B9E8C]"
    >
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-[#7B9E8C]">
          Darmowy mini kurs
        </p>
        <p className="mt-0.5 font-semibold text-[#1E2A36]">{course.name}</p>
        <p className="text-sm text-[#4A5B6A]">{course.tagline}</p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-[#7B9E8C] transition group-hover:translate-x-0.5" />
    </Link>
  );
}
