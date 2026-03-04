# Zespół Agentów AI (Claude Code) — The Life Writing Program (justmeaning.com)
## Program pisania, który pomaga zrozumieć swoją przeszłość, uporządkować teraźniejszość i świadomie zaplanować przyszłość

> **Status:** Dokument referencyjny (blueprint). Aktualne definicje agentów: `.claude/agents/*.md` (9 agentów, nie 8 jak poniżej — dodano `web-designer.md`).
> Aktualne ćwiczenia (19 plików YAML) w `docs/exercises/`.

---

## 1. ARCHITEKTURA ZESPOŁU — PRZEGLĄD

Projekt korzysta z **9 wyspecjalizowanych agentów** + **1 agenta-koordynatora (orchestrator)**, którzy wspólnie pokrywają trzy filary: **psychologię, kontent i technologię**.

```
                    ┌─────────────────────────┐
                    │   🎯 AGENT ORCHESTRATOR  │
                    │   (Koordynator Projektu) │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
    ╔═════╧══════╗        ╔═════╧══════╗        ╔═════╧══════╗
    ║  FILAR I   ║        ║  FILAR II  ║        ║ FILAR III  ║
    ║ PSYCHOLOGIA║        ║  KONTENT   ║        ║ TECHNOLOGIA║
    ╚════════════╝        ╚════════════╝        ╚════════════╝
     │          │          │    │    │           │          │
  Agent 1   Agent 2    Agent 3  4   5        Agent 6   Agent 7
  Psycholog Terapeut   Copywr. UX  Eduk.    Frontend  Backend
  Badawczy  Narracyjny        Writer         Dev       Dev
                                                   │
                                                Agent 8
                                                QA/Test
```

---

## 2. SZCZEGÓŁOWY OPIS KAŻDEGO AGENTA

---

### 🎯 AGENT 0: ORCHESTRATOR (Koordynator Projektu)

**Rola:** Zarządza całym pipeline'em, deleguje zadania, pilnuje spójności między agentami, rozwiązuje konflikty i scala outputy.

**System prompt (rdzeń):**
> Jesteś głównym koordynatorem projektu The Life Writing Program (justmeaning.com) — darmowego, dwujęzycznego (en/pl) programu online do ustrukturyzowania myśli. Twoim zadaniem jest dekompozycja zadań, delegowanie do wyspecjalizowanych agentów, walidacja spójności i scalanie rezultatów. Zawsze pilnujesz, aby każdy element był oparty na literaturze psychologicznej i służył użytkownikowi w kryzysie lub stagnacji.

**Odpowiada za:**
- Tworzenie i aktualizowanie planu projektu (roadmapa)
- Dekompozycję epików na zadania dla poszczególnych agentów
- Code review i content review międzyagentowy
- Pilnowanie terminologii i tonu komunikacji
- Scalanie Pull Requestów z różnych agentów

---

### 🧠 AGENT 1: PSYCHOLOG BADAWCZY

**Rola:** Fundament naukowy całego programu. Przegląda literaturę, projektuje framework ćwiczeń, waliduje wszystkie treści pod kątem evidence-based.

**System prompt (rdzeń):**
> Jesteś psychologiem badawczym specjalizującym się w psychologii narracyjnej, terapii poznawczo-behawioralnej i psychologii pozytywnej. Tworzysz evidence-based framework dla programu pomagającego ludziom przepracować przeszłość, zrozumieć teraźniejszość i zaprojektować przyszłość. Każda rekomendacja musi zawierać odniesienie do badań.

**Kluczowe zadania:**
- Przegląd i synteza literatury (patrz sekcja 3)
- Zaprojektowanie 3-modułowej struktury programu (Przeszłość / Teraźniejszość / Przyszłość)
- Opracowanie mechanizmów psychologicznych stojących za każdym ćwiczeniem
- Tworzenie skal samooceny i checkpointów postępu
- Definiowanie kontrwskazań i disclaimerów bezpieczeństwa
- Walidacja treści tworzonych przez innych agentów

**Baza wiedzy do załadowania:**
```
/docs/research/
  ├── pennebaker_expressive_writing.md
  ├── narrative_identity_mcadams.md
  ├── self_determination_theory.md
  ├── acceptance_commitment_therapy.md
  ├── positive_psychology_interventions.md
  ├── rumination_and_reflection.md
  ├── future_self_continuity.md
  └── trauma_informed_design.md
```

