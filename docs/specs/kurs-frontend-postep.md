# Frontend kursów: postęp, lista praktyk, utrzymanie

Specyfikacja warstwy, która ma sprawić, że ludzie nie porzucą kursu po dniu
drugim. Uzupełnia `kurs-przypomnienia-mailerlite.md` (poczta) i dotyczy obu
kursów (`kurs-wdziecznosci`, `kurs-niescrollowania`), bo oba jadą na tym samym
silniku z `src/lib/courses/`.

Stan na 2026-09-12. Autor decyzji produktowych: Kamil. Wskazówki z rozmowy o
ryzyku porzucania, zapisane do wdrożenia.

## 1. Zasada nadrzędna: postęp tak, presja nie

CLAUDE.md: „brak presji: zero timerów, streaks, gamifikacji opartej na presji".
Landing kursu obiecuje: „Nie ma pass, liczników ani spóźnień. Kurs po prostu
czeka, aż wrócisz." Każdy element poniżej musi przejść ten test:

- Pokazujemy, ile ktoś zrobił. Nigdy, ile dni z rzędu ani ile pominął.
- Nieodhaczona praktyka nie ma stanu „pominięta". Wczorajszy dzień znika z listy,
  nie zostaje jako wyrzut.
- Żadnych czerwonych kolorów, liczników wstecznych, „straciłeś serię".
- Przerwa w kursie nie resetuje niczego. Po powrocie użytkownik widzi ten sam
  stan, co przed przerwą, plus odblokowane dni.

## 2. Odblokowywanie dzień po dniu

Kolejny dzień otwiera się następnego dnia o 6:00, licząc od otwarcia dnia
poprzedniego (`isDayUnlocked` w `src/lib/course.ts`). Udostępnienie wszystkiego
naraz zabiłoby praktykę, bo jej sensem jest noc między lekcjami. Nie dodajemy
opcji „odblokuj wszystko". Po dłuższej przerwie otwiera się dokładnie jeden
następny dzień, nigdy kilka.

Zmiana z 2026-09-15: warunkiem gotowości dnia poprzedniego jest zaliczony
quiz, nie kliknięcie „Zakończ dzień". Ludzie praktykują wieczorem i idą spać;
poranek nie może ich witać zamkniętym dniem z powodu nieklikniętego przycisku.
Przycisk zostaje jako domknięcie (zapisuje notatnik, pokazuje wieczorną
dopiskę), a gdy ktoś go nie kliknie, otwarcie kolejnego dnia samo oznacza
poprzedni jako ukończony (`/api/course/day`, przy `start`). Po kliknięciu
„Zakończ dzień": jeśli następny dzień jest już otwarty, przenosimy tam od
razu; jeśli nie, pokazujemy „otworzy się dziś/jutro o 6:00" (`unlockStatus`)
i przewijamy do tej informacji zamiast odświeżać stronę.

## 3. Sidebar „Moje praktyki"

Cel: użytkownik nie musi skakać po dniach, żeby przypomnieć sobie, co dziś robi.

### 3.1 Skąd bierze się lista

