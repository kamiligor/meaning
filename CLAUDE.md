# Just have a little meaning — Platforma psychoedukacyjna

## Branding

| Element | Wartość |
|---------|--------|
| **Domena** | justmeaning.com |
| **Hasło / tagline** | Just have a little meaning (zawsze po angielsku) |
| **Stopka** | JUST HAVE A LITTLE MEANING |
| **Instagram** | @justhavealittlemeaning (po angielsku) |
| **Nazwa programu** | The Life Writing Program (zawsze po angielsku) |
| **Opis EN** | A guided writing process designed to help you understand your past, clarify your present, and intentionally shape your future. |
| **Opis PL** | Program pisania, który pomaga zrozumieć swoją przeszłość, uporządkować teraźniejszość i świadomie zaplanować przyszłość. |
| **Języki strony** | en/pl (multilanguage) |

Nazwy i hasło są ZAWSZE w języku angielskim — niezależnie od języka strony.

## O Projekcie

„Just have a little meaning" to dwujęzyczna (en/pl) platforma psychoedukacyjna na domenie **justmeaning.com**, składająca się z dwóch filarów:

1. **Feed psychologiczny** — karuzele na Instagram (@justhavealittlemeaning) + strona z rozszerzonymi treściami (psychology life hacks). Kategoria "Ulubione" (FAVORITES_KEY) widoczna tylko dla zalogowanych userów; strony /favorites (EN) i /ulubione (PL).
2. **The Life Writing Program** — ustrukturyzowany program pisania terapeutycznego oparty na badaniach naukowych (18 ćwiczeń w 3 modułach + ćwiczenie bramkowe).

Lejek: Instagram (@justhavealittlemeaning) → justmeaning.com (feed + rozszerzone treści) → The Life Writing Program.

## Stack Technologiczny

```
Framework:        Next.js 16+ (App Router), TypeScript, Tailwind CSS v4
UI:               shadcn/ui + custom components
Edytor (program): TipTap (rich text z autosave)
Posty:            Markdown files (content/posts/) + gray-matter
DB:               Supabase (PostgreSQL + Auth + RLS)
Auth (admin):     JWT w httpOnly cookie (jose + bcryptjs)
Auth (program):   Supabase Auth (magic link, Google OAuth)
Obrazki:          Satori + @resvg/resvg-js (JSX → SVG → PNG)
Szyfrowanie:      AES-256-GCM server-side, klucz z APP_SECRET (env var) + user_id
Hosting:          Coolify na Hostingerze (Docker, standalone output)
Newsletter:       MailerLite API
i18n:             en/pl (custom dict w src/lib/i18n.ts)
Testy:            Vitest (unit) + @testing-library/react
Markdown:          marked (rendering introductions modułów)
```

## Architektura

