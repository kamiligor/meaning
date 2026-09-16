import { Suspense } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthForm } from "@/components/auth/auth-form";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function RegisterModal() {
  const locale = await getLocale();

  return (
    <AuthModal title={t(locale).authRegisterTitle}>
      <Suspense>
        <AuthForm mode="register" locale={locale} linkReplace />
      </Suspense>
    </AuthModal>
  );
}
