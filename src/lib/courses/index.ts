import { isProgramAdmin } from "@/lib/admin-email";
import type { Course, CourseDay } from "./types";
import { niescrollowanieCourse } from "./niescrollowanie";
import { wdziecznoscCourse } from "./wdziecznosc";

export type {
  Course,
  CourseDay,
  CourseCheckin,
  CheckinOption,
  QuizQuestion,
  QuizOption,
} from "./types";

export const courses: Course[] = [niescrollowanieCourse, wdziecznoscCourse];

/** Whether this viewer may see the course at all. */
export function isCourseVisible(course: Course, email: string | null | undefined): boolean {
  return !course.adminOnly || isProgramAdmin(email);
}

/** Courses to list and index for this viewer (no e-mail = the public). */
export function visibleCourses(email: string | null | undefined): Course[] {
  return courses.filter((c) => isCourseVisible(c, email));
}

export function getCourse(slug: string): Course | null {
  return courses.find((c) => c.slug === slug) ?? null;
}

export function getDay(course: Course, day: number): CourseDay | null {
  return course.days.find((d) => d.day === day) ?? null;
}