```
jh/
├── CLAUDE.md                          # Ten plik
├── zespol_agentow_projekt.md          # Blueprint agentów (program pisania)
├── legacy/                            # Archiwalne dokumenty (plan.md, FUTURE.md, new-brand.md)
│
├── .claude/
│   ├── settings.local.json            # Uprawnienia lokalne
│   ├── agents/                        # Subagenci (9)
│   │   ├── psycholog-badawczy.md
│   │   ├── terapeuta-narracyjny.md
│   │   ├── copywriter.md
│   │   ├── ux-writer.md
│   │   ├── edukator.md
│   │   ├── frontend-dev.md
│   │   ├── backend-dev.md
│   │   ├── web-designer.md
│   │   └── qa-tester.md
│   └── commands/
│       ├── new-post.md                # Tworzenie karuzeli
│       └── nowe-cwiczenie.md          # Tworzenie ćwiczenia
│
├── docs/                              # Dokumentacja
│   ├── content-style-guide.md         # Wytyczne stylu treści (karuzele)
│   ├── exercises/                     # Definicje ćwiczeń YAML (19 plików)
│   │   ├── gate_00.yaml              #   Ćwiczenie bramkowe
│   │   ├── past_01-06.yaml           #   Moduł I: Przeszłość (6)
│   │   ├── present_01-06.yaml        #   Moduł II: Teraźniejszość (6)
│   │   └── future_01-06.yaml         #   Moduł III: Przyszłość (6)
│   ├── framework/
│   │   └── lista-wartosci.md          # 35 wartości do ćwiczenia II-2
│   ├── content/
│   │   ├── disclaimery-bezpieczenstwo.md  # Disclaimery, linie wsparcia
│   │   └── landing-page.md            # Copy strony programu
│   └── specs/                         # Specyfikacje techniczne
│       ├── user-flow.md               # Flow użytkownika programu
│       ├── editor-spec.md             # Specyfikacja edytora TipTap
│       └── autosave-encryption-spec.md # Autosave + szyfrowanie
│
├── content/                           # Treści (pliki Markdown)
│   ├── posts/                         # Posty karuzelowe (Markdown + frontmatter)
│   ├── introductions/                 # Wprowadzenia psychoedukacyjne (3 moduły)
│   └── blog/                          # Artykuły psychoedukacyjne
│
├── supabase/
│   └── migrations/                    # Migracje SQL (user_profiles)
│
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Feed / strona główna
│   │   ├── post/[slug]/              # Pojedynczy post
│   │   ├── favorites/                 #   Ulubione (EN)
│   │   ├── ulubione/                  #   Ulubione (PL)
│   │   ├── program/                   # The Life Writing Program
│   │   │   ├── page.tsx              #   Landing / opis programu
│   │   │   ├── layout.tsx            #   Layout z SafetyBanner + nav
│   │   │   ├── onboarding/           #   Onboarding (4 kroki)
│   │   │   ├── dashboard/            #   Dashboard użytkownika
│   │   │   ├── modul/[slug]/         #   Widok modułu
│   │   │   ├── cwiczenie/[id]/       #   Widok ćwiczenia (edytor TipTap)
│   │   │   ├── zasoby/              #   Linie wsparcia, FAQ, książki
│   │   │   └── auth/callback/        #   Supabase OAuth callback
│   │   ├── admin/                     # Panel admina
│   │   └── api/
│   │       ├── auth/                  # Auth endpoints (login, logout, check)
│   │       ├── posts/                 # GET lista postów (offset pagination)
│   │       ├── slides/                # Serwowanie PNG
│   │       ├── newsletter/            # MailerLite
│   │       └── program/               # API programu pisania
│   │           ├── responses/[exerciseId]  # GET + PUT (szyfrowane)
│   │           ├── progress/               # GET all + PUT per exercise
│   │           ├── data-export/            # Eksport RODO (JSON)
│   │           ├── account/                # DELETE konto
│   │           └── profile/                # GET + PUT profil (gender_form)
│   ├── lib/
│   │   ├── auth.ts                    # JWT admin auth
│   │   ├── i18n.ts                    # Słownik en/pl
│   │   ├── posts.ts                   # Loader postów z plików MD
│   │   ├── palettes.ts               # Palety kolorów (config)
│   │   ├── regenerate-slide.ts        # Regeneracja slajdu (on-demand)
│   │   ├── storage.ts                 # I/O plików PNG
│   │   ├── fonts.ts                   # Fonty Satori
│   │   ├── constants.ts               # Design tokens
│   │   ├── supabase.ts                # Supabase browser client
│   │   ├── supabase-server.ts         # Supabase server client (cookies)
│   │   ├── encryption.ts              # AES-256-GCM (PBKDF2)
│   │   ├── exercises.ts               # Ładowanie YAML ćwiczeń
│   │   ├── program-auth.ts            # requireProgramUser() helper
│   │   ├── personalize.ts             # Personalizacja (feminine/masculine/neutral)
│   │   ├── local-storage.ts           # Offline fallback dla odpowiedzi
│   │   ├── rate-limit.ts              # In-memory rate limiter
│   │   ├── content-sections.ts        # Parsowanie sekcji slajd/web
│   │   ├── slug.ts                    # Generator slugów (polskie znaki)
│   │   ├── categories.ts               # Definicje kategorii + FAVORITES_KEY
│   │   └── utils.ts                   # clsx/tailwind-merge helper
│   ├── templates/                     # Satori JSX szablony slajdów
│   ├── components/
│   │   ├── feed/                      # Publiczny feed
│   │   │   ├── carousel-viewer.tsx
│   │   │   ├── content-text.tsx
│   │   │   ├── feed-skeleton.tsx
│   │   │   ├── infinite-feed.tsx
│   │   │   ├── language-dropdown.tsx
│   │   │   ├── newsletter-form.tsx
│   │   │   ├── post-card.tsx
│   │   │   ├── post-lang-switcher.tsx
│   │   │   ├── share-button.tsx
│   │   │   ├── like-button.tsx
│   │   │   └── like-context.tsx
│   │   ├── program/                   # Komponenty programu
│   │   │   ├── exercise-editor.tsx    #   TipTap wrapper z autosave
│   │   │   ├── exercise-view.tsx      #   Widok ćwiczenia (pytania, stuck helpers)
│   │   │   ├── editor-toolbar.tsx     #   Bold/Italic/List toolbar
│   │   │   ├── save-status.tsx        #   Wskaźnik zapisu (idle/saving/saved/error)
│   │   │   ├── progress-bar.tsx       #   Pasek postępu
│   │   │   ├── safety-banner.tsx      #   Stały banner z liniami kryzysowymi
│   │   │   ├── content-warning.tsx    #   Bramka ostrzeżeń przed ćwiczeniem
│   │   │   ├── post-exercise-flow.tsx #   Refleksja → check-in → grounding
│   │   │   ├── emotional-checkin.tsx   #   3-opcyjny check emocjonalny
│   │   │   ├── grounding-exercise.tsx  #   Technika 5-4-3-2-1
│   │   │   ├── disclaimer-gate.tsx    #   Standalone disclaimer
│   │   │   └── profile-initializer.tsx #   Zapis gender_form z OAuth
│   │   ├── ui/                        # shadcn/ui komponenty
│   │   └── site-header.tsx            # Nagłówek strony
│   ├── hooks/
│   │   ├── use-infinite-posts.ts      # Infinite scroll
│   │   ├── use-autosave.ts            # 5s debounce + 30s interval + offline fallback
│   │   └── use-sync-recovery.ts       # Detekcja nowszego local backup
│   ├── scripts/                       # Utility CLI
│   └── middleware.ts                  # Security headers + admin auth + Supabase session
│
├── data/slides/                       # Wygenerowane PNG (persistent volume)
├── public/fonts/                      # Fonty Satori (.woff)
└── Dockerfile                         # Multi-stage build
```

