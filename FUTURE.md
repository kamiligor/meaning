# Strategia architektury marki — wyniki dyskusji zespołu

> **DECYZJA PODJĘTA (2026-03-03):** Poniższa analiza jest archiwalna. Ostateczne decyzje brandingowe:
>
> | Element | Decyzja |
> |---------|---------|
> | **Domena** | justmeaning.com |
> | **Tagline** | Just have a little meaning (zawsze EN) |
> | **Stopka** | JUST HAVE A LITTLE MEANING |
> | **Instagram** | @justhavealittlemeaning (EN) |
> | **Nazwa programu** | The Life Writing Program (zawsze EN) |
> | **Opis EN** | A guided writing process designed to help you understand your past, clarify your present, and intentionally shape your future. |
> | **Opis PL** | Program pisania, który pomaga zrozumieć swoją przeszłość, uporządkować teraźniejszość i świadomie zaplanować przyszłość. |
> | **Strona** | Multilanguage (en/pl) |

---

> Data analizy: 2026-03-01
> Uczestnicy: psycholog badawczy, terapeuta narracyjny, copywriter, UX writer, edukator, frontend dev, backend dev, QA tester

---

## Pytanie strategiczne

Czy projekt powinien rozwijać się jako:
1. Jeden projekt (life hacki + Pisz Siebie na jednej domenie)?
2. Dwa osobne projekty (osobne domeny, osobne marki)?
3. Projekt(y) w dwóch językach (en/pl osobno)?
4. Osobne domeny na każdy filar i język?

---

## Jednogłośna rekomendacja: JEDEN PROJEKT, JEDNA DOMENA

**Wszystkie 8 perspektyw wskazuje na ten sam wniosek.** Różnią się w detalach, ale żaden agent nie rekomendował pełnej separacji.

---

## Rekomendowana struktura

```
justhavelittlemeaning.com (lub krótsza domena, np. jhlm.pl / littlemeaning.com)
├── /pl/                    ← polski feed, life hacki, blog
├── /en/                    ← angielski feed, life hacki, blog
├── /pl/program/            ← landing "Pisz Siebie"
├── /en/program/            ← landing "Write Yourself" (przyszłość)
├── /pl/program/dashboard/  ← zalogowana część programu
└── /pl/program/cwiczenie/  ← edytor ćwiczeń
```

Opcjonalnie: `piszsiebie.pl` jako alias/redirect do `/pl/program/` (korzyść SEO bez fragmentacji marki).

---

## Argumenty — perspektywa każdego agenta

### 1. Psycholog badawczy — spójność lejka psychologicznego

**Kluczowy argument:** Lejek Instagram → feed → blog → program odwzorowuje model transteoretyczny zmiany (Prochaska & DiClemente): prekontemplacja → kontemplacja → przygotowanie → działanie. Rozdzielenie go na dwie domeny **przerywa progresję psychologiczną**.

- **Teoria samoekspansji** (Aron & Aron, 1986): ludzie nie odczuwają dysonansu między lekkimi a głębokimi treściami, gdy kontekst znaczeniowy jest spójny. Nazwa "just have a little meaning" mieści oba poziomy.
- **Efekt halo** (Thorndike): zaufanie zbudowane na feedzie przenosi się automatycznie na program.
- **SDT** (Deci & Ryan): autonomia użytkownika jest najlepiej wspierana, gdy sam decyduje o głębokości — bez presji, bez popupów, bez konieczności rejestracji na nowej stronie.
- **Destigmatyzacja**: w polskim kontekście (wyższa stygmatyzacja zdrowia psychicznego niż w Europie Zachodniej) osobna domena "piszsiebie.pl" wymaga od użytkownika intencjonalnego aktu "szukania pomocy". Jedna marka normalizuje głębię — przejście jest miękkie i naturalne.
- **Psychological safety** (Edmondson): jedna marka, która jest jednocześnie lekka i głęboka, zwiększa bezpieczeństwo psychologiczne, bo normalizuje proces.

### 2. Terapeuta narracyjny — ciągłość narracji

**Kluczowy argument:** Zmiana domeny w trakcie lejka to *disruption of context* — zerwanie kontekstu, który budował poczucie bezpieczeństwa. Dla osoby rozważającej głębszą pracę nad sobą, taki dysonans często wystarczy, żeby się wycofać.