**Kluczowe teorie i badania do wykorzystania:**

| Obszar | Teoria/Badanie | Zastosowanie w programie |
|--------|---------------|------------------------|
| Przeszłość | Ekspresywne pisanie (Pennebaker, 1997) | Moduł przepisywania trudnych wspomnień |
| Przeszłość | Tożsamość narracyjna (McAdams, 2001) | Tworzenie spójnej historii życia |
| Przeszłość | Wzrost potraumatyczny (Tedeschi & Calhoun) | Reinterpretacja trudnych doświadczeń |
| Teraźniejszość | ACT — Terapia Akceptacji i Zaangażowania (Hayes) | Ćwiczenia defuzji i akceptacji |
| Teraźniejszość | Mindful self-compassion (Neff, 2003) | Moduł współczucia dla siebie |
| Teraźniejszość | Wartości i zaangażowanie (Schwartz) | Klaryfikacja osobistych wartości |
| Przyszłość | Teoria autodeterminacji (Deci & Ryan) | Projektowanie celów wewnętrznie motywowanych |
| Przyszłość | Mental contrasting + Implementation intentions (Oettingen) | WOOP framework adaptowany |
| Przyszłość | Ciągłość przyszłego Ja (Hershfield) | Ćwiczenie „List do przyszłego siebie" |
| Ogólne | CBT — restrukturyzacja poznawcza (Beck) | Identyfikacja zniekształceń poznawczych |
| Ogólne | Psychologia pozytywna (Seligman) | Ćwiczenia wdzięczności i sił charakteru |

---

### 📖 AGENT 2: TERAPEUTA NARRACYJNY / PROJEKTANT ĆWICZEŃ

**Rola:** Przekłada framework naukowy na konkretne, empatyczne, prowadzące za rękę ćwiczenia pisemne.

**System prompt (rdzeń):**
> Jesteś terapeutą narracyjnym i projektantem ćwiczeń terapeutycznych. Tworzysz głębokie, empatyczne prompty do pisania, które prowadzą użytkownika przez proces autorefleksji. Piszesz ciepłym, nieoceniającym tonem. Każde ćwiczenie musi mieć jasną instrukcję, przykład i wyjaśnienie „dlaczego to działa". Twoje ćwiczenia pomagają ludziom w chaosie, stagnacji lub z nawracającymi negatywnymi wspomnieniami.

**Kluczowe zadania:**
- Projektowanie konkretnych ćwiczeń pisemnych dla każdego modułu
- Tworzenie „promptów głębokich" — pytań prowadzących użytkownika
- Pisanie przykładowych odpowiedzi (wzorców), żeby użytkownik wiedział, czego się spodziewać
- Projektowanie sekwencji ćwiczeń (łatwiejsze → trudniejsze)
- Tworzenie „podpowiedzi ratunkowych" dla osób, które utknęły
- Integracja elementów psychoedukacji w treść ćwiczeń

**Przykładowa struktura ćwiczenia:**
```yaml
exercise:
  id: past_03
  module: "Przeszłość"
  title: "Rozdział, który zmienił wszystko"
  difficulty: 2/5
  estimated_time: "25-40 minut"
  psychological_basis: "Ekspresywne pisanie (Pennebaker) + Tożsamość narracyjna (McAdams)"
  introduction: |
    Każde życie ma momenty zwrotne — chwile, po których nic już nie było takie samo.
    Nie muszą to być wielkie, dramatyczne wydarzenia. Czasem to cicha rozmowa,
    przypadkowe spotkanie lub decyzja podjęta w ułamku sekundy...
  prompt_questions:
    - "Opisz moment z przeszłości, który zmienił kierunek Twojego życia. Co dokładnie się wydarzyło?"
    - "Jak wyglądało Twoje życie PRZED tym momentem? Kim wtedy byłeś/byłaś?"
    - "Co się zmieniło w Tobie PO tym doświadczeniu?"
    - "Gdybyś mógł/mogła powiedzieć coś tamtej wersji siebie — co by to było?"
  stuck_helpers:
    - "Jeśli nie przychodzi Ci do głowy nic dramatycznego — pomyśl o małych zmianach. Kto powiedział Ci coś, co utkwiło w pamięci?"
    - "Spróbuj dokończyć zdanie: 'Przed tym byłem osobą, która... a po tym stałem się osobą, która...'"
  why_it_works: |
    Badania Pennebakera pokazują, że samo opisanie trudnego doświadczenia w formie
    spójnej narracji zmniejsza napięcie emocjonalne. Nadajemy sens temu, co nas spotkało,
    zamiast pozwalać, by chaotyczne wspomnienia krążyły w głowie bez struktury.
```

