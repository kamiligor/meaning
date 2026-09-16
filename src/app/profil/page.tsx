import { requireProgramUser } from "@/lib/program-auth";
import { isProgramAdmin } from "@/lib/admin-email";
import { courses } from "@/lib/courses";
import { getCourseState, currentDay } from "@/lib/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "./logout-button";
import { DisplayNameForm } from "./display-name-form";
import { DeleteAccount } from "./delete-account";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import Link from "next/link";

export default async function ProfilPage() {
  const locale: Locale = await getLocale();
  const d = t(locale);
  const { user, supabase } = await requireProgramUser();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("gender_form, created_at, display_name, display_name_changed_at")
    .eq("user_id", user.id)
    .single();

  const isAdmin = isProgramAdmin(user.email);

  // Mini courses the person is enrolled in, with progress (PL domain only —
  // the courses exist in Polish, and the proxy pins their pages to it anyway).
  const myCourses: {
    name: string;
    path: string;
    continueDay: number;
    completedDays: number;
    totalDays: number;
    finished: boolean;
  }[] = [];
  if (locale === "pl") {
    for (const course of courses) {
      const state = await getCourseState(supabase, user.id, course.slug);
      if (!state.enrollment) continue;
      const totalDays = course.days.length;
      const completedDays = Object.values(state.days).filter(
        (day) => day.completedAt
      ).length;
      myCourses.push({
        name: course.name,
        path: course.path,
        continueDay: currentDay(state.days, totalDays),
        completedDays,
        totalDays,
        finished: completedDays >= totalDays,
      });
    }
  }

  const email = user.email ?? "";
  const createdAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US")
    : null;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <SiteHeader locale={locale} />

      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#1E2A36] mb-8">{d.navMyAccount}</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">{d.accountDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8A99A8]">Email</span>
              <span className="text-[#1E2A36]">{email}</span>
            </div>
            {createdAt && (
              <div className="flex justify-between text-sm">
                <span className="text-[#8A99A8]">{d.accountSince}</span>
                <span className="text-[#1E2A36]">{createdAt}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <DisplayNameForm
              locale={locale}
              initialName={profile?.display_name ?? null}
              changedAt={profile?.display_name_changed_at ?? null}
            />
          </CardContent>
        </Card>

        {myCourses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Moje kursy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myCourses.map((course) => (
                <div
                  key={course.path}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="text-[#1E2A36] font-medium">{course.name}</p>
                    <p className="text-[#8A99A8]">
                      {course.finished
                        ? "Ukończony"
                        : `Ukończone dni: ${course.completedDays} z ${course.totalDays}`}
                    </p>
                  </div>
                  <Link
                    href={
                      course.finished
                        ? course.path
                        : `${course.path}/dzien/${course.continueDay}`
                    }
                    className="shrink-0 text-[#7B9E8C] hover:underline"
                  >
                    {course.finished ? "Zobacz" : `Dzień ${course.continueDay}`} &rarr;
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">The Life Writing Program</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href="/program/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-[#7B9E8C] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a8d7b] transition-colors"
              >
                {d.goToProgram} &rarr;
              </Link>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">{d.accountData}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <a
                href="/api/program/data-export"
                className="inline-flex items-center justify-center rounded-md border border-[#e2e7eb] px-4 py-2 text-sm font-medium text-[#1E2A36] hover:border-[#7B9E8C] hover:text-[#7B9E8C] transition-colors"
              >
                {d.accountExport}
              </a>
              <p className="mt-2 text-xs text-[#8A99A8]">
                {d.accountExportHint}
              </p>
            </div>

            <DeleteAccount locale={locale} />
          </CardContent>
        </Card>

        <div className="space-y-3">
          <LogoutButton label={d.accountLogout} />
        </div>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