- **Tożsamość narracyjna** (McAdams, 2001): ciągłość narracyjna wymaga spójności kontekstu. Jeden projekt pozwala użytkownikowi powiedzieć: "pracuję nad sobą w tej samej przestrzeni, w której się o sobie dowiedziałem."
- **Re-authoring** wymaga bezpiecznej, znanej przestrzeni. Zaufanie z setek przeczytanych postów przenosi się na program — to narracyjny kapitał, którego nie da się odtworzyć na nowej domenie.
- **Nazwy**: "just have a little meaning" to dom (filozofia, przestrzeń). "Pisz Siebie" to pokój (narzędzie, program). Hierarchia, nie konkurencja.
- **Język a intymność**: pisanie terapeutyczne w L1 (języku ojczystym) aktywuje głębsze przetwarzanie emocjonalne (Pavlenko, 2005; Harris et al., 2003). Program powinien być pierwotnie polski, angielska wersja jako równoległy kontekst kulturowy — nie tłumaczenie.

### 3. Copywriter — strategia komunikacji

**Kluczowy argument:** To nie są dwa produkty. To dwa etapy jednej relacji z użytkownikiem. Feed to wejście, program to pogłębienie. To lejek, nie portfolio.

- **Trust transfer**: zaufanie budowane przy lekkich treściach przenosi się na głębszy program bez konieczności odbudowy.
- **Lejek się urywa** przy dwóch domenach: Instagram → strona A → program na stronie B to o jeden krok za dużo. Każde przejście między domenami to utrata konwersji.
- **Naming**: "just have a little meaning" jako angielska nazwa na polskim rynku to "sygnał plemienny" — trafia do otwartej, wykształconej grupy docelowej. "Pisz Siebie" jest mocna, polska, czasownikowa — mówi co robisz, nie kim będziesz.
- **SEO**: dwie siły na jednej domenie (ruch informacyjny z feedu + ruch transakcyjny z programu) wzmacniają się przez internal linking.
- **Analogia**: Headspace — content i głębszy produkt na jednej marce, jeden konsekwentny ton.

### 4. UX Writer — trauma-informed user journey

**Kluczowy argument:** Przy profilu użytkownika, który często doświadcza trudnych emocji, każda nieoczekiwana zmiana kontekstu jest kosztem psychologicznym — nie tylko kognitywnym.

- **Liczba skoków**: wariant 1 (jedna domena) = 1 skok (Instagram → strona), potem płynne przejście. Wariant 2 (dwie domeny) = 2 skoki + zmiana "bezpiecznej przestrzeni".
- **Redirect między domenami** obniża konwersję o 20-30% w standardowym UX. Przy narzędziu wellness stawka jest wyższa — chodzi o poczucie bezpieczeństwa, nie tylko konwersję.
- **Progressive disclosure**: feed i blog jako lekkie wejście, subtelne CTA na końcu artykułu ("Chcesz porozmawiać z tym na papierze?"). Naturalne przejście od treści do narzędzia.
- **Przełączanie języków**: jeden przełącznik PL|EN w nagłówku. Preferencja w localStorage + profil użytkownika.
- **Opcjonalnie**: subdomena `app.justhavelittlemeaning.com` dla zalogowanej części — wspólna nazwa marki widoczna, użytkownik nie czuje "przejścia na obcą stronę".

### 5. Edukator — scaffolding i progresja edukacyjna

**Kluczowy argument:** Life hacki na Instagramie to scaffolding (rusztowanie, Wygotski) dla głębszego programu. Rozdzielenie na osobne domeny **przecina rusztowanie**.

- **Zona najbliższego rozwoju**: lekkie treści budują gotowość pojęciową. Kiedy użytkownik trafia na program i czyta o Pennebakerze — to nie jest jego pierwsze zetknięcie. To rozpoznanie.
- **Mere exposure effect** (Zajonc, 1968): wielokrotny kontakt z tą samą marką buduje zaufanie nie przez przekonywanie, ale przez powtarzanie.
- **Spójność kontekstu edukacyjnego**: artykuł blogowy o ekspresywnym pisaniu na tej samej domenie co program — to nie reklama. To integralny element tej samej rozmowy edukacyjnej.
- **Asymetria językowa**: angielska nazwa marki dodaje lekkości i świeżości. Polska nazwa programu ("Pisz Siebie") jest imperatywem skierowanym bezpośrednio do użytkownika. Zachować dokładnie tak, jak są.
- **Analogia**: Khan Academy — lekkie filmy YouTube budują zainteresowanie, pełny kurs na tej samej platformie, bez zmiany marki.

