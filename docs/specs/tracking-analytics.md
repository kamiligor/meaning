# Statystyki i tagi (first-party). Specyfikacja

Stan: projekt, 2026-09-14. Gałąź `feat/tracking-analytics`. Załączniki z pracy
pięciu agentów (inwentaryzacja, research narzędzi, backend, bezpieczeństwo i
RODO, panel) leżą w `docs/specs/tracking-analytics/`. Ten dokument jest
decyzją i planem; załączniki są uzasadnieniem i szczegółami.

## 1. Cel i zakres

Właściciel chce wiedzieć, bez ActiveCampaign i bez narzędzi firm trzecich:

- ile osób ogląda posty (per post, per język) i ile dociera do końca karuzeli,
- ile osób zakłada konta i loguje się, ile jest aktywnych,
- ile osób zapisuje się na kursy, dochodzi do każdego dnia, kończy i gdzie
  porzuca,
- kto ma jakie tagi, żeby w razie potrzeby wysłać kampanię mailową.

Poza zakresem: mapy cieplne, nagrania sesji, atrybucja kampanii, A/B testy,
śledzenie między domenami, jakiekolwiek dane z programu pisania per użytkownik.

## 2. Decyzja: wbudowane w aplikację, nie osobny serwis

Rozważone: Umami, Plausible CE, PostHog, Matomo (szczegóły w researchu poniżej
i w załączniku). Wybór: **własny, mały moduł w aplikacji**, z trzech powodów.

1. **Bezpieczeństwo i CSP.** `src/proxy.ts` ma `connect-src 'self'` i
   `script-src 'self'`. Własny endpoint nic tu nie zmienia. Każde zewnętrzne
   narzędzie wymaga poluzowania polityki albo reverse proxy pod subdomeną.
2. **Dane kursów już są w bazie.** Lejek kursów wynika wprost z
   `course_enrollments` i `course_day_progress`. Żadne narzędzie nie zrobi tego
   lepiej niż jedno zapytanie SQL, a duplikowanie tych faktów jako zdarzeń
   łamie DRY.
3. **Skala.** Kilka tysięcy odwiedzin miesięcznie to rząd 10 tysięcy wierszy
   miesięcznie. Postgres w Supabase obsłuży to bez partycjonowania, ClickHouse
   czy Redisa.

Plan B, gdyby panel okazał się za drogi w utrzymaniu: **Umami** (MIT, one-click
w Coolify, około 512 MB RAM, `SALT_ROTATION=day`, `identify({id})` dla
zalogowanych, segmenty i kohorty od wersji 3). Plausible CE nie identyfikuje
użytkowników z założenia, PostHog wymaga 16 GB RAM i siedmiu usług, Matomo bez
cookies przestaje liczyć osoby. Żadne z nich nie pasuje do tego przypadku.

## 3. Zasady, których projekt nie łamie

CLAUDE.md, punkt 3 („zero tracking”) jest sformułowany szerzej, niż wymaga tego
jego cel. Proponowane nowe brzmienie, do wprowadzenia razem z wdrożeniem:

> 3. Zero trackingu firm trzecich: brak Google Analytics, Meta Pixel i podobnych,
> brak cookies śledzących, brak fingerprintingu między domenami. Statystyki
> własne (first-party) są dozwolone wyłącznie, gdy: (a) nie zapisują niczego w
> przeglądarce (bez cookies i localStorage), (b) dla anonimowych przechowują
> tylko dobowe agregaty, a surowe zdarzenia z jednodniowym hashem kasują po
> 90 dniach, (c) nie zbierają treści, tytułów ćwiczeń ani czasu pracy nad
> ćwiczeniami programu pisania per użytkownik, (d) trafiają wyłącznie do
> własnej bazy. Tagowanie pod kampanie mailowe jest technicznie oddzielone od
> statystyk i dotyczy tylko osób z aktywną subskrypcją newslettera.

Konsekwencje, których pilnujemy w kodzie:

- **Bez cookies i bez localStorage.** Anonimowy odwiedzający to
  `sha256(sól_dobowa | ip | user-agent)`. Sól to `sha256(APP_SECRET | data w
  Europe/Warsaw)`, liczona w locie, nigdy nie zapisywana. IP i user-agent nie
  trafiają do bazy. To pseudonimizacja, nie anonimizacja, i tak to nazywamy w
  polityce prywatności.
