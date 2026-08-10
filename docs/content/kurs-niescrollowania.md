# Kurs niescrollowania. 5 dni nauki nudzenia się (format: wyzwanie)

Dokument koncepcyjny, wersja 2. Zmiana względem v1: kurs dostaje strukturę
wyzwania. Każdy dzień składa się z czterech stałych elementów:

1. **Check-in** (od dnia 2): krótki opis, jak poszło wczorajsze wyzwanie
2. **Dawka wiedzy**: jeden temat dziennie, 300-500 słów
3. **Quiz**: 2-3 lekkie pytania utrwalające, z wyjaśnieniem przy odpowiedzi
4. **Wyzwanie dnia**: jedno konkretne zadanie + wersja minimalna

Podstawa merytoryczna bez zmian: materiały Arthura Brooksa z atrybucją
(sekcja Źródła niżej) + badania z `kurs-niescrollowania-warianty.md`.
Gotowe teksty mailowe v1 w `kurs-niescrollowania-tresci.md` (do przepisania
po akceptacji tej struktury; dawki wiedzy w dużej mierze do ponownego użycia).

## Zasady formatu

- **Quiz to utrwalenie, nie test.** Bez punktów, bez wyniku, bez "oblałeś".
  Każda odpowiedź (dobra i zła) dostaje jedno zdanie wyjaśnienia. Pytania
  lekkie, czasem z przymrużeniem oka w dystraktorach.
- **Check-in bez oceniania.** Pytanie brzmi "jak poszło", nie "czy wykonano".
  Odpowiedź "nie wyszło, zapomniałem o wszystkim" jest pełnoprawna i dostaje
  taką samą reakcję jak sukces: to dane z eksperymentu. Technicznie: 3 opcje
  do kliknięcia + opcjonalne pole tekstowe (wzorzec jak emotional-checkin
  w programie).
- **Wyzwania eskalują**: dzień 1 to czysta zmiana myślenia (zero wysiłku
  behawioralnego), dopiero potem realne minuty nudy. Nikt nie odpada
  pierwszego dnia.
- Bez streaków i liczników. Pominięty dzień = kurs po prostu czeka.

## Format: mini kurs na stronie, z zapisem na konto (decyzja)

Kurs żyje na stronie. Jest darmowy, ale wymaga zapisu na konto: to samo
Supabase Auth co program (magic link + Google OAuth), więc uczestnik kursu
od pierwszego dnia ma konto, którym potem wchodzi w The Life Writing
Program. Szkic techniczny:

- **Routing (PL, poprostusens.pl):** `/kurs-niescrollowania` (landing
  z zapisem) + `/kurs-niescrollowania/dzien/[1-5]` (strony dni, tylko dla
  zapisanych). Wersja EN później, jak reszta platformy.
- **Zapis = konto.** Landing dostępny publicznie, przycisk "Zapisz się
  za darmo" prowadzi przez logowanie/rejestrację (istniejący flow
  programu). Po zalogowaniu rekord zapisu na kurs i wejście w dzień 1.
- **Trackowanie postępu (first-party, na koncie użytkownika):** zapisujemy
  całą aktywność w Supabase, żeby wiedzieć, ile osób kończy kurs i w którym
  miejscu odpada: zapis na kurs, rozpoczęcie i ukończenie każdego dnia,
  odpowiedzi check-inów, odpowiedzi quizów, moment porzucenia (ostatnia
  aktywność). Szkic danych: tabela `course_enrollments` (user_id,
  course_slug, enrolled_at, completed_at, baseline_screen_time,
  baseline_pickups) + `course_day_progress` (enrollment_id, day, started_at,
  completed_at, checkin_choice, checkin_text, quiz_answers JSONB). RLS jak
  w reszcie programu.
- **Analityka:** prosty widok w panelu admina: liczba zapisów, lejek
  dzień 1 → 5 (ile osób ukończyło każdy dzień), rozkład odpowiedzi
  check-inów. Bez narzędzi zewnętrznych.
- **Zgodność z zasadami platformy:** "zero tracking" z CLAUDE.md dotyczy
  śledzenia zewnętrznego (GA, cookies reklamowe, telemetria) i to się nie
  zmienia. Tu trackujemy aktywność zalogowanego użytkownika w jego własnym
  kursie, first-party, jawnie (informacja przy zapisie). Konsekwencje RODO:
  dane kursu MUSZĄ wejść do eksportu (`/api/program/data-export`) i być
  usuwane z kontem (`/api/program/account`). Teksty check-inów mogą
  zawierać treści osobiste, więc szyfrujemy je jak odpowiedzi ćwiczeń
  (AES-256-GCM); metadane postępu (daty, wybory quizu) zostają jawne,
  bo to one służą analityce.
