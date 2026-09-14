import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getStats, parseStatsQuery } from "@/lib/analytics-stats";
import { StatTile } from "@/components/admin/stat-tile";
import { BarChartSimple } from "@/components/admin/bar-chart-simple";
import { EmptyState } from "@/components/admin/empty-state";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { CoursesSection } from "./courses-section";
import { PostsSection } from "./posts-section";

export const dynamic = "force-dynamic";

const SHORT_DAY_LABELS = ["nd", "pn", "wt", "śr", "cz", "pt", "so"];

function formatDayLabel(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return SHORT_DAY_LABELS[date.getDay()];
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildLoginsCaption(data: { day: string; value: number }[]) {
  if (data.length === 0) return "Logowania dziennie w wybranym okresie.";
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const peak = data.reduce((max, d) => (d.value > max.value ? d : max), data[0]);
  return `Logowania dziennie w wybranym okresie, razem ${total}. Najwięcej ${formatDayLabel(
    peak.day
  )} (${peak.day}): ${peak.value}.`;
}

export default async function StatystykiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return (
      <p className="text-[#4A5B6A]">
        Brak konfiguracji SUPABASE_SERVICE_ROLE_KEY — statystyki są
        niedostępne.
      </p>
    );
  }

  const rawParams = await searchParams;
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(rawParams)) {
    if (typeof value === "string") usp.set(key, value);
  }
  const query = parseStatsQuery(usp);

  let stats;
  try {
    stats = await getStats(admin, query);
  } catch {
    return (
      <p className="text-[#4A5B6A]">
        Nie udało się pobrać statystyk. Spróbuj odświeżyć stronę za chwilę.
      </p>
    );
  }

  const overallReadRate =
    stats.posts.views.current > 0
      ? Math.round((stats.posts.reads.current / stats.posts.views.current) * 100)
      : null;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold text-[#1E2A36] mb-1">
          Statystyki
        </h1>
        <p className="text-sm text-[#4A5B6A]">
          {stats.aggregatedAt
            ? `Ostatnia agregacja: ${formatDateTime(stats.aggregatedAt)}`
            : "Agregacja dobowa jeszcze nie zadziałała — liczby poniżej mogą być niepełne."}
        </p>
      </div>

      <DateRangePicker
        range={query.range}
        from={query.from}
        to={query.to}
        basePath="/admin/statystyki"
      />

      <section aria-labelledby="konta-heading" className="space-y-4">
        <h2 id="konta-heading" className="text-lg font-semibold text-[#1E2A36]">
          Konta
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile
            label="Nowe konta"
            value={stats.accounts.newAccounts.current}
            delta={stats.accounts.newAccounts}
          />
          <StatTile
            label="Logowania"
            value={stats.accounts.logins.current}
            delta={stats.accounts.logins}
          />
          <StatTile label="Aktywni w 7 dniach" value={stats.accounts.active7d} />
          <StatTile
            label="Aktywni w 30 dniach"
            value={stats.accounts.active30d}
          />
        </div>
        {stats.accounts.loginsByDay.length === 0 ? (
          <EmptyState
            title="Brak danych w tym okresie"
            description="Agregacja dobowa jeszcze nie zebrała danych za dziś — wróć jutro."
          />
        ) : (
          <BarChartSimple
            data={stats.accounts.loginsByDay}
            caption={buildLoginsCaption(stats.accounts.loginsByDay)}
            formatLabel={formatDayLabel}
          />
        )}
      </section>

      <section aria-labelledby="kursy-heading" className="space-y-4">
        <h2 id="kursy-heading" className="text-lg font-semibold text-[#1E2A36]">
          Kursy
        </h2>
        {stats.courses.length === 0 ? (
          <EmptyState
            title="Brak kursów do pokazania"
            description="Jeszcze żaden kurs nie zebrał danych."
          />
        ) : (
          <CoursesSection courses={stats.courses} />
        )}
      </section>

      <section aria-labelledby="posty-heading" className="space-y-4">
        <h2 id="posty-heading" className="text-lg font-semibold text-[#1E2A36]">
          Posty
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile
            label="Wyświetlenia"
            value={stats.posts.views.current}
            delta={stats.posts.views}
          />
          <StatTile
            label="Unikalni czytelnicy"
            value={stats.posts.uniqueViews.current}
            delta={stats.posts.uniqueViews}
          />
          <StatTile
            label="Śr. odsetek dotarcia do końca"
            value={overallReadRate === null ? "—" : `${overallReadRate}%`}
          />
          <StatTile
            label="Lajki"
            value={stats.posts.likes.current}
            delta={stats.posts.likes}
          />
        </div>
        {stats.posts.top.length === 0 ? (
          <EmptyState
            title="Brak danych w tym okresie"
            description="Agregacja dobowa jeszcze nie zebrała danych za dziś — wróć jutro."
          />
        ) : (
          <PostsSection posts={stats.posts.top} />
        )}
      </section>
    </div>
  );
}
