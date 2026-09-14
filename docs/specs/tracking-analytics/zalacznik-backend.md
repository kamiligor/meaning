# Analityka pierwszoosobowa + tagi użytkowników — projekt

Zasada przewodnia: zero trackerów firm trzecich, minimum surowych danych, agregaty
zamiast danych osobowych tam gdzie się da. Wzorzec z repo: migracje SQL jak
`post_comments`/`course_*`, route handlery jak `src/app/api/course/*`, cron przez
Bearer `CRON_SECRET` jak `/api/course/reminders`, RLS „enable, brak polityk" gdy
dostęp ma mieć wyłącznie service role.

## 1. Model danych

**Kluczowa decyzja:** lejek kursów (`course_enroll`, `course_day_start/complete`,
`course_complete`) **nie jest osobnym zdarzeniem**. Te fakty już istnieją z
dokładnym czasem w `course_enrollments.enrolled_at/completed_at` i
`course_day_progress.started_at/completed_at`. Duplikowanie ich jako eventy
łamałoby DRY i podwajało zapisy. Agregat czyta wprost z tych tabel. Tabela
zdarzeń surowych jest potrzebna tylko tam, gdzie nie ma innej tabeli:
`post_view`, `post_read`, `login`.

```sql
-- Surowe zdarzenia, retencja 90 dni. Bez cookie: anonimowy odwiedzający jest
-- identyfikowany hashem, zalogowany — user_id.
CREATE TABLE analytics_events (
  id           BIGSERIAL PRIMARY KEY,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type   TEXT NOT NULL CHECK (event_type IN ('post_view','post_read','login')),
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- sha256(dzienna_sól + ip + user-agent), tylko dla anonimowych odwiedzin
  visitor_hash TEXT,
  locale       TEXT CHECK (locale IN ('en','pl')),
  target_id    TEXT,      -- slug posta
  meta         JSONB,     -- np. {"depth":"end"} dla post_read
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type_time ON analytics_events (event_type, occurred_at);
CREATE INDEX idx_analytics_events_target ON analytics_events (target_id, occurred_at) WHERE target_id IS NOT NULL;
CREATE INDEX idx_analytics_events_user ON analytics_events (user_id) WHERE user_id IS NOT NULL;

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
-- Świadomie zero polityk: anon i authenticated nie mają żadnego dostępu.
-- Zapis i odczyt wyłącznie przez service role (omija RLS) w route handlerach.
```

**Anonimowy odwiedzający bez cookie:** `visitor_hash = sha256(dailySalt + '|' + ip + '|' + userAgent)`.
`dailySalt = sha256(APP_SECRET + '|' + YYYY-MM-DD w Europe/Warsaw)` — liczony w
locie, **nigdy nie zapisywany w DB**. Rotacja jest więc automatyczna: ten sam
odwiedzający dostaje inny hash następnego dnia, więc nie da się go śledzić
między dniami, a samo IP nigdy nie trafia do bazy (tylko jego nieodwracalny,
jednodniowy hash). IP czytane z `x-forwarded-for` (Coolify/Docker za proxy),
tak jak `src/lib/domains.ts` czyta już `x-forwarded-host`.

```sql
-- Agregaty dobowe — jedna elastyczna tabela zamiast wielu wąskich, bo skala
-- (kilka tys. odwiedzin/mies.) nie uzasadnia osobnych tabel na każdy wymiar.
CREATE TABLE analytics_daily_stats (
  day           DATE NOT NULL,
  metric        TEXT NOT NULL,              -- 'post_view' | 'post_read' | 'login' | 'active_accounts'
                                              -- | 'course_enroll' | 'course_day_start'
                                              -- | 'course_day_complete' | 'course_complete'
  dimension     TEXT NOT NULL DEFAULT '',    -- slug posta / slug kursu
  locale        TEXT NOT NULL DEFAULT '',
  extra         TEXT NOT NULL DEFAULT '',    -- np. numer dnia kursu jako tekst
  count         INTEGER NOT NULL DEFAULT 0,
  unique_count  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, metric, dimension, locale, extra)
);
ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;
-- j.w.: brak polityk, tylko service role.
```

