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
  Peterson (resentyment, w treści zawsze jako „uraza", wdzięczność pomimo
  cierpienia, Beyond Order), Thich Nhat Hanh (gatha, dzwonki uważności,
  współistnienie).
- Gatha parafrazowana, nie tłumaczona dosłownie.
- Język prosty, pisany dla kogoś bez wykształcenia psychologicznego: krótkie
  zdania, żadnego terminu bez wyjaśnienia w tym samym zdaniu („uraza" zamiast
  „resentyment", „ta część mózgu" zamiast „kora przedczołowa"). Zamiast
  nazywać mechanizm, pokazujemy, co robi w życiu.
- Dzień 3 otwiera się przykładami z chrześcijaństwa, islamu i judaizmu jako
  obserwacją historyczną: wszędzie praktyka codzienna, o stałej porze,
  najczęściej rano, co uzasadnia porannej kotwicę. Bez przekonywania do
  religii, przykłady pokazują formę praktyki, nie prawdziwość wiary.
- Uraza z powodu (ktoś realnie krzywdzi) nie jest tematem kursu i dzień 2
  celowo w to nie wchodzi: rozróżnianie „uraza do naprawienia rozmową" od
  „uraza do ruszenia praktyką" wprowadzało zamieszanie w dniu, który mówi
  o czym innym. Zabezpieczenie zostaje tam, gdzie ma znaczenie, czyli w samej
  praktyce: wyzwanie dnia 2 każe odwracać narzekania z gatunku korków i pogody,
  a sprawy, które naprawdę ranią, zostawić. Tego zdania nie usuwać, bo bez
  niego praktyka zaprasza do zaklinania realnej krzywdy wdzięcznością.
- Rozdzielamy rejestry: obraz („uraza wyrasta w pustym miejscu", Peterson jako
  moralista i interpretator mitów) nazywamy obrazem, a to, co zmierzone
  (skrzywienie negatywności, badanie z 2003, docenianie partnera a trwałość
  związku), podajemy jako wynik. Zgodność z Petersonem nie jest dowodem i kurs
  nie może jej tak sprzedawać.
- Opinia zawsze z nazwiskiem („według Petersona", „Brooks twierdzi"). Głosem
  kursu mówimy wyłącznie rzeczy sprawdzone.
- Bez wyjaśnień post hoc udających dowód: ewolucyjne „bo to ratowało życie"
  oznaczamy jako zgadywanie, a neuro-ozdobniki („ta sama kora przedczołowa")
  zastępujemy czymś, co czytelnik sam sprawdzi na sobie.
- Bez retrofitu religii: tradycje nakazywały dziękczynienie, bo uważały je za
  należne Bogu, nie dlatego, że zauważyły efekt psychologiczny. Kurs mówi to
  wprost i korzysta tylko z obserwacji o formie (codziennie, o stałej porze).
- Fakty religijne sprawdzone: Eucharystia to obrzęd, nie modlitwa (najważniejsza
  modlitwa chrześcijan to Ojcze nasz); „alhamdulillah" znaczy „chwała Bogu"
  (hamd), a wdzięczność to shukr, więc nie używamy tej formuły jako przykładu
  wdzięczności.
- Siła efektu bez zaokrągleń: metaanalizy dają efekt umiarkowany, a wobec
  aktywnej grupy kontrolnej przewaga topnieje. Dzień 1 mówi to wprost, żeby
  proporcja między diagnozą a lekarstwem się domykała.
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
- Jordan Peterson, "Beyond Order", zasada 12 "Be grateful in spite of your
  suffering" — źródło dla dnia 2 (łatwo zgorzknieć, wdzięczność jest wyborem)
  i dnia 7 (wdzięczność pomimo cierpienia jako odwaga). UWAGA: tezy „w to
  miejsce wchodzi uraza", którą stawia dzień 2, nie udało się znaleźć u niego
  w tej postaci; udokumentowana jest zasada 12 (łatwo zgorzknieć, wdzięczność
  jest wyborem). Dlatego zdanie musi zostać przypisane wprost („Peterson
  twierdzi"), nigdy podane głosem kursu jako fakt.
- Jordan Peterson, "12 Rules for Life" — uraza jako sygnał: "resentment always
  means one of two things. Either the resentful person is immature (...) or
  there is tyranny afoot, in which case the person subjugated has a moral
  obligation to speak up". Cytat zweryfikowany, rozdziału nie przypięto
  (źródła podają lokalizację Kindle 1808-1813). Podstawa akapitu o adresie
  urazy w dniu 2.
- Thich Nhat Hanh, "The Heart of the Buddha's Teaching" (interbeing),
  poranna gatha, Plum Village "The Practice of Gratitude"
- Buddyjska wdzięczność (dzień 2): Kataññu Sutty AN 2.31-32 (człowiek prawy
  jest wdzięczny, człowiek bez integralności nie jest; kataññutā znaczy
  dosłownie „wiedzieć, co zostało zrobione") oraz Pięć Kontemplacji przed
  posiłkiem z tradycji Plum Village („may we eat with mindfulness and
  gratitude") jako przykład praktyki o stałej porze
