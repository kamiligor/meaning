import { CourseHeader } from "@/components/course/course-header";
import { niescrollowanieCourse } from "@/lib/courses/niescrollowanie";

export const metadata = {
  title: niescrollowanieCourse.metaTitle,
  description: niescrollowanieCourse.metaDescription,
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col">
      <CourseHeader
        name={niescrollowanieCourse.name}
        path={niescrollowanieCourse.path}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