Retencja i sprzątanie: bez partycjonowania — przy tej skali (rząd 10–20 tys.
wierszy w `analytics_events` w oknie 90 dni) to niepotrzebna złożoność. Cron
`/api/analytics/aggregate` (CRON_SECRET) raz dziennie: (1) zlicza wczorajszy
dzień do `analytics_daily_stats` z `analytics_events` (post_view/read/login) i
bezpośrednio z tabel kursów (enroll/day/complete), (2) dopiero potem
`DELETE FROM analytics_events WHERE occurred_at < now() - interval '90 days'`.
Agregaty nigdy nie zawierają danych osobowych, więc trzymane są bez limitu.

```sql
-- Tagi pod kampanie MailerLite.
CREATE TABLE user_tags (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL,
  source     TEXT NOT NULL CHECK (source IN ('auto','manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at  TIMESTAMPTZ,   -- ostatni udany push do MailerLite
  PRIMARY KEY (user_id, tag)
);
CREATE INDEX idx_user_tags_tag ON user_tags (tag);
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;  -- brak polityk, service role

-- Opcjonalny słownik tagów — dokumentacja + walidacja w panelu admina.
CREATE TABLE tag_definitions (
  tag         TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('auto','manual'))
);
```

`user_id` w `analytics_events` ma `ON DELETE SET NULL` (jak `post_comments`) —
usunięcie konta anonimizuje wpisy zamiast psuć agregaty. `user_tags` ma
`ON DELETE CASCADE` — tag istnieje wyłącznie po to, by celować w konkretną
osobę, więc po usunięciu konta nie ma powodu go trzymać.

## 2. Zbieranie zdarzeń

Minimalna lista: `post_view`, `post_read`, `login` (surowe); `course_enroll`,
`course_day_start`, `course_day_complete`, `course_complete`, `course_feedback`
(pochodne z istniejących tabel, bez nowego zapisu).

**Serwerowo, bez JS:**
- `login` — zapis w `src/app/program/auth/callback/route.ts`, zaraz po
  udanym `exchangeCodeForSession`, gdy znamy `user.id`. To jedyny callback
  logowania na całej platformie (magic link i Google OAuth), więc pokrywa
  wszystkie wejścia; nie odpala się przy cichym odświeżeniu tokenu.
- `post_view` — w `src/app/post/[slug]/page.tsx` (Server Component) po
  ustaleniu `post`. Trzeba pominąć prefetch Next: sprawdzić nagłówek
  `next-router-prefetch` z `headers()` i nie zapisywać zdarzenia, gdy jest
  obecny. Filtr botów: lista fragmentów User-Agent (`bot|crawl|spider|slurp|
  facebookexternalhit|whatsapp|telegram|preview`) — dopasowanie pomija zapis.
  Insert owinięty w `try/catch`, błąd analityki nigdy nie wywala renderu strony.

**Beacon (wymaga JS w przeglądarce):**
- `post_read` — dociera się do ostatniego slajdu karuzeli / końca artykułu;
  `CarouselViewer`/`ContentText` wywołuje `navigator.sendBeacon("/api/t", payload)`
  jednorazowo (flaga w komponencie). Naturalnie odsiewa boty bez silnika JS.

```ts
// POST /api/t — jedyny endpoint na klienta z beaconem, celowo wąski.
const BeaconSchema = z.object({
  event: z.literal("post_read"),   // na razie jeden dozwolony typ
  targetId: z.string().min(1).max(200),
  locale: z.enum(["en", "pl"]),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`beacon:${ip}`, { maxRequests: 30, windowMs: 60_000 });
  if (!allowed) return new NextResponse(null, { status: 204 }); // nie karmimy botów błędami

  const parsed = BeaconSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 204 });

  const visitorHash = await dailyVisitorHash(request); // patrz sekcja 1
  // Dedup w oknie: ten sam odwiedzający + post nie liczy się częściej niż raz/60s —
  // ponowne użycie istniejącego in-memory limitera zamiast nowego mechanizmu.
  const dedupKey = `pv:${visitorHash}:${parsed.data.targetId}`;
  if (!checkRateLimit(dedupKey, { maxRequests: 1, windowMs: 60_000 }).allowed) {
    return new NextResponse(null, { status: 204 });
  }

  const admin = getSupabaseAdmin();
  await admin.from("analytics_events").insert({
    event_type: parsed.data.event,
    target_id: parsed.data.targetId,
    locale: parsed.data.locale,
    visitor_hash: visitorHash,
  });
  return new NextResponse(null, { status: 204 });
}
```