---

### ✍️ AGENT 3: COPYWRITER / STRATEG KOMUNIKACJI

**Rola:** Tworzy wszystkie treści marketingowe, promocyjne i komunikacyjne programu.

**System prompt (rdzeń):**
> Jesteś polskojęzycznym copywriterem specjalizującym się w komunikacji projektów społecznych i psychologicznych. Piszesz empatycznie, ale bez patosu. Unikasz korporacyjnego żargonu i „coachingowego" tonu. Twoje teksty trafiają do osób w kryzysie, stagnacji lub szukających sensu — więc muszą być autentyczne, ciepłe i wolne od toksycznej pozytywności.

**Kluczowe zadania:**

#### A) Hasła promocyjne i claim programu:
```
HASŁO GŁÓWNE (propozycje do testowania):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ „The Life Writing Program — Twoja historia zasługuje na porządek"
→ „Uporządkuj chaos. Napisz swoją historię."  
→ „Przeszłość do zrozumienia. Teraźniejszość do przeżycia. Przyszłość do napisania."
→ „Nie musisz wszystkiego rozumieć. Zacznij od zapisania."
→ „Twoje myśli zasługują na strukturę."

HASŁA MODUŁOWE:
━━━━━━━━━━━━━━━
Moduł Przeszłość: „Przepisz historię, która Cię definiuje"
Moduł Teraźniejszość: „Zrozum, gdzie teraz stoisz"  
Moduł Przyszłość: „Zaprojektuj siebie, którym chcesz się stać"

HASŁA TARGETOWANE:
━━━━━━━━━━━━━━━━━
Dla osób w chaosie: „Kiedy w głowie jest za dużo — zacznij pisać"
Dla osób, które utknęły: „Utknąłeś? To dobry moment, żeby się zatrzymać i napisać"
Dla osób z nawracającymi wspomnieniami: „Wspomnienia wracają? Nadaj im nowy kształt"
```

#### B) Treści na stronę internetową (kontent serwisu):
- Strona główna (hero, sekcje korzyści, social proof, CTA)
- Opis każdego modułu
- Sekcja „Dlaczego to działa" (popularyzacja naukowa)
- FAQ
- Strona „O projekcie" (misja, zespół, open-source)
- Blog / artykuły psychoedukacyjne
- Onboarding copy (ekrany powitalne, e-maile)

#### C) Komunikacja kryzysowa:
- Disclaimery: „Ten program nie zastępuje psychoterapii"
- Informacje o liniach wsparcia kryzysowego
- Komunikaty przy wykryciu treści alarmujących

---

### 🎨 AGENT 4: UX WRITER / PROJEKTANT DOŚWIADCZENIA UŻYTKOWNIKA

**Rola:** Projektuje ścieżkę użytkownika, mikrokopię, architekturę informacji i emocjonalny design serwisu.

**System prompt (rdzeń):**
> Jesteś UX writerem i projektantem doświadczeń, specjalizującym się w aplikacjach wellness i zdrowia psychicznego. Projektujesz ścieżki użytkownika, które są bezpieczne, nieinwazyjne i wspierające. Każdy ekran musi redukować lęk i budować poczucie sprawczości. Stosujesz zasady trauma-informed design.

**Kluczowe zadania:**
- Mapa ścieżki użytkownika (user journey map)
- Architektura informacji serwisu
- Mikrokopia (buttony, toasty, empty states, error messages)
- Projektowanie onboardingu (pierwsze 5 minut w serwisie)
- System motywacyjny (postęp, milestones, bez gamifikacji opartej na presji)
- Dostępność (a11y) i inkluzywność językowa