- **Bez banera zgody.** Skoro nic nie jest zapisywane na urządzeniu, ePrivacy
  nie ma zastosowania; podstawą jest uzasadniony interes (pomiar ruchu na
  własnej stronie). To argumentacja Plausible i Umami, opisana w załączniku
  o RODO. Polityka prywatności dostaje osobny akapit (sekcja 9).
- **Program pisania poza statystykami.** Tabela zdarzeń nie zna pojęcia
  `exercise_id`. Dopuszczalny jest wyłącznie zbiorczy licznik ukończeń
  modułów, bez łączenia z ćwiczeniem ani z osobą. Wybory z check-inów
  kursów nie pojawiają się w panelu w rozbiciu per osoba.
- **Próg w panelu.** Rozbicia z liczbą osób mniejszą niż 5 nie są pokazywane
  (zamiast liczby: „mniej niż 5”), żeby rzadkie zdarzenie nie wskazywało
  konkretnej osoby.

## 4. Co zbieramy i skąd

| Zdarzenie | Źródło | Uwagi |
|-----------|--------|-------|
| `post_view` | beacon z przeglądarki, przy zamontowaniu strony posta | Strony postów są prerenderowane statycznie (`generateStaticParams`), więc zapis po stronie serwera nie wykonałby się na każde wejście. Beacon pomija `document.prerendering`, `navigator.webdriver` i localhost. |
| `post_read` | beacon, raz, po dotarciu do ostatniego slajdu karuzeli albo końca tekstu | Hook w `goTo` w `carousel-viewer.tsx`, flaga „wysłane” w komponencie. |
| `login` | serwer | Dwa miejsca: callback OAuth i potwierdzenia maila (`program/auth/callback/route.ts`) oraz logowanie hasłem, które dziś dzieje się w całości w przeglądarce (`auth-form.tsx`, `signInWithPassword`). Po udanym logowaniu hasłem klient woła `POST /api/t` z `{event:"login"}` z ciasteczkami sesji, a serwer bierze `user_id` z sesji Supabase, nie z payloadu. |
| aktywne konta | nocny agregat | Liczone z `auth.users.last_sign_in_at` przez service role (jak w przypomnieniach kursów). Bez nowych danych. |
| lejek kursów | nocny agregat | Z `course_enrollments` i `course_day_progress`: zapis, start dnia N, ukończenie dnia N, ukończenie kursu, opinie z `course_feedback`. Bez nowych zdarzeń. |
| lajki, komentarze | nocny agregat | Z `user_interactions` i `post_comments`, tylko liczby per post. |

Czego nie zbieramy: czasu na stronie, głębokości scrolla poza końcem karuzeli,
kliknięć w przyciski udostępniania (można dodać później jako `post_share` bez
danych o kanale, jeśli będzie potrzeba), ścieżek między stronami, referrerów
z parametrami.

## 5. Model danych

Konwencje z repo: migracje SQL jak dla `course_*`, RLS włączone bez polityk
tam, gdzie dostęp ma mieć wyłącznie service role, cron przez `Bearer
CRON_SECRET`, `ON DELETE SET NULL` dla danych, które mają przeżyć usunięcie
konta w postaci anonimowej (wzór: `post_comments`).

