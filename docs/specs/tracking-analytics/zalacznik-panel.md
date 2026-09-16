# Panel statystyk — projekt (/admin/statystyki)

## 1. Architektura informacji

Jedna strona `/admin/statystyki` z sekcjami na jednej kolumnie (jak `/admin/kurs`), nie osobne
podstrony — właściciel skanuje wzrokiem z góry na dół, bez przeklikiwania. Wyjątek: zarządzanie
tagami dostaje własną podstronę `/admin/tagi`, bo to inny tryb pracy (akcje, nie tylko czytanie)
i wymaga potwierdzeń — mieszanie go z read-only statystykami zwiększa ryzyko przypadkowego kliku.

Link w navie `admin/layout.tsx` obok „Posts” i „Kurs”: dodać „Statystyki” i „Tagi”.

Kolejność sekcji na `/admin/statystyki` (od tego, co właściciel sprawdza najpierw):

1. **Pasek zakresu czasu** (sticky pod nagłówkiem strony, nie w headerze admina)
2. **Konta** — czy w ogóle ktoś się loguje / zakłada konto (puls biznesu, pierwsze co sprawdza rano)
3. **Kursy** — lejek i porzucenia (główny produkt, tu są decyzje o zmianach)
4. **Posty** — ruch w feedzie (kontekst, ale niższy priorytet niż konwersja do kursów)

Uzasadnienie: konta i kursy odpowiadają na pytanie „czy biznes działa", posty są bardziej
ciekawostką niż decyzją. Tagi to osobne narzędzie operacyjne (kampanie), nie metryka — stąd
osobna podstrona, żeby nie rozmywać strony ze statystykami.

## 2. Sekcje

### Pasek zakresu czasu (wspólny dla całej strony `/admin/statystyki`)