**Architektura serwisu:**
```
STRONA GŁÓWNA
│
├── /o-programie — Misja, nauka za programem, zespół
├── /zacznij — Onboarding (wybór modułu lub pełna ścieżka)
│
├── /modul/przeszlosc
│   ├── Wprowadzenie psychoedukacyjne
│   ├── Ćwiczenie 1: Mapa życia (timeline)
│   ├── Ćwiczenie 2: Kluczowe rozdziały
│   ├── Ćwiczenie 3: Trudne wspomnienia — nowa perspektywa
│   ├── Ćwiczenie 4: List do dawnego siebie
│   └── Podsumowanie i refleksja
│
├── /modul/terazniejszosc
│   ├── Wprowadzenie psychoedukacyjne
│   ├── Ćwiczenie 1: Kim jestem teraz? (inwentarz)
│   ├── Ćwiczenie 2: Moje wartości
│   ├── Ćwiczenie 3: Co mi przeszkadza? (defuzja)
│   ├── Ćwiczenie 4: Współczucie dla siebie
│   └── Podsumowanie i refleksja
│
├── /modul/przyszlosc
│   ├── Wprowadzenie psychoedukacyjne
│   ├── Ćwiczenie 1: Ja za 5 lat — najlepsza wersja
│   ├── Ćwiczenie 2: Ja za 5 lat — najgorsza wersja
│   ├── Ćwiczenie 3: Planowanie oparte na wartościach
│   ├── Ćwiczenie 4: List do przyszłego siebie
│   └── Podsumowanie i refleksja
│
├── /moj-dziennik — Zapis wszystkich ćwiczeń użytkownika
├── /zasoby — Artykuły, polecane książki, linie wsparcia
└── /faq
```

**Zasady trauma-informed UX design:**
1. **Bezpieczeństwo** — użytkownik zawsze wie, co go czeka; brak niespodzianek
2. **Wybór** — nigdy nie zmuszamy; zawsze „możesz pominąć"
3. **Współpraca** — ton partnerski, nie dyrektywny
4. **Zaufanie** — transparentność co do danych i prywatności
5. **Empowerment** — podkreślanie odwagi i postępu użytkownika
6. **Tempo** — użytkownik sam decyduje, ile robi; brak timerów i presji

---

### 📚 AGENT 5: EDUKATOR / CONTENT WRITER

**Rola:** Pisze treści psychoedukacyjne „wewnątrz" programu — wprowadzenia do modułów, wyjaśnienia mechanizmów psychologicznych, artykuły blogowe.

**System prompt (rdzeń):**
> Jesteś popularyzatorem psychologii piszącym w języku polskim. Tłumaczysz złożone koncepcje psychologiczne na prosty, ciepły język. Nigdy nie upraszczasz kosztem prawdy. Podajesz źródła. Piszesz tak, jakbyś rozmawiał z mądrym przyjacielem, który nie jest psychologiem.

**Kluczowe zadania:**
- Wprowadzenia psychoedukacyjne do każdego modułu
- Artykuły blogowe (SEO-friendly)
- Sekcja „Dlaczego to działa" przy każdym ćwiczeniu
- Słowniczek pojęć psychologicznych
- Infografiki i materiały wizualne (briefy)

**Tematy artykułów edukacyjnych (przykłady):**
1. „Dlaczego pisanie o sobie pomaga? Nauka za ekspresywnym pisaniem"
2. „Nawracające wspomnienia — dlaczego wracają i jak je oswoić"
3. „Czy naprawdę możesz przepisać swoją historię? Czym jest tożsamość narracyjna"
4. „Utknąłeś w życiu? To częstsze niż myślisz"
5. „Przyszłe Ja — dlaczego tak trudno planować dla kogoś, kogo nie znasz"
6. „Czym różni się ruminacja od refleksji — i dlaczego to kluczowe"
7. „Wartości vs cele — co naprawdę daje kierunek"
8. „Współczucie dla siebie to nie słabość — co mówi nauka"

---

### 💻 AGENT 6: FRONTEND DEVELOPER

**Rola:** Implementuje interfejs użytkownika — responsywny, dostępny, estetyczny, zoptymalizowany pod kątem pisania.

**System prompt (rdzeń):**
> Jesteś senior frontend developerem budującym aplikację wellness do pisania terapeutycznego. Priorytetem jest: dostępność (WCAG 2.1 AA), wydajność, czytelność, spokojny design i doskonałe doświadczenie pisania. Stack: React/Next.js, TypeScript, Tailwind CSS. Aplikacja musi działać świetnie na mobile.

**Stack technologiczny:**
```
Framework:      Next.js 14+ (App Router)
Język:          TypeScript
Styling:        Tailwind CSS + shadcn/ui
Edytor:         TipTap (rich text) lub prosty textarea z autosave
Animacje:       Framer Motion (subtelne, spokojne)
Dostępność:     WCAG 2.1 AA minimum
PWA:            Tak (offline writing)
Hosting:        Vercel (darmowy tier) lub self-hosted
```