Każdy dzień kursu wnosi jedną praktykę (`CourseDay.challenge`). Lista w sidebarze
to praktyki ze wszystkich odblokowanych dni, które są **codzienne**. Praktyki
jednorazowe (np. dzień 1 kursu wdzięczności: „trzy rzeczy, teraz") pokazują się
tylko w dniu, w którym zostały zadane.

Wymaga to jednego nowego pola w typie `CourseDay.challenge`:

```ts
challenge: {
  lead: string;
  body: string[];
  minimal: string;
  evening?: string;
  /** "daily": trafia do listy Moje praktyki od dnia odblokowania.
   *  "once": tylko w swoim dniu. Domyślnie "daily". */
  cadence?: "daily" | "once";
  /** Pora dnia dla grupowania w sidebarze. */
  slot?: "morning" | "day" | "evening";
}
```

Dla kursu wdzięczności: dzień 1 `once`; dzień 2 `day`; dzień 3 `morning`;
dzień 4 `evening`; dzień 5 `day`; dzień 6 `day`; dzień 7 `day` (wyzwalacz,
nie pora).

### 3.2 Co pokazuje każda pozycja

- Nazwa praktyki (`challenge.lead`), np. „Jedno zdanie po przebudzeniu".
- Druga linijka: wersja minimalna (`challenge.minimal`). Zawsze widoczna, nie
  schowana pod „więcej". To obniża próg w gorszy dzień i jest zgodne z tonem
  kursu.
- Checkbox „zrobione dziś". Odhaczenie zapisuje się (patrz 5). Bez animacji
  fajerwerków, wystarczy spokojne potwierdzenie.
- Link do dnia, z którego praktyka pochodzi, dla przypomnienia pełnego opisu.

Grupowanie po `slot`: Rano / W ciągu dnia / Wieczorem. Wieczorna praktyka może
dodatkowo pokazać `challenge.evening`, jeśli dzień je ma.

### 3.3 Lista nie może rosnąć bez końca

Do dnia siódmego zbiera się pięć, sześć codziennych praktyk, a dzień siódmy
mówi wprost: „Nie potrzebujesz wszystkich pięciu praktyk. Potrzebujesz jednej
kotwicy, która zostanie." Sidebar, który tego dnia pokazuje sześć zadań,
zaprzecza tekstowi.

Rozwiązanie:

- Od dnia piątego każda praktyka ma pinezkę „to moja kotwica".
- Przypięte praktyki są na górze, zawsze rozwinięte. Reszta zwija się do
  sekcji „Inne praktyki z kursu".
- Jeśli użytkownik nic nie przypiął do dnia siódmego, dzień siódmy prosi o
  wybór jednej kotwicy w miejscu praktyki (to i tak jest treść tego dnia).
- Po zakończeniu kursu sidebar zostaje dostępny z poziomu `/profil` jako
  „Moje kotwice", tylko z przypiętymi praktykami. To jest most między kursem a
  dalszą praktyką, i między kursem a programem pisania.

### 3.4 Rotacja podpowiedzi

Emmons: praktyka umiera z nudy, dlatego trzeba zmieniać, o czym się pisze.
Przy praktykach typu lista (wieczorne trzy momenty, poranne zdanie) sidebar
podsuwa codziennie inną podpowiedź z krótkiej puli, np.:

- „Kto dziś zrobił coś dla ciebie, choćby drobnego?"
- „Jaki moment był lepszy, niż się spodziewałeś?"
- „Co dziś było na miejscu, choć mogło się zepsuć?"

Pula w pliku kursu, pole `challenge.prompts?: string[]`, wybór po numerze dnia
od zapisu, żeby był deterministyczny i nie powtarzał się dzień po dniu.

## 4. Postęp na stronie dnia i w profilu

- Pasek lub siedem kropek: ile dni ukończonych z siedmiu. Kropka pusta dla dni
  jeszcze nieodblokowanych, wypełniona dla ukończonych, bez rozróżnienia
  „ukończony w terminie" i „ukończony po przerwie".
- Licznik praktyk: „Zrobione praktyki: 14". Rośnie, nigdy nie maleje.
- Po ukończeniu dnia: jedno zdanie potwierdzenia w tonie kursu, bez odznak.
- Nie pokazujemy: dni z rzędu, procent „skuteczności", porównań z innymi.

## 5. Model danych

Istniejące tabele zostają: `course_enrollments`, `course_day_progress`
(check-in o poprzednim dniu w `checkin_choice`, quiz w `quiz_answers`),
`course_feedback`. Dochodzi jedna:

```sql
CREATE TABLE course_practice_log (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  practice_day INTEGER NOT NULL,      -- dzień, z którego pochodzi praktyka
  done_on DATE NOT NULL,              -- dzień kalendarzowy odhaczenia (strefa użytkownika)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_slug, practice_day, done_on)
);
-- RLS jak w course_day_progress: własne wiersze, select/insert/delete.
```

Plus pinezki:

```sql
ALTER TABLE course_enrollments
  ADD COLUMN pinned_practices INTEGER[] NOT NULL DEFAULT '{}';
```

Odhaczenie to insert, cofnięcie to delete. Żadnych treści użytkownika, więc
bez szyfrowania. Eksport RODO (`/api/program/data-export`) musi objąć nową
tabelę, usunięcie konta kasuje kaskadowo.

## 6. Pomiar (to, czego dziś nie ma)

Bez tego nie da się kursu poprawiać inaczej niż na wyczucie. Z powyższych
tabel da się policzyć w panelu admina (`/admin/kurs`):

- Odsetek zapisanych, którzy ukończyli każdy dzień (krzywa porzucania). Dziś
  najważniejsze pytanie brzmi: czy ludzie znikają w dniu drugim, czy trzecim.
- Która praktyka jest odhaczana najrzadziej i która wypada pierwsza po
  wprowadzeniu kolejnej.
- Odsetek ukończeń dnia siódmego i rozkład ocen w `course_feedback`.
- Ile osób przypięło kotwicę i które praktyki wybierają.

Definicja sukcesu do ustalenia przed startem, np. „40 procent zapisanych
kończy dzień siódmy". Liczba jest do dyskusji, ważne, żeby istniała.

## 7. Współpraca z przypomnieniami mailowymi

Mail dzienny (patrz `kurs-przypomnienia-mailerlite.md`) powinien zawierać to
samo, co sidebar: nazwę dzisiejszej praktyki i jej wersję minimalną, plus link
prosto do dnia. Personalizacja: jeśli użytkownik przypiął kotwicę, mail
przypomina o kotwicy, nie o całej liście. Jeśli od trzech dni nie odhaczył
niczego, mail nie mówi o tym ani słowem. Mówi: „Dzień N czeka. Wersja
minimalna zajmie minutę."

## 7a. Powrót do kursu i ponowne przejście

Tekst dnia siódmego obiecuje dwie rzeczy i obie muszą być prawdą w interfejsie.

**Powrót do dowolnego dnia (działa dziś).** Po ukończeniu wszystkie dni
zostają otwarte i czytelne razem z praktykami. Do zrobienia: w `/profil` przy
ukończonym kursie lista siedmiu dni z jednym zdaniem „kiedy tu wrócić", np.
dzień 2: „kiedy narzekanie znów wygrywa", dzień 4: „kiedy wieczory zrobiły
się ciężkie", dzień 7: „kiedy jest po prostu źle". Bez odblokowań i bez
liczników, to jest biblioteczka, nie kurs.

**Ponowne przejście od początku (do zrobienia).** Dziś `course_enrollments`
ma `UNIQUE (user_id, course_slug)`, a ponowny zapis jest ignorowany, więc
„zacznij od nowa" nie istnieje. Propozycja najmniejszej zmiany:

- przycisk „Przejdź kurs jeszcze raz" widoczny tylko przy `completed_at`
  ustawionym;
- kliknięcie zapisuje poprzednie przejście do archiwum (nowa kolumna
  `run INTEGER NOT NULL DEFAULT 1` w `course_day_progress` i
  `course_practice_log`, klucz główny rozszerzony o `run`), zeruje
  `completed_at` w zapisie i ustawia `current_run = run + 1`;
- dni odblokowują się znów po jednym, od 6:00 następnego dnia;
- check-iny i quizy z poprzedniego przejścia nie są pokazywane, ale zostają
  w bazie do eksportu RODO i do statystyk (ile osób wraca po drugi raz to
  jedna z lepszych miar, czy kurs coś dał).

Przypięte kotwice (`pinned_practices`) przechodzą do nowego przejścia bez
zmian, bo to jest właśnie to, co ktoś już ma, a kurs ma to wzmocnić.

## 8. Kolejność wdrożenia

1. Pole `cadence` i `slot` w typach, uzupełnienie obu kursów.
2. Sidebar z listą i checkboxami, tabela `course_practice_log`, endpoint w
   `src/app/api/course/`.
3. Kropki postępu i licznik praktyk na stronie dnia.
4. Pinezki, `pinned_practices`, widok „Moje kotwice" w profilu.
5. Rotacja podpowiedzi.
6. Statystyki w `/admin/kurs`.

Punkty 1 do 3 dają większość efektu. Reszta może przyjść po pierwszych danych.

## 9. Sprawy otwarte

- Strefa czasowa dla `done_on`: brać z przeglądarki przy odhaczaniu i zapisać
  w `course_enrollments`, czy liczyć po czasie serwera? Rekomendacja:
  z przeglądarki, jak przy odblokowaniu o 6:00.
- Czy sidebar ma być widoczny na landingu dla zalogowanych, czy tylko na
  stronach dni? Rekomendacja: na stronach dni i w profilu.
- Kurs nieskrollowania ma `challengeNoun: "wyzwanie"`. Etykieta sekcji musi
  brać słowo z kursu: „Moje praktyki" vs „Moje wyzwania".