```sql
-- Surowe zdarzenia. Retencja 90 dni. Dostęp tylko przez service role.
CREATE TABLE analytics_events (
  id           BIGSERIAL PRIMARY KEY,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type   TEXT NOT NULL CHECK (event_type IN ('post_view','post_read','login')),
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_hash TEXT,                       -- tylko dla anonimowych; NULL gdy jest user_id
  locale       TEXT CHECK (locale IN ('en','pl')),
  target_id    TEXT,                       -- slug posta; NULL dla login
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_analytics_events_type_time ON analytics_events (event_type, occurred_at);
CREATE INDEX idx_analytics_events_target ON analytics_events (target_id, occurred_at)
  WHERE target_id IS NOT NULL;
CREATE INDEX idx_analytics_events_user ON analytics_events (user_id)
  WHERE user_id IS NOT NULL;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
-- Celowo bez polityk: anon i authenticated nie czytają ani nie piszą.

-- Agregaty dobowe. Bez danych osobowych, trzymane bezterminowo.
CREATE TABLE analytics_daily_stats (
  day          DATE NOT NULL,
  metric       TEXT NOT NULL,   -- post_view | post_read | login | new_accounts
                                -- | active_7d | active_30d | course_enroll
                                -- | course_day_start | course_day_complete
                                -- | course_complete | course_feedback | post_like
  dimension    TEXT NOT NULL DEFAULT '',   -- slug posta lub kursu
  locale       TEXT NOT NULL DEFAULT '',
  extra        TEXT NOT NULL DEFAULT '',   -- numer dnia kursu, ocena z feedbacku
  count        INTEGER NOT NULL DEFAULT 0,
  unique_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, metric, dimension, locale, extra)
);
ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;

-- Tagi pod kampanie. Znikają razem z kontem.
CREATE TABLE user_tags (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL REFERENCES tag_definitions(tag),
  source     TEXT NOT NULL CHECK (source IN ('auto','manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at  TIMESTAMPTZ,
  PRIMARY KEY (user_id, tag)
);
CREATE INDEX idx_user_tags_tag ON user_tags (tag);
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;

-- Słownik tagów: allowlist. Tag spoza słownika nie może powstać.
CREATE TABLE tag_definitions (
  tag         TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('auto','manual'))
);
```

Dlaczego bez partycjonowania: przy 90-dniowym oknie i tej skali tabela ma
rząd 20 tysięcy wierszy. Kasowanie starych zdarzeń robi nocny cron zwykłym
`DELETE` w paczkach po 5 tysięcy. Gdyby ruch urósł dziesięciokrotnie,
partycje miesięczne i `DROP TABLE` zamiast `DELETE` są opisane w załączniku
z researchem.

## 6. Endpointy

| Endpoint | Metoda | Auth | Rola |
|----------|--------|------|------|
| `/api/t` | POST | publiczny; rate limit per IP i per hash; Zod | beacon: `post_view`, `post_read`, `login` (ten ostatni tylko z ważną sesją) |
| `/api/analytics/aggregate` | POST | `Bearer CRON_SECRET` | nocny agregat wczorajszego dnia + kasowanie zdarzeń starszych niż 90 dni |
| `/api/tags/apply` | POST | `Bearer CRON_SECRET` | naliczanie tagów automatycznych |
| `/api/tags/sync` | POST | `Bearer CRON_SECRET` | przyrostowa synchronizacja do MailerLite |
| `/api/admin/stats?range=7d` | GET | JWT admina (sprawdzany w handlerze, jak `/api/admin/comments`) | dane dla panelu: agregaty plus „dziś” liczone na żywo |
| `/api/admin/tags` | GET, POST | JWT admina | lista tagów z licznikami, ręczne nadanie |
| `/api/admin/tags/[tag]/members` | GET | JWT admina | lista maili, osobny endpoint, bez logowania odpowiedzi |
| `/api/admin/tags/sync` | POST | JWT admina | pełna rekoncyliacja z MailerLite na żądanie |

`/api/t` musi trafić do listy wyjątków w `src/proxy.ts` (dokładne dopasowanie
ścieżki), bo domyślnie każdy zapis pod `/api/` wymaga tokenu admina.

Zabezpieczenia `/api/t`, wszystkie obowiązkowe:

- tylko `POST`, `Content-Type` `application/json` lub `text/plain` (dla
  `sendBeacon`), body do 1 KB odrzucane przed parsowaniem;
- `Origin` albo `Referer` zgodny z jedną z dwóch własnych domen;
- schemat Zod z allowlistą typów; `target_id` sprawdzany wobec listy istniejących
  slugów postów z `src/lib/posts.ts`;
- filtr botów: biblioteka `isbot` na user-agent po stronie serwera, odrzucenie
  `Sec-Purpose: prefetch`;
- rate limit przez istniejący `checkRateLimit`: 30 żądań na minutę per IP oraz
  dedup 1 na 60 sekund per `hash + target_id`;