- **Tempo:** dzień 2 odblokowuje się o 6:00 rano następnego dnia po
  ukończeniu dnia 1 (daty w `course_day_progress`), i tak dalej. Poranek,
  nie północ: kurs o zdrowych nawykach nie powinien zapraszać do otwierania
  go o 00:01. Bramka 6:00 dotyczy tylko pierwszego poranka; raz otwarte dni
  nie zamykają się z powrotem, a ukończone można przeglądać o każdej porze.
  Bez presji: brak deadline'ów, przerwa nie resetuje niczego, kurs po prostu
  czeka. Blokada jest merytoryczna (wyzwanie potrzebuje doby), nie
  gamifikacyjna.
- **Komponenty:** strona dnia = 4 sekcje (check-in, wiedza, quiz,
  wyzwanie). Check-in wzorowany na `emotional-checkin.tsx` (3 opcje +
  opcjonalne pole tekstowe). Quiz: nowy prosty komponent (radio + natychmiastowe
  wyjaśnienie, bez wyniku). Pasek postępu: istniejący `progress-bar.tsx`.
- **Maile: tylko przypomnienia o odblokowanych dniach.** Kurs merytorycznie
  żyje w całości na stronie; mail niczego nie zawiera poza informacją, że
  kolejny dzień jest gotowy ("Dzień 3 czeka" + link). Zasady: maksymalnie
  jedno przypomnienie dziennie, wysyłane gdy dzień się odblokuje; brak
  presji w treści (żadnych pass, liczników, "nie poddawaj się"); jeśli ktoś
  przerwał, przypomnienia po prostu cichną po jednym dodatkowym mailu
  ("kurs czeka, wracasz kiedy chcesz", jednorazowo); rezygnacja jednym
  kliknięciem. Przy zapisie na kurs jasna informacja, że przypomnienia będą
  przychodzić + możliwość odznaczenia. Technicznie: pole
  `reminders_enabled` w `course_enrollments`, wysyłka przez MailerLite
  (osobna grupa) albo prosty endpoint + cron; do rozstrzygnięcia przy
  implementacji.
- **Feedback na koniec kursu, w kursie:** ostatni ekran dnia 5 (po
  wyzwaniu i bilansie) to krótki formularz feedbacku: 2-3 pytania, np.
  "czy kurs był wart tych 5 dni" (3 opcje, nie skala 1-10), "co było
  najtrudniejsze", "co zmienić" (pola opcjonalne). Odpowiedzi do Supabase
  (tabela `course_feedback`: enrollment_id, rating, answers JSONB,
  created_at). Na później (nie teraz): mail po ~tygodniu z pytaniem, czy
  któraś chwila nudy została na stałe (pomiar trwałości efektu, Brooks
  mówi o ~2 tygodniach).
- **Lejek:** feed / Instagram → landing kursu → konto → dzień 5 → feedback
  → The Life Writing Program. Kurs jest darmowy i pełni rolę pierwszego
  kontaktu z marką oraz budowy bazy kont.

---

## Dzień 0. Landing + zapis

Landing `/kurs-niescrollowania`: rama (eksperyment na 5 dni, nie odwyk),
jak to działa (wiedza, quiz, wyzwanie, check-in, jeden dzień naraz),
uczciwa obietnica (trening jednej umiejętności, nie detoks) i przycisk
"Zapisz się za darmo" (logowanie/rejestracja istniejącym flow programu;
przy zapisie krótka informacja, że postęp w kursie jest zapisywany na
koncie). Po zalogowaniu, przed wejściem w dzień 1, jedno mikrozadanie:
wpisz dwie liczby z ustawień telefonu (czas ekranowy, liczba podniesień);
trafiają do rekordu zapisu i wracają w bilansie dnia 5.

---

## Dzień 1. Stan domyślny

**Wiedza: co robi mózg, kiedy "nic nie robi"**

Punkt wyjścia: moment tuż po przebudzeniu, zanim ręka sięgnie po telefon.
Głowa sama z siebie zaczyna coś robić: przelatuje po wczorajszej rozmowie,
planuje dzień, wraca do sprawy sprzed tygodnia. To nie jest szum. To sieć
stanu domyślnego: tryb, w który mózg wchodzi zawsze, kiedy nie dostaje
zadania z zewnątrz. W tym trybie porządkuje wspomnienia, planuje przyszłość
i, jak podkreśla Arthur Brooks, jako jedyny zadaje pytania o to, co ważne.
Nuda to nie jest brak aktywności mózgu. To jego własna aktywność, ta,
której nie da się zlecić nikomu innemu.

