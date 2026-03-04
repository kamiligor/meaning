# [LEGACY] Plan: Just have a little meaning — Next.js Instagram Carousel Platform (justmeaning.com)

> **Ten plik jest nieaktualny (legacy).** Opisuje pierwotny plan z fazy, gdy projekt był tylko generatorem karuzel IG.
> Aktualny stan projektu: patrz `CLAUDE.md`.

---

## Kontekst

Obecny stan: jeden plik HTML (`index.html`) - generator karuzel IG z 4 slajdami (1080x1350px), design system (sage/slate), logo w wariantach light/dark/ghost, fonty Outfit + Fraunces + Libre Baskerville.

Cel: przerobienie na pełny Next.js projekt z **publicznym portalem** (feed z infinite scroll + karuzele) i **panelem admina** (generator obrazków z szablonów).

## Stack technologiczny

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **DB**: Turso (LibSQL) + Drizzle ORM
- **Generowanie obrazków**: Satori + @resvg/resvg-js (JSX -> SVG -> PNG, server-side)
- **Auth**: JWT w httpOnly cookie, jedno hasło admina (jose + bcryptjs)
- **Hosting**: Coolify na Hostingerze (Docker, standalone output)

## Struktura projektu

```
jh/
├── drizzle/                        # Migracje
├── public/fonts/                   # Fonty do Satori (.woff2/.ttf)
│   ├── Outfit-Regular.woff2
│   ├── Outfit-SemiBold.woff2
│   ├── Fraunces-ExtraBold.woff2
│   └── LibreBaskerville-Italic.woff2
├── src/
│   ├── app/
│   │   ├── page.tsx                # Publiczny feed (infinite scroll)
│   │   ├── post/[slug]/page.tsx    # Pojedynczy post
│   │   ├── admin/
│   │   │   ├── login/page.tsx      # Logowanie
│   │   │   ├── page.tsx            # Dashboard (lista postów)
│   │   │   ├── posts/new/page.tsx  # Nowy post (edytor szablonów)
│   │   │   └── posts/[id]/edit/page.tsx
│   │   └── api/
│   │       ├── auth/{login,logout,check}/route.ts
│   │       ├── posts/route.ts      # GET (paginacja) + POST (tworzenie)
│   │       ├── posts/[id]/route.ts # GET/PUT/DELETE
│   │       ├── posts/[id]/generate/route.ts  # Generowanie PNG
│   │       └── slides/[filename]/route.ts    # Serwowanie PNG
│   ├── db/
│   │   ├── schema.ts               # Tabele: posts, slides, color_palettes
│   │   └── index.ts                # Drizzle client (Turso)
│   ├── lib/
│   │   ├── auth.ts                 # JWT sign/verify, cookie helpers
│   │   ├── fonts.ts                # Ładowanie buforów fontów dla Satori
│   │   ├── generate-slides.ts      # Orkiestrator: template -> Satori -> resvg -> PNG
│   │   ├── storage.ts              # Zapis/odczyt PNG z dysku
│   │   └── constants.ts            # Kolory, wymiary, rozmiary fontów
│   ├── templates/                  # Satori JSX szablony (NIE React DOM)
│   │   ├── slide-title.tsx         # Slajd 1: Tytuł (jasne tło, ikona, headline)
│   │   ├── slide-content.tsx       # Slajd 2: Treść (ciemne tło, highlights)
│   │   ├── slide-quote.tsx         # Slajd 3: Cytat (kręgi, orbit dots)
│   │   ├── slide-cta.tsx           # Slajd 4: CTA (logo, follow button)
│   │   └── components/
│   │       ├── logo-mark.tsx       # Logo w JSX dla Satori
│   │       ├── watermark.tsx       # Watermark
│   │       └── svg-icons.tsx       # Ikony (clock, sun, brain, heart)
│   ├── components/                 # React UI komponenty
│   │   ├── feed/
│   │   │   ├── carousel-viewer.tsx # Swipeable karuzela (pointer events)
│   │   │   ├── post-card.tsx       # Karta postu (karuzela + caption)
│   │   │   ├── infinite-feed.tsx   # Infinite scroll (Intersection Observer)
│   │   │   └── feed-skeleton.tsx   # Loading skeleton
│   │   └── admin/
│   │       ├── post-form.tsx       # Edytor szablonu (formularz)
│   │       ├── slide-preview.tsx   # Podgląd slajdu (HTML, nie Satori)
│   │       ├── color-picker.tsx    # Wybór palety kolorów
│   │       └── post-list-table.tsx # Tabela postów w dashboardzie
│   ├── hooks/
│   │   └── use-infinite-posts.ts   # Hook do infinite scroll
│   └── middleware.ts               # Ochrona /admin/* i API routes
├── Dockerfile                      # Multi-stage build
├── drizzle.config.ts
└── .env.local                      # TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, ADMIN_PASSWORD, JWT_SECRET
```

