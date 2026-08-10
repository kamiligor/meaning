import type { Course } from "./types";

/**
 * "Kurs niescrollowania" (Polish only, like the writing program).
 * Factual basis and attribution rules live in
 * docs/content/kurs-niescrollowania.md — nothing here goes beyond them.
 */
export const niescrollowanieCourse: Course = {
  slug: "kurs-niescrollowania",
  path: "/kurs-niescrollowania",
  name: "Kurs niescrollowania",
  tagline: "5 dni nauki nudzenia się.",
  metaTitle: "Kurs niescrollowania. 5 dni nauki nudzenia się | po prostu sens",
  metaDescription:
    "Darmowy 5-dniowy mini kurs: codziennie dawka wiedzy, krótki quiz i jedno wyzwanie. Trening bycia z własnymi myślami zamiast scrollowania.",
  heroDescription:
    "Przez pięć dni trenujesz jedną umiejętność: bycie z własnymi myślami, zaczynając od trzech minut, kończąc na kwadransie. To eksperyment, nie odwyk.",
  howItWorks: [
    "Jeden dzień naraz. Kolejny dzień otwiera się następnego dnia o 6 rano, bo wyzwanie potrzebuje całego dnia, żeby się wydarzyć.",
    "Każdy dzień to krótkie kroki: dawka wiedzy, mały quiz bez punktów i jedno konkretne wyzwanie, a od drugiego dnia także opis, jak poszło ostatnio.",
    "Wyzwania rosną powoli: pierwszego dnia zmienia się tylko jedna myśl, ostatniego siedzisz kwadrans z jednym pytaniem.",
    "Przerwa niczego nie psuje. Nie ma pass, liczników ani spóźnień. Kurs po prostu czeka, aż wrócisz.",
  ],
  aboutHeading: "Umowa jest prosta",
  aboutParagraph:
    "Kurs opiera się na materiałach Arthura Brooksa, profesora Harvardu badającego szczęście, oraz na badaniach nad nudą i nawykami. Nie obiecujemy nowego życia w 5 dni. Obiecujemy pierwsze doświadczenie tego, że z pustą chwilą da się być, i plan, jak to utrzymać.",
  askBaseline: true,
  challengeNoun: "wyzwanie",
  days: [
    {
      day: 1,
      title: "Stan domyślny",
      knowledge: [
        "Przypomnij sobie moment tuż po przebudzeniu, zanim ręka sięgnie po telefon. Głowa sama z siebie już coś robi: przelatuje po wczorajszej rozmowie, planuje dzień, wraca do sprawy sprzed tygodnia. To nie jest szum. To stan domyślny mózgu (ang. default mode network), tryb, w który wchodzi zawsze, kiedy nie dostaje zadania z zewnątrz. W tym trybie mózg porządkuje wspomnienia i planuje przyszłość. Arthur Brooks, profesor Harvardu, który od lat bada, skąd bierze się szczęście, podkreśla, że tylko wtedy mózg zadaje sobie pytania o to, co ważne. Nuda to nie przestój. To czas, w którym mózg pracuje nad twoimi sprawami, a nie nad tym, co właśnie podsunął mu ekran.",
        "Problem w tym, że dziś ten tryb prawie nigdy nie dostaje szansy. Brooks przywołuje dane, z których wynika, że przeciętny człowiek zagląda w telefon jakieś 205 razy dziennie. Nie 205 razy, kiedy naprawdę czegoś potrzebuje. W większości to odruchy, których nie pamięta się minutę później: czekasz na windę, parzysz herbatę, głowa robi się pusta na sekundę i ręka sama sięga po telefon.",
        "I tu jest haczyk. W badaniu z 2021 roku, które Brooks cytuje, ludzie sięgający po telefon w chwilach nudy kończyli te chwile bardziej znudzeni i bardziej zmęczeni, nie mniej. Nuda, scroll, głębsza nuda, głębszy scroll. Koło się zamyka. A chwile nudy są prawie jedynym momentem, w którym mózg ma czas zadać sobie pytania o to, co ważne. Kto nigdy się nie nudzi, temu trudniej wiedzieć, po co właściwie to wszystko robi.",
        "Nuda ma też praktyczny skutek uboczny, który polubisz: rzeczy odkładane tygodniami nagle robią się ciekawe. Kiedy pod ręką nie ma nic łatwiejszego, zaległy mail, porządek w szufladzie albo trudna rozmowa przestają przegrywać każde porównanie z telefonem i stają się najciekawszą dostępną opcją. Dlatego Brooks radzi trenować coraz dłuższe odcinki nudy, docelowo powyżej piętnastu minut dziennie. Brzmi dużo, ale właśnie po to jest ten kurs: zaczniemy od trzech minut i do piątego dnia dojdziemy do kwadransa.",
      ],
      quiz: [
        {
          question: "Co robi mózg, kiedy się nudzisz?",
          options: [
            {
              text: "Przechodzi w tryb oszczędzania energii, jak telefon",
              correct: false,
              explanation:
                "Właśnie nie. Tryb „nicnierobienia” to jedna z najbardziej aktywnych sieci mózgu.",
            },
            {
              text: "Porządkuje wspomnienia, planuje i szuka sensu",
              correct: true,
              explanation:
                "Tak. Ten tryb wyłącza się dopiero wtedy, kiedy mózg dostaje bodziec z zewnątrz. Na przykład telefon.",
            },
            {
              text: "Czeka na bodziec, nic więcej",
              correct: false,
              explanation:
                "Wygląda to tak od środka, ale w tle mózg pracuje wtedy nad rzeczami, na które nigdy nie ma czasu.",
            },
          ],
        },
        {
          question: "Co pokazało badanie o sięganiu po telefon w chwilach nudy?",
          options: [
            {
              text: "Krótka przerwa na telefon odświeża głowę",
              correct: false,
              explanation:
                "Brzmi sensownie, ale wyszło odwrotnie: po telefonie ludzie byli bardziej znudzeni i zmęczeni.",
            },
            {
              text: "Telefon pomaga, ale tylko do 5 minut",
              correct: false,
              explanation:
                "Nie było takiej granicy. Sięganie po telefon z nudów pogłębiało nudę, nie skracało jej.",
            },
            {
              text: "Po telefonie ludzie byli bardziej znudzeni i zmęczeni",
              correct: true,
              explanation:
                "Dokładnie. To dlatego scrollowanie z nudów nigdy nie ma końca: nie leczy nudy, tylko ją odracza i pogłębia.",
            },
          ],
        },
        {
          question:
            "Ile razy dziennie przeciętny człowiek zagląda w telefon (wg danych, które przywołuje Brooks)?",
          options: [
            {
              text: "Około 60",
              correct: false,
              explanation: "Więcej. Dane, które przywołuje Brooks, mówią o około 205 razach.",
            },
            {
              text: "Około 205",
              correct: true,
              explanation:
                "Tak, około 205. W większości to odruchy, nie decyzje, i właśnie dlatego tak trudno je zauważyć.",
            },
            {
              text: "Około 500",
              correct: false,
              explanation:
                "Aż tak źle nie jest. Około 205, ale to i tak mniej więcej raz na pięć minut na jawie.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Nuda to stan pożądany",
        body: [
          "Za każdym razem, kiedy poczujesz ochotę na telefon, zatrzymaj się na sekundę i zauważ sytuację: co właśnie robisz? Czekasz? Nudzisz się? Jeśli to nuda, przypomnij sobie jedno zdanie: **nuda to stan pożądany**, mózg właśnie dostał czas dla siebie.",
          "Dzisiejsze zadanie to zauważać i notować te momenty: gdzie to było, co się działo i co się wtedy odezwało, nuda, stres czy zwykłe przyzwyczajenie. Możesz zapisywać je w notatniku pod wyzwaniem (otworzy się, gdy je przyjmiesz) albo we własnym notesie, ważne, żeby był pod ręką.",
        ],
        minimal:
          "Jeśli dziś nie wyjdzie nic więcej, wystarczy zauważyć jeden taki moment.",
        evening:
          "Wieczorem lub jutro rano przejrzyj notatki: w ilu sytuacjach ręka szła po telefon? Która z nich zaskoczyła cię najbardziej?",
      },
    },
    {
      day: 2,
      title: "Ochota to nie rozkaz",
      checkinAboutPrevious: {
        question: "Jak poszło przypominanie sobie, że nuda to stan pożądany?",
        options: [
          {
            value: "often",
            label: "Przypominało się często",
            response:
              "To dużo jak na pierwszy dzień. Samo zauważanie tych momentów to już połowa całego kursu.",
          },
          {
            value: "few",
            label: "Kilka razy",
            response:
              "Kilka razy zupełnie wystarczy. Automatyzmy działają szybciej niż uwaga, więc każde złapanie się liczy się podwójnie.",
          },
          {
            value: "none",
            label: "Wyleciało z głowy",
            response:
              "To najnormalniejszy wynik pierwszego dnia. Automatyzmy właśnie na tym polegają, że działają, zanim się je zauważy. Dziś nowa próba, z konkretniejszym narzędziem.",
          },
        ],
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Dyskomfort nudy jest prawdziwy, to nie wymysł. W jednym z badań ludzie mieli do wyboru siedzieć kilka minut samotnie z własnymi myślami albo dać się razić prądem, i część wybrała prąd. To pokazuje, że warto ten dyskomfort traktować serio, nie wyśmiewać go w sobie.",
        "Jest jednak różnica między dyskomfortem jako sygnałem i dyskomfortem jako rozkazem. Sygnał mówi tylko: teraz nic się nie dzieje, głowa nie ma bodźców. Rozkazem robi go dopiero ręka, która automatycznie sięga po telefon, żeby to uczucie natychmiast wyłączyć. Między jednym a drugim jest moment, w którym można coś wybrać.",
        "Impuls ma też cichego wspólnika: przekonanie, że trzeba być na bieżąco. To ono podpowiada, że właśnie coś się dzieje i zaraz coś przepadnie. Prawda jest mniej dramatyczna: wiadomości, powiadomienia i cudze relacje spokojnie poczekają, a nic się nie stanie, jeśli przeczytasz je z kilkugodzinnym poślizgiem. Dwa pokolenia temu wiadomości sprawdzało się raz dziennie i świat się od tego nie kończył.",
        "Brooks bardzo lubi jedno słowo: metapoznanie, czyli umiejętność patrzenia na własne emocje z boku, zamiast automatycznie na nie reagować. W praktyce ochota na telefon zachowuje się jak fala: narasta, ma szczyt i opada sama, zwykle w minutę lub dwie, jeśli się jej nie nakarmi. Nie trzeba z nią walczyć. Wystarczy ją przeczekać, patrząc, co robi.",
      ],
      quiz: [
        {
          question: "Co się dzieje z ochotą na telefon, jeśli się jej nie ulegnie?",
          options: [
            {
              text: "Rośnie w nieskończoność, aż w końcu wygra",
              correct: false,
              explanation:
                "Tak to czuć w pierwszej minucie, ale ochota działa jak fala: ma szczyt, po którym opada sama.",
            },
            {
              text: "Opada sama, jak fala",
              correct: true,
              explanation:
                "Tak. Zwykle wystarczy minuta lub dwie. Dzisiejsze wyzwanie pozwoli to sprawdzić na sobie.",
            },
            {
              text: "Zostaje na tym samym poziomie do wieczora",
              correct: false,
              explanation:
                "Na szczęście nie. Impulsy są krótkie, tylko rzadko dajemy im szansę pokazać, że umieją się skończyć.",
            },
          ],
        },
        {
          question: "Czym różni się sygnał od rozkazu?",
          options: [
            {
              text: "Niczym, to dwa słowa na to samo",
              correct: false,
              explanation:
                "Różnica jest spora: sygnał tylko informuje („nic się nie dzieje”). Rozkazem robi go dopiero automatyczna reakcja.",
            },
            {
              text: "Sygnał informuje, rozkazem robi go dopiero automatyczna reakcja",
              correct: true,
              explanation:
                "Dokładnie. A między sygnałem a reakcją jest moment wyboru. Ten kurs trenuje właśnie ten moment.",
            },
          ],
        },
        {
          question:
            "Co się stanie, jeśli sprawdzisz wiadomości kilka godzin później, a nie od razu?",
          options: [
            {
              text: "Coś ważnego mnie ominie",
              correct: false,
              explanation:
                "Naprawdę ważne wiadomości znajdują cię same, zwykle kilkoma drogami naraz. Reszta może poczekać albo zniknąć bez straty.",
            },
            {
              text: "Nic. Wszystko spokojnie poczeka",
              correct: true,
              explanation:
                "To całe odkrycie. Impuls obiecuje pilność, której nie ma, i na tym złudzeniu trzyma się większość zerkania.",
            },
            {
              text: "Wypadnę z obiegu",
              correct: false,
              explanation:
                "Obieg wygląda na szybki tylko z bliska. Z kilkugodzinnego dystansu widać, że prawie nic w nim nie wymagało twojej natychmiastowej obecności.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Policz fale",
        body: [
          "Licz dziś kreskami, na kartce, w notatce, jak wygodnie, każdą ochotę na telefon. Nie liczysz użyć, liczysz same ochoty, nawet jeśli w połowie z nich faktycznie po niego sięgniesz. Tego zadania nie da się oblać.",
          "Przy trzech dowolnych z tych ochot zostań z nią minutę, zanim zdecydujesz, co dalej. Obserwuj, gdzie ją czuć i co robi: narasta, faluje, opada?",
          "Wieczorem pierwszy trening: trzy minuty siedzenia bez niczego. Bez telefonu, bez muzyki, bez celu. Najgorsza bywa pierwsza minuta, kiedy głowa zaczyna podsuwać wszystko, co jeszcze trzeba zrobić. Zobacz, co podsunie twoja.",
        ],
        minimal:
          "Wersja minimalna: same kreski, bez obserwowania. Albo jedna minuta ciszy wieczorem.",
        evening: "Wieczorem: ile było kresek? Fala rzeczywiście opadała, czy raczej wygrywała?",
      },
    },
    {
      day: 3,
      title: "Czekanie jest twoje",
      checkinAboutPrevious: {
        question: "Jak poszły kreski i fale?",
        options: [
          {
            value: "full",
            label: "Kreski były, fale też obserwowane",
            response:
              "To już jest realny trening, nie czytanie o treningu. Dzisiejszy dzień będzie miał gdzie zapuścić korzenie.",
          },
          {
            value: "partial",
            label: "Były same kreski",
            response:
              "Kreski to najważniejsza część: pokazują skalę zjawiska. Obserwowanie fal można dołożyć dziś, przy okazji czekania.",
          },
          {
            value: "none",
            label: "Nie wyszło",
            response:
              "Nic straconego. Nie ma tu passy do zepsucia ani licznika porażek. Zaczynasz dzień tam, gdzie jesteś, a dzisiejsze wyzwanie jest konkretniejsze, więc bywa łatwiejsze.",
          },
        ],
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Kolejka w sklepie, działa jedna kasa na dwanaście osób. Telefon w kieszeni zaczyna ciążyć już po kilku sekundach i zwykle ląduje w ręku, zanim zapadnie jakakolwiek decyzja.",
        "Brooks pisze o czekaniu coś otrzeźwiającego: próba wyeliminowania czekania z życia, szybsze kasy, sprawniejsze aplikacje, kolejki online, jest z góry przegrana, bo do każdej wygody przywykamy w tydzień i znowu czekanie na cokolwiek wydaje się nie do zniesienia. Zamiast walczyć ze światem, proponuje zmienić to, kim się jest w tej kolejce.",
        "Konkretnie poleca ćwiczenie za psycholożką Ellen Langer: uważność to nic więcej niż zauważanie nowych rzeczy. W miejscu, które zna się na pamięć, zawsze jest coś jeszcze niezauważonego, jeśli poświęcić temu trzydzieści sekund.",
        "Jest jeszcze drugie ćwiczenie, mocniejsze i, nie ma co ukrywać, trochę zawstydzające przy pierwszej próbie: życzenie w myślach czegoś dobrego osobom w tej samej kolejce. Nic głośnego, nic widocznego. Badania, które Brooks przytacza, pokazują, że taka praktyka zwiększa cierpliwość, a ludzie cierpliwsi są zwyczajnie bardziej zadowoleni z życia.",
      ],
      quiz: [
        {
          question: "Dlaczego szybsze kasy i sprawniejsze aplikacje nie leczą zniecierpliwienia?",
          options: [
            {
              text: "Bo do każdej wygody przywykamy i próg irytacji wraca",
              correct: true,
              explanation:
                "Tak. Przyzwyczajenie zjada każdą wygodę w mniej więcej tydzień. Dlatego Brooks radzi zmieniać siebie w kolejce, nie kolejkę.",
            },
            {
              text: "Bo kolejki i tak zawsze będą za długie",
              correct: false,
              explanation:
                "Kolejki bywają coraz krótsze. Problem w tym, że próg irytacji obniża się razem z nimi.",
            },
            {
              text: "Bo ludzie lubią narzekać",
              correct: false,
              explanation:
                "Nie o narzekanie chodzi. Mechanizm nazywa się przyzwyczajeniem: każda wygoda szybko staje się nowym zerem.",
            },
          ],
        },
        {
          question: "Co Ellen Langer nazywa uważnością?",
          options: [
            {
              text: "Godzinną medytację w ciszy",
              correct: false,
              explanation:
                "Nie trzeba maty i kadzidełka. W ujęciu Langer wystarczy zauważanie nowych rzeczy tam, gdzie się właśnie jest.",
            },
            {
              text: "Zauważanie nowych rzeczy",
              correct: true,
              explanation:
                "Właśnie tak, nic więcej. I da się to robić w każdej kolejce, bez żadnego sprzętu.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Każda kolejka bez telefonu",
        body: [
          "Dziś każda chwila czekania, jaka się w ciągu dnia zdarzy, jest bez telefonu. Kolejka, przystanek, winda, czajnik, poczekalnia, toaleta, cokolwiek. W każdej takiej chwili spróbuj znaleźć coś, czego wcześniej nie było widać, choćby jedną rzecz.",
          "Dla chętnych wersja mocniejsza: pomyśl coś dobrego o kimś obcym w tej samej kolejce.",
          "Trening dnia rośnie do pięciu minut siedzenia bez niczego.",
        ],
        minimal:
          "Jeśli nie trafi się żadna naturalna chwila czekania, wystarczy jedna wizyta w toalecie bez telefonu albo jedna kolejka.",
        evening:
          "Wieczorem: co rzuciło się w oczy w miejscu, w którym bywasz codziennie? Znalazła się dziś jakaś kolejka, która okazała się nawet w porządku?",
      },
    },
    {
      day: 4,
      title: "Co zostaje w pamięci",
      checkinAboutPrevious: {
        question: "Jak poszło czekanie bez telefonu?",
        options: [
          {
            value: "many",
            label: "Udało się w kilku miejscach",
            response:
              "Czekanie przestaje być wrogiem szybciej, niż się wydaje. To dokładnie ten mechanizm, na którym stoi reszta kursu.",
          },
          {
            value: "once",
            label: "Raz się udało",
            response: "Jeden świadomy raz to więcej niż zero. Te chwile sumują się po cichu.",
          },
          {
            value: "none",
            label: "Telefon wygrywał",
            response:
              "Telefon gra na swoim boisku, ma przewagę. Dzisiejsze wyzwanie zabiera mu trochę tej przewagi, bo dotyczy tego, co po scrollowaniu zostaje. Spoiler: niewiele.",
          },
        ],
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Mały test na początek: spróbuj sobie przypomnieć, co przewijało się na twoim ekranie trzy dni temu. Konkretnie, choć jeden filmik, choć jeden post. Zwykle: nic. A rozmowę sprzed trzech dni, nawet całkiem nieważną, o niczym szczególnym, najczęściej da się przypomnieć.",
        "To dokładnie różnica, o której pisze Brooks: przyjemność i radość to nie to samo, choć w danym momencie wydają się podobne. Przyjemność jest samotna i nie zostawia po sobie żadnego śladu, stąd nikt nie pamięta wczorajszego scrollowania. Radość to przyjemność plus dwa dodatkowe elementy: ludzie i pamięć. Coś, co robi się z kimś, i coś, co zostaje w głowie dłużej niż pięć minut.",
        "Z tego rozróżnienia Brooks robi prosty test na każdą aplikację, każdą technologię: czy to uzupełnienie tego, czego się naprawdę chce (bliskości, wiedzy, poczucia sensu), czy podróbka, która to zastępuje. Rozmowa z przyjacielem przez telefon uzupełnia. Przewijanie zdjęć nieznanych ludzi zastępuje, bez względu na to, jak dobrze wygląda ich życie na zdjęciu.",
      ],
      quiz: [
        {
          question: "Czego według Brooksa brakuje przyjemności, żeby stała się radością?",
          options: [
            {
              text: "Ludzi i pamięci",
              correct: true,
              explanation:
                "Tak. Radość to przyjemność plus ludzie plus pamięć. Scrollowanie nie ma ani jednego, ani drugiego.",
            },
            {
              text: "Większej intensywności",
              correct: false,
              explanation: "Intensywność nic tu nie zmienia. Brakuje dwóch rzeczy: ludzi i pamięci.",
            },
            {
              text: "Więcej czasu",
              correct: false,
              explanation:
                "Więcej scrollowania to nadal scrollowanie. Różnicę robią ludzie i pamięć, nie minuty.",
            },
          ],
        },
        {
          question: "Rozmowa z przyjacielem przez komunikator to uzupełnienie czy substytut?",
          options: [
            {
              text: "Uzupełnienie",
              correct: true,
              explanation:
                "Tak, bo technologia służy tu więzi, która istnieje naprawdę. Substytutem byłby feed obcych ludzi zamiast tej rozmowy.",
            },
            {
              text: "Substytut",
              correct: false,
              explanation:
                "Nie, bo po drugiej stronie jest prawdziwy człowiek i prawdziwa więź. Substytutem jest to, co więź udaje.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Jedna zamiana",
        body: [
          "Zadanie ma dwie części. Po pierwsze, mały audyt: przejrzyj ekran główny telefonu i przy każdej aplikacji zadaj sobie jedno pytanie: uzupełnia czy zastępuje? Te z drugiej kategorii przenieś do folderu na ostatnią stronę (przytrzymaj palcem ikonę, aż da się ją przeciągnąć), gdzieś, gdzie trzeba specjalnie po nie sięgnąć. Nic nie trzeba usuwać, samo przeniesienie zmienia więcej, niż się wydaje.",
          "Po drugie, zamień dziś jedną sesję scrollowania na coś, co ma szansę zostać w pamięci: rozmowę, wspólny posiłek bez telefonów na stole, telefon do kogoś, z kim dawno się nie rozmawiało. A jeśli dziś nie ma wokół ludzi, wystarczy posiłek bez telefonu na stole, choćby w pojedynkę: chodzi o obecność, nie o towarzystwo.",
          "Trening dnia rośnie do 10-12 minut, najlepiej jako spacer, bez telefonu i bez słuchawek w uszach.",
        ],
        minimal:
          "Jeśli dziś nie ma czasu na spacer i rozmowy, sam audyt trzech najczęściej używanych aplikacji też wystarczy. Lepiej mało niż nic.",
        evening:
          "Wieczorem, tylko dla siebie: co pamiętasz z dzisiejszego scrollowania, jeśli w ogóle było? A co zostało w pamięci z tej jednej rzeczy zrobionej w zamian?",
      },
    },
    {
      day: 5,
      title: "Kwadrans, który zostaje",
      checkinAboutPrevious: {
        question: "Jak poszedł audyt i zamiana?",
        options: [
          {
            value: "both",
            label: "Audyt zrobiony, zamiana też",
            response:
              "To był najbardziej wymagający dzień kursu. Dzisiejszy finał ma już z górki, przynajmniej organizacyjnie.",
          },
          {
            value: "partial",
            label: "Tylko część",
            response:
              "Część w zupełności wystarczy. Audyt i zamiana zostają w repertuarze na zawsze, nie trzeba ich domykać dziś.",
          },
          {
            value: "none",
            label: "Nie dziś",
            response:
              "W porządku. Finał kursu nie wymaga niczego z poprzednich dni. Piętnaście minut i jedno pytanie, to wszystko.",
          },
        ],
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Pięć dni temu ten kurs zaczynał się od trzech minut ciszy i pewnie wtedy wydawały się długie. Dziś ostatni trening: piętnaście minut, poziom, o którym Brooks mówi najczęściej, bo jego zdaniem właśnie gdzieś w tym czasie mózg przestaje krążyć wokół drobiazgów, co ugotować, co odpisać, i zaczyna dochodzić do pytań, które normalnie się zagłusza.",
        "Brooks proponuje wziąć na ten czas jedno pytanie, na które nie ma dobrej odpowiedzi, bo nie o odpowiedź tu chodzi, tylko o to, co robi z człowiekiem samo trzymanie pytania w głowie przez dłuższą chwilę.",
        "I domknięcie wątku z dnia drugiego: skoro z bycia na bieżąco nic nie wynika, nie ma też powodu rozsypywać sprawdzania po całym dniu. Brooks radzi sprawdzać wiadomości i powiadomienia tylko w jednej stałej porze dnia, kwadrans albo pół godziny, i poza nią po prostu nie zaglądać.",
        "I jedna rzecz o trwałości, uczciwie: pięć dni to eksperyment, nie cała reszta życia. Brooks twierdzi, że nawyk zaczyna się utrwalać po około dwóch tygodniach, więc kurs się dziś kończy, ale rozstrzyga się w najbliższych dwóch tygodniach. Dlatego finał ma dwie części: kwadrans i decyzję, co zostaje na dłużej.",
      ],
      quiz: [
        {
          question: "Po co brać do kwadransa nudy pytanie, na które nie ma dobrej odpowiedzi?",
          options: [
            {
              text: "Żeby w końcu znaleźć odpowiedź",
              correct: false,
              explanation:
                "Nie o odpowiedź chodzi. Chodzi o to, co robi z człowiekiem samo trzymanie pytania w głowie przez dłuższą chwilę.",
            },
            {
              text: "Nie o odpowiedź chodzi, tylko o samo trzymanie pytania",
              correct: true,
              explanation:
                "Tak. Pytanie działa jak kotwica: myśli mogą odpływać i wracać, a to, co ważne, samo się przy nim zbiera.",
            },
          ],
        },
        {
          question: "Nuda to...",
          options: [
            {
              text: "Strata czasu",
              correct: false,
              explanation:
                "Po pięciu dniach tego kursu ta odpowiedź nie przejdzie. Mózg w nudzie pracuje dla ciebie.",
            },
            {
              text: "Stan pożądany, w którym mózg pracuje dla ciebie",
              correct: true,
              explanation: "Dokładnie to zdanie było wyzwaniem pierwszego dnia. Teraz jest twoje.",
            },
            {
              text: "Problem do rozwiązania telefonem",
              correct: false,
              explanation: "Telefon to jedyne rozwiązanie, które pogłębia problem, który rozwiązuje.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Kwadrans z jednym pytaniem",
        body: [
          "Piętnaście minut prawdziwej nudy. Bez telefonu, bez notatnika pod ręką, bez żadnego innego zadania. Weź na start jedno pytanie i pozwól myślom do niego wracać, kiedy same zechcą, niekoniecznie po kolei. Może to być: „co jest dla mnie naprawdę ważne?”. Może: „czego by brakowało, gdyby wszystko zostało tak, jak jest teraz?”. Po kwadransie, jeśli jest ochota, zapisz, co przyszło.",
          "Potem bilans: wróć do liczb z dnia zapisu, czasu ekranowego i liczby podniesień telefonu, i porównaj je z tym, co pokazują ustawienia teraz. Nie po to, żeby oceniać wynik. Po to, żeby zobaczyć, czy coś się w tym tygodniu ruszyło.",
          "Na koniec dwie decyzje, ważniejsze niż sam kwadrans. Jedna chwila nudy, która zostaje na stałe: kolejka, toaleta, spacer, kwadrans przy oknie wieczorem, cokolwiek, co było testowane w tym tygodniu i nie było najgorsze. I jedno stałe okno bez telefonu, wybrane z trzech, które Brooks poleca najczęściej: pierwsza godzina po przebudzeniu, posiłki albo godzina przed snem. Zapisz to jako proste zdanie w stylu „jeśli [sytuacja], to telefon zostaje odłożony”. A jeśli masz ochotę na trzecią zasadę: jedna stała pora na wiadomości i powiadomienia zamiast zerkania co chwilę.",
        ],
        minimal:
          "Jeśli piętnaście minut jednym ciągiem wydaje się nie do zrobienia, rozłóż je na dwa razy po siedem albo wróć do trzech minut z początku kursu. Liczy się kontakt z ciszą, nie idealna liczba na zegarze.",
        acceptLabel: "Biorę kwadrans na siebie",
      },
    },
  ],
};