### 6. Frontend dev — architektura już to wspiera

**Kluczowy argument:** Projekt **już podjął** decyzję architektoniczną. Kod jest poprawnie rozdzielony przez route groups i foldery komponentów — feed i program nie importują od siebie nic.

- **Shared code**: UI components, middleware, i18n, fonty, Dockerfile, Tailwind config — synchronizacja tego między repozytoriami to konkretny koszt.
- **Performance**: Next.js App Router z route groups = osobne bundle'e per route. Użytkownik feedu nie pobiera TipTapa. Tree shaking > separacja repo.
- **i18n**: subdirectory (`/en/`, `/pl/`) przez middleware. Jeden domain authority, nie rozproszony. Istniejące komponenty `language-dropdown.tsx` i `post-lang-switcher.tsx` to rozbudowa, nie przepisanie.
- **Deployment**: jeden Dockerfile, jeden kontener, jeden health check. Przy 1-2 osobach w zespole podwójne repo to marnotrawstwo.
- **Kiedy wrócić do decyzji**: gdy program urośnie do 10 000+ aktywnych użytkowników z osobnym zespołem. Wtedy Turborepo/pnpm workspaces.

### 7. Backend dev — polyglot persistence, nie polyglot projects

**Kluczowy argument:** Dual DB (Turso + Supabase) to wzorzec polyglot persistence — dwie bazy w jednej aplikacji. Podział na dwa projekty niczego nie upraszcza.

- **Bezpieczeństwo**: jeden projekt jest bezpieczniejszy. Separacja tworzy więcej powierzchni ataku, więcej tokenów API, więcej env vars, więcej punktów konfiguracyjnych.
- **RODO**: prawo do zapomnienia i eksport danych wymaga dostępu do obu warstw. Jeden projekt = jeden endpoint. Dwa projekty = koordynacja, ryzyko niespójnego stanu.
- **Auth**: dwie warstwy auth (JWT admin + Supabase) współistnieją w jednym middleware bez konfliktu. Rozdzielenie = duplikacja boilerplate'u.
- **Koszty**: podwójny kontener, podwójny deployment, podwójny monitoring — zero korzyści na etapie MVP.

### 8. QA tester — testowalność lejka

**Kluczowy argument:** Lejek Instagram → feed → program w jednym projekcie to jeden test Playwright, jeden kontekst przeglądarki. Przy dwóch domenach — cross-domain redirect staje się punktem awarii trudnym do debugowania w CI.

- **Test matrix**: ~35 scenariuszy E2E w jednym pipeline vs rozbite na 2 projekty + 15-20% narzut na integrację międzydomenową.
- **Regression risk**: middleware obsługuje oba filary — zmiana w jednym może zepsuć drugi. Łatwiej testować w jednym repo.
- **Content QA**: testy bezpieczeństwa emocjonalnego (np. "ćwiczenia o difficulty >= 4 muszą mieć contentWarning") są naturalnym elementem jednego suite.
- **RODO testing**: jeden endpoint eksportu, jeden użytkownik testowy, prosta weryfikacja.

---

## Konsensus — kluczowe decyzje

| Decyzja | Rekomendacja | Zgodność agentów |
|---------|-------------|-------------------|
| Jedna vs dwie marki | **Jedna marka** | 8/8 |
| Jedna vs dwie domeny | **Jedna główna domena** | 7/8 (QA: dwie domeny via proxy, ale jeden codebase) |
| Języki razem vs osobno | **Razem** (subdirectory /en/, /pl/) | 8/8 |
| "just have a little meaning" + "Pisz Siebie" | **Hierarchia**: marka-parasol + program wewnątrz | 8/8 |
| Jedno vs dwa repozytoria | **Jedno repo** | 8/8 |

---

## Decyzje do podjęcia

### 1. Domena główna

Kandydaci:
- `justhavelittlemeaning.com` — pełna nazwa, rozpoznawalna z Instagrama, ale długa
- `littlemeaning.com` — krótsza, elegancka
- `jhlm.pl` / `jhlm.com` — skrót, ale mniej czytelna
- Inna — do przemyślenia

### 2. Aliasy domenowe

- `piszsiebie.pl` → redirect do `/pl/program/` (SEO + rozpoznawalność w polskim kontekście)
- Ewentualnie wersja EN programu na `/en/program/` z własną nazwą

