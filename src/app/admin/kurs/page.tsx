import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { courses, getDay, type Course } from "@/lib/courses";

export const dynamic = "force-dynamic";

const RATING_LABELS: Record<string, string> = {
  worth_it: "Warte tych dni",
  mixed: "Częściowo",
  not_for_me: "Nie dla mnie",
};

async function CourseStats({
  course,
  admin,
}: {
  course: Course;
  admin: ReturnType<typeof getSupabaseAdmin>;
}) {
  const [enrollmentsResult, daysResult, feedbackResult] = await Promise.all([
    admin
      .from("course_enrollments")
      .select("enrolled_at, completed_at, reminders_enabled")
      .eq("course_slug", course.slug),
    admin
      .from("course_day_progress")
      .select("day, started_at, completed_at, checkin_choice")
      .eq("course_slug", course.slug),
    admin
      .from("course_feedback")
      .select("rating, hardest, suggestion, created_at")
      .eq("course_slug", course.slug)
      .order("created_at", { ascending: false }),
  ]);

  const enrollments = enrollmentsResult.data ?? [];
  const dayRows = daysResult.data ?? [];
  const feedback = feedbackResult.data ?? [];

  const totalEnrolled = enrollments.length;
  const totalFinished = enrollments.filter((e) => e.completed_at).length;

  const funnel = course.days.map(({ day }) => {
    const rows = dayRows.filter((r) => r.day === day);
    return {
      day,
      title: getDay(course, day)?.title ?? "",
      started: rows.length,
      completed: rows.filter((r) => r.completed_at).length,
    };
  });

  const ratingCounts = feedback.reduce<Record<string, number>>((acc, f) => {
    acc[f.rating] = (acc[f.rating] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#1E2A36]">{course.name}</h2>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Zapisy", value: totalEnrolled },
          { label: "Ukończone kursy", value: totalFinished },
          {
            label: "Konwersja do końca",
            value: totalEnrolled
              ? `${Math.round((totalFinished / totalEnrolled) * 100)}%`
              : "—",
          },
          {
            label: "Przypomnienia wł.",
            value: enrollments.filter((e) => e.reminders_enabled).length,
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e7eb] p-5">
            <p className="text-xs text-[#8A99A8] uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-2xl font-semibold text-[#1E2A36]">{value}</p>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-xl border border-[#e2e7eb] p-5">
        <h3 className="font-semibold text-[#1E2A36] mb-4">Lejek dni</h3>
        <div className="space-y-3">
          {funnel.map(({ day, title, started, completed }) => {
            const pct = totalEnrolled
              ? Math.round((completed / totalEnrolled) * 100)
              : 0;
            return (
              <div key={day} className="flex items-center gap-4">
                <span className="w-48 shrink-0 text-sm text-[#1E2A36] truncate">
                  Dzień {day}: {title}
                </span>
                <div className="flex-1 h-4 bg-[#F1F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7B9E8C] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-44 shrink-0 text-xs text-[#4A5B6A] text-right">
                  otwarty: {started} · ukończony: {completed} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-xl border border-[#e2e7eb] p-5">
        <h3 className="font-semibold text-[#1E2A36] mb-4">
          Feedback ({feedback.length})
        </h3>
        <div className="flex gap-4 mb-5">
          {Object.entries(RATING_LABELS).map(([value, label]) => (
            <span key={value} className="text-sm text-[#4A5B6A]">
              {label}: <strong>{ratingCounts[value] ?? 0}</strong>
            </span>
          ))}
        </div>
        {feedback.length === 0 ? (
          <p className="text-sm text-[#8A99A8]">Jeszcze nic tu nie ma.</p>
        ) : (
          <div className="space-y-4">
            {feedback.map((f, idx) => (
              <div
                key={idx}
                className="border border-[#e2e7eb] rounded-lg p-4 text-sm"
              >
                <p className="text-[#1E2A36] font-medium mb-1">
                  {RATING_LABELS[f.rating] ?? f.rating}
                  <span className="text-[#8A99A8] font-normal ml-2">
                    {new Date(f.created_at).toLocaleDateString("pl-PL")}
                  </span>
                </p>
                {f.hardest && (
                  <p className="text-[#4A5B6A] mb-1">
                    <span className="text-[#8A99A8]">Najtrudniejsze:</span>{" "}
                    {f.hardest}
                  </p>
                )}
                {f.suggestion && (
                  <p className="text-[#4A5B6A]">
                    <span className="text-[#8A99A8]">Do zmiany:</span>{" "}
                    {f.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function AdminCoursesPage() {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return (
      <p className="text-[#4A5B6A]">
        Brak konfiguracji SUPABASE_SERVICE_ROLE_KEY — statystyki kursów są
        niedostępne.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold text-[#1E2A36] mb-1">
          Mini kursy
        </h1>
        <p className="text-sm text-[#4A5B6A]">
          Lejek dni, feedback i zapisy dla każdego kursu.
        </p>
      </div>
      {courses.map((course) => (
        <CourseStats key={course.slug} course={course} admin={admin} />
      ))}
    </div>
  );
}
