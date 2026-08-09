# Testy użyteczności mini kursów: symulacja 9 person AI (2026-08-09/10)

## Metodologia

9 agentów AI wcieliło się w zróżnicowane persony i przeszło przez kursy w
prawdziwej przeglądarce (Playwright, dev server), symulując tydzień używania:
po każdym ukończonym dniu skrypt cofał znaczniki czasu o dobę ("noc mija"),
odblokowując kolejny dzień. Persony działały wyłącznie przez UI (zakaz
czytania kodu i dokumentacji), prowadziły dziennik i wypełniały wspólną
ankietę. Konta sim1-9@symulacja.test, po testach do usunięcia.

Ograniczenie metody: persony AI dobrze łapią tarcia UI, tekstów i przepływów;
gorzej symulują prawdziwą długoterminową motywację. Wnioski o motywacji
traktować jako hipotezy, nie pomiar.

## Persony

| # | Kurs(y) | Persona | Test |
|---|---------|---------|------|
| 1 | niescrollowanie | Ola, 24, studentka, doomscrolling | skanowanie tekstów, niecierpliwość |
| 2 | niescrollowanie | Marek, 38, zdalny, dzieci | sumienność, notatki, szczegóły |
| 3 | niescrollowanie | Grażyna, 51, księgowa | niska techniczność, bariera językowa |
| 4 | wdzięczność | Kuba, 29, programista po wypaleniu | sceptycyzm, merytoryka |
| 5 | wdzięczność | Ewa, 45, polonistka, wierząca | język, ton, duchowość |
| 6 | wdzięczność | Tomek, 19, prokrastynator | 2-dniowa przerwa i powrót |
| 7 | oba | Karolina, 33, PM | doświadczenie multi-kursowe |
| 8 | oba | Paweł, 27, bez pracy, w dołku | bezpieczeństwo emocjonalne |
| 9 | oba | Adam, 40, przedsiębiorca | 100% mobile (390px) |

Ukończenia: 8/9 person doszło do końca swoich kursów (Tomek zgodnie ze
scenariuszem został na 5/7 po przerwie). Wszystkie oceniły, że w prawdziwym
życiu prawdopodobnie ukończyłyby kurs, co jak na tę grupę person jest bardzo
dobrym wynikiem.

## Potwierdzone bugi

| # | Bug | Zgłosiło | Repro |
|---|-----|----------|-------|
| B1 | Formularz feedbacku pyta o "5 dni" w 7-dniowym kursie wdzięczności ("Czy kurs był wart tych pięciu dni?", "Tak, było warte tych 5 dni") + niezgrabne "było warte" | 5 person | hardcode w feedback-form.tsx |
| B2 | Puste pole "podniesienia" przy zapisie staje się "około 0 dziennie" w bilansie dnia 5 | P3 | Number("")===0 w enroll-form.tsx |
| B3 | Rejestracja gubi powrót do kursu: /login?next=... → "Sign up" → /register (bez next) → po zalogowaniu ląduje na "/" | P6, P9 | parametr next nie przechodzi przez link do /register |
| B4 | "Check your email to confirm your account" po rejestracji, choć konto działa od razu (mylące; prawie porzucenie) | P6, P8, P9 | copy w auth-form (dev: autoconfirm) |
| B5 | Literówki na /profil: "Nazwa wyswietlana", "Pokazuje sie" | 5 person | brak polskich znaków w labelach |
| B6 | Landing: "Każdy dzień to cztery krótkie kroki", a dzień 1 ma trzy (brak check-inu) | P2, P3, P8 | copy howItWorks |

## Tarcia według częstotliwości

| Zgłoszenie | Głosy | Waga |
|------------|-------|------|
| Modal logowania w całości po angielsku na polskiej domenie | 9/9 | wysoka (dla P3 bariera nie do przejścia samodzielnie) |
| Zakończenie kursu "płaskie": brak podsumowania/lustra po 5-7 dniach, tylko CTA do płatnego programu | 8/9 | wysoka |
| Notatki z check-inów "write-only" (nie da się ich nigdzie przeczytać poza eksportem JSON) | 4 | wysoka |
| Decyzje z finału (zasada "jeśli-to", okno bez telefonu) nie mają gdzie się zapisać | 4 | średnia |
| Podwójny klik "Zapisz się za darmo" (po logowaniu formularz nie otwiera się sam) | 3 | średnia |
| Brak linii wsparcia w kursach (program ma SafetyBanner, kursy nie) | P8 | **decyzja właściciela: NIE dodajemy** — kursy nawykowe (niescrollowanie, wdzięczność) to nie terapia ani kursy o depresji; osoby szukające pomocy nie szukają jej przez te kursy, więc numery pomocowe tu nie trafią. Łagodzimy za to język zadań emocjonalnych (zdania ratunkowe przy zadaniu, nie dzień później). |
| Multi-kurs "niewidzialny": brak wspólnego widoku, przełączanie przez landingi, ekran ukończenia ignoruje drugi trwający kurs | P7, P8, P9 | średnia |
| Check-in po przerwie pyta o "wczoraj" (fałszywe po dziurze); powrót "bezkarny ale bezbarwny" | P6 | średnia |
| Kursy niedostępne ze strony głównej (brak linków w nagłówku/stopce/sitemap) | P8 | wysoka (przed startem) |
| Brak stanu "wybrane" na opcjach check-inu (a11y: brak aria-pressed) | P2, P4, P5 | średnia |
| Quizy za łatwe (2 opcje, karykaturalne dystraktory) | 4 | niska |
| Treści zakładają "urządzone życie" (wspólne posiłki, korki, praca) — ukłucia dla osób samotnych/bez pracy | P8 | średnia |
| Zdania ratunkowe przychodzą dzień po zadaniu ("echo nie jest potrzebne" w d7 zamiast przy zadaniu d6) | P8 | średnia |
| Formy męskie w treściach ("jesteś wdzięczny"), mimo że platforma ma gender_form | P5, P8 | średnia |
| "Modlitwa to technologia utrzymywania uwagi" instrumentalizuje modlitwę | P5 | niska (1 zdanie) |
| Instrukcje techniczne bez instrukcji (gdzie jest czas ekranowy, jak zrobić folder) | P3 | niska |
| Powtarzany dopisek "(bez punktów, obiecujemy)" 5-7x traci wdzięk | P5 | niska |
| Wersja minimalna tylko jako tekst, nie da się jej "wybrać" | P9 | niska |
| Brak przycisku "pomiń" przy liczbach bazowych | P2, P8 | niska |
| Brak paska postępu w sidebarze (liczenie kropek) | P7 | niska |