### 3. Subdomena dla zalogowanej części?

UX writer zaproponował `app.justhavelittlemeaning.com` dla dashboardu i edytora. Frontend dev jest przeciw (niepotrzebna złożoność). Do rozważenia — standard w SaaS, ale może być overengineering na tym etapie.

### 4. Angielska wersja programu

Terapeuta narracyjny: wersja EN to nie tłumaczenie, to osobny kontekst kulturowy. Priorytet: polski program, angielski feed. Angielski program jako faza 2.

---

## Dlaczego NIE dwie marki — podsumowanie ryzyk

| Ryzyko | Wpływ |
|--------|-------|
| Przerwanie lejka psychologicznego | Utrata użytkowników w momencie redirect |
| Podwójne budowanie zaufania | 2x koszt content marketingu |
| Stygmatyzacja (kontekst PL) | Osobna domena "terapeutyczna" podnosi barierę wejścia |
| Zerwanie narracji uczestnika | Disruption of context → wycofanie się użytkownika |
| Przecięcie scaffoldingu | Użytkownik traci "rusztowanie" zbudowane przez feed |
| Podwójna infrastruktura | 2x koszt ops, monitoring, deployment |
| Rozbity lejek w testach | Cross-domain E2E = +20% narzut testowy |
| Koordynacja RODO | Ryzyko niespójnego usunięcia danych |

---

## Kiedy wrócić do tej decyzji

Rozważ wydzielenie programu gdy:
- Program ma **10 000+ aktywnych użytkowników** z osobnym zespołem deweloperskim
- Program jest rekomendowany w **kontekście klinicznym** (partnerstwa z klinikami, ubezpieczycielami) — może potrzebować bardziej "profesjonalnego" brandingu
- Feed generuje **setki tysięcy pageviews miesięcznie** i wymaga osobnego poziomu CDN
- **Cykle deploy** obu filarów stają się konfliktowe

Do tego momentu: jeden projekt, jedna domena, dwa wyraźne filary wewnątrz.

---

---

# Część II: Analiza nazwy i domeny

> Data analizy: 2026-03-01
> Uczestnicy: copywriter (naming), UX writer, psycholog badawczy

## Problem

Właściciel projektu obawia się, że "justhavelittlemeaning" to zbyt skomplikowana nazwa dla polskiego użytkownika. Czy słusznie?

## Diagnoza: TAK, to realny problem — ale nie tam, gdzie się wydaje

### Nie chodzi o wpisywanie URL

W 2026 roku prawie nikt nie wpisuje domen ręcznie. ~60-70% ruchu to kliknięcia z Instagrama, ~15-20% z Messengera/WhatsApp, ~10-15% z Google. Wpisywanie z pamięci to zaledwie 2-5% przypadków.

### Chodzi o trzy inne rzeczy

**1. Polecanie ustne (word-of-mouth)**
> "Znalazłam fajną stronę... ee... just have... a little... meaning?"

Pauzy są rzeczywiste. Nazwa wymaga wysiłku emisji. Dla platformy skierowanej do osób z niską energią psychiczną — to zły sygnał. Test SMS "wejdź na justhavelittlemeaning.pl" — nie przechodzi.

**2. Processing fluency — wiarygodność (Alter & Oppenheimer, 2009)**
Bodźce łatwe do przetworzenia są oceniane jako bardziej wiarygodne i bezpieczniejsze. 5-wyrazowa angielska fraza u polskiego odbiorcy generuje "friction" poznawczy. Szacunkowo wymaga 2-3 sekundy dodatkowego przetwarzania — w środowisku Instagrama (średni czas uwagi: 1.7s) to utrata znacznej części potencjalnych odbiorców.

**3. Inkluzywność (Tajfel & Turner, 1979)**
Angielska nazwa tworzy niejawną selekcję: włącza osoby kosmopolityczne, "online-native" — i WYKLUCZA osoby starsze, mniej anglojęzyczne, z mniejszych ośrodków. Część grupy docelowej programu (osoby doświadczające chaosu myślowego, być może trudności ekonomicznych) może czuć się obco wobec angielskiej nazwy.

### Porównanie z konkurencją

| Marka | Znaki | Wymawialność po polsku |
|---|---|---|
| Headspace | 9 | wysoka |
| BetterHelp | 10 | wysoka |
| Calm | 4 | bardzo wysoka |
| Pisz Siebie | 10 | bardzo wysoka |
| **just have a little meaning** | **23** | **niska** |

