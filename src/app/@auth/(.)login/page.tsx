import { Suspense } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthForm } from "@/components/auth/auth-form";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function LoginModal() {
  const locale = await getLocale();

  return (
    <AuthModal title={t(locale).authLoginTitle}>
      <Suspense>
        <AuthForm mode="login" locale={locale} linkReplace />
      </Suspense>
    </AuthModal>
  );
}