Segmented control: **Dziś / 7 dni / 30 dni / Własny** (date range picker tylko przy „Własny").
Domyślnie: 7 dni. Każda sekcja pod spodem pokazuje deltę vs. poprzedni okres tej samej długości
(np. 7 dni temu → 14 dni temu) jako mały tekst obok liczby: `↑ 12%` w `text-[#7B9E8C]` lub
`↓ 8%` w przygaszonej czerwieni (nie z palety UI, ale zgodnej intencji — np. `text-red-700`
jak w `badge.tsx` destructive, bez nowego koloru). Brak danych porównawczych → myślnik, nie 0%.

### (b) Konta

- 4 kafelki w rzędzie (wzór z `course/page.tsx`: `bg-white rounded-xl border border-[#e2e7eb] p-5`):
  - Nowe konta (okres)
  - Logowania (okres, suma dzienna zsumowana)
  - Aktywne w 7 dniach (unikalni, licznik z ostatniego dnia okresu, nie suma)
  - Aktywne w 30 dniach (jw.)
- Pod kafelkami: prosty wykres słupkowy „Logowania dziennie" — bez biblioteki, `<div>` słupki
  o wysokości proporcjonalnej w kontenerze `h-32`, skala automatyczna do max wartości w okresie.
  Etykiety dni pod słupkami (`text-[10px]`), wartość liczbowa jako `title` + widoczna nad słupkiem
  przy hover. Tekstowa alternatywa: `<table class="sr-only">` z tymi samymi danymi dzień/wartość
  dla czytników ekranu (patrz sekcja 3).
- Zakres: dziś/7/30/własny, porównanie okres do okresu jak wyżej.

### (c) Kursy

- Selektor kursu (tabs, jeśli >1 kurs — teraz jest jeden, „Wdzięczność" / „Niescrollowanie",
  więc od razu projektować pod wielość, wzorem `courses.map()` w istniejącym `admin/kurs/page.tsx`).
- Lejek jako pozioome paski (dokładnie wzorzec już użyty w `admin/kurs/page.tsx` —
  `h-4 bg-[#F1F4F6] rounded-full` + wypełnienie `bg-[#7B9E8C]`), ale rozszerzony o krok „Zapis"
  jako punkt 0 (100% bazowe) i osobno wyliczony **odsetek porzucających po każdym dniu**
  (różnica między kolejnymi krokami, wypisana obok paska: `-18% porzuca tu`).
- Pod lejkiem: kafelki — Mediana dni zapis→ukończenie, Liczba ukończeń (okres), Konwersja
  zapis→ukończenie (okres, z deltą vs. poprzedni okres).
- Sekcja ocen z feedbacku: zostaje w formie zbliżonej do obecnej (`RATING_LABELS` + lista), ale
  dodać rozkład jako 3 poziome paski proc. zamiast gołych liczb w tekście — spójnie z lejkiem.
- Zakres czasu wpływa na to, kto wchodzi do lejka (zapisani w okresie), nie na feedback (feedback
  zawsze pokazuje wszystko — to mała próbka, obcinanie w czasie zgubiłoby sygnał).

### (a) Posty

- Kafelki zbiorcze: Wyświetlenia (okres), Unikalni czytelnicy, Śr. odsetek dotarcia do końca
  karuzeli, Lajki + udostępnienia (jeśli dane istnieją — jeśli tabela ich nie ma, pominąć kafelek
  całkowicie, nie pokazywać zer, żeby nie sugerować, że metryka istnieje i wynosi 0).
- Tabela top 10 postów (wzorem tabeli w `admin/page.tsx`: `bg-white rounded-2xl` + `<table>`):
  kolumny Tytuł, Język, Wyświetlenia, % dotarcia do końca, (Lajki, Udostępnienia jeśli dostępne).
  Sortowalna po kliknięciu nagłówka kolumny (prosty client component, sort lokalny na już
  pobranych danych okresu — bez re-fetchu).
- Przełącznik języka jako pigułki nad tabelą: Wszystkie / PL / EN (styl `ModerationQueue` tabs:
  `bg-[#1E2A36] text-white` aktywny, `bg-white text-[#6C7C8B]` nieaktywny).
- Zakres: dziś/7/30/własny + porównanie jak wyżej dla kafelków zbiorczych.

## 3. Stany

- **Ładowanie**: sekcje to Server Components z `await` (wzorem `admin/kurs/page.tsx`) — Next
  pokaże `loading.tsx` na poziomie strony ze szkieletem kafelków (`animate-pulse bg-[#F1F4F6]`
  bloki w tych samych proporcjach co docelowe kafelki, żeby layout nie skakał). Jeśli sekcja
  wymaga client-side fetch (np. przełącznik zakresu bez przeładowania strony), pokazuj
  `Wczytywanie…` tekstem `text-sm text-[#8A99A8]` — wzorem `ModerationQueue`.
- **Pusto**: komunikat w stylu istniejącego `„No posts yet"` — spokojny, bez wykrzykników,
  np. „Brak danych w tym okresie" + drugorzędna linijka wyjaśniająca dlaczego (np. „Agregacja
  dobowa jeszcze nie zebrała danych za dziś — wróć jutro."). Nigdy pusty wykres bez podpisu.
- **Błąd**: identyczny wzorzec jak w `admin/kurs/page.tsx` przy braku `SUPABASE_SERVICE_ROLE_KEY`
  — pojedyncze zdanie `text-[#4A5B6A]` tłumaczące co nie działa, bez stack trace.
- **Dostępność**:
  - Kontrast: wszystkie teksty na białym tle trzymają się istniejącej palety (`#1E2A36`,
    `#4A5B6A`, `#8A99A8` — wszystkie spełniają WCAG AA na `#FFFFFF`/`#FAFBFC`).
  - Tabele: prawdziwe `<table>`/`<th scope="col">`, nie `<div>` udające tabelę — czytnik ekranu
    musi umieć nawigować kolumnami.
  - Wykresy słupkowe/liniowe (CSS/SVG): każdy wykres owinięty w `<figure>` z `<figcaption>`
    opisującym trend słowami („Logowania rosną, szczyt w środę: 42") + ukryta wizualnie
    (`sr-only`) tabela z tymi samymi surowymi danymi jako pełna alternatywa tekstowa, nie tylko
    `aria-label` ze skrótem — dla liczb ważne jest, żeby dało się je odczytać punkt po punkcie.
  - Delty (`↑12%` / `↓8%`) nie polegają wyłącznie na kolorze — zawsze ze strzałką/znakiem
    w tekście, nie samym kolorem tła.

## 4. Szkic ASCII

### Desktop (`/admin/statystyki`)

```
┌─────────────────────────────────────────────────────────────────┐
│ jhalm   Admin        Posts  Kurs  Statystyki  Tagi   View Site ⎋ │  ← nav istniejąca
├─────────────────────────────────────────────────────────────────┤
│ Statystyki                                                       │
│ Ostatnia aktualizacja: dziś 06:00 (agregat dobowy)                │
│                                                                    │
│ [ Dziś ] [ 7 dni ] [ 30 dni ] [ Własny ▾ ]                        │  ← sticky pasek
│                                                                    │
│  KONTA                                                            │
│  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐                │
│  │Nowe konta││Logowania ││Aktywni 7d││Aktywni30d│                │
│  │   42     ││   118    ││   210    ││   340    │                │
│  │  ↑ 12%   ││  ↓ 3%    ││  ↑ 5%    ││   —      │                │
│  └──────────┘└──────────┘└──────────┘└──────────┘                │
│  ┌────────────────────────────────────────────────┐              │
│  │ Logowania dziennie          ▁▃▅█▆▃▂             │              │
│  │                            pn wt śr cz pt so nd  │              │
│  └────────────────────────────────────────────────┘              │
│                                                                    │
│  KURSY                    [ Wdzięczność ] [ Niescrollowanie ]     │
│  ┌────────────────────────────────────────────────┐              │
│  │ Zapis      ████████████████████████ 100% (86)   │              │
│  │ Dzień 1    ████████████████████ 78%  -22% tu     │              │
│  │ Dzień 2    ███████████████ 61%       -17% tu     │              │
│  │ ...                                               │              │
│  │ Ukończenie ████████ 34%              -12% tu     │              │
│  └────────────────────────────────────────────────┘              │
│  ┌──────────┐┌──────────┐┌──────────┐                            │
│  │ Mediana  ││Ukończenia││Konwersja │                            │
│  │  5 dni   ││    29    ││   34%    │                            │
│  └──────────┘└──────────┘└──────────┘                            │
│  Feedback (29)                                                    │
│  Warte tych dni  ████████████████ 72%                             │
│  Częściowo       █████ 21%                                        │
│  Nie dla mnie    ██ 7%                                            │
│                                                                    │
│  POSTY                    [ Wszystkie ] [ PL ] [ EN ]             │
│  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐                │
│  │Wyśw.     ││Unikalni  ││% do końca││Lajki     │                │
│  │  4 210   ││  2 980   ││   61%    ││   312    │                │
│  └──────────┘└──────────┘└──────────┘└──────────┘                │
│  ┌────────────────────────────────────────────────┐              │
│  │ Tytuł          Jęz  Wyśw.  % końca  Lajki  Udost.│             │
│  │ Jak zacząć...  PL   890    72%      44     12    │             │
│  │ ...                                               │              │
│  └────────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌───────────────────┐
│ jhalm      ☰       │
├───────────────────┤
│ Statystyki          │
│ [Dziś][7d][30d][▾] │  ← poziomy scroll jeśli za wąsko
│                     │
│ KONTA               │
│ ┌─────┐┌─────┐      │
│ │Nowe ││Logow│      │  ← grid-cols-2 zamiast -4
│ │ 42  ││ 118 │      │
│ └─────┘└─────┘      │
│ ┌─────┐┌─────┐      │
│ │Akt7d││Akt30│      │
│ └─────┘└─────┘      │
│ [ wykres słupkowy ] │  ← pełna szerokość, mniej słupków
│                     │
│ KURSY               │
│ [Wdzięczność ▾]     │  ← select zamiast tabs przy wielu kursach
│ lejek pionowo,       │
│ paski pełna szer.    │
│                     │
│ POSTY               │
│ karty zamiast tabeli:│
│ ┌─────────────────┐ │
│ │ Jak zacząć...    │ │
│ │ PL · 890 wyśw.   │ │
│ │ 72% do końca     │ │
│ └─────────────────┘ │
└───────────────────┘
```

Na mobile tabela postów zamienia się w listę kart (tabela z wieloma kolumnami nie mieści się
czytelnie < 640px) — wzorzec analogiczny do kart komentarzy w `ModerationQueue`.

## 5. Komponenty do zbudowania

`src/components/admin/`

- `stat-tile.tsx` — `{ label, value, delta?: { pct: number; direction: "up"|"down" } }`.
  Pojedynczy kafelek metryki, używany we wszystkich sekcjach zamiast kopiowania JSX (obecnie
  zduplikowany inline w `admin/kurs/page.tsx` — okazja do DRY).
- `date-range-picker.tsx` (client) — `{ value: "today"|"7d"|"30d"|"custom", onChange, customRange? }`.
  Segmented control + popover z inputami dat przy „Własny". Steruje URL query (`?range=7d`), żeby
  stan przetrwał odświeżenie i dało się linkować konkretny widok.
- `bar-chart-simple.tsx` — `{ data: { label: string; value: number }[], caption: string }`.
  Czyste `<figure>` + flex słupków `<div style={{height: pct}}>` + `sr-only` tabela wewnątrz.
  Reużywalny dla logowań i (opcjonalnie) wyświetleń postów w czasie.
- `funnel-bars.tsx` — `{ steps: { label: string; count: number; base: number }[] }`.
  Wydzielony z istniejącego inline kodu w `admin/kurs/page.tsx` (obecnie lejek jest tam napisany
  ręcznie) + dodane wyliczanie „porzuca tu” między krokami.
- `data-table.tsx` — generyczna sortowalna tabela client-side, `{ columns, rows, defaultSort? }`,
  z fallbackiem na listę kart poniżej `sm:` (renderuje dwa warianty w jednym komponencie z
  Tailwind `hidden sm:table` / `sm:hidden`).
- `empty-state.tsx` — `{ title, description? }`, ujednolicenie obecnego ad-hoc JSX z `admin/page.tsx`.
- `pill-tabs.tsx` — `{ options: { key; label }[], active, onChange }`, wydzielone z wzorca już
  istniejącego w `ModerationQueue` (obecnie inline), reużyte do przełącznika języka i kursu.
- `tag-list.tsx` — `{ tags: { id; name; count }[], onReveal(tagId) }`, tabela tagów + przycisk
  „Pokaż listę” per wiersz.
- `tag-members-dialog.tsx` (client) — Radix `Dialog` z `shadcn/ui`, wymaga potwierdzenia (checkbox
  „Rozumiem, że to dane osobowe” przed pokazaniem listy e-maili), potem `sr-only`-friendly lista.
- `mailerlite-sync-button.tsx` (client) — `{ tagId, lastSyncedAt, lastSyncStatus }`, przycisk +
  status (`Badge` z `shadcn/ui`: `secondary` dla „zsynchronizowano”, `destructive` dla błędu).

shadcn/ui do wykorzystania: `Card` (kontener sekcji zamiast ręcznego `div` — ale obecny kod w
`admin/kurs/page.tsx` nie używa `Card`, więc zostaję przy istniejącym wzorcu `bg-white rounded-xl
border border-[#e2e7eb] p-5` dla spójności z resztą panelu, zamiast wprowadzać nowy wzorzec),
`Badge` (statusy synchronizacji, tagi jako etykiety), `Dialog` (potwierdzenie przed pokazaniem
e-maili), `Button` (akcje), `Separator` (rozdzielenie sekcji na stronie statystyk).

**Bez biblioteki wykresów** (Recharts/Chart.js/Victory): dane to proste serie dzienne (max ~30-90
punktów), bez potrzeby zoomu, tooltipów, animacji czy wielu osi. Biblioteka dodałaby kilkadziesiąt
KB do bundla admina i kolejną zależność do utrzymania dla czegoś, co CSS/SVG robi w ~40 liniach
i jest w pełni kontrolowane stylistycznie (te same kolory z palety, bez motywu biblioteki). Lejek
kursów już dziś jest zrobiony jako paski CSS w `admin/kurs/page.tsx` — nowy kod idzie tą samą
drogą zamiast wprowadzać drugi paradygmat wizualizacji obok istniejącego.

## 6. Ochrona danych

- Kafelki i wykresy na `/admin/statystyki` pokazują wyłącznie zagregowane liczby (sumy, odsetki,
  mediany) — zero e-maili, zero ID użytkowników, zero treści. Ta strona jest bezpieczna do
  screenshotów/eksportu bez ryzyka wycieku danych osobowych.
- Lista osób z danym tagiem żyje tylko na `/admin/tagi` i tylko za `tag-members-dialog.tsx`:
  1. klik „Pokaż listę” otwiera `Dialog` z ostrzeżeniem („To są adresy e-mail realnych osób —
     pokazuj tylko, jeśli naprawdę potrzebujesz”) i checkboxem potwierdzenia,
  2. dopiero zaznaczenie odblokowuje przycisk „Pokaż” wewnątrz dialogu,
  3. lista renderuje się dopiero po kliknięciu — nie jest wysyłana do klienta razem z liczbą
     (endpoint `GET /api/admin/tags/[id]/members` osobno od `GET /api/admin/tags` z samymi
     licznikami), żeby e-maile nie leżały w markupie/JS state, jeśli nikt ich nie odsłonił.
  4. Dialog zamyka się bez pamiętania stanu „odsłonięte” między odświeżeniami strony.
- „Synchronizuj do MailerLite” to jawna akcja (przycisk + `confirm()` jak przy usuwaniu
  komentarza w `moderation-queue.tsx`), nie automatyczny cron bez potwierdzenia — właściciel
  decyduje kiedy wypycha listy do kampanii. Status ostatniej synchronizacji (`Badge`) pokazuje
  tylko czas i sukces/błąd, nie treść przesłanych danych.
- Endpointy admina korzystają z istniejącego JWT + httpOnly cookie (`src/lib/auth.ts`) — bez
  nowej warstwy auth, ale endpoint `members` dodatkowo nie loguje treści odpowiedzi (żeby e-maile
  nie trafiały do logów serwera przy debugowaniu).
