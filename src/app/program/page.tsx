import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Lock, Clock, BookOpen, Check, Sparkles } from "lucide-react";
import { ProgramHeader } from "@/components/program/program-header";

export default function ProgramLandingPage() {
  return (
    <>
    <ProgramHeader />
    <div className="max-w-5xl mx-auto px-5 md:px-8">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1E2A36] leading-tight mb-4">
          Kiedy w głowie jest za dużo chaosu, zacznij od pisania.
        </h1>
        <p className="text-lg text-[#4A5B6A] max-w-2xl mx-auto mb-8 leading-relaxed">
          The Life Writing Program to program autorefleksji oparty na badaniach psychologicznych.
          Pomaga uporządkować myśli o przeszłości, teraźniejszości i przyszłości.
          Bez presji czasu, bez oceniania, w Twoim tempie.
        </p>
        <a href="#cennik">
          <Button size="lg" className="text-base px-8">
            Dołącz do programu
          </Button>
        </a>
        <p className="text-sm text-[#8A99A8] mt-3">
          <span className="line-through">79 PLN</span> 29 PLN. Jednorazowo, bez subskrypcji.
        </p>
      </section>

      {/* Problem */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-4">
          Znasz to uczucie?
        </h2>
        <div className="text-[#4A5B6A] leading-relaxed space-y-4">
          <p>
            Poczucie, że myślisz w kółko, ale nigdzie nie dochodzisz.
            Że dużo o sobie wiesz, ale nic z tego nie wynika.
            Że czas mija, a Ty stoisz w miejscu.
          </p>
          <p>
            Prowadzenie dziennika nie pomagało, bo pusta strona nie daje struktury.
            Książki o rozwoju? Wiedza sama nie zamienia się w zmianę.
          </p>
          <p className="font-medium text-[#1E2A36]">
            Czasem potrzebujesz struktury. Narzędzia, które prowadzi Cię krok po kroku.
          </p>
        </div>
      </section>

      {/* Solution — 3 modules */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-8">
          Struktura zamiast chaosu
        </h2>
        <p className="text-[#4A5B6A] leading-relaxed mb-8">
          To nie kolejna aplikacja do mindfulness ani lista motywacyjnych cytatów.
          To ustrukturyzowany program pisania oparty na 30 latach badań psychologicznych.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Moduł I: Przeszłość",
              subtitle: "Zrozum swoją historię",
              desc: "Uporządkuj wspomnienia. Nadaj im sens. Zmniejsz ich emocjonalny ładunek.",
              meta: "6 ćwiczeń · 3-5 godzin łącznie",
            },
            {
              title: "Moduł II: Teraźniejszość",
              subtitle: "Zrozum, gdzie stoisz",
              desc: "Odkryj swoje wartości. Rozpoznaj schematy myślenia. Potraktuj siebie z życzliwością.",
              meta: "6 ćwiczeń · 3-5 godzin łącznie",
            },
            {
              title: "Moduł III: Przyszłość",
              subtitle: "Zaprojektuj siebie",
              desc: "Stwórz wizję. Skonfrontuj ją z rzeczywistością. Zrób jeden konkretny krok.",
              meta: "6 ćwiczeń · 3-5 godzin łącznie",
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
          Nie wierzymy w magiczne rozwiązania. Wierzymy w badania.
        </h2>
        <div className="text-[#4A5B6A] leading-relaxed space-y-4">
          <p>
            Profesor James Pennebaker z Uniwersytetu Teksańskiego spędził ponad 30 lat
            badając, dlaczego pisanie o trudnych doświadczeniach pomaga. Jego badania pokazują,
            że kiedy nadajemy strukturę chaotycznym myślom, ich emocjonalny ładunek się
            zmniejsza. Nie znikają, ale przestają tak bardzo przeszkadzać.
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1.5 shrink-0">•</span>
              <span>
                <strong>Tożsamość narracyjna</strong> (McAdams): badania sugerują, że ludzie
                ze spójną historią własnego życia mają wyższe poczucie sensu
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1.5 shrink-0">•</span>
              <span>
                <strong>Terapia Akceptacji i Zaangażowania</strong> (Hayes): rozróżnienie
                między Tobą a Twoimi myślami zmienia sposób, w jaki na nie reagujesz
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1.5 shrink-0">•</span>
              <span>
                <strong>Współczucie dla siebie</strong> (Neff): samokrytyka pogłębia
                paraliż, życzliwość wobec siebie go przełamuje
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1.5 shrink-0">•</span>
              <span>
                <strong>Mental Contrasting</strong> (Oettingen): sam optymizm nie wystarczy.
                Dopiero kontrast wizji z realistycznymi przeszkodami tworzy motywację
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-8">
          5 minut od kliknięcia do pisania
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              icon: BookOpen,
              step: "1",
              title: "Załóż konto",
              desc: "Wystarczy e-mail. Nic więcej nie potrzebujemy.",
            },
            {
              icon: BookOpen,
              step: "2",
              title: "Przeczytaj krótkie wprowadzenie",
              desc: "Dowiesz się, dlaczego ten moduł działa i czego się spodziewać.",
            },
            {
              icon: BookOpen,
              step: "3",
              title: "Zacznij pisać",
              desc: "Konkretne pytania prowadzą Cię krok po kroku. Jeśli utkniesz, masz podpowiedzi.",
            },
            {
              icon: Clock,
              step: "4",
              title: "Zapisz i wróć",
              desc: "Autosave co 30 sekund. Możesz przerwać i wrócić kiedy chcesz.",
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
          Twoje słowa. Tylko Twoje.
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: Lock,
              title: "Szyfrowanie",
              desc: "Twoje teksty są szyfrowane, zanim trafią na serwer. Nikt ich nie może przeczytać, nawet my.",
            },
            {
              icon: Shield,
              title: "Zero śledzenia",
              desc: "Brak Google Analytics, brak cookies śledzących, brak telemetrii.",
            },
            {
              icon: Shield,
              title: "Twoje dane, Twoja kontrola",
              desc: "W każdej chwili możesz wyeksportować swoje teksty lub usunąć konto.",
            },
            {
              icon: Shield,
              title: "RODO/GDPR",
              desc: "Pełna zgodność z europejskimi przepisami o ochronie danych.",
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
          Ten program jest dla Ciebie, jeśli:
        </h2>
        <ul className="space-y-3 text-[#4A5B6A]">
          {[
            "Masz wrażenie, że w głowie wszystko kręci się w kółko, ale nic z tego nie wynika",
            "Utknąłeś/aś w miejscu i nie potrafisz zrozumieć dlaczego",
            "Chcesz uporządkować swoje doświadczenia i lepiej je zrozumieć",
            "Próbowałeś/aś prowadzić dziennik, ale pusta strona pogłębiała chaos",
            "Brakuje Ci konkretnego narzędzia do tego, żeby lepiej siebie zrozumieć",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[#7B9E8C] mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[#8A99A8]">
          To narzędzie do autorefleksji, nie forma terapii.
        </p>
      </section>

      {/* Pricing */}
      <section id="cennik" className="py-12 scroll-mt-20">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-8 text-center">
          Ile to kosztuje
        </h2>
        <div className="max-w-md mx-auto">
          <div className="relative bg-gradient-to-b from-[#f0f7f2] to-white border border-[#c5d8cc] rounded-2xl p-8 pt-10 text-center shadow-[0_4px_24px_rgba(123,158,140,0.12)]">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-[#7B9E8C] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Wczesny dostęp
              </span>
            </div>

            <p className="text-5xl font-bold text-[#1E2A36] mb-1">
              29 <span className="text-2xl font-semibold">PLN</span>
            </p>
            <p className="text-sm text-[#8A99A8] mb-8">
              Cena regularna: <span className="line-through">79 PLN</span>
            </p>

            <ul className="space-y-3 text-sm text-[#4A5B6A] mb-8 text-left">
              {[
                "Wszystkie 3 moduły (18 ćwiczeń, 10-15h pracy)",
                "Szyfrowanie treści i autosave",
                "Dożywotni dostęp, bez subskrypcji",
                "Eksport do PDF",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#7B9E8C] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/program/onboarding">
              <Button className="w-full text-base" size="lg">
                Dołącz do programu
              </Button>
            </Link>
            <p className="text-xs text-[#8A99A8] mt-3">
              Jednorazowa płatność. Bez subskrypcji, bez ukrytych kosztów.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-[#1E2A36] mb-6">
          Najczęściej zadawane pytania
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {[
            {
              q: "Czym jest ten program?",
              a: "To ustrukturyzowane narzędzie do autorefleksji przez pisanie, oparte na badaniach psychologicznych. Nie jest formą terapii.",
            },
            {
              q: "Czy ktoś przeczyta to, co piszę?",
              a: "Nie. Twoje teksty są szyfrowane. Na serwerze przechowujemy zaszyfrowane dane, których nie potrafimy odczytać.",
            },
            {
              q: "Ile czasu zajmuje cały program?",
              a: "Typowo 10-15 godzin rozłożonych na kilka tygodni. Ale nie ma limitu czasu. Możesz robić jedno ćwiczenie dziennie, jedno tygodniowo, albo przerwać na miesiąc i wrócić.",
            },
            {
              q: "Czy muszę robić ćwiczenia po kolei?",
              a: "Rekomendujemy pełną ścieżkę (Przeszłość, Teraźniejszość, Przyszłość), bo moduły budują na sobie. Ale to Twój wybór.",
            },
            {
              q: "Co jeśli utknę i nie wiem co pisać?",
              a: "Każde ćwiczenie ma podpowiedzi ratunkowe. To konkretne wskazówki, dokończenia zdań i alternatywne pytania dla osób, które utknęły.",
            },
            {
              q: "Czy mogę pominąć ćwiczenie?",
              a: "Tak, zawsze. Przy każdym ćwiczeniu jest przycisk \"Pomiń\" i \"Wróć później\". Bez wyjaśnień, bez poczucia winy.",
            },
            {
              q: "Dlaczego jest płatny?",
              a: "29 PLN to cena wczesnego dostępu (regularna cena to 79 PLN). Ta kwota pokrywa koszty serwera, szyfrowania i rozwoju programu. Darmowe treści psychoedukacyjne znajdziesz na naszym feedzie.",
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
        <a href="#cennik">
          <Button size="lg" className="text-base px-8">
            Dołącz do programu
          </Button>
        </a>
      </section>
    </div>
    </>
  );
}
