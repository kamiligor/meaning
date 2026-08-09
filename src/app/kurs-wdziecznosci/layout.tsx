import { CourseHeader } from "@/components/course/course-header";
import { wdziecznoscCourse } from "@/lib/courses/wdziecznosc";

export const metadata = {
  title: wdziecznoscCourse.metaTitle,
  description: wdziecznoscCourse.metaDescription,
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col">
      <CourseHeader currentSlug={wdziecznoscCourse.slug} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