## Fundament Naukowy — Program Pisania

Każde ćwiczenie programu MUSI być osadzone w co najmniej jednej z tych teorii:

- Ekspresywne pisanie (Pennebaker, 1997, 2004)
- Tożsamość narracyjna (McAdams, 2001)
- Wzrost potraumatyczny (Tedeschi & Calhoun, 2004)
- ACT — Terapia Akceptacji i Zaangażowania (Hayes et al.)
- Mindful Self-Compassion (Neff, 2003)
- Teoria autodeterminacji SDT (Deci & Ryan)
- Mental Contrasting + Implementation Intentions (Oettingen, WOOP; Gollwitzer, 1999)
- Ciągłość przyszłego Ja (Hershfield)
- CBT — restrukturyzacja poznawcza (Beck)
- Psychologia pozytywna — siły charakteru (Seligman, Peterson)
- Ruminacja vs refleksja (Trapnell & Campbell)
- Dystansowanie poznawcze / self-distancing (Kross & Ayduk, 2011)
- Compassion Focused Therapy — CFT (Gilbert, 2009)
- Efekt backdraft w ćwiczeniach współczucia (Germer & Neff, 2013)

## Struktura Programu Pisania

```
Ćwiczenie bramkowe: „5 Minut dla Siebie"
Moduł I:   PRZESZŁOŚĆ     — „Zrozum swoją historię" (6 ćwiczeń)
Moduł II:  TERAŹNIEJSZOŚĆ — „Zrozum, gdzie stoisz" (6 ćwiczeń)
Moduł III: PRZYSZŁOŚĆ     — „Zaprojektuj siebie" (6 ćwiczeń)
```

