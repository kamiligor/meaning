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

1. **Feed psychologiczny** — karuzele na Instagram (@justhavealittlemeaning) + strona z rozszerzonymi treściami (psychology life hacks). Istniejący, działający produkt.
2. **The Life Writing Program** — ustrukturyzowany program pisania terapeutycznego oparty na badaniach naukowych (18 ćwiczeń w 3 modułach). W budowie.

Lejek: Instagram (@justhavealittlemeaning) → justmeaning.com (feed + rozszerzone treści) → The Life Writing Program.

## Stack Technologiczny

```
Framework:        Next.js 16+ (App Router), TypeScript, Tailwind CSS v4
UI:               shadcn/ui + custom components
Edytor (program): TipTap (rich text z autosave)
Posty:            Markdown files (content/posts/) + gray-matter
DB (użytkownicy): Supabase (PostgreSQL + Auth + RLS)
Auth (admin):     JWT w httpOnly cookie (jose + bcryptjs)
Auth (program):   Supabase Auth (magic link, Google OAuth)
Obrazki:          Satori + @resvg/resvg-js (JSX → SVG → PNG)
Szyfrowanie:      AES-256-GCM server-side, klucz z APP_SECRET (env var) + user_id
Hosting:          Coolify na Hostingerze (Docker, standalone output)
Newsletter:       MailerLite API
i18n:             en/pl (custom dict w src/lib/i18n.ts)
Testy:            Vitest (unit), Playwright (E2E), axe-core (a11y)
```

## Architektura — Dwa filary, jeden projekt

```
jh/
├── CLAUDE.md                          # Ten plik
├── plan.md                            # Plan architektury platformy karuzel
├── zespol_agentow_projekt.md          # Blueprint agentów (program pisania)
│
├── .claude/
│   ├── settings.local.json            # Uprawnienia lokalne
│   ├── agents/                        # Subagenci (8 — program pisania)
│   │   ├── psycholog-badawczy.md
│   │   ├── terapeuta-narracyjny.md
│   │   ├── copywriter.md
│   │   ├── ux-writer.md
│   │   ├── edukator.md
│   │   ├── frontend-dev.md
│   │   ├── backend-dev.md
│   │   └── qa-tester.md
│   └── commands/
│       ├── new-post.md                # Tworzenie karuzeli
│       └── nowe-cwiczenie.md          # Tworzenie ćwiczenia
│
├── docs/                              # Dokumentacja obu filarów
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
│       └── autosave-encryption-spec.md # Autosave + szyfrowanie v2.0
│
├── content/                           # Treści (pliki Markdown)
│   ├── posts/                         # Posty karuzelowe (Markdown + frontmatter)
│   │   ├── keep-a-consistent-wake-up-time.md  # EN
│   │   └── wstawaj-o-stalej-porze.md          # PL
│   ├── introductions/                 # Wprowadzenia psychoedukacyjne
│   │   ├── przeszlosc.md
│   │   ├── terazniejszosc.md
│   │   └── przyszlosc.md
│   └── blog/                          # Artykuły psychoedukacyjne
│       ├── dlaczego-wspomnienia-wracaja.md
│       ├── ruminacja-vs-refleksja.md
│       ├── ekspresywne-pisanie-nauka.md
│       └── utknales-w-zyciu.md
│
├── src/
│   ├── app/
│   │   ├── (marketing)/               # Landing page, feed (istniejące)
│   │   ├── post/[slug]/               # Pojedynczy post (istniejące)
│   │   ├── program/                   # 🔮 The Life Writing Program
│   │   │   ├── page.tsx               #   Landing / opis programu
│   │   │   ├── dashboard/             #   Dashboard użytkownika
│   │   │   ├── modul/[slug]/          #   Widok modułu
│   │   │   ├── cwiczenie/[id]/        #   Widok ćwiczenia (edytor TipTap)
│   │   │   └── zasoby/               #   Linie wsparcia, FAQ
│   │   ├── admin/                     # Panel admina (istniejące)
│   │   └── api/
│   │       ├── auth/                  # Auth endpoints (istniejące)
│   │       ├── posts/                 # GET lista postów (offset pagination)
│   │       ├── slides/                # Serwowanie PNG (istniejące)
│   │       ├── newsletter/            # MailerLite (istniejące)
│   │       └── program/               # 🔮 API programu pisania
│   │           ├── responses/         #   CRUD odpowiedzi (szyfrowane)
│   │           ├── progress/          #   Postęp użytkownika
│   │           └── data-export/       #   Eksport RODO
│   ├── db/
│   │   ├── schema.ts                  # Drizzle schema (typy Post/Slide/ColorPalette)
│   │   └── index.ts                   # Turso client
│   ├── lib/
│   │   ├── auth.ts                    # JWT admin auth (istniejące)
│   │   ├── i18n.ts                    # Słownik en/pl (istniejące)
│   │   ├── posts.ts                   # Loader postów z plików MD
│   │   ├── palettes.ts               # Palety kolorów (config, nie DB)
│   │   ├── regenerate-slide.ts        # Regeneracja slajdu (on-demand)
│   │   ├── storage.ts                 # I/O plików PNG (istniejące)
│   │   ├── fonts.ts                   # Fonty Satori (istniejące)
│   │   ├── constants.ts               # Design tokens (istniejące)
│   │   ├── supabase.ts                # 🔮 Supabase client
│   │   ├── encryption.ts              # 🔮 AES-256-GCM (APP_SECRET)
│   │   └── exercises.ts               # 🔮 Ładowanie YAML ćwiczeń
│   ├── templates/                     # Satori JSX szablony (istniejące)
│   ├── components/
│   │   ├── feed/                      # Publiczny feed (istniejące)
│   │   ├── admin/                     # Panel admina (istniejące)
│   │   ├── program/                   # 🔮 Komponenty programu
│   │   │   ├── exercise-editor.tsx    #   TipTap wrapper
│   │   │   ├── progress-bar.tsx       #   Pasek postępu
│   │   │   └── safety-banner.tsx      #   Linie kryzysowe
│   │   └── ui/                        # Współdzielone komponenty
│   ├── hooks/
│   │   └── use-infinite-posts.ts      # Infinite scroll (istniejące)
│   ├── scripts/                       # Utility CLI (istniejące)
│   └── middleware.ts                  # Auth middleware
│
├── data/slides/                       # Wygenerowane PNG (persistent volume)
├── public/fonts/                      # Fonty Satori (.woff)
├── drizzle/                           # Migracje Drizzle
└── Dockerfile                         # Multi-stage build
```