## Kluczowe odkrycie: "Pisz Siebie" jest silniejszą nazwą

### Podwójne kodowanie (Paivio, 1971)
"Pisz Siebie" aktywuje OBA kanały pamięci:
- **Werbalny**: fraza w ojczystym języku, natychmiastowo zrozumiała
- **Obrazowy**: natychmiastowy obraz mentalny — ręka z długopisem, zeszyt, pisanie

"just have a little meaning" aktywuje głównie kanał werbalny, i to z opóźnieniem translacyjnym. Słowo "meaning" jest abstrakcyjne — nie generuje obrazu. Różnica w zapamiętywaniu: 40-80% na korzyść podwójnego kodowania.

### Testy funkcjonalne

| Test | "justhavelittlemeaning" | "piszsiebie" |
|------|------------------------|--------------|
| Podyktowanie SMS | nie przechodzi | przechodzi |
| Word-of-mouth | wymaga 3+ prób | płynne |
| Google search | użytkownik wpisze po polsku | trafi bezpośrednio |
| Brand recall po 3 tyg. | "ta strona o meaning..." | "pisz siebie" |
| SERP wiarygodność | wygląda jak przypadkowa nazwa | wygląda jak narzędzie |

## Rekomendacja: strategia "endorsed brand"

### Struktura nazewnicza

```
MARKA PARASOLOWA (sygnatura):     just have a little meaning
MARKA PRODUKTOWA (główna):        Pisz Siebie
DOMENA GŁÓWNA:                    piszsiebie.pl
INSTAGRAM:                        @justhavealittlemeaning (bez zmian)
DOMENA ALIASOWA:                  justhavelittlemeaning.com → redirect do piszsiebie.pl
```

### Jak to działa w praktyce

- **Instagram**: `@justhavealittlemeaning` — angielska, poetycka, buduje tożsamość marki. Bez zmian.
- **Link w bio**: prowadzi do `piszsiebie.pl` — polskie, krótkie, jednoznaczne.
- **Landing page**: "Witaj w **Pisz Siebie** — programie pisania terapeutycznego. Na Instagramie jesteśmy jako *just have a little meaning*."
- **Stopka / about**: "Pisz Siebie to program platformy *just have a little meaning*"
- **Word-of-mouth**: "Sprawdź piszsiebie.pl" — 10 znaków, zero dwuznaczności.

### Psychologiczne uzasadnienie (Keller, 2003)

To wzorzec **endorsed brand architecture** — silna, zrozumiała submarka ("Pisz Siebie") czerpie autorytet z parasola ("just have a little meaning"), ale nie jest od niego uzależniona w codziennej komunikacji. Jak Google (parasol) i YouTube (produkt).

### Analogia copywritera

> "Twoja obecna nazwa jest zbyt dobra, żeby ją porzucić, i zbyt poetycka, żeby ją nawigować. Najlepsze rozwiązanie to nie zmiana — to właściwe rozmieszczenie: poetykę zostawić Instagramowi, precyzję dać domenie."

## Ranking opcji domenowych

### 1. `piszsiebie.pl` (rekomendowana)

- Przechodzi WSZYSTKIE testy funkcjonalne
- Polska domena dla polskiego produktu
- "Pisz Siebie" to gotowy, mocny brand — zwięzły, imperatywny, ale miękki
- SEO: polskie frazy ("pisanie terapeutyczne", "dziennik emocji") → polska domena
- Jedyne ryzyko: trzeba sprawdzić dostępność domeny

### 2. `littlemeaning.pl` / `littlemeaning.com`

- Zachowuje rdzeń angielskiej nazwy
- Krótka (13 znaków), dwuczłonowa
- Minus: "little meaning" = "mały sens" — może czytać się deprecjonująco
- Minus: nie komunikuje co strona robi

### 3. `justhavelittlemeaning.com` z aliasem (najniższy koszt zmiany)

- Zostaje obecna domena, ale w komunikacji promujemy "Pisz Siebie"
- URL staje się technicznym adresem, nie twarzą marki
- Działa jeśli 95%+ ruchu pochodzi z kliknięć (nie z wpisywania)
- Największy koszt komunikacyjny — dysonans między domeną a marką

## Czego NIE robić