## Format Ćwiczeń (YAML)

Każde pytanie w ćwiczeniu ma trzy pola:
- `text` - treść pytania
- `estimated_time` - szacowany czas (renderowany zaokrąglony do 5 minut)
- `min_chars` - minimalna liczba znaków (wewnętrzny parametr, nie blokada)

Przykład:
```yaml
prompt_questions:
  - text: "Opisz moment przełomowy..."
    estimated_time: "8-12 minut"
    min_chars: 100
```

- `min_chars` odsiewuje puste/testowe odpowiedzi, nie wymusza rozpisywania się
- Przycisk "Zakończ ćwiczenie" jest disabled gdy minimum nie jest spełnione
- gate_00 jest zwolnione ze wszystkich minimów
- Max znaków = max(min_chars × 10, 2000) — obliczany automatycznie

## Dane

| Źródło | Technologia | Co przechowuje |
|--------|------------|----------------|
| **Pliki MD** | Markdown + gray-matter | Posty karuzelowe (content/posts/*.md) |
| **Pliki config** | TypeScript | Palety kolorów (src/lib/palettes.ts) |
| **Filesystem** | PNG (data/slides/) | Slajdy generowane przez Satori |
| **Supabase** | PostgreSQL + Auth + RLS | Użytkownicy, sesje, zaszyfrowane treści programu, postęp |

Posty = pliki Markdown w repozytorium. Slajdy = deterministyczne PNG ({slug}-slide-{nr}.png).

## Autentykacja - Dwie warstwy

| Warstwa | Technologia | Kto | Jak |
|---------|------------|-----|-----|
| **Admin** | JWT (jose + bcryptjs) | Jeden admin | Hasło → httpOnly cookie |
| **Program** | Supabase Auth | Użytkownicy programu | Magic link + Google OAuth |

## Szyfrowanie Treści Programu

- **Algorytm:** AES-256-GCM server-side
- **Klucz:** `PBKDF2(APP_SECRET + user_id, random_salt, 600000)`
- **APP_SECRET:** WYŁĄCZNIE w env var Coolify — NIGDY w kodzie, DB, logach, repozytorium
- **Model zagrożeń:** wyciek DB = bezużyteczny ciphertext, wyciek kodu = brak klucza
- **Szczegóły:** `docs/specs/autosave-encryption-spec.md`

## Zasady Bezpieczeństwa — NIGDY NIE ŁAM

1. **Szyfrowanie treści w DB** — AES-256-GCM, APP_SECRET w env var Coolify
2. **APP_SECRET tylko w env var** — NIGDY w kodzie, NIGDY w bazie, NIGDY w logach
3. **Zero tracking** — brak Google Analytics, brak cookies śledzących, brak telemetrii
4. **RODO/GDPR compliance** — prawo do zapomnienia, eksport danych, minimalizacja danych
5. **Disclaimery widoczne** — „Nie zastępuje psychoterapii" na KAŻDYM ekranie ćwiczenia
6. **Linie kryzysowe** — Telefon Zaufania (116 123), Centrum Wsparcia (800 70 2222) — łatwo dostępne
7. **Autosave** — nigdy nie trać tekstu użytkownika, autosave co 30 sekund
8. **Brak presji** — zero timerów, streaks, gamifikacji opartej na presji

## Zasady Trauma-Informed Design (Program)

- Użytkownik ZAWSZE wie, co go czeka (preview trudności ćwiczenia)
- Przycisk „Pomiń" / „Wróć później" przy KAŻDYM ćwiczeniu
- Ton partnerski, NIGDY dyrektywny
- Brak toksycznej pozytywności („Dasz radę!", „Wszystko będzie dobrze!")
- Walidacja emocji bez minimalizowania doświadczeń
- Podpowiedzi ratunkowe (stuck helpers) dla osób, które utknęły podczas pisania
- Stopniowanie trudności: łatwiejsze ćwiczenia → trudniejsze
- Po głębokim ćwiczeniu → łagodniejsze (nigdy nie zostawiaj w głębi)

## i18n

- **Cała platforma:** en/pl (dict w `src/lib/i18n.ts`)
- **Ćwiczenia YAML:** obecnie tylko pl — wersja en do stworzenia
- **Instagram:** @justhavealittlemeaning (po angielsku)
- **Nazwy i hasło:** zawsze po angielsku (Just have a little meaning, The Life Writing Program)

## Standardy Kodowania

- TypeScript strict mode ZAWSZE
- Functional components, React hooks
- Server Components domyślnie, Client Components tylko gdy potrzebne
- Tailwind CSS v4 — nie pisz custom CSS chyba że absolutnie konieczne
- shadcn/ui jako bazowa biblioteka komponentów
- Nazwy zmiennych/funkcji po angielsku
- Treści użytkownikowe (ćwiczenia, copy) — en/pl
- Commit messages w konwencji Conventional Commits (feat, fix, docs, chore)

## Sub-Agent Routing Rules

**Parallel dispatch** (gdy WSZYSTKIE warunki spełnione):
- 3+ niezależnych zadań z różnych domen
- Brak współdzielonego stanu między zadaniami
- Jasne granice plików — brak overlap

**Sequential dispatch** (gdy JAKIKOLWIEK warunek zachodzi):
- Zadania mają zależności (B wymaga outputu z A)
- Współdzielone pliki lub stan
- Niejasny zakres — najpierw zrozum, potem działaj

**Typowe wzorce:**
- Treści psychologiczne → ZAWSZE sekwencyjnie: psycholog-badawczy → terapeuta-narracyjny → edukator
- Frontend + Backend → MOGĄ równolegle gdy niezależne endpointy
- QA → ZAWSZE na końcu
- Copywriter → MOŻE równolegle z devami

## Komendy

```bash
npm run dev              # Development server
npm run build            # Production build
npm start                # Run production
npm run lint             # ESLint
npm test                 # Vitest

# Posty karuzelowe
npx tsx src/scripts/generate-slides.ts <slug>    # Generuj slajdy dla jednego posta
npx tsx src/scripts/generate-slides.ts --all      # Generuj slajdy dla wszystkich
```

**WAŻNE — po dodaniu/edycji posta:**
Po każdym stworzeniu lub zmianie pliku `content/posts/{slug}.md` ZAWSZE uruchom generowanie slajdów:
```bash
npx tsx src/scripts/generate-slides.ts {slug}
```
Bez tego post nie będzie miał slajdów PNG i karuzela się nie wyświetli.

## Deployment (Coolify)

- **Docker**: multi-stage build (Alpine + libc6-compat)
- **Output**: `standalone`
- **Port**: 3000
- **Persistent volume**: `/data/slides` (PNG karuzel)
- **ENV vars**: `ADMIN_PASSWORD`, `ADMIN_EMAIL`, `JWT_SECRET`, `STORAGE_PATH`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_SECRET`, `MAILERLITE_API_TOKEN`, `NEXT_PUBLIC_SITE_URL`