## Schema bazy danych (Drizzle)

### Tabela `posts`

| Kolumna | Typ | Opis |
|---------|-----|------|
| id | INTEGER PK | Auto-increment |
| slug | TEXT UNIQUE | URL-friendly slug |
| status | TEXT | 'draft' \| 'published' |
| topicTag | TEXT | "Psychology Life Hack" |
| headline | TEXT | "Keep a {Consistent} Wake-Up Time" (klamry = kolor akcentu) |
| subtitle | TEXT | "Swipe to learn why" |
| iconType | TEXT | 'clock' \| 'sun' \| 'brain' \| 'heart' \| 'none' |
| contentTag | TEXT | "Why it works" |
| contentBody | TEXT | Treść z {highlight} markerami |
| sectionNumber | TEXT | "01" |
| quote | TEXT | Cytat z {accent} markerami |
| quoteAttribution | TEXT | "— Your daily routine" |
| ctaText | TEXT | "Follow for {more} psychology life hacks" |
| hashtags | TEXT | JSON array hashtagów |
| caption | TEXT | Pełny tekst caption na IG |
| colorPalette | TEXT | 'sage' \| 'slate' \| 'warm' itp. |
| logoVariant | TEXT | 'light' \| 'dark' |
| createdAt, updatedAt, publishedAt | TEXT | Timestamps |

### Tabela `slides` (wygenerowane obrazki)

| Kolumna | Typ | Opis |
|---------|-----|------|
| id | INTEGER PK | Auto-increment |
| postId | INTEGER FK | -> posts.id (CASCADE) |
| slideNumber | INTEGER | 1-4 |
| filename | TEXT | "post-17-slide-1-abc123.png" |
| filePath | TEXT | Ścieżka na dysku |
| fileSize | INTEGER | Bajty |
| generatedAt | TEXT | Timestamp |

### Tabela `color_palettes`