**Kluczowe widoki do zaimplementowania:**
- Landing page (marketing)
- Onboarding flow (3-4 ekrany)
- Dashboard użytkownika (postęp, moduły)
- Widok ćwiczenia (instrukcja + edytor + podpowiedzi)
- Dziennik / historia wpisów
- Profil i ustawienia

**Wymagania krytyczne:**
- Autosave co 30 sekund (lokalne + serwer)
- Tryb ciemny/jasny
- Responsywność mobile-first
- Czas ładowania < 2s
- Export do PDF własnych tekstów
- Zero tracking/analytics (prywatność)

---

### ⚙️ AGENT 7: BACKEND DEVELOPER

**Rola:** Buduje API, bazę danych, autentykację, bezpieczeństwo danych, logikę postępu.

**System prompt (rdzeń):**
> Jesteś senior backend developerem budującym bezpieczny backend dla aplikacji wellness. Priorytetem jest: prywatność danych (RODO/GDPR), szyfrowanie treści użytkowników, minimalizm danych, niezawodność. Stack: Node.js/Python, PostgreSQL, end-to-end encryption dla treści użytkowników.

**Stack technologiczny:**
```
Runtime:        Node.js (Express/Fastify) lub Python (FastAPI)
Baza danych:    PostgreSQL + Prisma ORM
Auth:           NextAuth.js / Auth.js (magic link, Google, email)
Szyfrowanie:    AES-256 dla treści użytkowników (client-side encryption)
API:            REST lub tRPC
Hosting:        Railway / Fly.io / self-hosted VPS
CI/CD:          GitHub Actions
```

**Kluczowe endpointy / funkcje:**
```
Auth:
  POST /auth/register
  POST /auth/login
  POST /auth/magic-link

Moduły:
  GET  /modules                    — lista modułów
  GET  /modules/:id               — szczegóły modułu z ćwiczeniami

Ćwiczenia:
  GET  /exercises/:id             — pobranie ćwiczenia
  POST /exercises/:id/response    — zapisanie odpowiedzi
  PUT  /exercises/:id/response    — aktualizacja odpowiedzi

Postęp:
  GET  /progress                  — postęp użytkownika
  GET  /progress/stats            — statystyki (czas, słowa, ukończone)

Dziennik:
  GET  /journal                   — wszystkie wpisy użytkownika
  GET  /journal/export/pdf        — export do PDF

Bezpieczeństwo:
  DELETE /account                 — usunięcie konta i wszystkich danych
  GET    /data-export             — RODO export danych
```

**Wymagania bezpieczeństwa:**
- Szyfrowanie treści po stronie klienta (serwer NIE widzi plaintext)
- Brak analytics śledzących użytkownika
- Prawo do zapomnienia (pełne usunięcie danych)
- RODO-compliance
- Rate limiting
- CSP headers

---

### 🧪 AGENT 8: QA / TESTER / BEZPIECZEŃSTWO

**Rola:** Testuje aplikację pod kątem technicznym, UX-owym, merytorycznym i bezpieczeństwa emocjonalnego.

**System prompt (rdzeń):**
> Jesteś QA engineerem i specjalistą od bezpieczeństwa testującym aplikację wellness. Testujesz nie tylko kod, ale też bezpieczeństwo emocjonalne — czy treści nie mogą zaszkodzić użytkownikowi w kryzysie. Szukasz edge cases zarówno technicznych jak i psychologicznych.

**Obszary testowania:**

| Typ testu | Co testujemy | Narzędzia |
|-----------|-------------|-----------|
| Unit testy | Logika biznesowa, API | Jest, Vitest |
| E2E testy | Ścieżki użytkownika | Playwright, Cypress |
| Accessibility | WCAG compliance | axe-core, Lighthouse |
| Security | OWASP Top 10, szyfrowanie | ZAP, manual review |
| Content QA | Poprawność psychologiczna | Checklist od Agenta 1 |
| Emotional safety | Bezpieczeństwo treści | Manual review + red teaming |
| Performance | Czas ładowania, responsywność | Lighthouse, WebPageTest |
| RODO | Zgodność z przepisami | Manual checklist |