- odpowiedź zawsze `204`, bez treści, bez `Set-Cookie`, z `Cache-Control:
  no-store`; brak rozróżnienia między „zapisano”, „duplikat” i „odrzucone”,
  żeby endpoint nie był wyrocznią;
- zapis przez service role wyłącznie po stronie serwera; RLS bez polityk
  gwarantuje, że ominięcie endpointu przez REST Supabase z kluczem anon nic
  nie da.

Uwaga do limitera: `src/lib/rate-limit.ts` trzyma stan w pamięci procesu.
Przy jednej instancji w Coolify to wystarcza. Przy skalowaniu na kilka
instancji limit i dedup trzeba przenieść do Postgresa albo Redisa; do tego
czasu to świadomy kompromis.

## 7. Agregacja

Nocny cron (Coolify Scheduled Task, jak przypomnienia kursów, na przykład
04:30) woła `/api/analytics/aggregate`, który:

1. liczy wczorajszy dzień: `post_view` i `post_read` per slug i locale
   (`count` oraz `unique_count` po `visitor_hash` lub `user_id`), `login`,
   `new_accounts` z `auth.users.created_at`, `active_7d` i `active_30d`
   z `last_sign_in_at`, lejek kursów z tabel kursów, oceny z `course_feedback`,
   lajki z `user_interactions`;
2. zapisuje wynik do `analytics_daily_stats` przez `UPSERT`, więc powtórne
   uruchomienie jest bezpieczne;
3. dopiero potem kasuje zdarzenia starsze niż 90 dni.

Dlaczego tabela agregatów, a nie widok: widok przeliczałby 90 dni przy każdym
odświeżeniu panelu, a przede wszystkim przestałby działać dla dni, których
surowe zdarzenia już skasowano. Panel dla bieżącego dnia dolicza wartości na
żywo prostym `COUNT`, więc „dziś” nigdy nie pokazuje zera.

## 8. Tagi i kampanie

**Źródło prawdy dla zgody marketingowej: aktywna subskrypcja newslettera w
MailerLite** (status `active`, po double opt-in). Nie wprowadzamy drugiej
kolumny ze zgodą, żeby nie mieć dwóch źródeł prawdy. Warunek: formularz
newslettera i polityka prywatności mówią wprost, że subskrybent może dostawać
maile dobrane do jego aktywności na stronie (sekcja 9). Przypomnienia kursów
(`reminders_enabled`) to osobna, transakcyjna zgoda i zostają jak są.

**Allowlist tagów.** Tag może powstać tylko, jeśli istnieje w
`tag_definitions`. Tagi są neutralne i dotyczą lejka, nigdy stanu
psychicznego ani treści ćwiczeń. Zestaw startowy:

| Tag | Rodzaj | Reguła |
|-----|--------|--------|
| `ukonczyl-kurs-{slug}` | auto | `course_enrollments.completed_at` ustawione |
| `porzucil-kurs-{slug}-dzien-{n}` | auto | dzień `n` rozpoczęty, kurs nieukończony, brak startu dnia `n+1` przez 3 dni; usuwany, gdy przestaje być prawdziwy |
| `zapisany-na-kurs-{slug}` | auto | zapis istnieje |
| `czyta-{kategoria}` | auto | co najmniej 3 zdarzenia `post_view` lub `post_read` z `user_id` w tej samej kategorii postu w 30 dniach |
| dowolny ręczny | manual | nadany w panelu, cron nigdy go nie usuwa |

Tag `czyta-{kategoria}` dotyczy tylko zalogowanych, bo anonimowych nie da się
i nie wolno łączyć między dniami. Kategorie ograniczone do neutralnych
(np. relacje, nawyki); jeśli w przyszłości powstaną kategorie o traumie czy
zdrowiu psychicznym, nie wchodzą do tagowania bez osobnej oceny skutków (DPIA).

**Synchronizacja do MailerLite.** Grupa MailerLite = nazwa tagu. Do MailerLite
wysyłamy wyłącznie e-mail i nazwę grupy. Dwa tryby:

