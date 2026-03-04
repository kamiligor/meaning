import { requireProgramUser } from "@/lib/program-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LogoutButton } from "./logout-button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { t, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";
import { getLocaleFromCookies } from "@/lib/locale-cookie";

export default async function ProfilPage() {
  const cookieStore = await cookies();
  const locale: Locale = getLocaleFromCookies(cookieStore);
  const d = t(locale);
  const { user, supabase } = await requireProgramUser();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("gender_form, created_at")
    .eq("user_id", user.id)
    .single();

  const email = user.email ?? "";
  const provider = user.app_metadata?.provider ?? "email";
  const createdAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US")
    : null;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <SiteHeader locale={locale} />

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#1E2A36]">{d.navMyAccount}</h1>
          <Link href="/program/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">{d.accountDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8A99A8]">Email</span>
              <span className="text-[#1E2A36]">{email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8A99A8]">{d.accountProvider}</span>
              <span className="text-[#1E2A36] capitalize">{provider}</span>
            </div>
            {createdAt && (
              <div className="flex justify-between text-sm">
                <span className="text-[#8A99A8]">{d.accountSince}</span>
                <span className="text-[#1E2A36]">{createdAt}</span>
              </div>
            )}
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
