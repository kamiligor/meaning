# Analiza QA/security: first-party statystyki + tagi MailerLite

Przeczytane: CLAUDE.md, src/proxy.ts, src/lib/rate-limit.ts,
src/app/api/newsletter/subscribe/route.ts, src/app/api/program/data-export/route.ts,
src/app/api/program/account/route.ts, supabase/migrations/*.sql,
src/lib/supabase-server.ts, src/lib/supabase-admin.ts, src/app/api/course/day/route.ts.

## 1. Zgodność z "zero tracking"

Zgodne z duchem reguły: first-party endpoint (brak GA/Meta Pixel), agregaty
dobowe zamiast profilu dla anonimowych, brak cookies identyfikujących, dane
kursów zapisywane server-side (kontynuacja wzorca `course_day_progress`,
`course_feedback`).

Narusza literę obecnego zapisu "brak telemetrii" — sformułowanie jest zbyt
szerokie i trzeba je doprecyzować, inaczej każdy audyt wykaże złamanie
CLAUDE.md, mimo braku śledzenia przez firmy trzecie.

Ryzyka do domknięcia: hash z dobową solą wciąż pozwala łączyć wiele zdarzeń
tego samego dnia w jedną sesję — to krótkotrwały fingerprinting, trzeba go
tak nazwać w polityce, nie ukrywać pod słowem "anonimowe". Tagowanie
zalogowanych to marketing, nie statystyka, wymaga osobnej zgody (pkt 2).
Panel /admin musi pokazywać tylko agregaty z progiem minimalnym (np. brak
liczb < 5 w rozbiciach), inaczej rzadkie zdarzenia identyfikują osobę.

Proponowane brzmienie punktu 3 w CLAUDE.md:

> 3. Zero tracking firm trzecich — brak Google Analytics, Meta Pixel i
> podobnych narzędzi, brak cookies śledzących, brak fingerprintingu
> między-domenowego. Statystyki własne (first-party) dozwolone WYŁĄCZNIE gdy:
> (a) nie używają cookies/localStorage, (b) dla anonimowych przechowują
> wyłącznie zagregowane liczniki dobowe, nigdy zdarzenia per-odwiedzający
> pozwalające odtworzyć ścieżkę, (c) dla programu pisania nie zbierają
> treści, tytułów ćwiczeń per użytkownik ani czasu nad konkretnym
> ćwiczeniem, (d) dane trafiają wyłącznie do własnej bazy. Tagowanie do
> kampanii mailowych wymaga osobnej, jawnej zgody marketingowej i jest
> rozdzielone technicznie od zdarzeń statystycznych.

## 2. RODO i ePrivacy

Hash(IP+UA+sól dobowa) to dane osobowe (pseudonimizacja, nie anonimizacja —
motyw 26 RODO, wyrok Breyer C-582/14): administrator zna algorytm i sól,
więc przy dostępie do surowego IP/UA może odtworzyć powiązanie.

Zgoda z ePrivacy (cookie banner) NIE jest wymagana, o ile nic z endpointu
`/api/t` nie zapisuje się w przeglądarce (brak cookies, brak localStorage) —
art. 5(3) dyrektywy ePrivacy dotyczy dostępu do informacji na urządzeniu, a
nie samego wysłania beacona. To dokładnie argumentacja Plausible/Umami:
brak trwałego identyfikatora klienta = poza zakresem ePrivacy, podstawa
prawna RODO to uzasadniony interes (art. 6 ust. 1 lit. f, motyw 47 — pomiar
ruchu na własnej stronie), o ile jest proporcjonalny i minimalny.

W polityce prywatności musi się znaleźć: opis mechanizmu (hash IP+UA z solą
zmienianą co dobę, nieodwracalny, niełączony z kontem dla niezalogowanych),
podstawa prawna (uzasadniony interes), retencja — surowe zdarzenia max
30-90 dni, potem kasowane automatycznie, zostają tylko dobowe agregaty bez
hasha — oraz informacja o prawie sprzeciwu (art. 21 RODO), z adresem
kontaktowym zamiast technicznego opt-outu (bo nie ma identyfikatora do
wyszukania).

Tagowanie zalogowanych i wysyłka kampanii **wymaga osobnej zgody
marketingowej.** To już nie pomiar ruchu, tylko marketing bezpośredni
skierowany do zidentyfikowanej osoby (e-mail + tag zachowania) — wymaga
zgody z ePrivacy/ustawy o świadczeniu usług drogą elektroniczną niezależnie
od podstawy RODO. Rekomendacja: osobny checkbox przy zapisie/onboardingu,
domyślnie odznaczony, zapisany jako `user_profiles.marketing_consent_at`
(timestamp + wersja polityki), z wycofaniem w `/profil`. Tagowanie w
MailerLite tylko dla kont z aktywną zgodą; cofnięcie zgody musi usuwać tagi
behawioralne u dostawcy, nie tylko przestać je aktualizować.

Eksport i usunięcie konta: `data-export/route.ts` (linie 26-157) trzeba
rozszerzyć o status zgody marketingowej i listę tagów wysłanych do
MailerLite. Nowa tabela zdarzeń NIE powinna mieć FK `ON DELETE CASCADE` do
`user_id` (usunięcie konta zniekształciłoby historyczne agregaty innych
dni) — zamiast tego `user_id` nullable i **anonimizacja** przy usunięciu
konta, analogicznie do `wipeComments()` w `account/route.ts` (linie 17-48).
Trzeba też wywołać usunięcie subskrybenta/tagów w MailerLite w tej samej
operacji.

## 3. Model zagrożeń `/api/t`

- **Zatruwanie statystyk / spam:** rate limit per IP (np. 30/min) i per hash
  (np. 20/min) przez istniejący `checkRateLimit()`; allowlist typów zdarzeń
  (enum) i allowlist slugów sprawdzana wobec realnej listy postów/kursów
  (`getCourse()`, loader postów) — nieznane wartości odrzucane, nie zapisywane.
- **CSRF:** endpoint nie zmienia stanu konta, więc klasyczny CSRF ma niską
  wartość ataku, ale mimo to: walidacja `Origin`/`Referer` wobec dwóch
  własnych domen, brak cookies w request/response tego endpointu.
- **Wyciek przez błędy:** brak echa inputu w odpowiedzi (zwracaj `204` albo
  statyczne `{ok:true}`), generic komunikat 400 bez szczegółów schematu,
  `console.error` bez wrażliwych pól.
- **DoS:** twardy limit rozmiaru body (np. 1 KB, odrzucany przed parsowaniem
  JSON), tylko POST, `Content-Type` ograniczony do `application/json` lub
  `text/plain` (dla `sendBeacon`).
- **Nagłówki:** `Cache-Control: no-store`, brak `Set-Cookie`; globalny CSP z
  `proxy.ts` (linie 138-160) już obejmuje ten endpoint jako same-origin.
- **Service role:** bezpieczny WYŁĄCZNIE po stronie serwera, do samego
  INSERT, nigdy zwracany do klienta. RLS na tabeli zdarzeń musi i tak
  zabraniać `anon`/`authenticated` zapisu i odczytu — service role jest
  jedyną drogą zapisu, co eliminuje ominięcie endpointu przez bezpośrednie
  wywołanie Supabase REST z kluczem anon.
- Odpowiedź nie powinna różnicować kodu między "duplikat odrzucony" a
  "zapisano", inaczej endpoint staje się orackiem do enumerowania slugów.

## 4. Wrażliwość treści — czego NIE zbierać

Zakazane: który `exercise_id`/tytuł ćwiczenia dana osoba otworzyła lub
ukończyła w zdarzeniach czytanych przez panel admina (to już jest w
`user_progress`, chronione RLS i szyfrowaniem — nie duplikować do tabeli
zdarzeń); treść odpowiedzi, długość, czas pisania per pytanie per-user;
wybory `checkin_choice`/`emotional-checkin` per user w panelu statystyk
(ujawnia stan emocjonalny); porzucenie konkretnego wrażliwego ćwiczenia w
rozbiciu z małą liczbą osób (efektywnie identyfikuje).

Dopuszczalne: zagregowane dobowo liczby wyświetleń postów per slug, liczba
rozpoczętych/ukończonych dni kursu per kurs per dzień bez wiązania z
`user_id` w warstwie odczytu panelu, procent porzuceń funnela kursu
("X% zaczęło dzień 3, Y% dzień 4"), zagregowany licznik ukończeń modułów
programu pisania bez łączenia z konkretnym ćwiczeniem. Logowania —
zagregowany licznik dzienny, bez rozbicia per-user w panelu (dane o
ostatnim logowaniu per-user już istnieją w Supabase Auth, chronione RLS, nie
duplikować).

Zasada: tabela zdarzeń nie zawiera `exercise_id` programu pisania jako
wymiaru grupowania per-user; dopuszczalny jest tylko zagregowany licznik na
poziomie całego programu.

## 5. Checklist testów przed wdrożeniem

- RLS: `anon` nie odczyta tabeli zdarzeń (`select *` → pusto/401).
- RLS: `anon` nie zapisze bezpośrednio przez REST Supabase (brak polityk
  INSERT dla `anon`/`authenticated`, zapis tylko przez `service_role`).
- `authenticated` nie odczyta cudzych zdarzeń (jeśli w ogóle dajemy odczyt).
- `/admin/statystyki` chronione tym samym JWT guard co reszta `/admin`
  (`isAdminAuthenticated`, proxy.ts linie 162-167).
- `/api/t` z body > limit → 400/413, nie 500.
- `/api/t` z nieznanym typem/slugiem → 400, brak zapisu w DB.
- `/api/t` z Origin spoza dwóch domen → odrzucone.
- Test obciążeniowy: 1000 req/min z jednego IP → 429 po progu, serwer stabilny.
- Odpowiedź `/api/t` bez `Set-Cookie`.
- Strona działa normalnie przy zablokowanym fetch/JS (statystyki nie
  blokują renderu ani nawigacji).
- Eksport RODO zawiera zgodę marketingową i ewentualne zdarzenia powiązane z kontem.
- Usunięcie konta anonimizuje `user_id` w tabeli zdarzeń (weryfikacja
  bezpośrednim zapytaniem do DB po usunięciu).
- Sól dobowa nie jest trywialnie odtwarzalna (HMAC z osobnym sekretem
  rotowanym co 24h, nie goły `Date.now()`).
- Network tab: brak requestów do domen firm trzecich poza MailerLite API
  wywoływanym wyłącznie server-side.

## 6. Ryzyka MailerLite

Obecny wzorzec w `newsletter/subscribe/route.ts` (linie 44-55) wysyła tylko
`email` + `fields: { language }` — minimalizacja zachowana. Rozszerzenie o
tagi behawioralne musi trzymać tę zasadę: tylko e-mail + nazwa/ID grupy lub
tag (np. `course_kurs-niescrollowania_completed`), nigdy treść ćwiczeń,
surowe odpowiedzi ani `checkin_choice` jako wolny tekst.

Wymagana umowa powierzenia przetwarzania (art. 28 RODO) z MailerLite;
sprawdzić lokalizację serwerów i mechanizm transferu poza EOG przed
włączeniem tagowania. Cofnięcie zgody lub usunięcie konta musi usuwać
subskrybenta/tagi też u dostawcy, nie tylko w bazie własnej — inaczej prawo
do zapomnienia jest spełnione tylko częściowo.

Największe ryzyko biznesowe: presja w stronę coraz bardziej szczegółowych
tagów ("otwiera maile, ale nie wraca do ćwiczenia o traumie") — to
profilowanie stanu psychicznego przekazywane firmie trzeciej, wymagające
oceny skutków dla ochrony danych (DPIA) niezależnie od zgody. Rekomendacja:
twarda allowlist dozwolonych tagów po stronie serwera (nie dowolny string z
frontendu), ograniczona do neutralnych zdarzeń funnela, bez nazw ćwiczeń
psychologicznych w treści tagu.