**Testy bezpieczeństwa emocjonalnego (unikalne):**
- Czy ćwiczenie może wywołać retraumatyzację bez ostrzeżenia?
- Czy disclaimer jest widoczny przed trudnymi ćwiczeniami?
- Czy informacja o liniach kryzysowych jest łatwo dostępna?
- Czy język jest wolny od toksycznej pozytywności i gaslightingu?
- Czy użytkownik może wyjść z ćwiczenia w każdym momencie?

---

## 3. PIPELINE PRACY ZESPOŁU

```
FAZA 1: FUNDAMENT (Tydzień 1-2)
═══════════════════════════════
Agent 1 (Psycholog) → Framework naukowy, bibliografia, struktura modułów
Agent 4 (UX Writer) → User journey, architektura informacji, wireframes
Agent 0 (Orchestrator) → Plan projektu, podział zadań

FAZA 2: TREŚCI (Tydzień 3-5)
═══════════════════════════════
Agent 2 (Terapeuta) → Projektowanie ćwiczeń (prompt, instrukcje, przykłady)
Agent 5 (Edukator) → Wprowadzenia do modułów, artykuły psychoedukacyjne
Agent 3 (Copywriter) → Landing page, hasła, onboarding copy, FAQ
Agent 1 (Psycholog) → Review i walidacja WSZYSTKICH treści

FAZA 3: IMPLEMENTACJA (Tydzień 4-8)
════════════════════════════════════
Agent 6 (Frontend) → Implementacja UI (równolegle z Fazą 2)
Agent 7 (Backend) → API, baza danych, auth, szyfrowanie
Agent 4 (UX Writer) → Mikrokopia, empty states, error messages

FAZA 4: INTEGRACJA I TESTY (Tydzień 7-9)
═════════════════════════════════════════
Agent 8 (QA) → Testy techniczne, accessibility, security
Agent 8 (QA) → Testy bezpieczeństwa emocjonalnego
Agent 1 (Psycholog) → Finalna walidacja merytoryczna
Agent 0 (Orchestrator) → Integracja, bug fixing, polish

FAZA 5: LAUNCH (Tydzień 10)
════════════════════════════
Agent 3 (Copywriter) → Materiały PR, posty social media
Agent 0 (Orchestrator) → Deployment, monitoring
```

---

## 4. STRUKTURA PROGRAMU — MODUŁY

### 📕 MODUŁ I: PRZESZŁOŚĆ — „Zrozum swoją historię"
> Oparty na: Pennebaker (ekspresywne pisanie), McAdams (tożsamość narracyjna), Tedeschi & Calhoun (wzrost potraumatyczny)

**Cel:** Uporządkować wspomnienia, nadać im narracyjną spójność, zmniejszyć ich emocjonalny ładunek.

**Ćwiczenia:**
1. **Mapa życia** — narysuj (opisz) timeline najważniejszych wydarzeń
2. **Siedem rozdziałów** — podziel życie na rozdziały i nazwij każdy
3. **Moment zwrotny** — opisz wydarzenie, które wszystko zmieniło
4. **Trudne wspomnienie — nowa perspektywa** — przepisz bolesne wspomnienie z dystansu
5. **List do dawnego siebie** — współczucie dla przeszłej wersji siebie
6. **Podsumowanie** — „Czego nauczyło mnie moje życie do tej pory?"

---

### 📗 MODUŁ II: TERAŹNIEJSZOŚĆ — „Zrozum, gdzie stoisz"
> Oparty na: ACT (Hayes), Self-compassion (Neff), teoria wartości (Schwartz), CBT (Beck)

**Cel:** Zrozumienie obecnej sytuacji, identyfikacja wartości, defuzja od negatywnych myśli.

**Ćwiczenia:**
1. **Kim jestem teraz?** — inwentarz ról, relacji, nawyków
2. **Moje wartości** — klaryfikacja 5 najważniejszych wartości
3. **Co mi przeszkadza?** — nazwanie największych frustracji i ćwiczenie defuzji
4. **Moje zniekształcenia** — rozpoznawanie schematów myślenia (CBT)
5. **Współczucie dla siebie** — list od wyrozumiałego przyjaciela
6. **Podsumowanie** — „Co jest teraz ważne, a co mogę puścić?"

---

### 📘 MODUŁ III: PRZYSZŁOŚĆ — „Zaprojektuj siebie"
> Oparty na: SDT (Deci & Ryan), mental contrasting (Oettingen), ciągłość przyszłego Ja (Hershfield)

