import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { t, type Locale } from "@/lib/i18n";

interface Section {
  heading: string;
  body: string[];
}

const content: Record<Locale, { heading: string; intro: string; sections: Section[] }> = {
  en: {
    heading: "How this site is written",
    intro:
      "No post here is signed with a name. That is a deliberate choice, and it puts the burden on the writing itself. These are the rules it is held to.",
    sections: [
      {
        heading: "Where the material comes from",
        body: [
          "Every post starts from published psychological research, not from opinion. The books and studies behind each one are listed at the bottom of the post, by title and author, so you can go to the source rather than take our word for it.",
          "Where a post quotes someone, the quote is attributed and checked against the original wording. We do not translate quotations from memory.",
        ],
      },
      {
        heading: "What we will not claim",
        body: [
          "Research rarely says anything as cleanly as a headline would like. When the evidence is thin or contested, the post says so instead of rounding it up into advice.",
          "We stay away from popular simplifications that sound scientific and are not. If a widely repeated idea is a myth, the post names it as one.",
        ],
      },
      {
        heading: "When we get something wrong",
        body: [
          "We do. When an error surfaces, the post is corrected rather than quietly deleted, and the modification date on the page moves with it.",
          "If you spot something that is wrong, misleading or out of date, the comment section under the post is the fastest way to tell us.",
        ],
      },
      {
        heading: "What this is not",
        body: [
          "This is psychoeducation, not treatment. Nothing here diagnoses anyone, and nothing here replaces a conversation with a professional.",
          "If you are in crisis, a website is the wrong tool. In Poland: Crisis Line 116 123, Support Centre 800 70 2222.",
        ],
      },
    ],
  },
  pl: {
    heading: "Jak powstają te teksty",
    intro:
      "Żaden post nie jest podpisany nazwiskiem. To świadomy wybór, który cały ciężar przenosi na samą treść. Oto zasady, którym ta treść podlega.",
    sections: [
      {
        heading: "Skąd pochodzi materiał",
        body: [
          "Każdy post zaczyna się od opublikowanych badań psychologicznych, nie od opinii. Książki i prace, na których się opiera, wypisane są na dole posta, z tytułem i autorem, żeby dało się sięgnąć do źródła zamiast wierzyć nam na słowo.",
          "Jeśli post kogoś cytuje, cytat ma podanego autora i jest sprawdzony z oryginalnym brzmieniem. Nie tłumaczymy cytatów z pamięci.",
        ],
      },
      {
        heading: "Czego nie będziemy twierdzić",
        body: [
          "Badania rzadko mówią coś tak gładko, jak chciałby nagłówek. Kiedy dowody są słabe albo sporne, post to zaznacza, zamiast zaokrąglać je do porady.",
          "Trzymamy się z dala od popularnych uproszczeń, które brzmią naukowo, a nauką nie są. Jeśli powtarzana powszechnie teza jest mitem, post nazywa ją mitem.",
        ],
      },
      {
        heading: "Kiedy się mylimy",
        body: [
          "Zdarza się. Gdy błąd wyjdzie na jaw, post zostaje poprawiony, a nie po cichu usunięty, i data modyfikacji na stronie idzie za tą poprawką.",
          "Jeśli zauważysz coś nieprawdziwego, mylącego albo nieaktualnego, najszybszą drogą jest komentarz pod postem.",
        ],
      },
      {
        heading: "Czym to nie jest",
        body: [
          "To psychoedukacja, nie leczenie. Nic tutaj nikogo nie diagnozuje i nic nie zastępuje rozmowy ze specjalistą.",
          "Jeśli jesteś w kryzysie, strona internetowa jest złym narzędziem. Telefon Zaufania 116 123, Centrum Wsparcia 800 70 2222.",
        ],
      },
    ],
  },
};

export function StandardsContent({ locale }: { locale: Locale }) {
  const d = t(locale);
  const c = content[locale];

  return (
    <>
      <SiteHeader locale={locale} backHref="/" backLabel={d.backToFeed} />

      <main className="max-w-2xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1E2A36] leading-snug mb-6">
          {c.heading}
        </h1>

        <p className="text-[#4A5B6A] leading-relaxed text-[15px] md:text-base mb-12">
          {c.intro}
        </p>

        <div className="flex flex-col gap-10">
          {c.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-base font-semibold text-[#1E2A36] mb-3">
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[#4A5B6A] leading-relaxed text-[15px] md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
