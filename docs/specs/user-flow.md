---
type: spec
name: User Flow
version: "1.2"
last_updated: "2026-03-16"
---

# User Flow - The Life Writing Program

## 1. Przegląd Ścieżki Użytkownika

```
Landing Page → Micro-onboarding → Rejestracja → Wybór ścieżki → Ćwiczenie bramkowe
    → Dashboard → Moduł (intro → ćwiczenia → podsumowanie) → Następny moduł / Paywall
```

---

## 2. Flow Szczegółowy

### 2.1 Landing Page → Rejestracja (cel: < 2 min)

```
┌─────────────────────────────────────────────┐
│  LANDING PAGE                                │
│                                              │
│  Hero: "Kiedy w głowie jest za dużo          │
│         chaosu, zacznij od zapisania."       │
│                                              │
│  [Spróbuj za darmo]                          │
│                                              │
│  ↓ scroll                                    │
│  Problem · Rozwiązanie · Nauka · Jak to      │
│  wygląda · Bezpieczeństwo · Cennik · FAQ     │
│                                              │
│  Footer: linie kryzysowe + disclaimer        │
└──────────────────┬──────────────────────────┘
                   │ klik CTA
                   ▼
┌─────────────────────────────────────────────┐
│  MICRO-ONBOARDING (1 ekran)                  │
│                                              │
│  "Zanim zaczniemy, kilka rzeczy:"            │
│  • Nie zastępuje psychoterapii [link]        │
│  • Teksty szyfrowane, nikt nie przeczyta     │
│  • Brak złych odpowiedzi, brak presji        │
│  • Możesz pominąć dowolne ćwiczenie          │
│                                              │
│  [Rozumiem. Chcę zacząć.]                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  REJESTRACJA (1 ekran, minimalna)            │
│                                              │
│  "Podaj e-mail, żebyśmy mogli zapisywać     │
│   Twoje teksty. Nic więcej nie potrzebujemy."│
│                                              │
│  [email input]                               │
│  [Kontynuuj z e-mailem]                      │
│  ─── lub ───                                 │
│  [Kontynuuj z Google]                        │
│                                              │
│  Mały tekst: "Bez spamu. Bez dzielenia       │
│  się danymi. Polityka prywatności."           │
└──────────────────┬──────────────────────────┘
                   │ magic link / Google OAuth
                   ▼
┌─────────────────────────────────────────────┐
│  WYBÓR ŚCIEŻKI (1 ekran)                    │
│                                              │
│  ○ Chcę przejść pełną ścieżkę (zalecane)    │
│  ○ Chcę zacząć od konkretnego modułu         │
│                                              │
│  "Rekomendujemy pełną ścieżkę, bo moduły    │
│   budują na sobie. Ale to Twój wybór."       │
│                                              │
│  [Dalej]                                     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  ĆWICZENIE BRAMKOWE: "5 Minut dla Siebie"   │
│  (szczegóły: gate_00.yaml)                   │
│                                              │
│  Krótkie intro → 5 zdań do dokończenia       │
│  (wybierz 3) → edytor → zapis → potwierdzenie│
│                                              │
│  "Gotowe? To właśnie zaczęłaś/zacząłeś."    │
│  [Przejdź do programu]                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
              DASHBOARD
```

**Cel:** Użytkownik pisze w ciągu 5 minut od kliknięcia CTA na landing page.

---

