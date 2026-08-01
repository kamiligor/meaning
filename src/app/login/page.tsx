import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getLocale } from "@/lib/locale";
import type { Locale } from "@/lib/i18n";

export const metadata = {
  title: "Log in — just have a little meaning",
};

export default async function LoginPage() {
  const locale: Locale = await getLocale();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <SiteHeader locale={locale} />
      <main className="flex-1 flex items-center justify-center px-4">
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