## Co działa (jednogłośnie)

1. **Reakcje na porażkę w check-inach** — wszystkie 9 person wskazało to jako
   najmocniejszy element ("pierwszy raz appka nie robi mi wyrzutów, że jestem
   sobą"; "bezcenne dla osoby w dołku").
2. **Wersje minimalne wyzwań** — "ani razu nie porzuciłem, choć byłem blisko".
3. **Jakość tekstów** — średnia ocen 4,7/5; Ewa: "najlepiej napisany kurs
   internetowy, jaki widziałam".
4. **Powrót liczb bazowych w dniu 5** — "kurs mnie pamięta", najlepszy moment
   produktu wg 4 person.
5. **Struktura dnia i nawigacja** — identyczny rytm obu kursów, sidebar/chipy,
   "Kontynuuj: dzień X"; mobile: wygoda dotykowa 5/5.
6. **Powrót po przerwie mechanicznie bezbłędny** — jeden przycisk, zero wstydu,
   nic nie przepada.

## Gamifikacja: werdykt person

Zaskakująco spójny w 9 głosach:
- **Streaki/serie: jednoznacznie NIE** (3 persony wprost: "streak by mnie
  dobił/odpadłabym po zerwaniu"). Świadomy brak pass jest zauważany i chwalony.
- **Liczniki postępu: wystarczają** obecne (kropki, "X z Y").
- **Czego faktycznie chcą: "lustro, nie medal"** — podsumowanie WŁASNYCH danych
  na koniec (check-iny z tygodnia, notatki, liczby przed/po) jako nagroda-pamiątka.
  5 person osobno wymyśliło tę samą funkcję.
- **Lekka celebracja momentów: 2 głosy na tak** (Tomek: "odrobina fajerwerków
  tak, streaki nie"; Paweł: "zaliczenie dnia to czasem jedyna rzecz zrobiona
  tego dnia"). Cieplejsze domknięcie dnia wystarczy, bez confetti-przymusu.

## Wdrożone poprawki

Decyzją właściciela naprawione wszystko POZA dodawaniem informacji o pomocy /
linii wsparcia do kursów (patrz tabela wyżej).

- B1-B6: wszystkie bugi naprawione.
- Polski interfejs logowania/rejestracji + zachowanie parametru powrotu przez
  rejestrację + automatyczne zalogowanie po rejestracji (bez mylącego
  "Check your email").
- Auto-otwarcie formularza zapisu po powrocie z logowania; przycisk pominięcia
  liczb bazowych; neutralne zdanie przyjęcia liczb; instrukcja, gdzie znaleźć
  czas ekranowy.
- Ekran ukończenia kursu: podsumowanie-"lustro" (check-iny + notatki
  odszyfrowane + liczby przed/po) oraz wskazanie drugiego, trwającego kursu
  przed CTA do programu.
- Sekcja "Moje kursy" na /profil + link "Moje konto" w nagłówku kursów +
  skrót do drugiego kursu w sidebarze + pasek postępu w sidebarze.
- Linki do kursów w stopce (domena PL) i sitemapie.
- a11y: aria-pressed na opcjach check-inu i feedbacku.
- Mikrocelebracja: cieplejsze domknięcie dnia (bez streaków i konfetti).
- Treści: check-iny odporne na przerwę (bez "wczorajsze"), zdanie ratunkowe
  d6 przy zadaniu (zamiast dzień później), "technologia modlitwy"
  przeredagowana, formy męskie zneutralizowane, przykłady przyjazne osobom
  samotnym, dopisek quizu tylko w dniu 1, poprawki językowe z listy Ewy.

## Nadal do decyzji

1. **Maile: przypomnienia + win-back po 2-3 dniach ciszy** — preferencja
   zapisywana, wysyłka niezaimplementowana (wybór: MailerLite vs cron).
2. **Trudność quizów** — 4 głosy "za łatwe"; podniesienie trudności to
   przeprojektowanie pytań (świadomie łatwe = utrwalenie, nie test).
3. **Zapis decyzji finału** (pole na zasadę "jeśli-to") — wymaga kolumny
   w bazie; częściowo zaadresowane przez podsumowanie-lustro.
