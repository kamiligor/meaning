import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { t, type Locale } from "@/lib/i18n";

const content = {
  en: {
    heading: "We share what we know. You decide what to do with it.",
    paragraphs: [
      "There is a lot of psychological research that most people never encounter. Not because it is hidden, but because it lives in academic journals, behind paywalls, in language that is not meant to be read over breakfast.",
      "We think that is a shame. Because some of it is genuinely useful.",
      "Just have a little meaning started as a simple idea: take what the research actually says about memory, emotions, identity, and behavior, and put it into plain language. No jargon. No false promises. Just the things we found worth knowing.",
      "What we do is translate findings from psychology and behavioral science into formats that are practical and honest. A short post. An exercise that helps you slow down and think. An article that explains why your brain does what it does.",
    ],
    closing:
      "We believe that understanding yourself a little better is worth something, even if it does not solve everything.",
  },
  pl: {
    heading: "Dzielimy się tym, co wiemy. Reszta należy do Ciebie.",
    paragraphs: [
      "W psychologii jest mnóstwo badań, o których większość ludzi nigdy nie słyszy. Nie dlatego, że są tajne. Dlatego, że są zamknięte w akademickich czasopismach, napisane językiem, którego nikt nie czyta dla przyjemności.",
      "Uważamy, że to szkoda. Bo część z tego jest naprawdę przydatna.",
      "Just have a little meaning zaczęło się od prostego pomysłu: wziąć to, co nauka faktycznie mówi o pamięci, emocjach, tożsamości i zachowaniu, i przełożyć to na przystępny język. Bez żargonu. Bez obietnic. Tylko rzeczy, które uznaliśmy za warte uwagi.",
      "Tłumaczymy wyniki badań z psychologii i neurobiologii na formaty, które są praktyczne i uczciwe. Krótki post. Ćwiczenie, które pomaga się zatrzymać i pomyśleć. Artykuł, który wyjaśnia, dlaczego Twój mózg robi to, co robi.",
    ],
    closing:
      "Wierzymy, że zrozumienie siebie choć trochę lepiej ma wartość, nawet jeśli nie rozwiązuje wszystkiego.",
  },
} as const;


export function MissionContent({ locale }: { locale: Locale }) {
  const d = t(locale);
  const c = content[locale];

  return (
    <>
      <SiteHeader
        locale={locale}
        backHref="/"
        backLabel={d.backToFeed}

      />

      <main className="max-w-2xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1E2A36] leading-snug mb-10">
          {c.heading}
        </h1>

        <div className="space-y-5">
          {c.paragraphs.map((p, i) => (
            <p key={i} className="text-[#4A5B6A] leading-relaxed text-[15px] md:text-base">
              {p}
            </p>
          ))}
        </div>

        {c.closing && (
          <p className="mt-14 text-lg md:text-xl font-medium text-[#1E2A36] leading-snug">
            {c.closing}
          </p>
        )}
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
