import { t, type Locale } from "@/lib/i18n";

interface SafetyBannerProps {
  locale: Locale;
}

export function SafetyBanner({ locale }: SafetyBannerProps) {
  const d = t(locale);
  return (
    <div
      role="complementary"
      aria-label={d.safetyBannerText}
      className="w-full bg-amber-50 border-t border-amber-200 py-2 px-4"
    >
      <p className="text-center text-xs text-amber-800 leading-relaxed">
        {d.safetyBannerText}{" "}
        <span className="font-medium">{d.safetyBannerHotline}</span>{" "}
        {d.disclaimerHotlines}
      </p>
    </div>
  );
}