`sendBeacon` nie niesie ciasteczek autoryzacji programu, więc `user_id` przy
`post_read` zwykle jest `null` — to świadomy kompromis: czytelnicy postów w
większości nie są zalogowani, a beacon ma być lekki i nie wymagać sesji.
Rate limit: 30 beaconów/min/IP (wielokrotność normalnego czytania), niezależnie
od globalnego dedupu per odwiedzający+post.

`/api/t` musi zostać dopisany do listy wyjątków w `src/proxy.ts` (dokładne
dopasowanie ścieżki, nie prefiks), bo domyślnie każdy POST pod `/api/` wymaga
tokenu admina — sam route broni się rate limitem i wąskim Zod-schema zamiast
sesji.

## 3. Tagi

**Auto (cron dobowy, po `/api/analytics/aggregate`):**
- `ukonczyl-kurs-{slug}` — `course_enrollments.completed_at IS NOT NULL`.
- `porzucil-{slug}-dzien-{n}` — ukończony dzień `n`, brak `completed_at` kursu,
  a `started_at` dnia `n` jest starsze niż 3 dni bez postępu na `n+1`. Jeśli
  osoba wróci i tag przestaje być prawdziwy, cron go usuwa — ale **tylko
  tagi z `source='auto'`**, ręczne nigdy nie są ruszane automatycznie.
- `czyta-posty-o-{kategoria}` — ≥3 zdarzenia `post_view`/`post_read` z
  `user_id` w tej samej kategorii (z frontmatter posta, `src/lib/posts.ts`) w
  ostatnich 30 dniach.

**Ręczne:** `POST /api/admin/tags` z panelu (JWT admin), `source='manual'`,
np. do ręcznego dopisania kogoś do kampanii. Cron nigdy ich nie kasuje.

