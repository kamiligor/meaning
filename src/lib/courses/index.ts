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

export function getCourse(slug: string): Course | null {
  return courses.find((c) => c.slug === slug) ?? null;
}

export function getDay(course: Course, day: number): CourseDay | null {
  return course.days.find((d) => d.day === day) ?? null;
}