| Kolumna | Typ | Opis |
|---------|-----|------|
| id | TEXT PK | 'sage', 'slate', itp. |
| name | TEXT | "Sage Green" |
| primary, primaryLight, primaryPale | TEXT | Kolory główne (#7B9E8C, #a3c4b3, #e8f0eb) |
| secondary, secondaryLight, secondaryPale | TEXT | Kolory drugorzędne |
| textDark, textMid, textLight | TEXT | Kolory tekstu |
| bgWhite, bgCool | TEXT | Kolory tła |

## Pipeline generowania obrazków

```
Post data + Color palette
        ↓
  Template JSX (slide-title.tsx, slide-content.tsx, ...)
        ↓
  satori(jsx, { width: 1080, height: 1350, fonts })  →  SVG string
        ↓
  new Resvg(svg).render().asPng()  →  PNG Buffer
        ↓
  saveFile("post-{id}-slide-{n}-{hash}.png", buffer)  →  /data/slides/
        ↓
  INSERT INTO slides (postId, slideNumber, filename, ...)
```

### Konwencja formatowania tekstu w DB

Klamry `{text}` oznaczają słowa do wyróżnienia:
- Slide 1 headline: `{Consistent}` → kolor akcentu (sage)
- Slide 2 content: `{the same time}` → highlight (tło + jasny kolor)
- Slide 3 quote: `{begins}` → kolor akcentu
- Slide 4 CTA: `{more}` → kolor akcentu

### Ograniczenia Satori do obejścia

- Brak `radial-gradient` → zastąpione solidnym kółkiem z opacity
- Brak `::before`/`::after` → jawne elementy dzieci
- Brak `text-align: center` na zawijanych wierszach → flex wrap + justify center
- Brak `box-shadow` (ograniczone) → pomijamy dekoracyjne cienie
- Fonty: wymagane statyczne pliki (.woff2/.ttf), NIE variable fonts

## Karuzela publiczna (carousel-viewer.tsx)

- Pointer events (pointerdown/pointermove/pointerup) do swipe'owania
- Strzałki lewo/prawo overlaid na krawędziach
- Dot indicators na dole (aktywny slajd podświetlony)
- Nawigacja klawiaturą (lewo/prawo gdy focused)
- CSS: `translateX(-${currentIndex * 100}%)` z transition
- Aspect ratio 4:5 (CSS `aspect-ratio: 4/5`)
- Bez bibliotek — czyste pointer events, ~4 slajdy na karuzeli

## Infinite scroll (infinite-feed.tsx)

- Intersection Observer na sentinel div na dole feedu
- Cursor-based pagination: `GET /api/posts?cursor={lastId}&limit=10`
- Pierwsze 10 postów SSR (server component), reszta client-side
- Skeleton loading podczas ładowania

## Deployment na Coolify

- **Dockerfile**: multi-stage build (deps → build → runner)
- **next.config.mjs**: `output: 'standalone'` + `serverComponentsExternalPackages: ['@resvg/resvg-js']`
- **Persistent volume**: mount `/data/slides` (wygenerowane PNG)
- **ENV variables** w Coolify UI: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_PASSWORD`, `JWT_SECRET`, `STORAGE_PATH=/data/slides`
- **Port**: 3000
- **Alpine + libc6-compat** dla @resvg/resvg-js

### Dockerfile

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN mkdir -p /data/slides
ENV STORAGE_PATH=/data/slides
EXPOSE 3000
CMD ["node", "server.js"]
```

## Fazy implementacji

### Faza 1: Fundament

- Init Next.js + TypeScript + Tailwind
- Instalacja deps: `drizzle-orm @libsql/client satori @resvg/resvg-js jose bcryptjs`
- Schema DB + migracja (`drizzle-kit push`)
- Seed palety "sage" do tabeli color_palettes
- Auth (JWT, middleware, /admin/login)
- Podstawowy dashboard admina

### Faza 2: Silnik generowania obrazków

- Ładowanie fontów (public/fonts/)
- Shared components szablonów (logo-mark, watermark, svg-icons)
- 4 szablony Satori (slide-title, slide-content, slide-quote, slide-cta)
- Orkiestrator generate-slides.ts
- API: POST /api/posts/[id]/generate + GET /api/slides/[filename]
- Test: porównanie wizualne z oryginałem HTML

### Faza 3: Admin CRUD i edytor

- API CRUD dla postów
- Formularz edytora (post-form.tsx) z podglądem na żywo
- Color picker, lista postów
- Flow: create → fill → save → generate → preview → publish

### Faza 4: Publiczny feed

- Carousel viewer (swipe + arrows + dots)
- Post card + infinite feed + skeleton
- Strona główna (SSR + client hydration)
- Strona pojedynczego postu (/post/[slug])
- Responsive mobile-first
- Open Graph meta tags

### Faza 5: Polish i deploy

- Dockerfile + deploy na Coolify
- Więcej palet kolorów i ikon
- Cache headers na obrazkach
- Seed przykładowego posta z index.html
- Test end-to-end

## Weryfikacja

1. **Generowanie**: wygenerowane PNG powinny wizualnie odpowiadać slajdom z oryginalnego HTML
2. **Feed**: karuzela działa na mobile (touch swipe) i desktop (strzałki + klawiatura)
3. **Infinite scroll**: kolejne strony ładują się płynnie przy scrollowaniu
4. **Admin**: pełen flow create → generate → publish → widoczne na feedzie
5. **Deploy**: `docker build` + Coolify deploy bez błędów, persistent volume działa