Problem: 205 spojrzeń w telefon dziennie (dane, które przywołuje Brooks)
oznacza, że ten tryb prawie nigdy się nie włącza. A badanie z 2021 roku
pokazało rzecz przewrotną: sięganie po telefon z nudów zostawia ludzi
bardziej znudzonych i zmęczonych, nie mniej. Brooks nazywa to pętlą:
im częściej uciekasz od nudy, tym bardziej pusta się robi, i tym mocniej
chce się uciekać.

**Quiz (przykładowe pytania):**

1. Co robi mózg, kiedy się nudzisz?
   a) Przechodzi w tryb oszczędzania energii, jak telefon ✗
   b) Porządkuje wspomnienia, planuje i szuka sensu ✓
   c) Czeka na bodziec, nic więcej ✗
   Wyjaśnienie: tryb "nicnierobienia" to jedna z najbardziej aktywnych
   sieci mózgu. Wyłącza się dopiero, kiedy dostaje bodziec z zewnątrz.
2. Co pokazało badanie o sięganiu po telefon w chwilach nudy?
   a) Krótka przerwa na telefon odświeża głowę ✗
   b) Telefon pomaga, ale tylko do 5 minut ✗
   c) Po telefonie ludzie byli bardziej znudzeni i zmęczeni ✓
3. Ile razy dziennie przeciętny człowiek zagląda w telefon (wg danych,
   które przywołuje Brooks)?
   a) około 60 b) około 205 ✓ c) około 500
   Wyjaśnienie przy każdej odpowiedzi: w większości to odruchy, nie decyzje.

**Wyzwanie dnia: nuda to stan pożądany**

Dziś niczego nie odkładasz i niczego sobie nie zabraniasz. Wyzwanie dzieje
się wyłącznie w głowie: za każdym razem, kiedy złapiesz się na nudzie
i ręka już będzie szła po telefon, przypomnij sobie jedno zdanie:
**nuda to stan pożądany, mózg właśnie dostał czas dla siebie**. Możesz
potem i tak wziąć telefon. Chodzi tylko o to przypomnienie, o zmianę
etykiety na tym uczuciu z "coś jest nie tak" na "to jest ten moment".

Wersja minimalna: przypomnieć sobie to zdanie choć raz.

**Check-in na jutro:** w ilu mniej więcej sytuacjach udało się przypomnieć?
Była taka, w której po przypomnieniu telefon został w kieszeni sam z siebie?

---

## Dzień 2. Ochota to nie rozkaz

**Check-in z dnia 1** (3 opcje + pole tekstowe): "Przypominało się często /
Kilka razy / W ogóle nie pamiętałem o wyzwaniu". Każda opcja dostaje
życzliwą odpowiedź; "w ogóle" dostaje: to najnormalniejszy wynik pierwszego
dnia, automatyzmy właśnie na tym polegają, że działają zanim się je zauważy.

**Wiedza: dyskomfort jest prawdziwy, ale nie jest rozkazem**

Badanie, w którym część ludzi wolała razić się prądem niż siedzieć kilka
minut z myślami: dyskomfort nudy to nie wymysł i nie słabość. Rozróżnienie
sygnał/rozkaz: uczucie mówi tylko "nie ma bodźców", rozkazem robi je
dopiero ręka. Metapoznanie wg Brooksa: patrzenie na własne emocje z boku.
Ochota na telefon zachowuje się jak fala: narasta, ma szczyt, opada sama,
zwykle w minutę-dwie, jeśli się jej nie nakarmi.

**Quiz:** np. "Co się dzieje z ochotą na telefon, jeśli jej nie ulec?"
(rośnie w nieskończoność / opada sama jak fala ✓ / zostaje na stałym
poziomie do wieczora), "Czym różni się sygnał od rozkazu?".

**Wyzwanie dnia: policz fale**

Licz kreskami (kartka, notatka, jak wygodnie) każdą ochotę sięgnięcia po
telefon. Przy trzech dowolnych z nich zostań z tą ochotą minutę: obserwuj,
gdzie ją czuć i co robi, zanim zdecydujesz, co dalej. Wieczorem: pierwsze
3 minuty siedzenia bez niczego.

Wersja minimalna: same kreski, bez obserwowania.

**Check-in na jutro:** ile kresek? Fala rzeczywiście opadała, czy raczej
wygrywała?

---

## Dzień 3. Czekanie jest twoje

**Check-in z dnia 2**, potem:

**Wiedza: dlaczego nie da się wyeliminować czekania**

