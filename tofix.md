# To fix — przed launchem justmeaning.com

Lista znalezionych problemów z audytu QA + zaplanowane usprawnienia. Idziemy krok po kroku, odhaczając.

---

## 🔍 SEO + AI search

### Już zrobione ✅
- [x] `sitemap.xml` (auto z postów + kategorii EN/PL)
- [x] `robots.txt` (otwarte poza `/admin`, `/api/`, `/program`)
- [x] Per-page metadata: homepage, category, post (title, description, OG, Twitter)
- [x] Hreflang (`alternates.languages`) dla EN/PL
- [x] Canonical URLs
- [x] **JSON-LD Organization + WebSite** w root layout (Schema.org)
- [x] **JSON-LD Article + BreadcrumbList** na każdym poście (z citation z references)
- [x] **`llms.txt`** route (auto z aktualnymi postami EN+PL, z polityką cytowania)
- [x] References renderowane na stronie postu (HTML, czytelne dla AI)

### Do zrobienia po launchu (manualne, w Twoich rękach)
- [ ] **Google Search Console** — verify domain → submit sitemap (`https://justmeaning.com/sitemap.xml`)
- [ ] **Bing Webmaster Tools** — verify + submit sitemap (Bing zasila ChatGPT search!)
- [ ] **Lighthouse / Core Web Vitals audit** — sprawdzić LCP, CLS na rzeczywistym serwerze
- [ ] Performance: rozważyć `next/image` zamiast `<img>` w carousel-viewer (pre-existing warning)

### Do rozważenia długoterminowo
- [ ] Related posts component na końcu postu (transfer page authority + AI context)
- [ ] Q&A format w nowych postach (lepiej rankuje w AI Overviews) — zmiana w pipeline tworzenia
- [ ] `llms-full.txt` — pełna kopia treści w plain text (gdy będzie więcej postów)
- [ ] Blog z dłuższymi tekstami (3000+ słów) na konkretne keywords

---

## ✅ Już naprawione

- [x] **Build fail** — `tsconfig.json` wykluczał teraz `src/scripts/**` (TS error w `generate-logo.ts`)
- [x] **`metadataBase` na złą domenę** (`meaning.igicode.com` → `justmeaning.com`) + dodane OG/Twitter defaults i title template (`src/app/layout.tsx`)
- [x] **Hardcoded admin email w kodzie** — usunięty fallback w `src/lib/admin-email.ts`, env `ADMIN_EMAIL` wymagany
- [x] **Brak `robots.txt` i `sitemap.xml`** — dodane `src/app/robots.ts` i `src/app/sitemap.ts`
- [x] **`/api/program/simulate-payment` otwarte w prod** — zwraca 404 gdy `NODE_ENV=production`
- [x] **Program zablokowany dla wszystkich poza adminem** (middleware + 7 API routes + frontend)
- [x] **Link "Program" ukryty w nawigacji** dla nie-adminów
- [x] **Kafelek "Go to program" ukryty na `/profil`** dla nie-adminów

---

## 🔴 HIGH — fix przed launch

### 1. ~~`/favorites` brakuje w middleware matcher~~ ✅ FIXED
- **Plik:** `src/middleware.ts` (config.matcher)
- **Problem:** tylko `/ulubione` (PL) jest w matcherze. Dla `/favorites` (EN) sesja Supabase nie odświeża się w middleware → page sam robi `redirect("/login?next=/favorites")`, ale czyta potencjalnie zatęchłe cookies.
- **Fix:** dodać `/favorites` do `matcher` array.