**Sync do MailerLite** (`src/lib/tag-sync.ts`, wzorzec `mailerlite.ts` +
`course-reminders.ts`): grupa MailerLite = nazwa tagu. Dwa tryby:
- **Przyrostowy (cron nocny)** — tylko dodaje: dla `user_tags` z
  `synced_at IS NULL` sprawdza w MailerLite, czy subskrybent o tym mailu
  istnieje i ma `status: active` (czyli **realnie wyraził zgodę przez
  double opt-in** — to jedyna reprezentacja zgody, celowo bez własnej,
  drugiej kolumny „marketing_consent", żeby nie duplikować źródła prawdy).
  Jeśli tak: `ensureGroup(tag)`, dopisanie do grupy, `synced_at = now()`.
  Jeśli nie ma subskrypcji: tag zostaje tylko lokalnie, nic nie leci do MailerLite.
- **Pełna rekoncyliacja (przycisk „Synchronizuj" w panelu, `POST /api/admin/tags/sync`)** —
  przed wysyłką kampanii admin klika ręcznie: pobiera aktualnych członków
  grupy z MailerLite i aktualny zestaw tagów z DB, dodaje brakujących,
  usuwa nieaktualnych (np. komuś cofnięto tag `porzucil-...`). Rozdzielenie
  tanie-dodawanie/nocny-cron vs pełna-rekoncyliacja/na-żądanie utrzymuje
  koszt API MailerLite niski, a dokładność wysoką dokładnie wtedy, gdy
  się liczy — przed wysyłką.

## 4. API

| Endpoint | Metoda | Auth |
|---|---|---|
| `/api/t` | POST | publiczny, IP rate-limit + Zod (beacon) |
| `/api/analytics/aggregate` | POST | `Bearer CRON_SECRET`, jak `/api/course/reminders` |
| `/api/tags/apply` | POST | `Bearer CRON_SECRET` — nalicza tagi auto |
| `/api/tags/sync` | POST | `Bearer CRON_SECRET` — sync przyrostowy nocny |
| `/api/admin/stats?range=7d\|30d\|90d` | GET | JWT admina (self-check jak `/api/admin/comments`) |
| `/api/admin/tags` | GET/POST | JWT admina |
| `/api/admin/tags/sync` | POST | JWT admina — pełna rekoncyliacja na żądanie |

`GET /api/admin/stats` czyta z `analytics_daily_stats` (szybkie, stabilne
nawet po czyszczeniu surowych zdarzeń), a bieżący, jeszcze nieagregowany
dzień dolicza „na żywo" prostym `COUNT` z `analytics_events` i tabel kursu —
dashboard nigdy nie pokazuje zera dla „dziś". Wybór crona + tabeli zamiast
SQL view jest celowy: view liczący 90 dni na każde odświeżenie panelu to
niepotrzebna praca przy tej skali, a przede wszystkim **agregat musi przeżyć
czyszczenie surowych zdarzeń** — view przestałby działać dla starszych dni.

## 5. RODO

**Eksport** (`/api/program/data-export`) — dopisać trzy sekcje: `tags` (tag,
source, createdAt z `user_tags`), `loginEvents` (same daty z
`analytics_events` gdzie `event_type='login' AND user_id = user.id`),
`postActivity` (daty i sluga postów z `post_view`/`post_read` powiązanych z
kontem). Bez `visitor_hash` — to techniczny identyfikator, nie treść dla usera.

**Usunięcie konta** (`/api/program/account`) — nie wymaga nowego kodu:
`analytics_events.user_id` ma `ON DELETE SET NULL` (dziedziczy z FK, tak jak
`post_comments`), więc wpisy zostają anonimowe automatycznie; `user_tags` ma
`ON DELETE CASCADE`, znika w całości. Jedyny dopisek do route handlera: krótki
komentarz w kodzie tłumaczący, że to FK, nie ręczny krok (spójnie z istniejącym
stylem komentarzy w tym pliku).

**Retencja:** surowe zdarzenia 90 dni (cron), agregaty bez limitu (nie są
danymi osobowymi), `user_tags` do usunięcia konta lub cofnięcia zgody
marketingowej w MailerLite (przy pełnej rekoncyliacji tag bez aktywnej
subskrypcji przestaje być synchronizowany, ale lokalnie zostaje — do decyzji
właściciela, czy też kasować po X dniach braku zgody; nie jest to wymagane
prawnie, bo lokalny tag bez wysyłki nie jest przetwarzaniem w celu
marketingowym).

## 6. Kolejność wdrożenia

1. **Fundament danych (0,5 dnia).** Migracja: `analytics_events`,
   `analytics_daily_stats`, `user_tags`, `tag_definitions`, RLS bez polityk.
2. **Zbieranie zdarzeń (1 dzień).** `login` w callbacku, `post_view` w stronie
   posta (z filtrem prefetch/botów), `/api/t` + beacon w `CarouselViewer`/
   `ContentText`, wpis w `proxy.ts`.
3. **Agregacja i panel admina (1,5 dnia).** `/api/analytics/aggregate`,
   `GET /api/admin/stats`, prosty widok w `/admin` (liczby, bez wykresów na
   start — YAGNI).
4. **Tagi i MailerLite (1,5 dnia).** `/api/tags/apply`, `/api/tags/sync`,
   `src/lib/tag-sync.ts`, `/api/admin/tags(/sync)`, dopisanie sekcji RODO do
   eksportu.

Razem **~4,5 dnia** dla jednej osoby, przy istniejących wzorcach (cron przez
CRON_SECRET, service role, `checkRateLimit`) do skopiowania, nie wymyślenia
od nowa.