Brooks o przegranej wojnie z czekaniem (do każdej wygody przywykamy
w tydzień) i o tym, że zamiast zmieniać kolejkę, można zmienić siebie
w kolejce. Ellen Langer: uważność to zauważanie nowych rzeczy. Dla
chętnych: życzliwe życzenia dla ludzi w kolejce (badania: rośnie
cierpliwość, a cierpliwsi ludzie są bardziej zadowoleni z życia).

**Quiz:** np. "Dlaczego szybsze kasy nie leczą zniecierpliwienia?"
(habituacja ✓), "Co Ellen Langer nazywa uważnością?".

**Wyzwanie dnia: każda kolejka bez telefonu**

Każda chwila czekania dzisiaj jest bez telefonu: kolejka, przystanek,
winda, czajnik, toaleta. W każdej znajdź coś, czego wcześniej nie było
widać. Trening rośnie do 5 minut nudy w ciągu dnia.

Wersja minimalna: jedna kolejka albo jedna wizyta w toalecie bez telefonu.

**Check-in na jutro:** co się znalazło w miejscach znanych na pamięć?

---

## Dzień 4. Co zostaje w pamięci

**Check-in z dnia 3**, potem:

**Wiedza: przyjemność i radość to nie to samo**

Test otwierający: co przewijało się na ekranie trzy dni temu? Zwykle nic.
Brooks: przyjemność jest samotna i nie zostawia śladu; radość to
przyjemność plus ludzie plus pamięć. Test na każdą aplikację: uzupełnia
to, czego naprawdę chcę (bliskość, wiedza, sens), czy to zastępuje?

**Quiz:** np. "Czego wg Brooksa brakuje przyjemności, żeby stała się
radością?" (ludzi i pamięci ✓), "Rozmowa z przyjacielem przez komunikator
to uzupełnienie czy substytut?" (uzupełnienie: technologia służy więzi,
która istnieje naprawdę).

**Wyzwanie dnia: jedna zamiana**

Audyt ekranu głównego: przy każdej aplikacji pytanie "uzupełnia czy
zastępuje", te drugie do folderu na ostatnią stronę (nic nie kasujemy).
Plus jedna sesja scrollowania zamieniona na coś z ludźmi i pamięcią.
Trening: 10-12 minut, najlepiej spacer bez telefonu i słuchawek.

Wersja minimalna: audyt trzech najczęściej używanych aplikacji.

**Check-in na jutro:** co zostało w pamięci z rzeczy zrobionej w zamian?

---

## Dzień 5. Kwadrans i co dalej

**Check-in z dnia 4**, potem:

**Wiedza: poziom, o którym mówi Brooks**

15 minut i więcej: wtedy mózg przestaje krążyć wokół drobiazgów i dochodzi
do pytań, które zwykle się zagłusza. Pytania bez odpowiedzi jako praktyka:
nie chodzi o odpowiedź, tylko o to, co robi samo trzymanie pytania.
Uczciwie o trwałości: Brooks twierdzi, że nawyki łapią po ok. 2 tygodniach,
więc kurs się kończy, ale rozstrzyga się w najbliższych dwóch tygodniach.

**Quiz** (lekki, domykający): np. "Nuda to..." (a. strata czasu ✗
b. stan pożądany, w którym mózg pracuje dla ciebie ✓ c. problem do
rozwiązania telefonem ✗). Ostatnie pytanie quizu może być żartem-klamrą
spinającą kurs.

**Wyzwanie dnia: kwadrans z jednym pytaniem**

