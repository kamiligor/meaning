---
type: spec
name: User Flow
version: "1.0"
last_updated: "2026-02-27"
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
│  │  "Witaj ponownie."                                │   │
│  │  (lub przy pierwszej wizycie: "Twoja przestrzeń   │   │
│  │   do pisania jest gotowa.")                       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──── Moduły ──────────────────────────────────────┐   │
│  │                                                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │   │
│  │  │ PRZESZŁOŚĆ  │ │TERAŹNIEJSZ. │ │ PRZYSZŁOŚĆ  │ │   │
│  │  │             │ │             │ │             │ │   │
│  │  │ Zrozum swoją│ │ Zrozum,     │ │ Zaprojektuj │ │   │
│  │  │ historię    │ │ gdzie stoisz│ │ siebie      │ │   │
│  │  │             │ │             │ │             │ │   │
│  │  │ 2/6 ćwiczeń│ │ (nie rozp.) │ │ 🔒          │ │   │
│  │  │ [Kontynuuj] │ │ [Zacznij]   │ │ [29 PLN]    │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │   │
│  │                                                    │   │
│  │  Pełna ścieżka: Moduł I ▸ Moduł II ▸ Moduł III   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──── Szybki dostęp ──────────────────────────────┐   │
│  │  📖 Mój dziennik   📚 Zasoby   ⚙️ Ustawienia   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──── Baner kryzysowy (subtelny) ─────────────────┐   │
│  │  Potrzebujesz wsparcia? 116 123 · 800 70 2222    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Stany modułu:**
- `locked` - nie kupiony (Moduł II/III dla darmowych)
- `available` - odblokowany, nie rozpoczęty
- `in_progress` - rozpoczęty, pokazuje postęp (np. "3/6 ćwiczeń")
- `completed` - ukończony (subtelne oznaczenie, bez fajerwerków)

**Stany karty modułu:**
- Nigdy nie pokazuj "Pominąłeś X ćwiczeń"
- Zawsze "Ukończone: X/6"
- Ćwiczenia bramkowe nie wliczają się

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

```
┌──────────────────────────────────────────────┐
│  EKRAN ĆWICZENIA                              │
│                                               │
│  ┌─ Nagłówek ─────────────────────────────┐  │
│  │ Moduł I > Ćwiczenie 3                  │  │
│  │ "Moment, Który Wszystko Zmienił"       │  │
│  │ ★★★☆☆  ⏱ 25-40 min                    │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Disclaimer ───────────────────────────┐  │
│  │ Ten program nie zastępuje psychoterapii.│  │
│  │ Linie wsparcia: 116 123 · 800 70 2222  │  │
│  │ [Rozumiem. Chcę kontynuować.]          │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Content Warning (jeśli dotyczy) ──────┐  │
│  │ "To ćwiczenie może wywołać silne        │  │
│  │  emocje. To normalne..."               │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Wprowadzenie ─────────────────────────┐  │
│  │ 2-4 akapity z YAML introduction        │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Dlaczego to działa ──────────────────┐   │
│  │ (zwijane) Krótkie wyjaśnienie naukowe  │   │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Pytania prowadzące ──────────────────┐   │
│  │ 1. "Pytanie otwierające..."            │   │
│  │                                        │   │
│  │ ┌─ EDYTOR (TipTap) ─────────────────┐ │   │
│  │ │                                     │ │   │
│  │ │  [tekst użytkownika]                │ │   │
│  │ │                                     │ │   │
│  │ │  Autosave: ✓ Zapisano              │ │   │
│  │ └─────────────────────────────────────┘ │   │
│  │                                        │   │
│  │ 2. "Pytanie pogłębiające..."          │   │
│  │ [edytor]                               │   │
│  │ ...                                    │   │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Podpowiedzi ratunkowe (zwijane) ─────┐  │
│  │ "Utknąłeś/aś? Spróbuj:"              │  │
│  │ • Podpowiedź 1                         │  │
│  │ • Podpowiedź 2                         │  │
│  │ • Podpowiedź 3                         │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Akcje ────────────────────────────────┐  │
│  │ [Zakończ ćwiczenie]                     │  │
│  │ [Pomiń to ćwiczenie]  [Wróć później]   │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌─ Baner kryzysowy ─────────────────────┐  │
│  │ Potrzebujesz wsparcia? 116 123         │  │
│  │ [Potrzebuję pomocy]                    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

**Po kliknięciu "Zakończ ćwiczenie":**

```
┌──────────────────────────────────────────────┐
│  REFLEKSJA PO ĆWICZENIU                       │
│                                               │
│  [reflection_prompt z YAML]                    │
│  "Przeczytaj to, co napisałeś/aś.            │
│   Jak się teraz czujesz?"                     │
│                                               │
│  (opcjonalny krótki edytor na refleksję)     │
│                                               │
│  --- jeśli difficulty >= 3: ---               │
│  "Jak się teraz czujesz?"                     │
│  [W porządku, chcę kontynuować]               │
│  [Potrzebuję przerwy]                         │
│  [Czuję się źle, potrzebuję wsparcia]         │
│                                               │
│  --- jeśli difficulty < 3: ---                │
│  [Przejdź do następnego ćwiczenia]            │
│  [Wróć do dashboardu]                         │
└──────────────────────────────────────────────┘
```

**Flow "Potrzebuję przerwy":**
```
→ Ćwiczenie uziemiające 5-4-3-2-1
→ [Wróć do dashboardu] [Sprawdź zasoby] [Kontynuuj]
```

**Flow "Czuję się źle":**
```
→ Zasoby kryzysowe (pełna lista)
→ "Twój tekst jest zapisany. Wracasz kiedy chcesz."
→ [Wróć do dashboardu]
```

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