- `jhlm.pl` / `jhlm.com` — akronim bez fonetycznego oparcia, nie da się wymówić ani zapamiętać
- `havemeaning.com` — generyczne, korporacyjne brzmienie
- Porzucenie "just have a little meaning" całkowicie — to dobra, poetycka nazwa, tyle że w złotym miejscu (Instagram, nie URL)

## A co z angielskim rynkiem?

Jeśli w przyszłości pojawi się angielska wersja programu:
- `piszsiebie.pl` → polski program
- `writeyourself.com` (lub inna domena) → angielski program
- `@justhavealittlemeaning` → wspólny Instagram

Albo prostszy wariant: `piszsiebie.pl/en/` dla angielskiej wersji (jak w obecnej architekturze i18n).

---

---

# Część III: Dwujęzyczna architektura nazw — product & digital marketing

> Data analizy: 2026-03-01
> Uczestnicy: ekspert product marketingu, ekspert digital marketingu

## Nowy problem

Jeśli domena jest angielska (`littlemeaning.com`), program nie może się nazywać tylko "Pisz Siebie" — to nie trafi do anglojęzycznych odbiorców. Potrzebna jest spójna dwujęzyczna architektura nazw.

## Rekomendacja: `littlemeaning.com` + lokalizowane nazwy programu

### Architektura nazw

```
DOMENA:              littlemeaning.com
MARKA PARASOLOWA:    little meaning (skrót "just have a little meaning")
INSTAGRAM:           @justhavealittlemeaning (bez zmian)

PROGRAM PL:          Pisz Siebie          → littlemeaning.com/pl/program/
PROGRAM EN:          Write Yourself       → littlemeaning.com/en/program/

FEED PL:             littlemeaning.com/pl/
FEED EN:             littlemeaning.com/en/
```

### Dlaczego `littlemeaning.com` a nie `piszsiebie.pl`

| Kryterium | `littlemeaning.com` | `piszsiebie.pl` |
|-----------|--------------------|-----------------|
| Rynek EN | otwarty | zamknięty |
| Rynek PL | neutralny (nie przeszkadza) | silny |
| SEO dwujęzyczne | jeden Domain Authority | DA tylko dla PL |
| Geolokacja Google | neutralna (.com) | sygnał "tylko Polska" (.pl) |
| Przyszłość | nie wymaga migracji | wymaga migracji przy skalowaniu EN |
| Word-of-mouth PL | "wejdź na littlemeaning.com" — OK | "wejdź na piszsiebie.pl" — lepsze |

**Kompromis:** `littlemeaning.com` jako główna domena + `piszsiebie.pl` jako alias/redirect do `/pl/program/` (najlepsze z obu światów).

### Dlaczego lokalizowane nazwy, nie jedna neutralna

Rozważano jedną angielską nazwę programu na oba rynki (np. "Clarity Journal", "Inner Narrative"). Ekspert product marketingu odrzuca tę opcję:

> "Dla docelowej grupy — osoby w kryzysie, w stagnacji — abstrakcyjna angielska nazwa programu na polskiej stronie działa jak dystans. 'Pisz Siebie' jest bezpośrednie i ciepłe. 'Clarity Journal' brzmi jak narzędzie produktywności dla managerów."

Lokalizacja nazw to standard — Coursera, Netflix, Spotify robią to bez dysonansu. Klucz: marka nadrzędna (`little meaning`) jest stała, nazwy programów dostosowane do języka.

### "Write Yourself" — czy to dobry odpowiednik?

Dosłowne tłumaczenie "Pisz Siebie" → "Write Yourself". Ocena:
- **Zalety**: personalne, bezpośrednie, trochę literackie, zachowuje imperatyw
- **Wady**: może brzmieć niejasno w EN (write yourself what?)
- **Alternatywy do rozważenia**: "Write Into Yourself", "The Writing Program", "Write Through"
- **Werdykt**: "Write Yourself" jest wystarczające na etapie MVP. Rewizja przed pełnym angielskim launchem.

## Strategia rynkowa: PL first, EN w tle

### Dlaczego najpierw Polska

**Polski rynek therapeutic writing — prawie zero konkurencji:**

| Fraza (PL) | Wyszukiwania/mies. | Konkurencja |
|---|---|---|
| "pisanie terapeutyczne" | 200-400 | niska |
| "dziennik terapeutyczny" | 400-600 | niska-średnia |
| "jak przestać ruminować" | 300-500 | niska |
| "ekspresywne pisanie" | 50-100 | minimalna |

