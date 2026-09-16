/**
 * Shared shapes for the mini-course engine. One course = a slug, a set of
 * landing texts and an ordered list of days; each day is check-in about
 * yesterday + knowledge + quiz + challenge. Content lives in per-course
 * files next to this one, registered in ./index.ts.
 */

export interface QuizOption {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface CheckinOption {
  value: string;
  label: string;
  /** Kind reaction shown after picking this option. Never judgmental. */
  response: string;
}

export interface CourseCheckin {
  question: string;
  options: CheckinOption[];
}

export interface CourseDay {
  day: number;
  title: string;
  /** Check-in about the previous day's challenge. Absent on day 1. */
  checkinAboutPrevious?: CourseCheckin;
  knowledge: string[];
  quiz: QuizQuestion[];
  challenge: {
    lead: string;
    body: string[];
    minimal: string;
    evening?: string;
  };
}

export interface Course {
  slug: string;
  /** Route prefix, e.g. "/kurs-niescrollowania". */
  path: string;
  name: string;
  /** Short line under the name, e.g. "5 dni nauki nudzenia się." */
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  howItWorks: string[];
  aboutHeading: string;
  aboutParagraph: string;
  /** Whether enrollment asks for screen-time baseline numbers. */
  askBaseline: boolean;
  /** The course's word for its daily task; drives UI labels. */
  challengeNoun: "wyzwanie" | "praktyka";
  days: CourseDay[];
}