### 2.2 Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  DASHBOARD                                               │
│                                                          │
│  ┌──── Nagłówek ────────────────────────────────────┐   │
│  │  "Twój program"                                   │   │
│  │  "Twoje teksty są zapisywane i szyfrowane.        │   │
│  │   Program czeka, wracasz kiedy chcesz."           │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──── Następne ćwiczenie (CTA box) ───────────────┐   │
│  │  border-[#7B9E8C], bg-[#f8fbf9]                  │   │
│  │                                                    │   │
│  │  "NASTĘPNE ĆWICZENIE" (lub "KONTYNUUJ")           │   │
│  │  Tytuł ćwiczenia                                  │   │
│  │  Moduł X: Nazwa · czas szacowany                  │   │
│  │  [Rozpocznij] (lub [Kontynuuj pisanie])           │   │
│  │                                                    │   │
│  │  Logika wyboru: najpierw szuka in_progress        │   │
│  │  w modułach → jeśli brak, bierze pierwsze         │   │
│  │  not_started. Jeśli gate_00 nie ukończone —       │   │
│  │  pokazuje bramkowe jako CTA.                      │   │
│  │  Znika gdy wszystkie ćwiczenia ukończone.         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──── Na start ────────────────────────────────────┐   │
│  │  Ćwiczenie bramkowe wyświetlane inline:           │   │
│  │  [ikona] Tytuł                     czas [Zacznij]│   │
│  │                                                    │   │
│  │  (po ukończeniu: ikona CheckCircle, przycisk Wróć)│   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──── Moduły ──────────────────────────────────────┐   │
│  │  Karty modułów (blokowane gdy gate_00 nie        │   │
│  │  ukończone). Każda karta zawiera:                 │   │
│  │  - Nagłówek: "Moduł X: Tytuł"                    │   │
│  │  - Podtytuł modułu                                │   │
│  │  - "Ukończone: X/6 ćwiczeń" + pasek postępu      │   │
│  │  - Lista ćwiczeń z ikonami statusu                │   │
│  │    (BookOpen / Play / CheckCircle2)               │   │
│  │  - Przyciski: Zacznij / Kontynuuj / Wróć          │   │
│  │  - Link "Przeczytaj wprowadzenie do modułu"       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──── Stopka dashboardu ──────────────────────────┐   │
│  │  [Profil i ustawienia]    [Eksportuj dane]        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Stany modułu:**
- `locked` - zablokowany (gdy gate_00 nie ukończone)
- `available` - odblokowany, nie rozpoczęty
- `in_progress` - rozpoczęty, pokazuje postęp (np. "3/6 ćwiczeń")
- `completed` - ukończony (subtelne oznaczenie, bez fajerwerków)

**Stany karty modułu:**
- Nigdy nie pokazuj "Pominąłeś X ćwiczeń"
- Zawsze "Ukończone: X/6"
- Ćwiczenia bramkowe nie wliczają się do licznika modułów

**CTA box — szczegółowa logika (`findNextExercise`):**
1. Jeśli `gate_00` nie ukończone (status inny niż `completed`/`skipped`) — zwróć bramkowe
2. Przeglądaj moduły po kolei; zwróć pierwsze ćwiczenie ze statusem `in_progress`
3. Jeśli brak `in_progress` — zwróć pierwsze `not_started`
4. Jeśli wszystkie ukończone — box znika

**Linki w stopce dashboardu:**
- "Profil i ustawienia" — `/profil`, kolor `#7B9E8C`
- "Eksportuj dane" — `/api/program/data-export`, kolor `#8A99A8`

---

### 2.3 Flow Modułu

```
┌──────────────────────────────────────────────┐
│  WPROWADZENIE DO MODUŁU                       │
│                                               │
│  Treść psychoedukacyjna (400-600 słów)        │
│  z content/introductions/[modul].md           │
│                                               │
│  "Co Cię czeka w tym module:"                 │
│  1. Ćwiczenie 1 - nazwa - ⏱ XX min - ★☆☆☆☆  │
│  2. Ćwiczenie 2 - nazwa - ⏱ XX min - ★★☆☆☆  │
│  ...                                          │
│                                               │
│  [Zacznij od ćwiczenia 1]                     │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
         ┌─── ĆWICZENIE ───┐
         │  (patrz 2.4)    │
         └────────┬────────┘
                  │ ukończone / pominięte
                  ▼
         ┌─── ĆWICZENIE ───┐
         │  (kolejne)      │
         └────────┬────────┘
                  │ ... (powtórz dla 6 ćwiczeń)
                  ▼
┌──────────────────────────────────────────────┐
│  PODSUMOWANIE MODUŁU                          │
│                                               │
│  "Ukończyłeś/aś Moduł [X]."                 │
│                                               │
│  Krótka refleksja, co ten moduł obejmował     │
│                                               │
│  Jeśli darmowy tier + ukończony Moduł I:      │
│  → paywall (patrz 2.5)                        │
│                                               │
│  Jeśli pełny dostęp:                          │
│  [Przejdź do Modułu [X+1]]                    │
│  [Wróć do dashboardu]                         │
└──────────────────────────────────────────────┘
```

---

### 2.4 Flow Ćwiczenia

Ekran ćwiczenia składa się z trzech kroków zarządzanych przez komponent `ExerciseView`:

```
ViewStep: "warning" → "writing" → "postExercise"
```

**Krok 1 — Content Warning (ekran ostrzeżenia):**

Wyświetla się wyłącznie gdy ćwiczenie ma pole `contentWarning` w YAML i użytkownik nie ma jeszcze zapisanych odpowiedzi (`savedResponses.length === 0`). Przy powrocie do ćwiczenia, które ma już odpowiedzi, ostrzeżenie jest pomijane i użytkownik trafia od razu do pisania.

```
[Rozumiem, chcę kontynuować]
[Pomiń to ćwiczenie]
[Wróć do dashboardu]
```

**Krok 2 — Pisanie:**

```
┌──────────────────────────────────────────────┐
│  EKRAN ĆWICZENIA                              │
│                                               │
│  ┌─ Nagłówek ─────────────────────────────┐  │
│  │ Tytuł ćwiczenia                         │  │
│  │ Szacowany czas · Poziom X/5             │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Wprowadzenie ─────────────────────────┐  │
│  │ Akapity z YAML introduction             │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Instrukcja promptu (tylko gate_00) ───┐  │
│  │ bg-[#e8f0eb], tekst z promptInstruction│  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Pytania prowadzące ──────────────────┐   │
│  │ Pytanie (text z YAML)                 │   │
│  │ ~XX minut (ikona zegara)              │   │
│  │                                        │   │
│  │ ┌─ EDYTOR (TipTap) ─────────────────┐ │   │
│  │ │  [tekst użytkownika]               │ │   │
│  │ │  X / min-max znaków               │ │   │
│  │ │  Autosave: Zapisano               │ │   │
│  │ └───────────────────────────────────┘ │   │
│  │                                        │   │
│  │ (kolejne pytania...)                   │   │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Podpowiedzi ratunkowe (zwijane) ─────┐  │
│  │ "Nie wiem, co napisać? Podpowiedzi"   │  │
│  │ Treści z YAML stuckHelpers             │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Akcje ────────────────────────────────┐  │
│  │ [Zakończ ćwiczenie]  (disabled gdy     │  │
│  │  nie spełnia min_chars; gate_00 exempt)│  │
│  │ [Zapisz i wyjdź]  → wraca do dashboard │  │
│  │                   (nie ma modali)      │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Dlaczego to działa (zwijane) ─────────┐  │
│  │ Wyjaśnienie naukowe z YAML whyItWorks  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

**Logika przycisku "Zakończ ćwiczenie":**
- `gate_00`: zawsze aktywny
- Pozostałe: aktywny gdy każde pytanie z `minChars > 0` osiągnie próg i cokolwiek zostało wpisane
- Brak modali potwierdzenia — klik od razu przenosi do kroku postExercise

**"Zapisz i wyjdź":**
- Dostępny zawsze (niezależnie od min_chars)
- Zapisuje bieżący stan (autosave już zadziałał), przechodzi do dashboardu
- Status ćwiczenia pozostaje `in_progress`

**Wskaźniki przy pytaniach:**
- Czas: `~XX minut` (zaokrąglony do pełnych 5, ikona zegara)
- Licznik znaków: `X / min-max` w edytorze (z `ExerciseEditor`)

**Krok 3 — Post-exercise (patrz 2.4a)**

---

### 2.4a Post-Exercise Flow

Jeden ekran (komponent `PostExerciseFlow`) z trzema wewnętrznymi krokami: `reflection → checkin → grounding`.

**Krok reflection (domyślny):**

```
┌──────────────────────────────────────────────┐
│  POST-EXERCISE                                │
│                                               │
│  ┌─ Refleksja (bg-[#e8f0eb]) ─────────────┐  │
│  │ Treść reflection_prompt z YAML          │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Twoje odpowiedzi ─────────────────────┐  │
│  │ Pobierane z /api/program/responses/:id  │  │
│  │ Każda odpowiedź: pytanie + treść        │  │
│  │ (skeleton podczas ładowania)            │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Notatka (jeśli postExerciseNote) ─────┐  │
│  │ bg-amber-50, border-amber-200           │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  "Twój tekst jest zapisany. Możesz wrócić    │
│   i edytować w dowolnym momencie."            │
│                                               │
│  ┌─ Akcje ────────────────────────────────┐  │
│  │                                         │  │
│  │  jeśli canComplete:                     │  │
│  │  [Oznacz jako ukończone (i przejdź      │  │
│  │   dalej)] → markCompleted() + redirect  │  │
│  │                                         │  │
│  │  jeśli nie canComplete:                 │  │
│  │  Komunikat amber: "Niektóre pytania     │  │
│  │  wymagają dłuższej odpowiedzi..."       │  │
│  │                                         │  │
│  │  [Wróć do dashboardu]  (status zostaje  │  │
│  │   in_progress, tekst zachowany)         │  │
│  │                                         │  │
│  │  jeśli difficulty >= 3:                 │  │
│  │  [Potrzebuję chwili]  (ghost button)    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

**Krok checkin (EmotionalCheckin):**
- Dostępny tylko gdy `difficulty >= 3`
- Przejście: klik "Potrzebuję chwili" na ekranie reflection
- Trzy opcje: "W porządku" → wraca do reflection; "Potrzebuję przerwy" → grounding; "Potrzebuję wsparcia" → zasoby kryzysowe

**Krok grounding (GroundingExercise):**
- Technika 5-4-3-2-1
- "Wróć do dashboardu" → dashboard
- "Kontynuuj" → wraca do reflection (nie do osobnego ekranu "gotowe")

**Uwaga:** Post-exercise nie ma osobnego ekranu potwierdzenia ukończenia. Po kliknięciu "Oznacz jako ukończone" następuje bezpośrednie przekierowanie do następnego ćwiczenia lub dashboardu.

---

### 2.5 Paywall (po Module I)

```
┌──────────────────────────────────────────────┐
│  PAYWALL                                      │
│                                               │
│  "Ukończyłeś/aś Moduł I - Przeszłość.       │
│   To duży krok."                              │
│                                               │
│  "Moduły Teraźniejszość i Przyszłość          │
│   czekają na Ciebie."                         │
│                                               │
│  ┌────────────────────────────────────────┐  │
│  │  Pełny program                         │  │
│  │  ~~79 PLN~~ 29 PLN (promocja startowa) │  │
│  │                                        │  │
│  │  • Wszystkie 3 moduły (18 ćwiczeń)    │  │
│  │  • Dożywotni dostęp                    │  │
│  │  • Przyszłe aktualizacje              │  │
│  │  • Jednorazowa płatność               │  │
│  │                                        │  │
│  │  [Kup pełny program - 29 PLN]         │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  "Mniej niż 20% ceny jednej sesji            │
│   psychoterapeutycznej."                      │
│                                               │
│  [Na razie wystarczy mi darmowy moduł]        │
│  (→ dashboard, bez presji)                    │
└──────────────────────────────────────────────┘
```

**Zasady paywallu:**
- Nigdy nie blokuj dostępu do już napisanych tekstów
- Nigdy nie usuwaj danych użytkownika
- Zawsze pozwól wrócić do darmowego modułu
- Bez presji, bez countdown timerów, bez "zostało X miejsc"
- Przycisk rezygnacji widoczny i bez wyrzutów sumienia

---

### 2.6 Dziennik (Mój Dziennik)

```
┌──────────────────────────────────────────────┐
│  MÓJ DZIENNIK                                 │
│                                               │
│  Wszystkie Twoje teksty w jednym miejscu.     │
│                                               │
│  Filtruj: [Wszystko] [Przeszłość]             │
│           [Teraźniejszość] [Przyszłość]       │
│                                               │
│  ┌─ Ćwiczenie bramkowe ──────────────────┐   │
│  │ "5 Minut dla Siebie" · 27 lut 2026    │   │
│  │ "Teraz czuję się zmęczona, ale..."    │   │
│  │ [Otwórz]                               │   │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Moduł I, Ćw. 1 ─────────────────────┐   │
│  │ "Mapa Twojego Życia" · 28 lut 2026    │   │
│  │ "1. Przeprowadzka do Warszawy..."     │   │
│  │ [Otwórz]                               │   │
│  └────────────────────────────────────────┘  │
│  ...                                          │
│                                               │
│  [Eksportuj do PDF]                           │
│                                               │
│  Baner: Twoje teksty są zaszyfrowane.         │
│  Tylko Ty możesz je odczytać.                 │
└──────────────────────────────────────────────┘
```

---

### 2.7 Feed — Kategoria Ulubione

Widok filtrujący posty oznaczone jako ulubione przez zalogowanego użytkownika.

```
┌──────────────────────────────────────────────┐
│  ULUBIONE                                     │
│                                               │
│  Widoczne tylko dla zalogowanych.             │
│  Niezalogowany użytkownik przekierowywany     │
│  do /login?next=/favorites                    │
│                                               │
│  InfiniteFeed z initialCategory="favorites"   │
│  (filtrowanie po stronie klienta/komponentu)  │
│                                               │
│  Puste: "Tu pojawią się posty, które          │
│  polubiłeś/aś. Przeglądaj feed i             │
│  zapisuj ulubione."                           │
└──────────────────────────────────────────────┘
```

**URL:**
- Polski: `/ulubione`
- Angielski: `/favorites`

**Dostęp:**
- Wyłącznie dla zalogowanych użytkowników (Supabase Auth)
- Niezalogowani: redirect do `/login?next=/favorites`

**Implementacja:**
- Stała `FAVORITES_KEY = "favorites"` z `src/lib/categories.ts`
- `categoryKeyFromPath()` wykrywa ścieżki `/favorites` i `/ulubione`
- `getFavoritesUrl(locale)` generuje właściwy URL zależnie od języka
- Dane strony ładowane server-side, filtrowanie ulubionych po stronie `InfiniteFeed`

**Nawigacja do ulubionych:**
- Link dostępny w nagłówku/nawigacji feedu gdy użytkownik jest zalogowany
- `getFavoritesUrl(locale)` zwraca `/ulubione` dla PL i `/favorites` dla EN

---

## 3. Stany Nawigacji

### Nawigacja główna (po zalogowaniu):
```
┌──────────────────────────────────────────────┐
│  justmeaning    Dashboard  Dziennik  Zasoby  │
│                                    [Konto ▾] │
└──────────────────────────────────────────────┘
```

### Nawigacja w ćwiczeniu (uproszczona, bez rozpraszaczy):
```
┌──────────────────────────────────────────────┐
│  ← Wróć do modułu    Moduł I · Ćwiczenie 3  │
│                            [Potrzebuję pomocy]│
└──────────────────────────────────────────────┘
```

---

## 4. Responsywność

### Desktop (>1024px):
- Treść wyśrodkowana, max-width ~720px (optymalnie do czytania)
- Edytor pełnej szerokości w kolumnie treści
- Sidebar z podpowiedziami opcjonalny

### Tablet (768-1024px):
- Jak desktop, bez sidebara

### Mobile (<768px):
- Single column, pełna szerokość
- Edytor zajmuje pełną szerokość
- Podpowiedzi w rozwijanej sekcji
- Baner kryzysowy na dole (sticky)
- Nawigacja: hamburger menu

---

## 5. Kluczowe Interakcje

### Autosave:
- Wskaźnik: "Zapisywanie..." → "✓ Zapisano" (subtelny, nie rozpraszający)
- Co 30 sekund lub po 5 sekundach bezczynności
- Przy utracie połączenia: "Zapisano lokalnie. Zsynchronizujemy gdy wrócisz online."

### Przejścia między ćwiczeniami:
- Łagodne fade transition (200ms)
- Scroll to top
- Bez animacji typu "confetti" czy "achievement unlocked"

### Empty states:
- Dashboard bez ćwiczeń: "Twoja przestrzeń do pisania jest gotowa. [Zacznij od Modułu I]"
- Dziennik pusty: "Tu pojawią się Twoje teksty. [Zacznij pisać]"

### Error states:
- Błąd zapisu: "Nie udało się zapisać. Twój tekst jest bezpieczny w przeglądarce. Spróbuj ponownie."
- Błąd logowania: "Coś poszło nie tak. Spróbuj ponownie lub napisz do nas: [email]"
- 404: "Ta strona nie istnieje. [Wróć do dashboardu]"