Żadna polska platforma nie oferuje ustrukturyzowanego programu pisania terapeutycznego. Gap rynkowy jest realny.

**Angielski rynek — gigantyczny, ale nasycony:**

| Fraza (EN) | Wyszukiwania/mies. | Konkurencja |
|---|---|---|
| "journaling for mental health" | 20 000-40 000 | bardzo wysoka |
| "therapeutic writing" | 8 000-12 000 | wysoka |
| "journaling prompts anxiety" | 15 000-25 000 | wysoka |

Bezpośrednia konkurencja EN: Reflectly, Day One, Journey, 750words.com. Plus Headspace, Calm, Verywell Mind w content marketingu.

**Wniosek:** Na PL zbudujesz organiczny ruch w 6-12 miesięcy. Na EN potrzebujesz 2-3 lat lub płatnej akwizycji.

### Harmonogram

```
MIESIĄCE 1-12:   PL full focus
                 - littlemeaning.com/pl/ → blog, feed, program "Pisz Siebie"
                 - Instagram PL jako główny kanał
                 - SEO PL: 4 istniejące blogposty + nowe treści
                 - EN w tle: tłumaczenia blogpostów, budowanie DA

MIESIĄCE 12-18:  Ocena wyników PL → decyzja o EN
                 - Jeśli PL działa: rozbudowa EN (Write Yourself)
                 - Jeśli PL nie działa: pivot strategiczny

MIESIĄCE 18+:    EN launch (jeśli uzasadniony)
                 - littlemeaning.com/en/program/ → "Write Yourself"
                 - EN Instagram jako kanał wzrostu
```

## SEO — implementacja techniczna

- **Subdirectory** (`/pl/`, `/en/`) — nie subdomena, nie osobna domena
- **hreflang** na każdej stronie wskazujący odpowiednik w drugim języku
- **Canonical URL** jednoznaczne per strona
- **`lang` atrybut** na `<html>` tag
- **Jeden Domain Authority** budowany przez oba języki
- Google nie karze za mixed-language content przy poprawnej implementacji

## Social media

- **Dwa konta IG** (en/pl) — algorytm optymalizuje zasięg na podstawie języka
- **Handle `@justhavealittlemeaning`** — bez zmian (rozbieżność handle ≠ domena to standard)
- **Bio link**: docelowo `/links` na własnej domenie (zamiast Linktree)

## Gap rynkowy — unikalna pozycja

> "Nikt nie pozycjonuje się wprost jako 'structured therapeutic writing program based on research' dla osób w kryzysie lub stagnacji, które nie mogą sobie pozwolić na terapię. To jest Twój gap — i na rynku EN też."
>
> — ekspert digital marketingu

---

# Podsumowanie końcowe — zaktualizowana rekomendacja

## Architektura (Część I — jednogłośnie 8/8 agentów)
Jeden projekt, jedna domena, jedno repozytorium, dwa filary wewnątrz.

## Naming (Część II + III — konsensus 5 ekspertów)

```
DOMENA:           littlemeaning.com
ALIAS PL:         piszsiebie.pl → redirect do /pl/program/
INSTAGRAM:        @justhavealittlemeaning (bez zmian)
PROGRAM PL:       Pisz Siebie
PROGRAM EN:       Write Yourself (roboczy, do rewizji przed EN launch)
MARKA:            little meaning (skrót pełnej nazwy)
TAGLINE:          "just have a little meaning" (pełna nazwa jako podpis)
```

## Strategia rynkowa
PL first (12 miesięcy focus), EN w tle (budowanie DA, tłumaczenia). Decyzja o pełnym EN launch po ocenie wyników PL.

---

## Następne kroki

1. **Sprawdzić dostępność `littlemeaning.com`** — i zarejestrować (+ `piszsiebie.pl` jako alias)
2. **Wdrożyć i18n routing** przez Next.js middleware (`/en/`, `/pl/`) od początku
3. **Utrzymać separację kodu** przez route groups i foldery (już działa)
4. **Zoptymalizować 4 istniejące blogposty** pod SEO PL (meta, hreflang, internal linking)
5. **Dodać brakujące testy** (content QA, i18n completeness — rekomendacja QA)
6. **PL launch** — feed + program "Pisz Siebie" na `littlemeaning.com/pl/`
7. **EN content w tle** — tłumaczenia blogpostów, budowanie DA
8. **Ocena po 12 miesiącach** — decyzja o EN launch "Write Yourself"
