import { requireProgramUser } from "@/lib/program-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "./logout-button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { t, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import Link from "next/link";

export default async function ProfilPage() {
  const cookieStore = await cookies();
  const locale: Locale = getLocaleFromCookies(cookieStore);
  const d = t(locale);
  const { user, supabase } = await requireProgramUser();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("gender_form, created_at, has_paid")
    .eq("user_id", user.id)
    .single();

  const hasPaid = profile?.has_paid === true;

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

        {hasPaid && (
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

        <div className="space-y-3">
          <LogoutButton label={d.accountLogout} />
        </div>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