### 2. ~~`carousel-viewer.tsx` — ref accessed during render~~ ✅ FIXED
- **Plik:** `src/components/feed/carousel-viewer.tsx:71,90`
- **Problem:** `containerRef.current?.offsetWidth` i `dragging.current` czytane w render path. 4 lint errors. To główny komponent feedu — może powodować stale rendery i wizualne glitche przy drag/swipe.
- **Fix:** przenieść odczyt do `useEffect` lub `useLayoutEffect`, zsynchronizować przez state.
- **Co zrobiono:** wyeliminowano potrzebę znania szerokości containera — `transform: translateX(${-current*100}%) translateX(${dragOffset}px)` (procent na slajd + piksele na drag). `dragging` ref → `isDragging` state. Brak czytania refów w renderze.

### 3. ~~`/api/newsletter/subscribe` bez rate limitingu~~ ✅ FIXED
- **Plik:** `src/app/api/newsletter/subscribe/route.ts`
- **Problem:** atakujący może spamować MailerLite API → spalanie quoty i farmienie subscriberów.
- **Fix:** dodać `checkRateLimit` z `src/lib/rate-limit.ts` (np. 3 requesty / 10 minut / IP).
- **Co zrobiono:** dodano per-EMAIL rate limit (1 req/h/email) — chroni przed subscription bombing bez NAT/CGNAT collateral. Per-IP nie używamy, bo MailerLite już ma double opt-in. Endpoint zwraca `429` z headerem `Retry-After`.

### 4. ~~Homepage + `/category/[slug]` bez per-page metadata~~ ✅ FIXED
- **Pliki:** `src/app/page.tsx`, `src/app/category/[slug]/page.tsx`, `src/app/kategoria/[slug]/page.tsx`
- **Problem:** brak `generateMetadata` / `metadata` exportu → social shares pokazują pustą kartę OG.
- **Fix:** dodać `generateMetadata()` per route. Dla kategorii: `Title — Just have a little meaning`, opis kategorii, `og:image` (np. domyślny brand asset).
- **Co zrobiono:** dodano `generateMetadata` per locale do homepage i category. OG image = slide-1.png najnowszego posta (dla home) / pierwszego posta w kategorii. `alternates.canonical` + `languages` (hreflang) dla EN/PL. PL category re-eksportuje też `generateMetadata` z EN routes.