- nocny, przyrostowy: dla `user_tags.synced_at IS NULL` sprawdź, czy subskrybent
  jest `active`; jeśli tak, `ensureGroup(tag)` i dopisanie do grupy (wzorzec z
  `src/lib/mailerlite.ts`), `synced_at = now()`; jeśli nie ma aktywnej
  subskrypcji, tag zostaje tylko lokalnie i nic nie wychodzi;
- na żądanie, pełna rekoncyliacja przyciskiem w panelu: pobierz członków
  grupy, porównaj z tagami w bazie, dodaj brakujących, usuń nieaktualnych.
  Właściciel klika to przed wysyłką kampanii.

Kampanie wysyła się z panelu MailerLite do grupy. Na planie Free API nie
pozwala tworzyć ani wysyłać kampanii, ale grupy, pola i upsert subskrybenta
działają, i tyle wystarczy.

Cofnięcie zgody i usunięcie konta: przy usunięciu konta handler
`/api/program/account` dodatkowo usuwa subskrybenta z grup tagowych w
MailerLite (nowa funkcja w `mailerlite.ts`), a `user_tags` znika kaskadowo.
Przy samym wypisaniu z newslettera pełna rekoncyliacja usuwa osobę z grup.

## 9. RODO i polityka prywatności

- **Eksport** (`/api/program/data-export`) dostaje sekcje: `tags`,
  `loginEvents` (daty), `postActivity` (daty i slugi z `user_id`). Bez
  `visitor_hash`. Przy okazji warto dopisać `user_interactions` (lajki), których
  eksport dziś nie obejmuje.
- **Usunięcie konta**: zdarzenia anonimizują się przez `ON DELETE SET NULL`,
  tagi znikają kaskadowo, MailerLite czyszczony jak wyżej.
- **Polityka prywatności** dostaje akapit: co mierzymy, jak liczymy odwiedziny
  (jednodniowy hash z adresu IP i przeglądarki, bez cookies, nieodwracalny,
  kasowany po 90 dniach), podstawa prawna (uzasadniony interes), prawo
  sprzeciwu z adresem kontaktowym, oraz osobny akapit o newsletterze:
  subskrybenci mogą dostawać maile dobrane do aktywności (ukończenie lub
  przerwanie kursu, czytane tematy), MailerLite jako podmiot przetwarzający.
- **Umowa powierzenia z MailerLite** (art. 28) i lokalizacja danych: do
  sprawdzenia przed włączeniem synchronizacji tagów. Sam newsletter już
  z tego korzysta, więc prawdopodobnie jest to załatwione.

## 10. Panel

Dwie strony w istniejącym panelu (`src/app/admin/`), styl jak `/admin/kurs`:

- `/admin/statystyki`: pasek zakresu (dziś, 7 dni, 30 dni, własny) z deltą do
  poprzedniego okresu, potem sekcje w kolejności: Konta (nowe, logowania,
  aktywni 7 i 30 dni, słupki dzienne), Kursy (lejek z odsetkiem porzucających
  po każdym dniu, mediana dni do ukończenia, oceny), Posty (wyświetlenia,
  unikalni, odsetek dotarcia do końca, top 10, przełącznik języka). Tylko
  liczby zagregowane, zero maili.
- `/admin/tagi`: lista tagów z licznikami, ręczne nadanie, przycisk
  synchronizacji ze statusem, lista maili tylko po kliknięciu i potwierdzeniu
  w oknie dialogowym, pobierana osobnym endpointem, żeby nie leżała w
  markupie strony.

Bez biblioteki wykresów: słupki i lejek jako CSS, jak dziś w `/admin/kurs`.
Komponenty do wydzielenia (`src/components/admin/`): `stat-tile`,
`funnel-bars` (dziś inline w `/admin/kurs`), `bar-chart-simple`,
`date-range-picker`, `pill-tabs`, `data-table`, `tag-list`,
`tag-members-dialog`, `mailerlite-sync-button`. Każdy wykres z `figcaption`
i ukrytą tabelą dla czytników ekranu. Szczegóły i szkice w załączniku o panelu.

## 11. Kolejność wdrożenia