Legenda: brak adnotacji = istniejące, 🔮 = do zbudowania.

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

## Dane

| Źródło | Technologia | Co przechowuje |
|--------|------------|----------------|
| **Pliki MD** | Markdown + gray-matter | Posty karuzelowe (content/posts/*.md) |
| **Pliki config** | TypeScript | Palety kolorów (src/lib/palettes.ts) |
| **Filesystem** | PNG (data/slides/) | Slajdy generowane przez Satori |
| **Turso** | LibSQL + Drizzle ORM | (Legacy, schema zachowane dla typów) |
| **Supabase** | PostgreSQL + Auth + RLS | Użytkownicy, sesje, zaszyfrowane treści programu, postęp |

Posty = pliki Markdown w repozytorium. Slajdy = deterministyczne PNG ({slug}-slide-{nr}.png).

## Autentykacja — Dwie warstwy

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

- **Karuzele:** en/pl (istniejące, dict w `src/lib/i18n.ts`)
- **The Life Writing Program:** en/pl (ćwiczenia YAML obecnie tylko pl — wersja en do stworzenia)
- **Instagram:** @justhavealittlemeaning (po angielsku)
- **UI:** wspólny system i18n dla całej platformy
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
npm run db:push          # Drizzle push do Turso
npm run db:studio        # Drizzle Studio

# Posty karuzelowe
npx tsx src/scripts/generate-slides.ts <slug>    # Generuj slajdy dla jednego posta
npx tsx src/scripts/generate-slides.ts --all      # Generuj slajdy dla wszystkich
npx tsx src/scripts/migrate-posts-to-md.ts        # (jednorazowy) Migracja z DB do MD
npx tsx src/scripts/rename-slides.ts              # (jednorazowy) Rename slajdów na deterministyczne nazwy
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
- **ENV vars**: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_PASSWORD`, `JWT_SECRET`, `STORAGE_PATH`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `APP_SECRET`, `MAILERLITE_API_TOKEN`
