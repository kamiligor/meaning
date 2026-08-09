# Kurs wdzięczności. 7 dni praktyki

Dokument koncepcyjny drugiego mini kursu, zbudowanego na silniku kursów
(patrz `kurs-niescrollowania.md`). Podstawa merytoryczna: notatki
`gratitude-mini-course-plan.md` (łuk 4 części, trzy głosy: Arthur Brooks,
Jordan Peterson, Thich Nhat Hanh).

## Decyzje (wobec pytań otwartych z notatek)

- **Odbiorca:** ogólny, jak reszta platformy (ton "mądry znajomy").
- **Długość:** 7 dni, jeden dzień naraz (odblokowywanie jak w kursie
  niescrollowania). Wrap "make it stick" wpleciony w dzień 7, bez osobnego dnia.
- **Format:** mini kurs na stronie (`/kurs-wdziecznosci`), zapis na konto,
  check-in / wiedza / quiz / praktyka. Zamiast "wyzwania" mówimy "praktyka"
  (parametr `challengeNoun` w silniku). Bez liczb bazowych przy zapisie
  (parametr `askBaseline: false`).

## Mapowanie lekcji z notatek na dni

| Dzień | Lekcja z notatek | Praktyka |
|---|---|---|
| 1 | The case for gratitude | Zapisz 3 rzeczy, za które dziękujesz teraz |
| 2 | Gratitude vs resentment | Złap jedno narzekanie i odwróć je |
| 3 | The morning anchor | Jedno zdanie podziękowania przed telefonem |
| 4 | The evening anchor | 3 dobre momenty przed snem (+ opcja listy tygodniowej) |
| 5 | The rhythm of gratitude | 3 pauzy na oddech w ciągu dnia |
| 6 | Gratitude expressed | Jedna szczera, konkretna wiadomość z podziękowaniem |
| 7 | Finding the good in what is + wrap | "Za co tu mogę uczciwie podziękować?" + plan 30 dni |

## Zasady treści

- Uczciwa wdzięczność, nie toksyczna pozytywność: szukamy dobrego OBOK
  trudnego, nie zamiast; wprost nazwane w dniu 7 i na landingu.
- Atrybucje naturalne, bez cytowań akademickich: Brooks (umiejętność nie
  cecha, protokół 5 kroków, sen), badanie z 2003 o liczeniu dobrodziejstw
  (Emmons i McCullough, w treści "klasyczne badanie dwóch psychologów"),
  Peterson (resentyment, wdzięczność pomimo cierpienia, Beyond Order),
  Thich Nhat Hanh (gatha, dzwonki uważności, współistnienie).
- Gatha parafrazowana, nie tłumaczona dosłownie.
- Efekt fali (wdzięczność podnosi też innych) jako motywacja w dniu 6.

## Silnik (co się zmieniło technicznie)

Infrastruktura kursów uogólniona na wiele kursów: rejestr w
`src/lib/courses/` (types + treści per kurs + index), API przyjmuje
`courseSlug`, wspólne komponenty stron (`course-landing`, `course-day-page`),
panel admina pokazuje lejek każdego kursu osobno. Tabele w Supabase były
od początku kluczowane po `course_slug`, migracja nie była potrzebna.

## Źródła (z notatek)

- Arthur Brooks, "5 Steps Toward a More Grateful Life" (Office Hours, odc. 16)
- Emmons i McCullough, "Counting Blessings Versus Burdens" (2003)
- Jordan Peterson, "Beyond Order", zasada 12 (wdzięczność pomimo cierpienia)
- Thich Nhat Hanh, "The Heart of the Buddha's Teaching" (interbeing),
  poranna gatha, Plum Village "The Practice of Gratitude"
