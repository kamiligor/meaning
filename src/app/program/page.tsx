import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Lock, Clock, BookOpen } from "lucide-react";

export default function ProgramLandingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1E2A36] leading-tight mb-4">
          Kiedy w glowie jest za duzo chaosu — zacznij od zapisania.
        </h1>
        <p className="text-lg text-[#4A5B6A] max-w-2xl mx-auto mb-8 leading-relaxed">
          Pisz Siebie to darmowy program oparty na badaniach psychologicznych, który
          pomaga uporzadkowac mysli o przeszlosci, terazniejszosci i przyszlosci.
          Bez timerow, bez oceniania, w Twoim tempie.
        </p>
        <Link href="/program/onboarding">
          <Button size="lg" className="text-base px-8">
            Sprobuj za darmo
          </Button>
        </Link>
        <p className="text-sm text-[#8A99A8] mt-3">
          Bez karty kredytowej. Bez zobowiazan. Twoje teksty sa szyfrowane — nikt ich nie przeczyta.
        </p>
      </section>

      {/* Problem */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-4">
          Znasz to uczucie?
        </h2>
        <div className="text-[#4A5B6A] leading-relaxed space-y-4">
          <p>
            Te same mysli kraza w kolko. Te same wspomnienia wracaja noca. Te same pytania
            bez odpowiedzi.
          </p>
          <p>
            Probowales/as prowadzic dziennik — ale pusta strona tylko poglebiala chaos.
            Czytales/as ksiazki o rozwoju — ale wiedza nie zamieniala sie w zmiane.
          </p>
          <p className="font-medium text-[#1E2A36]">
            To nie znaczy, ze cos jest z Toba nie tak. To znaczy, ze potrzebujesz innego narzedzia.
          </p>
        </div>
      </section>

      {/* Solution — 3 modules */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-8">
          Struktura zamiast chaosu
        </h2>
        <p className="text-[#4A5B6A] leading-relaxed mb-8">
          Pisz Siebie to nie kolejna aplikacja do mindfulness ani lista motywacyjnych cytatow.
          To ustrukturyzowany program pisania, oparty na 30 latach badan psychologicznych.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Modul I: Przeszlosc",
              subtitle: "Zrozum swoja historie",
              desc: "Uporzadkuj wspomnienia. Nadaj im sens. Zmniejsz ich emocjonalny ladunek.",
              meta: "6 cwiczen · 3-5 godzin lacznie",
            },
            {
              title: "Modul II: Terazniejszosc",
              subtitle: "Zrozum, gdzie stoisz",
              desc: "Odkryj swoje wartosci. Rozpoznaj schematy myslenia. Potraktuj siebie z zyczliwoscia.",
              meta: "6 cwiczen · 3-5 godzin lacznie",
            },
            {
              title: "Modul III: Przyszlosc",
              subtitle: "Zaprojektuj siebie",
              desc: "Stwórz wizje. Skonfrontuj ja z rzeczywistoscia. Zrob jeden konkretny krok.",
              meta: "6 cwiczen · 3-5 godzin lacznie",
            },
          ].map((mod) => (
            <div
              key={mod.title}
              className="bg-white border border-[#e2e7eb] rounded-xl p-6"
            >
              <h3 className="font-semibold text-[#1E2A36] mb-1">{mod.title}</h3>
              <p className="text-sm text-[#7B9E8C] font-medium mb-3">
                {mod.subtitle}
              </p>
              <p className="text-sm text-[#4A5B6A] leading-relaxed mb-3">
                {mod.desc}
              </p>
              <p className="text-xs text-[#8A99A8]">{mod.meta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Science */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-4">
          Nie wierzymy w magiczne rozwiazania. Wierzymy w badania.
        </h2>
        <div className="text-[#4A5B6A] leading-relaxed space-y-4">
          <p>
            Profesor James Pennebaker z Uniwersytetu Teksanskiego spedzil ponad 30 lat
            badajac, dlaczego pisanie o trudnych doswiadczeniach pomaga. Jego odkrycie:
            kiedy nadajemy narracyjna strukture chaotycznym wspomnieniom, mozg przestaje
            do nich wracac w nieskonczonej petli.
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1.5 shrink-0">•</span>
              <span>
                <strong>Tozsamosc narracyjna</strong> (McAdams) — ludzie, którzy potrafia
                opowiedziec spojna historie swojego zycia, maja wyzsze poczucie sensu
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1.5 shrink-0">•</span>
              <span>
                <strong>Terapia Akceptacji i Zaangazowania</strong> (Hayes) — rozroznienie
                miedzy Toba a Twoimi myslami zmienia sposob, w jaki na nie reagujesz
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1.5 shrink-0">•</span>
              <span>
                <strong>Wspolczucie dla siebie</strong> (Neff) — samokrytyka poglebia
                paraliz, zyczliwosc wobec siebie go przelamuje
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1.5 shrink-0">•</span>
              <span>
                <strong>Mental Contrasting</strong> (Oettingen) — sam optymizm nie wystarczy
                — dopiero kontrast wizji z realistycznymi przeszkodami tworzy motywacje
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-8">
          5 minut od klikniecia do pisania
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              icon: BookOpen,
              step: "1",
              title: "Zaloz konto",
              desc: "Wystarczy e-mail. Nic wiecej nie potrzebujemy.",
            },
            {
              icon: BookOpen,
              step: "2",
              title: "Przeczytaj krótkie wprowadzenie",
              desc: "Dowiesz sie, dlaczego ten modul dziala i czego sie spodziewac.",
            },
            {
              icon: BookOpen,
              step: "3",
              title: "Zacznij pisac",
              desc: "Konkretne pytania prowadza Cie krok po kroku. Jesli utkniesz — masz podpowiedzi.",
            },
            {
              icon: Clock,
              step: "4",
              title: "Zapisz i wroc",
              desc: "Autosave co 30 sekund. Mozesz przerwac i wrocic kiedy chcesz.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-4">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#e8f0eb] text-[#7B9E8C] font-semibold text-sm shrink-0">
                {step}
              </span>
              <div>
                <h3 className="font-medium text-[#1E2A36] mb-1">{title}</h3>
                <p className="text-sm text-[#4A5B6A]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-6">
          Twoje slowa. Tylko Twoje.
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: Lock,
              title: "Szyfrowanie",
              desc: "Twoje teksty sa szyfrowane, zanim trafia na serwer. Nikt — nawet my — nie moze ich przeczytac.",
            },
            {
              icon: Shield,
              title: "Zero sledzenia",
              desc: "Brak Google Analytics, brak cookies sledzacych, brak telemetrii.",
            },
            {
              icon: Shield,
              title: "Twoje dane, Twoja kontrola",
              desc: "W kazdej chwili mozesz wyeksportowac swoje teksty lub usunac konto.",
            },
            {
              icon: Shield,
              title: "RODO/GDPR",
              desc: "Pelna zgodnosc z europejskimi przepisami o ochronie danych.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 bg-white border border-[#e2e7eb] rounded-lg p-4"
            >
              <Icon className="h-5 w-5 text-[#7B9E8C] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1E2A36] text-sm mb-1">{title}</h3>
                <p className="text-xs text-[#4A5B6A]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For whom */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-6">
          Pisz Siebie jest dla Ciebie, jesli:
        </h2>
        <ul className="space-y-3 text-[#4A5B6A]">
          {[
            "Masz wrazenie, ze Twoje mysli kraza w kolko i nie prowadza do niczego",
            "Czujesz, ze utknales/as w miejscu, ale nie wiesz od czego zaczac",
            "Wracaja do Ciebie wspomnienia, z którymi nie wiesz co zrobic",
            "Probowales/as prowadzic dziennik, ale pusta strona poglebiala chaos",
            "Chcesz sie lepiej zrozumiec, ale nie stac Cie na terapie lub czekasz w kolejce",
            "Jestes w terapii i szukasz narzedzia do pracy wlasnej miedzy sesjami",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-[#4A5B6A]">
          Ten program to narzedzie do autorefleksji. Nie zastepuje psychoterapii.
          <br />
          Telefon Zaufania: 116 123 · Centrum Wsparcia: 800 70 2222
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-8 text-center">
          Ile to kosztuje
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white border border-[#e2e7eb] rounded-xl p-6">
            <h3 className="font-semibold text-[#1E2A36] mb-1">Darmowy</h3>
            <p className="text-3xl font-bold text-[#1E2A36] mb-4">0 PLN</p>
            <ul className="space-y-2 text-sm text-[#4A5B6A] mb-6">
              <li>Cwiczenie bramkowe &ldquo;5 Minut dla Siebie&rdquo;</li>
              <li>Modul I: Przeszlosc (kompletny, 6 cwiczen)</li>
              <li>Szyfrowanie i autosave</li>
              <li>Bez limitu czasu</li>
            </ul>
            <Link href="/program/onboarding">
              <Button variant="outline" className="w-full">
                Zacznij za darmo
              </Button>
            </Link>
          </div>
          <div className="bg-white border-2 border-[#7B9E8C] rounded-xl p-6">
            <h3 className="font-semibold text-[#1E2A36] mb-1">Pelny program</h3>
            <p className="text-3xl font-bold text-[#1E2A36] mb-1">
              <span className="text-lg line-through text-[#8A99A8] mr-2">79 PLN</span>
              29 PLN
            </p>
            <p className="text-xs text-[#7B9E8C] mb-4">promocja startowa</p>
            <ul className="space-y-2 text-sm text-[#4A5B6A] mb-6">
              <li>Wszystkie 3 moduly (18 cwiczen)</li>
              <li>Dozywotni dostep</li>
              <li>Przyszle aktualizacje</li>
              <li>Eksport do PDF</li>
              <li>Jednorazowa platnosc — bez subskrypcji</li>
            </ul>
            <Button className="w-full">Kup pelny program</Button>
          </div>
        </div>
        <p className="text-center text-sm text-[#8A99A8] mt-4 max-w-lg mx-auto">
          Mniej niz 20% ceny jednej sesji psychoterapeutycznej. Jednorazowo, bez subskrypcji.
        </p>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-6">
          Najczesciej zadawane pytania
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {[
            {
              q: "Czy to zastepuje psychoterapie?",
              a: "Nie. Pisz Siebie to narzedzie do autorefleksji, nie terapia. Jesli zmagasz sie z depresja, myslami samobojczymi lub trauma — skontaktuj sie ze specjalista. Program moze byc natomiast dobrym uzupelnieniem terapii lub krokiem, gdy na terapie czekasz.",
            },
            {
              q: "Czy ktos przeczyta to, co pisze?",
              a: "Nie. Twoje teksty sa szyfrowane. Na serwerze przechowujemy zaszyfrowane dane, ktorych nie potrafimy odczytac.",
            },
            {
              q: "Ile czasu zajmuje caly program?",
              a: "Typowo 10-15 godzin rozlozonych na kilka tygodni. Ale nie ma limitu czasu. Mozesz robic jedno cwiczenie dziennie, jedno tygodniowo, albo przerwac na miesiac i wrocic.",
            },
            {
              q: "Czy musze robic cwiczenia po kolei?",
              a: "Rekomendujemy pelna sciezke (Przeszlosc -> Terazniejszosc -> Przyszlosc), bo moduly buduja na sobie. Ale to Twoj wybor.",
            },
            {
              q: "Co jesli utkne i nie wiem co pisac?",
              a: "Kazde cwiczenie ma podpowiedzi ratunkowe — konkretne wskazowki, dokoczenia zdan i alternatywne pytania dla osob, ktore utkneły.",
            },
            {
              q: "Czy moge pominac cwiczenie?",
              a: "Tak, zawsze. Przy kazdym cwiczeniu jest przycisk \"Pomin\" i \"Wroc pozniej\". Bez wyjasnien, bez poczucia winy.",
            },
            {
              q: "Dlaczego nie jest w pelni darmowy?",
              a: "Modul I (Przeszlosc) jest w pelni darmowy — 6 cwiczen, bez ograniczen. Moduly II i III kosztuja jednorazowo 29 PLN (promocja). Ta kwota pokrywa koszty serwera i rozwoju programu.",
            },
          ].map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="bg-white border border-[#e2e7eb] rounded-lg px-4"
            >
              <AccordionTrigger className="text-left text-[#1E2A36] font-medium py-4">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#4A5B6A] pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer CTA */}
      <section className="py-12 text-center border-t border-[#e2e7eb]">
        <Link href="/program/onboarding">
          <Button size="lg" className="text-base px-8">
            Sprobuj za darmo
          </Button>
        </Link>
        <p className="text-sm text-[#8A99A8] mt-6">
          Potrzebujesz wsparcia? Telefon Zaufania: 116 123 · Centrum Wsparcia: 800 70 2222
        </p>
      </section>
    </div>
  );
}
