import Link from "next/link";
import { Phone, BookOpen, Users } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/program/dashboard"
        className="text-sm text-[#7B9E8C] hover:underline mb-4 inline-block"
      >
        &larr; Wroc do dashboardu
      </Link>

      <h1 className="text-2xl font-semibold text-[#1E2A36] mb-2">
        Zasoby wsparcia
      </h1>
      <p className="text-[#4A5B6A] mb-8">
        Pisz Siebie to narzedzie do autorefleksji — nie zastepuje kontaktu ze
        specjalista. Ponizej znajdziesz zasoby, ktore moga Ci pomoc.
      </p>

      {/* Crisis lines */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-[#7B9E8C]" />
          <h2 className="text-lg font-semibold text-[#1E2A36]">
            Natychmiastowa pomoc
          </h2>
        </div>
        <div className="bg-white border border-[#e2e7eb] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {[
                {
                  name: "Telefon Zaufania dla Doroslych",
                  contact: "116 123",
                  href: "tel:116123",
                  hours: "Calodobowo",
                  desc: "Anonimowa pomoc dla osob w kryzysie emocjonalnym",
                },
                {
                  name: "Centrum Wsparcia",
                  contact: "800 70 2222",
                  href: "tel:800702222",
                  hours: "Calodobowo",
                  desc: "Darmowa linia wsparcia psychologicznego",
                },
                {
                  name: "Telefon Zaufania dla Dzieci i Mlodziezy",
                  contact: "116 111",
                  href: "tel:116111",
                  hours: "Calodobowo",
                  desc: "Dla osob ponizej 18. roku zycia",
                },
                {
                  name: "Chat kryzysowy",
                  contact: "116111.pl",
                  href: "https://116111.pl",
                  hours: "Codziennie",
                  desc: "Pomoc tekstowa online",
                },
                {
                  name: "SMS dla osob gluchych",
                  contact: "8148",
                  href: "sms:8148",
                  hours: "Calodobowo",
                  desc: "Linia kryzysowa dostepna przez SMS",
                },
              ].map((line) => (
                <tr key={line.name} className="border-b border-[#e2e7eb] last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1E2A36]">{line.name}</div>
                    <div className="text-xs text-[#8A99A8]">{line.desc}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={line.href}
                      className="font-medium text-[#7B9E8C] hover:underline"
                      target={line.href.startsWith("http") ? "_blank" : undefined}
                      rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {line.contact}
                    </a>
                    <div className="text-xs text-[#8A99A8]">{line.hours}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Finding a therapist */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-[#7B9E8C]" />
          <h2 className="text-lg font-semibold text-[#1E2A36]">
            Jak znalezc psychoterapeute
          </h2>
        </div>
        <div className="bg-white border border-[#e2e7eb] rounded-xl p-6 space-y-6 text-sm text-[#4A5B6A]">
          <div>
            <h3 className="font-medium text-[#1E2A36] mb-2">
              1. Psycholog czy psychiatra?
            </h3>
            <ul className="space-y-1 ml-4">
              <li>Psycholog/psychoterapeuta — terapia rozmowa</li>
              <li>Psychiatra — leki (jesli potrzebne) + moze prowadzic terapie</li>
              <li>Czesto najlepiej: oboje jednoczesnie</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-[#1E2A36] mb-2">
              2. Gdzie szukac
            </h3>
            <ul className="space-y-1 ml-4">
              <li>Twoj lekarz pierwszego kontaktu (skierowanie do poradni zdrowia psychicznego na NFZ)</li>
              <li>Portale: psychoterapeuci.pl, psychologowie.pl, znanylekarz.pl</li>
              <li>Platformy online: twojterapueta.pl, mindy.pl</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-[#1E2A36] mb-2">
              3. Ile to kosztuje
            </h3>
            <ul className="space-y-1 ml-4">
              <li>NFZ: bezplatnie (kolejka: tygodnie-miesiace)</li>
              <li>Prywatnie: 150-300 PLN za sesje</li>
              <li>Platformy online: czesto tansze (80-150 PLN)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-[#1E2A36] mb-2">
              4. Jak wybrac
            </h3>
            <ul className="space-y-1 ml-4">
              <li>Szukaj certyfikowanych psychoterapeutow (4-letnie szkolenie)</li>
              <li>Pierwsza sesja to &ldquo;poznanie&rdquo; — nie musisz zostac</li>
              <li>Jesli nie czujesz sie dobrze z terapeuta — szukaj dalej. To normalne.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Recommended books */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-[#7B9E8C]" />
          <h2 className="text-lg font-semibold text-[#1E2A36]">
            Polecane ksiazki
          </h2>
        </div>
        <div className="bg-white border border-[#e2e7eb] rounded-xl p-6">
          <ul className="space-y-3 text-sm text-[#4A5B6A]">
            {[
              { title: "Pulapka szczescia", author: "Russ Harris", note: "ACT w przystepnej formie" },
              { title: "Wspolczucie dla siebie", author: "Kristin Neff", note: "" },
              { title: "Moc terazniejszosci", author: "Eckhart Tolle", note: "mindfulness" },
              { title: "Czlowiek w poszukiwaniu sensu", author: "Viktor Frankl", note: "" },
              { title: "Cialo pamieta", author: "Bessel van der Kolk", note: "o traumie" },
            ].map((book) => (
              <li key={book.title}>
                <span className="font-medium text-[#1E2A36]">
                  &ldquo;{book.title}&rdquo;
                </span>
                {" — "}
                {book.author}
                {book.note && (
                  <span className="text-[#8A99A8]"> ({book.note})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