**Cel:** Stworzenie motywującej wizji przyszłości i konkretnego planu działania.

**Ćwiczenia:**
1. **Najlepsza możliwa przyszłość** — szczegółowy opis idealnego życia za 3-5 lat
2. **Najgorsza możliwa przyszłość** — co się stanie, jeśli nic nie zmienisz (motywacja negatywna)
3. **Plan oparty na wartościach** — cele wynikające z Modułu II
4. **Przeszkody i strategie** — mental contrasting (WOOP)
5. **List do przyszłego siebie** — kontrakt z przyszłą wersją siebie
6. **Podsumowanie** — „Jeden krok, który podejmę jutro"

---

## 5. KLUCZOWE PLIKI KONFIGURACYJNE PROJEKTU

### Plik: `agents.yaml` (konfiguracja dla Claude Code)
```yaml
project: "pisz-siebie"
version: "1.0"
language: "pl"

orchestrator:
  name: "Koordynator"
  model: "claude-sonnet-4-5-20250929"
  max_tokens: 8000
  tools: ["file_management", "code_review", "task_delegation"]
  
agents:
  - id: "psycholog"
    name: "Psycholog Badawczy"
    model: "claude-sonnet-4-5-20250929"
    role: "Walidacja naukowa, framework psychologiczny"
    context_files: ["/docs/research/*"]
    output_dir: "/docs/framework/"
    
  - id: "terapeuta"
    name: "Terapeuta Narracyjny"
    role: "Projektowanie ćwiczeń pisemnych"
    depends_on: ["psycholog"]
    output_dir: "/content/exercises/"
    
  - id: "copywriter"
    name: "Copywriter"
    role: "Treści marketingowe i komunikacyjne"
    output_dir: "/content/marketing/"
    
  - id: "ux_writer"
    name: "UX Writer"
    role: "Architektura informacji, mikrokopia"
    output_dir: "/design/"
    
  - id: "edukator"
    name: "Edukator"
    role: "Treści psychoedukacyjne"
    depends_on: ["psycholog"]
    output_dir: "/content/education/"
    
  - id: "frontend"
    name: "Frontend Developer"
    role: "Implementacja UI"
    depends_on: ["ux_writer"]
    output_dir: "/src/frontend/"
    
  - id: "backend"
    name: "Backend Developer"
    role: "API, baza danych, bezpieczeństwo"
    output_dir: "/src/backend/"
    
  - id: "qa"
    name: "QA Engineer"
    role: "Testowanie techniczne i emocjonalne"
    depends_on: ["frontend", "backend", "terapeuta"]
    output_dir: "/tests/"
```

---

## 6. WYRÓŻNIKI VS SELF AUTHORING (J. Peterson)

| Aspekt | Self Authoring | The Life Writing Program |
|--------|---------------|-------------|
| Język | Angielski | Polski |
| Cena | ~29.90 USD | Darmowe (open-source) |
| Podstawa naukowa | Big Five + narracja | Szerszy framework (ACT, CBT, SDT, Pennebaker, Neff) |
| Bezpieczeństwo | Minimalne disclaimery | Trauma-informed design, linie kryzysowe |
| UX | Przestarzały interfejs | Nowoczesny, mobile-first, dostępny |
| Prywatność | Dane na serwerach | Szyfrowanie client-side, zero tracking |
| Personalizacja | Sztywna ścieżka | Wybór modułu lub pełna ścieżka |
| Wsparcie | Brak | Podpowiedzi ratunkowe, psychoedukacja przy każdym ćwiczeniu |
| Podejście | Dyrektywne | Partnerskie, trauma-informed |

---

## 7. METRYKI SUKCESU

```
Zaangażowanie:
  - % użytkowników kończących przynajmniej 1 moduł
  - Średnia liczba słów na ćwiczenie
  - Retencja 7-dniowa i 30-dniowa

Jakość:
  - NPS (Net Promoter Score)
  - Samoocena samopoczucia (pre/post, 5-punktowa skala)
  - Jakościowy feedback użytkowników

Bezpieczeństwo:
  - Liczba użytkowników kierowanych do linii kryzysowych
  - Zero incydentów z danymi użytkowników
  - WCAG compliance score
```

---

*Dokument wygenerowany jako blueprint projektu The Life Writing Program (justmeaning.com) — gotowy do implementacji przez zespół agentów Claude Code.*
