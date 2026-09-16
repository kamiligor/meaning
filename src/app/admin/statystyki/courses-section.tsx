"use client";

import { useState } from "react";
import type { CourseStats } from "@/lib/analytics-types";
import { PillTabs } from "@/components/admin/pill-tabs";
import { StatTile } from "@/components/admin/stat-tile";
import { FunnelBars, type FunnelStep } from "@/components/admin/funnel-bars";
import { EmptyState } from "@/components/admin/empty-state";

const RATING_LABELS: Record<string, string> = {
  worth_it: "Warte tych dni",
  mixed: "Częściowo",
  not_for_me: "Nie dla mnie",
};

interface CoursesSectionProps {
  courses: CourseStats[];
}

/**
 * Course selector (only shown when there is more than one course) plus the
 * funnel, headline tiles and rating bars for whichever course is active.
 * Everything is already fetched server-side, so switching courses is pure
 * client-side state, no re-fetch.
 */
export function CoursesSection({ courses }: CoursesSectionProps) {
  const [active, setActive] = useState(courses[0]?.slug ?? "");
  const course = courses.find((c) => c.slug === active) ?? courses[0];
  if (!course) return null;

  const funnelSteps: FunnelStep[] = [
    { label: "Zapis", count: course.enrolled.current },
    ...course.funnel.map((f) => ({
      label: `Dzień ${f.day}: ${f.title}`,
      count: f.completed,
    })),
    { label: "Ukończenie", count: course.completed.current },
  ];

  const ratingEntries = Object.entries(RATING_LABELS);
  const ratingTotal = ratingEntries.reduce(
    (sum, [key]) => sum + (course.ratings[key] ?? 0),
    0
  );

  const hasFunnelActivity =
    course.enrolled.current > 0 || course.funnel.some((f) => f.started > 0);

  return (
    <div className="space-y-6">
      {courses.length > 1 && (
        <PillTabs
          options={courses.map((c) => ({ key: c.slug, label: c.name }))}
          active={active}
          onChange={setActive}
          ariaLabel="Wybierz kurs"
        />
      )}

      <div className="bg-white rounded-xl border border-[#e2e7eb] p-5">
        {hasFunnelActivity ? (
          <FunnelBars steps={funnelSteps} caption={`Lejek kursu ${course.name}`} />
        ) : (
          <EmptyState
            title="Brak zapisów w tym okresie"
            description="Nikt nie zapisał się na ten kurs w wybranym zakresie dat."
          />
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatTile
          label="Mediana dni zapis→ukończenie"
          value={course.medianDaysToComplete ?? "—"}
        />
        <StatTile
          label="Ukończenia"
          value={course.completed.current}
          delta={course.completed}
        />
        <StatTile
          label="Konwersja zapis→ukończenie"
          value={
            course.enrolled.current
              ? `${Math.round(
                  (course.completed.current / course.enrolled.current) * 100
                )}%`
              : "—"
          }
        />
      </div>

      <div className="bg-white rounded-xl border border-[#e2e7eb] p-5">
        <h3 className="font-semibold text-[#1E2A36] mb-4">
          Oceny (wszystkie, {ratingTotal})
        </h3>
        {ratingTotal === 0 ? (
          <p className="text-sm text-[#8A99A8]">
            Jeszcze nikt nie zostawił oceny.
          </p>
        ) : (
          <div className="space-y-3">
            {ratingEntries.map(([key, label]) => {
              const count = course.ratings[key] ?? 0;
              const pct = Math.round((count / ratingTotal) * 100);
              return (
                <div key={key} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 text-sm text-[#1E2A36]">
                    {label}
                  </span>
                  <div className="flex-1 h-4 bg-[#F1F4F6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7B9E8C] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-xs text-[#4A5B6A] text-right">
                    {pct}% ({count})
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
