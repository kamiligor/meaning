import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { getLocale } from "@/lib/locale";

export const metadata = {
  title: "Create account — just have a little meaning",
};

export default async function RegisterPage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Suspense>
        <AuthForm mode="register" locale={locale} />
      </Suspense>
    </div>
  );
}