| Krok | Zakres | Szacunek |
|------|--------|----------|
| 1 | Migracja: cztery tabele, RLS, słownik tagów. Zmiana punktu 3 w CLAUDE.md. | 0,5 dnia |
| 2 | Zbieranie: `/api/t` z zabezpieczeniami, wyjątek w `proxy.ts`, beacon w stronie posta i w karuzeli, `login` w callbacku i po logowaniu hasłem. | 1 dzień |
| 3 | Agregat: `/api/analytics/aggregate`, zadanie w Coolify, `GET /api/admin/stats`, `/admin/statystyki` z samymi liczbami. | 1,5 dnia |
| 4 | Tagi: `/api/tags/apply`, `/api/tags/sync`, `/admin/tagi`, funkcje w `mailerlite.ts`, sekcje w eksporcie RODO, czyszczenie przy usuwaniu konta. | 1,5 dnia |
| 5 | Polityka prywatności i copy formularza newslettera. Testy z listy poniżej. | 0,5 dnia |

Razem około 5 dni dla jednej osoby. Kroki 1 do 3 dają odpowiedź na pytania
„czy ktoś to czyta” i „gdzie porzucają”; krok 4 można odłożyć do pierwszej
kampanii.

## 12. Testy przed wdrożeniem

- RLS: `anon` i `authenticated` nie czytają i nie piszą do czterech nowych
  tabel przez REST Supabase.
- `/api/t`: body powyżej 1 KB, nieznany typ, nieznany slug, obce `Origin`,
  metoda `GET`: wszystko odrzucone bez zapisu; odpowiedź zawsze `204` bez
  `Set-Cookie`.
- `/api/t` z `event: login` bez sesji nie zapisuje niczego.
- 1000 żądań na minutę z jednego IP: `429` po progu, serwer stabilny.
- Strona posta i karuzela działają przy zablokowanym JS i przy zablokowanym
  `/api/t`.
- Prefetch Next i `navigator.webdriver` nie generują `post_view`.
- Agregat uruchomiony dwa razy dla tego samego dnia daje ten sam wynik.
- Eksport RODO zawiera nowe sekcje; po usunięciu konta `user_id` w
  `analytics_events` jest `NULL`, `user_tags` puste, subskrybent usunięty z grup
  w MailerLite.
- Panel: rozbicia z liczbą osób poniżej 5 pokazują „mniej niż 5”; strona
  `/admin/statystyki` nie zawiera żadnego adresu e-mail w źródle HTML.
- Zakładka sieci w przeglądarce: brak żądań do domen firm trzecich.

## 13. Sprawy otwarte

1. Czy `post_share` (bez kanału) ma wejść do pierwszej wersji? Rekomendacja:
   nie, dopiero gdy ktoś o to zapyta.
2. Nazwa tagów kategorii postów: potrzebna lista neutralnych kategorii z
   `src/lib/categories.ts`, które wolno tagować.
3. Retencja tagów lokalnych dla osób bez subskrypcji: zostawić bezterminowo
   (nie są przetwarzane w celu marketingowym) czy kasować po 180 dniach?
   Rekomendacja: kasować, mniej danych to mniej ryzyka.

## Research narzędzi w skrócie

| | Umami | Plausible CE | PostHog | Matomo |
|---|---|---|---|---|
| Licencja | MIT | AGPLv3 | MIT | GPLv3 |
| Infrastruktura | Node + Postgres, ok. 512 MB | Elixir + Postgres + ClickHouse, min. 2 GB | ClickHouse, Kafka, Redis, Postgres, MinIO, zalecane 16 GB | PHP + MySQL |
| Cookieless bez zgody | tak, sól domyślnie miesięczna, można dobowa | tak, sól dobowa | tak, ale wtedy bez `identify()` | tak, ale wtedy nie liczy osób |
| Identyfikacja zalogowanych, segmenty | tak | nie, z założenia | tak, poza trybem cookieless | tak, ale wymaga zgody |
| Coolify | oficjalny one-click | szablon ukryty | szablon ukryty, „unsupported” | brak szablonu |
| CSP | domena Umami w `script-src` i `connect-src` | jak wyżej | snippet inline | snippet inline |

Pełne porównanie, wzorce liczenia unikalnych, filtrowania botów i retencji
oraz endpointy MailerLite: załączniki w `docs/specs/tracking-analytics/`.
