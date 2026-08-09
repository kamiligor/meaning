"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";
import type { Course } from "@/lib/courses";

export interface OutlineDayEntry {
  day: number;
  completed: boolean;
  unlocked: boolean;
  quizPassed: boolean;
}

export type OutlineStep = "knowledge" | "quiz" | "challenge";

interface OutlineOtherCourse {
  name: string;
  path: string;
  continueDay: number;
  completedDays: number;
  totalDays: number;
  finished: boolean;
}

interface CourseOutlineProps {
  course: Course;
  currentDay: number;
  daysNav: OutlineDayEntry[];
  /** Live state of the day being viewed (fresher than daysNav). */
  live: { quizPassed: boolean; completed: boolean; step: OutlineStep };
  /** Step click on the current, unfinished day switches the step in place. */
  onStepSelect: (step: OutlineStep) => void;
  /** The person's other enrolled courses, for a quick jump. */
  otherCourses?: OutlineOtherCourse[];
}

function StatusIcon({
  done,
  active,
  locked,
  label,
}: {
  done: boolean;
  active: boolean;
  locked: boolean;
  label: string | number;
}) {
  return (
    <span
      className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold shrink-0 ${
        active
          ? "bg-[#1E2A36] text-white"
          : done
            ? "bg-[#7B9E8C] text-white"
            : locked
              ? "bg-[#F1F4F6] text-[#c5cdd4]"
              : "bg-[#e8f0eb] text-[#7B9E8C]"
      }`}
    >
      {done && !active ? (
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      ) : locked ? (
        <Lock className="h-3 w-3" strokeWidth={2} />
      ) : (
        label
      )}
    </span>
  );
}

/**
 * Sticky course outline (desktop sidebar): every day with its three steps
 * and their completion state. Unlocked and completed days navigate; steps
 * of the current day switch the view in place.
 */
export function CourseOutline({
  course,
  currentDay,
  daysNav,
  live,
  onStepSelect,
  otherCourses = [],
}: CourseOutlineProps) {
  const stepLabels: [OutlineStep, string][] = [
    ["knowledge", "Wiedza"],
    ["quiz", "Quiz"],
    ["challenge", course.challengeNoun === "wyzwanie" ? "Wyzwanie" : "Praktyka"],
  ];

  const completedCount = daysNav.filter((d) =>
    d.day === currentDay ? live.completed : d.completed
  ).length;

  return (
    <nav aria-label="Plan kursu" className="text-sm">
      <Link
        href={course.path}
        className="block font-semibold text-[#1E2A36] hover:text-[#7B9E8C] transition-colors mb-1"
      >
        {course.name}
      </Link>
      <p className="text-xs text-[#8A99A8] mb-4">
        Ukończone: {completedCount} z {daysNav.length}
      </p>

      <ol className="space-y-1">
        {daysNav.map((entry) => {
          const dayContent = course.days.find((d) => d.day === entry.day);
          const isCurrent = entry.day === currentDay;
          const completed = isCurrent ? live.completed : entry.completed;
          const quizPassed = isCurrent
            ? live.quizPassed || completed
            : entry.quizPassed || entry.completed;
          const locked = !entry.unlocked && !entry.completed;
          const navigable = (entry.unlocked || entry.completed) && !isCurrent;

          const dayRow = (
            <span className="flex items-center gap-2.5 py-1.5">
              <StatusIcon
                done={completed}
                active={isCurrent}
                locked={locked}
                label={entry.day}
              />
              <span
                className={`leading-snug ${
                  isCurrent
                    ? "font-semibold text-[#1E2A36]"
                    : locked
                      ? "text-[#c5cdd4]"
                      : "text-[#4A5B6A]"
                }`}
              >
                Dzień {entry.day}: {dayContent?.title}
              </span>
            </span>
          );

          const stepStates: Record<OutlineStep, boolean> = {
            knowledge: quizPassed || completed,
            quiz: quizPassed || completed,
            challenge: completed,
          };

          return (
            <li key={entry.day}>
              {navigable ? (
                <Link
                  href={`${course.path}/dzien/${entry.day}`}
                  className="block rounded-lg px-2 -mx-2 hover:bg-[#F1F4F6] transition-colors"
                >
                  {dayRow}
                </Link>
              ) : (
                <div className="px-2 -mx-2">{dayRow}</div>
              )}

              {/* Steps: expanded for the current day, compact ticks otherwise */}
              {isCurrent && !completed ? (
                <ol className="ml-[11px] border-l border-[#e2e7eb] pl-5 py-1 space-y-1">
                  {stepLabels.map(([step, label]) => {
                    const done = stepStates[step];
                    const isActiveStep = live.step === step;
                    const reachable =
                      step === "challenge" ? live.quizPassed : true;

                    return (
                      <li key={step}>
                        <button
                          type="button"
                          onClick={() => reachable && onStepSelect(step)}
                          disabled={!reachable}
                          className={`flex items-center gap-2 py-0.5 w-full text-left transition-colors ${
                            isActiveStep
                              ? "font-semibold text-[#1E2A36]"
                              : done
                                ? "text-[#7B9E8C] hover:text-[#1E2A36]"
                                : reachable
                                  ? "text-[#8A99A8] hover:text-[#1E2A36]"
                                  : "text-[#c5cdd4] cursor-default"
                          }`}
                        >
                          {done ? (
                            <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                          ) : (
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                isActiveStep ? "bg-[#1E2A36]" : "bg-[#c5cdd4]"
                              }`}
                            />
                          )}
                          {label}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                !locked && (
                  <ol className="ml-[11px] border-l border-[#e2e7eb] pl-5 py-1 space-y-1">
                    {stepLabels.map(([step, label]) => (
                      <li
                        key={step}
                        className={`flex items-center gap-2 py-0.5 ${
                          stepStates[step] ? "text-[#7B9E8C]" : "text-[#c5cdd4]"
                        }`}
                      >
                        {stepStates[step] ? (
                          <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c5cdd4] shrink-0" />
                        )}
                        {label}
                      </li>
                    ))}
                  </ol>
                )
              )}
            </li>
          );
        })}
      </ol>

      {otherCourses.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#e2e7eb]">
          <p className="text-xs text-[#8A99A8] uppercase tracking-wider mb-2">
            Twój drugi kurs
          </p>
          {otherCourses.map((other) => (
            <Link
              key={other.path}
              href={
                other.finished
                  ? other.path
                  : `${other.path}/dzien/${other.continueDay}`
              }
              className="block py-1 text-[#7B9E8C] hover:underline"
            >
              {other.name}:{" "}
              {other.finished
                ? "ukończony"
                : `dzień ${other.continueDay} z ${other.totalDays}`}{" "}
              →
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