### 5. ~~Brak `og:image` w ogóle~~ ⏭️ NIE DOTYCZY
- **Plik:** `public/` lub Satori-generated
- **Problem:** żaden post ani strona nie ma OG image. Linki na social = brzydka pusta karta.
- **Decyzja:** OG image generowany jest dynamicznie ze slide-1 najnowszego/pierwszego posta w danej kategorii (zob. #4). Posty istnieją od początku, więc brak edge case "pusta strona". Default fallback niepotrzebny.

---

## 🟡 MEDIUM — fix wkrótce po launchu

### 6. ~~15 polskich postów bez wygenerowanych slajdów~~ ✅ FIXED
- **Lokalizacja:** `data/slides/`
- **Problem:** posty PL takie jak `cel-porzadkuje-chaos`, `drobne-problemy-nie-sa-takie-drobne`, `smutek-to-nie-awaria` itd. (15 sztuk) nie mają katalogów w `data/slides/`. Slajdy regenerują się on-demand → wolny first load.
- **Fix:** uruchomić lokalnie `npx tsx src/scripts/generate-slides.ts --all` i pushnąć na hosta przez `rsync` przed deployem.
- **Co zrobiono:** wygenerowane wszystkie 31 wariantów (16 grup × en/pl). Pliki w `data/slides/`. **Do zrobienia podczas deploy:** `rsync -avz data/slides/ user@host:/coolify-data/justmeaning/slides/`

### 7. ~~Brak Content-Security-Policy~~ ✅ FIXED
- **Plik:** `src/proxy.ts` (post-rename z middleware.ts)
- **Problem:** są HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy — ale brak CSP. securityheaders.com da grade C lub niżej.
- **Fix:** dodać CSP header z odpowiednimi `script-src`, `style-src`, `img-src`, `connect-src`.
- **Co zrobiono:** dodany CSP z directives: `default-src 'self'`, `script-src 'self' 'unsafe-inline'` (wymagane przez Next.js hydration + JSON-LD), `style-src 'self' 'unsafe-inline'` (Tailwind/next-font), `connect-src 'self' + Supabase host (HTTPS + WSS)`, `frame-ancestors 'none'`, `object-src 'none'`, `upgrade-insecure-requests`. Bez nonces — można dodać w przyszłości dla pełnej redukcji 'unsafe-inline'.

### 8. ~~`<img>` bez alt~~ ✅ FIXED
- **Plik:** `src/templates/components/logo-mark.tsx:116`
- **Problem:** lint error, a11y fail.
- **Fix:** dodano `alt="Just have a little meaning"`.

### 9. ~~Lint errors (`prefer-const`, setState in effect)~~ ✅ FIXED
- **Pliki:**
  - `src/middleware.ts:62` — `let response` → `const`
  - `src/lib/exercises.ts:89` — `let cachedModules` → `const`
  - `src/hooks/use-sync-recovery.ts:30` — `setLocalContent` synchronicznie w `useEffect` (cascading rerender)
- **Fix:** wszystkie naprawione. Dla setState-in-effect: tam gdzie pattern jest świadomy (SSR-safe localStorage read) dodano `eslint-disable-next-line` z komentarzem-uzasadnieniem (use-sync-recovery, newsletter-form, share-button).

### 10. ~~Next.js 16 deprecation: `middleware` → `proxy`~~ ✅ FIXED
- **Plik:** `src/middleware.ts` → `src/proxy.ts`
- **Problem:** Next.js 16.1.6 wyświetla warning: "The 'middleware' file convention is deprecated. Please use 'proxy' instead."
- **Fix:** zmienione: plik przeniesiony na `src/proxy.ts`, eksport funkcji zmieniony na `proxy`. Warning zniknął.

### 11. ~~`/api/posts` bez limitu pagination abuse~~ ⏭️ FALSE ALARM
- **Plik:** `src/app/api/posts/route.ts`
- **Problem:** brak max limit enforce ponad 50, brak rate limit.
- **Sprawdzono:** `Math.min(Number(searchParams.get("limit") || 10), 50)` JEST clampem do 50 (linia 7). QA się pomylił. Endpoint serwuje publiczne dane (te same co sitemap), więc rate limit niekonieczny — DDoS protection lepiej na poziomie Cloudflare.

---

## 🟢 LOW — nice-to-have

### 12. ~~Brak hamburger menu na mobile~~ ✅ FIXED
- **Plik:** `src/components/site-header.tsx`
- **Problem:** desktop nav (`Mission`, kiedyś `Program`) jest `hidden md:flex`. Na mobile users widzą tylko logo + Log In. Mission nieosiągalne z headera.
- **Fix:** dodać Sheet/Drawer z shadcn/ui jako hamburger menu.
- **Co zrobiono:** zamiast hamburgera — usunięto `hidden md:flex` na nav, linki (krótkie `Mission`/`Misja`, opcjonalnie `Program` dla admina) widoczne też na mobile inline. Spacing zmniejszony z `gap-5` → `gap-3 md:gap-5`. Bez dodatkowych komponentów shadcn.

### 13. ~~`<a href="/">` zamiast `<Link>` w onboarding~~ ✅ FIXED
- **Plik:** `src/app/program/onboarding/page.tsx:15`
- **Problem:** powoduje pełną nawigację zamiast client-side routingu. Lint error `@next/next/no-html-link-for-pages`.
- **Fix:** użyć `next/link`. Zmienione na `<Link>`.

### 14. ~~`/favorites`, `/ulubione` bez per-page metadata~~ ✅ FIXED
- **Pliki:** `src/app/favorites/page.tsx`, `src/app/ulubione/page.tsx`
- **Problem:** brak `metadata` exportu → tab pokazuje generic root title.
- **Fix:** dodać `metadata` z odpowiednim tytułem per locale. Dodatkowo `robots: { index: false, follow: false }` (strony per-user, nie indeksowane).

### 15. ~~Cleanup `src/app/ulubione/page.tsx:22`~~ ✅ FIXED
- **Plik:** `src/app/ulubione/page.tsx`
- **Problem:** `const d = t(locale)` — zmienna assigned ale nieużywana. Lint warning.
- **Fix:** usunięta nieużywana zmienna oraz import `t`.

---

## 🆕 Discovered podczas naprawiania (do zrobienia po launchu — admin-only)

Te lint errors nie były na initial QA list, ale wyłapane podczas pełnego `npm run lint`. Wszystkie w komponentach `/program/` które są ukryte za admin-gate, więc nie wpływają na publiczny launch:

### 16. `Date.now()` w `useRef()` initializer
- **Plik:** `src/components/program/exercise-editor.tsx:44`
- **Problem:** `useRef(Date.now())` wywołuje `Date.now()` przy każdym renderze — impure function during render.
- **Fix:** `useRef<number | null>(null)` + ustawić w `useEffect`.

### 17. `<a href>` zamiast `<Link>` w komponentach programu
- **Pliki:** `src/components/program/program-header.tsx:25`, `src/components/program/exercise-editor.tsx:73`
- **Problem:** pełna nawigacja zamiast client-side routing.
- **Fix:** użyć `next/link`.

---

## 🛠️ Pre-deploy checklist (Coolify)

- [ ] Setup aplikacji w Coolify UI (Dockerfile, port 3000)
- [ ] Persistent volume mount: `/data/slides`
- [ ] DNS: A record dla `justmeaning.com` na IP Coolify; CNAME `www` → apex
- [ ] Wygenerować slajdy lokalnie i wgrać na hosta przez rsync (zob. punkt #6)
- [ ] Wkleić env vars (lista poniżej)
- [ ] Supabase → Auth → URL Configuration:
  - Site URL: `https://justmeaning.com`
  - Redirect URLs: `https://justmeaning.com/program/auth/callback`
- [ ] Pierwszy deploy — health check `/` powinien zwrócić 200
- [ ] Test smoke: homepage, post detail, /login, /register, newsletter
- [ ] Sprawdzić, że `/program` redirektuje nie-adminów na `/`
- [ ] Sprawdzić, że admin (`kamiligorkucharski@gmail.com`) ma dostęp do `/program`

### Env vars w Coolify (Production)

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://justmeaning.com

# Admin / auth
ADMIN_PASSWORD=<wygeneruj nowe, mocne>
JWT_SECRET=<wygeneruj 32+ bajty losowe>
ADMIN_EMAIL=kamiligorkucharski@gmail.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<z Supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<z Supabase>
SUPABASE_SERVICE_ROLE_KEY=<z Supabase, tajne>

# Szyfrowanie programu (na przyszłość, jeśli otworzysz)
APP_SECRET=<32+ bajty losowe; NIGDY nie zmieniaj jeśli są zaszyfrowane dane>

# MailerLite (newsletter)
MAILERLITE_API_TOKEN=<z MailerLite>

# Storage
STORAGE_PATH=/data/slides

# Legacy (Turso) — jeśli nie używasz, możesz pominąć
TURSO_DATABASE_URL=<lub puste>
TURSO_AUTH_TOKEN=<lub puste>
```

**NIE wrzucaj** w prod: `INSTAGRAM_LOGIN`, `INSTAGRAM_PASSWORD` — to do lokalnych skryptów.

---

## 📋 Niesprawdzone (do testów manualnych po deployu)

- Supabase RLS policies (wymaga DB access)
- OAuth callback flow + magic link expiry behavior (test runtime)
- MailerLite double-opt-in configuration (dashboard MailerLite)
- Lighthouse scores i contrast ratios
- Trzeci-party requests w devtools (czy nie ma trackerów)