15 minut prawdziwej nudy, z jednym pytaniem w tle ("co jest dla mnie
naprawdę ważne?" albo "czego by brakowało, gdyby wszystko zostało tak,
jak jest?"). Po kwadransie zapisać, co przyszło. Potem bilans: porównanie
liczb z dnia 0. Na koniec dwie decyzje na stałe: jedna chwila nudy, która
zostaje (kolejki, toaleta, spacer, kwadrans przy oknie) i jedno okno bez
telefonu z trzech polecanych przez Brooksa (pierwsza godzina dnia, posiłki,
godzina przed snem), zapisane jako zdanie "jeśli-to".

Wersja minimalna: dwa razy po 7 minut albo powrót do 3 minut z dnia 2.

**Zakończenie + pomost:** ostatni check-in (jak poszło całe 5 dni) i pomost
do The Life Writing Program: ta sama umiejętność siedzenia z własnymi
myślami, rozpisana na konkretne pytania, z piórem w ręku.

---

## Progresja w pigułce

| Dzień | Wiedza | Wyzwanie | Minuty nudy |
|---|---|---|---|
| 1 | Stan domyślny mózgu, pętla nudy i scrolla | Przeramowanie: "nuda to stan pożądany" | 0 (tylko myśl) |
| 2 | Dyskomfort to sygnał, nie rozkaz; fala | Kreski + obserwacja 3 fal | 3 |
| 3 | Czekanie, habituacja, zauważanie (Langer) | Każda kolejka bez telefonu | 5 |
| 4 | Przyjemność vs radość; substytut vs uzupełnienie | Audyt aplikacji + jedna zamiana | 10-12 (spacer) |
| 5 | 15+ minut, pytania bez odpowiedzi | Kwadrans z pytaniem + plan "jeśli-to" | 15 |

---

## Źródła (do wewnętrznej dokumentacji, nie do treści kursu)

Materiały Brooksa, na których stoi kurs (zweryfikowane, z dostępem bez paywalla):

- "How Not to Be Bored When You Have to Wait", The Atlantic, 03.2024 (pełny tekst:
  aei.org/op-eds/how-not-to-be-bored-when-you-have-to-wait) - czekanie, Langer,
  medytacja życzliwości, badanie 2021 o telefonie pogłębiającym nudę
- "You Need to Be Bored. Here's Why.", Harvard Business Review (wideo), 08.2025 -
  DMN, doom loop of meaning, trening 15+ minut, jego własne zasady (telefon po
  19:00, sypialnia, posiłki)
- "Why It Pays to Be Bored", CBS Sunday Morning, 03.2026 - 205 spojrzeń dziennie,
  spacer i trening bez telefonu, efekty po ~2 tygodniach
- CNN (syndykacja kesq.com), 05.2026 - substytut vs komplement, trzy okna bez
  telefonu
- "Choose Enjoyment Over Pleasure", The Atlantic, 03.2022 - przyjemność vs radość
  (ludzie + pamięć)
- "Envy, the Happiness Killer", The Atlantic, 10.2022 (mirror aei.org) - zazdrość
  z feedu, wdzięczność
- Podcast "Office Hours with Arthur Brooks": "A 5-Step Approach to Ending Your
  Phone Addiction", 11.2025 - strefy i pory bez telefonu, powiadomienia, szarość
- "Build the Life You Want" (2023) - metapoznanie; "From Strength to Strength"
  (2022) - cztery idole; "The Meaning of Your Life" (2026) - nuda i sens
- Wystąpienie ARC 2026 - pytania bez odpowiedzi

Badania niezależne od Brooksa, potwierdzające szkielet kursu (szczegóły i linki
w `kurs-niescrollowania-warianty.md`): Wilson 2014 (dyskomfort siedzenia z
myślami), Hunt 2018 (sam pomiar obniża lęk i FOMO), Ward 2017 (obecność telefonu
a pamięć robocza), Gollwitzer 2006 (plany "jeśli-to"), Brailovskaia 2022
(redukcja trwalsza niż abstynencja), Baird 2012 i Mann 2014 (nuda a kreatywność).

### Atrybucja i prawa autorskie

- Opieramy się na ideach i ramach pojęciowych Brooksa z wyraźną atrybucją
  ("Arthur Brooks, profesor Harvardu, pisze..."). Idee i wyniki badań nie są
  chronione prawem autorskim; chronione jest konkretne wyrażenie. Zasada:
  parafraza własnymi słowami + co najwyżej krótkie cytaty z podaniem źródła.
  Nie tłumaczymy całych fragmentów kolumn ani książek.
- Brooks nie ma własnego kursu o nudzie ani telefonie (jego "Managing Happiness"
  na edX to ogólny kurs dobrostanu), więc nie konkurujemy z jego produktem.

### Czego świadomie NIE używamy (niezweryfikowane w źródłach)

- Fraza "psychic rest" (mówimy o "stanie domyślnym" / odpoczynku umysłu)
- Zalecenie "patrz w okno samolotu" jako cytat z Brooksa
- Teza przyczynowa "epidemia depresji bierze się z braku sensu" jako fakt
  naukowy; jeśli pada, to wyraźnie jako opinia Brooksa
- Rama "lewa/prawa półkula" za McGilchristem (kontrowersyjna naukowo, pomijamy)

## Otwarte decyzje

1. Nazwa bez zmian ("Kurs niescrollowania. 5 dni nauki nudzenia się")?
   Struktura wyzwania może uzasadniać wariant "Wyzwanie niescrollowania".
2. Odblokowywanie dni: dzień po dniu (rekomendacja, opisana wyżej) czy
   wszystko otwarte od razu?
3. Przepisanie treści v1 (`kurs-niescrollowania-tresci.md`, format mailowy)
   na treści stron dni: po akceptacji tego szkieletu (copywriter,
   z zachowaniem obecnego tonu).
