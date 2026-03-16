import { cookies } from "next/headers";
import { SafetyBanner } from "@/components/program/safety-banner";
import { isLocale, type Locale } from "@/lib/i18n";

export const metadata = {
  title: "The Life Writing Program | just have a little meaning",
  description:
    "A guided writing process designed to help you understand your past, clarify your present, and intentionally shape your future.",
};

export default async function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("locale")?.value ?? "pl";
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "pl";

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col">
      <div className="flex-1">{children}</div>
      <SafetyBanner locale={locale} />
    </div>
  );
}
