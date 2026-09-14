import type { Course } from "./types";

/**
 * "Kurs wdzięczności" (Polish only). 7 days, following the four-part arc
 * from docs/content/gratitude-mini-course-plan.md: why it works, once a day,
 * a few times a day, in every moment. Three voices with attribution:
 * Arthur Brooks (science), Jordan Peterson (meaning), Thich Nhat Hanh
 * (contemplative practice). Honest gratitude, never toxic positivity.
 */
export const wdziecznoscCourse: Course = {
  slug: "kurs-wdziecznosci",
  path: "/kurs-wdziecznosci",
  name: "Kurs wdzięczności",
  tagline: "7 dni praktyki, która realnie dodaje szczęścia.",
  metaTitle: "Kurs wdzięczności. 7 dni praktyki | po prostu sens",
  metaDescription:
    "Darmowy 7-dniowy mini kurs praktykowania wdzięczności: codziennie dawka wiedzy, krótki quiz i jedna mała praktyka. Bez wymuszonej pozytywności.",
  heroDescription:
    "Wdzięczność to umiejętność, którą się trenuje, i jedna z najlepiej przebadanych dróg do większego szczęścia. Przez siedem dni przechodzisz od jednej praktyki dziennie do wdzięczności wplecionej w zwykłe chwile. Bez udawania, że wszystko jest super.",
  howItWorks: [
    "Jeden dzień naraz. Kolejny dzień otwiera się następnego dnia o 6 rano, bo praktyka potrzebuje całego dnia, żeby się wydarzyć.",
    "Każdy dzień to krótkie kroki: dawka wiedzy, mały quiz bez punktów i jedna konkretna praktyka, a od drugiego dnia także opis, jak poszło ostatnio.",
    "Praktyki są małe z założenia: trzy zapisane rzeczy, jedno odwrócone narzekanie, jedno zdanie rano. Duży efekt bierze się z powtarzania, nie z rozmachu.",
    "Przerwa niczego nie psuje. Nie ma pass, liczników ani spóźnień. Kurs po prostu czeka, aż wrócisz.",
  ],
  aboutHeading: "Uczciwa wdzięczność, nie laurka",
  aboutParagraph:
    "Kurs łączy trzy spojrzenia, które zgadzają się częściej, niż się różnią: badania Arthura Brooksa z Harvardu, psychologię sensu Jordana Petersona i praktykę uważności Thich Nhat Hanha. Nie uczymy udawania, że trudne rzeczy są dobre. Uczymy zauważania dobrego, które istnieje obok trudnego. To różnica, na której stoi cały kurs.",
  askBaseline: false,
  challengeNoun: "praktyka",
  days: [
    {
      day: 1,
      title: "Umiejętność, nie cecha",
      knowledge: [
        "Na pewno znasz kogoś, kto „po prostu taki jest”: zawsze umie się ucieszyć drobiazgiem, zawsze znajdzie coś dobrego w kiepskim dniu. I pewnie myślisz, że tobie ta cecha nie została przydzielona. Tak to wygląda z zewnątrz. Arthur Brooks, profesor Harvardu badający, skąd bierze się szczęście, twierdzi coś innego: wdzięczność to umiejętność, nie cecha wrodzona. Trenuje się ją jak mięsień. A to znaczy, że punkt startu nie przesądza o niczym.",
        "Zacznijmy od tego, czym ta umiejętność właściwie jest, bo słowo „wdzięczność” zużyło się od nadużywania. Robert Emmons, psycholog, który przebadał ją najdokładniej, rozkłada ją na dwa ruchy. Pierwszy: zauważyć, że w moim życiu jest coś dobrego. Drugi: zauważyć, że nie wzięło się to wyłącznie ode mnie. Ktoś to zrobił, ktoś to dał, albo po prostu tak się złożyło. Wdzięczność to nie jest „pozytywne myślenie”. To dostrzeganie faktów, które i tak są, tylko na co dzień ich nie liczysz.",
        "Najbardziej znany dowód pochodzi z 2003 roku. Badacze podzielili uczestników na trzy grupy: jedna co tydzień spisywała pięć rzeczy, za które jest wdzięczna, druga pięć uciążliwości i problemów, trzecia po prostu pięć wydarzeń z minionego tygodnia. Trwało to dziesięć tygodni. Zwróć uwagę, czego w tym badaniu nie było. Nikt nikomu nie zmieniał życia, nie dawał pieniędzy ani urlopu. Zmieniono tylko to, na co ludzie raz w tygodniu patrzyli. Po kilku tygodniach pierwsza grupa była wyraźnie bardziej zadowolona z życia, bardziej optymistyczna, zgłaszała nawet mniej dolegliwości fizycznych. Ta sama rzeczywistość, inna uwaga, inne samopoczucie.",
        "Nie działa tu żadna magia słowa. Działa regularne kierowanie uwagi gdzie indziej niż na to, co negatywne, i to jest umiejętność, która rośnie z każdym powtórzeniem. Dlatego dzisiejsza praktyka jest najprostsza z możliwych: trzy rzeczy, teraz. Jedna wskazówka na start: im konkretniej, tym lepiej. „Że mam co jeść” działa słabo. „Że ktoś dziś rano zrobił mi kawę, bez proszenia” działa mocno, bo widzisz przy tym człowieka i gest. Badania pokazują, że im więcej szczegółów zauważysz, tym trwalej dobra rzecz zapisuje się w pamięci. To pierwszy przedsmak tego, co będziemy trenować przez tydzień.",
      ],
      quiz: [
        {
          question: "Czym jest wdzięczność w świetle badań?",
          options: [
            {
              text: "Cechą wrodzoną: albo się ją ma, albo nie",
              correct: false,
              explanation:
                "Tak to wygląda z zewnątrz, ale badania mówią co innego: wdzięczność rośnie od treningu, jak mięsień.",
            },
            {
              text: "Umiejętnością, którą można wytrenować",
              correct: true,
              explanation:
                "Tak. To najlepsza wiadomość w całym kursie: punkt startu nie przesądza o niczym.",
            },
            {
              text: "Nastrojem zależnym od okoliczności",
              correct: false,
              explanation:
                "Okoliczności mają mniejsze znaczenie, niż się wydaje. W badaniach zmieniała się uwaga, nie życie, a wynik i tak rósł.",
            },
          ],
        },
        {
          question: "Co robiła grupa, która po kilku tygodniach była szczęśliwsza?",
          options: [
            {
              text: "Unikała myślenia o problemach",
              correct: false,
              explanation:
                "Nie chodziło o unikanie. Problemy zostały, zmieniło się to, na co dodatkowo patrzyli.",
            },
            {
              text: "Co tydzień spisywała rzeczy, za które jest wdzięczna",
              correct: true,
              explanation:
                "Dokładnie. Zwykła lista, raz w tygodniu. Od dziś testujesz działanie tego mechanizmu na sobie.",
            },
            {
              text: "Codziennie robiła godzinną medytację",
              correct: false,
              explanation:
                "Nic aż tak wymagającego. Wystarczyła krótka lista wdzięczności raz w tygodniu.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Trzy rzeczy, teraz",
        body: [
          "Zapisz w notatniku poniżej co najmniej trzy rzeczy, za które czujesz wdzięczność w tej chwili. Mogą być duże (ktoś bliski, zdrowie) albo małe (ciepła woda, dzisiejsza kawa, że autobus przyjechał). Małe działają tak samo dobrze.",
          "Po zapisaniu zatrzymaj się na dziesięć sekund i zauważ, czy coś się zmieniło: w nastroju, w ciele, w tym, na co patrzysz. To pierwszy przedsmak mechanizmu, który będziemy trenować przez tydzień.",
        ],
        minimal: "Jeśli dziś nie wyjdzie nic więcej, wystarczy jedna rzecz, jedno zdanie w notatniku.",
        evening:
          "Kiedy lista już jest, spójrz na nią jeszcze raz: która z tych rzeczy była najmniej oczywista? Takie znaleziska są najcenniejsze, bo pokazują, ile dobrego umyka na co dzień.",
      },
    },
    {
      day: 2,
      title: "Uraza rośnie sama",
      checkinAboutPrevious: {
        question: "Jak poszła twoja wczorajsza lista?",
        options: [
          {
            value: "written",
            label: "Zapisana, co najmniej trzy rzeczy",
            response:
              "Pierwsza lista za tobą. Właśnie na takich listach stało całe badanie z 2003 roku, więc jesteś w dobrym towarzystwie.",
          },
          {
            value: "partial",
            label: "Jedna albo dwie, w biegu",
            response:
              "W zupełności wystarczy. Liczy się skierowanie uwagi, nie kompletność listy.",
          },
          {
            value: "none",
            label: "Nie wyszło",
            response:
              "Nic straconego, pierwsze dni tak mają. Dzisiejsza praktyka jest inna, bardziej zaczepna, niektórym wchodzi łatwiej.",
          },
        ],
      },
      knowledge: [
        "Wyobraź sobie taki dzień: dziesięć rzeczy poszło dobrze, a jedna osoba rzuciła nieprzyjemną uwagę. Co pamiętasz wieczorem? Właśnie. Złe rzeczy działają na nas mocniej niż dobre tej samej wielkości. Brooks nazywa to skrzywieniem negatywności i od razu dodaje coś ważnego: nie ma w tym twojej winy. To fabryczne ustawienie mózgu, który przez tysiące lat przeżywał dzięki temu, że każdy sygnał zagrożenia traktował poważnie, a każdy sygnał, że jest dobrze, mógł bez szkody zignorować. Dlatego narzekanie przychodzi samo, a wdzięczności trzeba się uczyć.",
        "Brak wdzięczności nie jest przy tym stanem neutralnym i to jest najważniejsza myśl dzisiejszego dnia. Jordan Peterson, kanadyjski psycholog kliniczny, pisze wprost: wdzięczność jest alternatywą dla urazy, być może jedyną. Kiedy wdzięczności nie ma, w to puste miejsce po cichu wchodzi uraza: poczucie, że dostaliśmy mniej, niż nam się należało. Kiedy urośnie, zmienia to, co widzisz. Bliscy przestają być ludźmi, którym coś zawdzięczasz, a stają się ludźmi, którzy są ci coś winni. Wdzięczność odwraca ten rachunek. Zamiast liczyć, ile ci się należy, zaczynasz widzieć, ile ci już dano.",
        "Dobra wiadomość jest taka, że fabryczne ustawienia nie są wyrokiem. Znasz ten efekt: kupujesz auto w konkretnym kolorze i nagle widzisz takie same na każdym skrzyżowaniu. Nie przybyło ich na drogach. Zmieniło się tylko to, czego szuka twoja uwaga, i robi to sama, bez żadnego wysiłku. Uwaga zawsze czegoś szuka. Domyślnie szuka zagrożeń, i niech szuka, bo od czasu do czasu ratuje ci to skórę. Można jej jednak dać drugie zadanie: szukać także tego, co dobre.",
        "Jak to zrobić? Większość narzekań ma drugą stronę: skoro coś cię denerwuje, to zwykle znaczy, że masz coś, co może się zepsuć. Zmywanie oznacza, że był obiad. Powolny internet oznacza, że masz internet. Korek oznacza, że masz auto. Nie musisz przestać narzekać. Wystarczy, że raz dziennie złapiesz jedno narzekanie i dopowiesz mu drugą połowę: „zmywanie, a to znaczy, że był obiad”. Jedna zasada: druga połowa musi być prawdziwa. Nie dopisujesz dobrego na siłę, tylko sprawdzasz, czy tam jest. Jeśli go nie ma, narzekanie zostaje narzekaniem, a ty bierzesz następne. Jedno takie odwrócenie dziennie wystarczy. Nowy odruch bierze się z powtórzeń, nie z jednego wielkiego postanowienia.",
      ],
      quiz: [
        {
          question: "Co się dzieje, kiedy nie ćwiczymy wdzięczności?",
          options: [
            {
              text: "Nic szczególnego, po prostu jej nie ma",
              correct: false,
              explanation:
                "Tak to tylko wygląda. Uwaga zostawiona sama sobie zsuwa się w stronę krzywd i porównań, nie w stronę spokoju.",
            },
            {
              text: "Łatwo zbiera się gorycz i uraza",
              correct: true,
              explanation:
                "Tak. Dlatego stawka jest wyższa, niż się wydaje: to nie wybór między czymś a niczym, tylko między dwoma kierunkami.",
            },
          ],
        },
        {
          question: "Dlaczego narzekanie przychodzi samo, a wdzięczność nie?",
          options: [
            {
              text: "Bo ludzie są z natury niewdzięczni",
              correct: false,
              explanation:
                "To nie kwestia charakteru, tylko tego, jak działa uwaga: na złe reaguje mocniej niż na dobre. U wszystkich tak samo.",
            },
            {
              text: "Bo mózg ma wbudowane skrzywienie negatywności",
              correct: true,
              explanation:
                "Dokładnie. Zagrożenia zauważasz sam z siebie, dobre rzeczy trzeba zauważać celowo. Stąd trening.",
            },
            {
              text: "Bo świat jest obiektywnie coraz gorszy",
              correct: false,
              explanation:
                "Niezależnie od stanu świata mózg i tak skanuje w stronę zagrożeń. Tak jest zbudowany.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Odwróć jedno narzekanie",
        body: [
          "Dziś złap się na jednym narzekaniu. Na głos albo w myślach, obojętne: korki, pogoda, zmywanie, powolny internet. Nie tłum go i nie oceniaj, po prostu zauważ. Zostań przy takich drobiazgach. Jeśli pierwsze, co przychodzi do głowy, to sprawa, która naprawdę cię rani, zostaw ją. Tego się nie odwraca jednym zdaniem.",
          "A potem odwróć: zapytaj, co to narzekanie zdradza, że masz. Korki oznaczają auto. Zmywanie oznacza, że było co jeść. Powolny internet oznacza internet. Cisza w mieszkaniu oznacza własny kąt. Nie chodzi o skasowanie narzekania, tylko o dopisanie drugiej kolumny, której uwaga sama z siebie nigdy nie wypełni.",
        ],
        minimal:
          "Jeśli w ciągu dnia nic się nie złapie, wieczorem przypomnij sobie jedno narzekanie z dzisiaj i odwróć je wstecz.",
        evening:
          "Wieczorem: które narzekanie się złapało i co wyszło z odwrócenia? Było w tym coś zaskakującego?",
      },
    },
    {
      day: 3,
      title: "Poranna kotwica",
      checkinAboutPrevious: {
        question: "Jak poszło odwracanie narzekania?",
        options: [
          {
            value: "flipped",
            label: "Złapane i odwrócone",
            response:
              "To jest dokładnie ten ruch, który po latach robi się sam. Na razie wymaga chwili uwagi i tak ma być.",
          },
          {
            value: "caught",
            label: "Złapane, ale bez odwrócenia",
            response:
              "Samo złapanie to większa część pracy. Odwrócenie można dorobić dziś, przy pierwszym lepszym narzekaniu.",
          },
          {
            value: "none",
            label: "Narzekało się bez świadka",
            response:
              "Tak działa autopilot i nie ma w tym nic złego. Dzisiejsza praktyka nie wymaga łapania niczego w biegu, ma stałą porę.",
          },
        ],
      },
      knowledge: [
        "Zacznijmy od pytania: co robisz w pierwszych minutach po przebudzeniu? Według ankiet około ośmiu na dziesięć osób zagląda w tym czasie do telefonu, choćby tylko po to, żeby wyłączyć budzik i rzucić okiem na powiadomienia. A jeszcze gorzej, jeśli zaczynasz scrollować. Brooks nazywa telefon znieczuleniem: sięgamy po niego zawsze wtedy, kiedy w głowie robi się pusto, a rano robimy to, zanim zdążymy cokolwiek pomyśleć. Tyle że ta pusta minuta jest cenna. To jedyny moment dnia, w którym umysł nie dostał jeszcze nic z zewnątrz i może zacząć od własnej myśli. Zamiast tego dostaje cudze pilne sprawy i cudze zdanie o świecie. Dzień zaczyna się od reagowania i tak już często zostaje.",
        "Tradycje religijne znają ten mechanizm, bo od tysięcy lat obserwują, jak działa człowiek. I dały wdzięczności stałe miejsce właśnie na początku dnia. Muzułmanin odmawia pierwszą z pięciu codziennych modlitw o świcie, jeszcze przed wschodem słońca. Żyd zaczyna dzień od krótkiej modlitwy odmawianej jeszcze w łóżku: dziękuję, że zwróciłeś mi dziś duszę. Prawosławne modlitwy poranne zaczynają się od słów: powstawszy ze snu, dzięki składam Tobie, Najświętsza Trójco. Thich Nhat Hanh, wietnamski nauczyciel uważności, zaczynał dzień od gathy, czyli krótkiego wiersza recytowanego zaraz po przebudzeniu: budzę się i uśmiecham, przede mną dwadzieścia cztery zupełnie nowe godziny. Nikt z nich nie miał pod ręką badań, a wszyscy trafili w tę samą formę: codziennie, zaraz po przebudzeniu, zanim dzień nabierze rozpędu. Psychologia dopiero teraz mierzy to, co te tradycje wiedziały z praktyki, i wyniki się zgadzają.",
        "Brooks przychodzi z zupełnie innego świata i robi to samo: wdzięczność ma u niego stałe miejsce w porannej rutynie. Mechanizm jest prosty. Pierwsza myśl dnia nadaje ton kolejnym. Jeśli pierwsza jest cudza, reagujesz. Jeśli pierwsza jest twoja i mówi o czymś dobrym, resztę dnia zaczynasz z innego miejsca.",
        "Zwróć uwagę, czego tu nie robisz: nie dokładasz sobie obowiązku ani nowej pory w kalendarzu. Podmieniasz tylko pierwszy odruch, z reagowania na docenianie. Najłatwiej przyczepić nową rzecz do czegoś, co i tak się dzieje, dlatego kotwicą jest sam moment przebudzenia: otwierasz oczy i zanim zrobisz cokolwiek innego, jeszcze w łóżku, mówisz sobie jedno zdanie. Telefon może poczekać minutę. To zdanie może być pożyczone od Thich Nhat Hanha: budzę się i uśmiecham, przede mną dwadzieścia cztery nowe godziny. Może być własne, na przykład „dziękuję, że jest kolejny dzień” albo „dziękuję, że mam dla kogo wstać”. Może być jedna konkretna rzecz, którą dziś masz: ciepły dom, kawa, ktoś, kto się dziś odezwie. Nie musi brzmieć mądrze. Musi być pierwsze i wyrażać wdzięczność.",
      ],
      quiz: [
        {
          question: "Czym jest poranna gatha?",
          options: [
            {
              text: "Godzinną medytacją o świcie",
              correct: false,
              explanation:
                "Nic z tych rzeczy. To dosłownie kilka linijek, chwila na jeden oddech.",
            },
            {
              text: "Krótkim wierszem witającym dzień jako dar",
              correct: true,
              explanation:
                "Tak. Kilka słów po przebudzeniu, zanim zacznie się szum. Formę możesz mieć własną, mechanizm zostaje ten sam.",
            },
          ],
        },
        {
          question: "Dlaczego pora poranna jest dobrym miejscem na wdzięczność?",
          options: [
            {
              text: "Bo rano jest najwięcej czasu",
              correct: false,
              explanation:
                "Zwykle wcale nie jest. Chodzi o coś innego: o to, co jest pierwsze.",
            },
            {
              text: "Bo pierwsza myśl dnia nadaje ton kolejnym",
              correct: true,
              explanation:
                "Dokładnie. Dzień zaczęty od jednego własnego zdania wygląda inaczej niż dzień zaczęty od cudzych powiadomień.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Jedno zdanie po przebudzeniu",
        body: [
          "Praktyka na najbliższy poranek (jeśli czytasz rano, zacznij od razu): zaraz po otwarciu oczu, jeszcze w łóżku i zanim sięgniesz po telefon, weź jeden oddech i powiedz sobie jedno zdanie podziękowania za nowy dzień. Własnymi słowami, bez formułek. Może być po cichu, może być banalne. „Dziękuję, że jest kolejny dzień” w zupełności wystarczy.",
          "Jeśli chcesz, dodaj jedną konkretną rzecz, na którą czekasz albo którą masz: poranna kawa, czyjś głos, światło za oknem. Całość ma zająć mniej niż dwie minuty.",
        ],
        minimal:
          "Wersja minimalna: jedno zdanie w myślach przy pierwszej kawie, nawet jeśli telefon już był w ręku.",
        evening:
          "Wieczorem zaplanuj, gdzie to zdanie jutro zmieści: przed budzikiem, przy otwarciu oczu, przy kawie? Kotwica działa lepiej, kiedy ma stałe miejsce.",
      },
    },
    {
      day: 4,
      title: "Wieczorna kotwica",
      checkinAboutPrevious: {
        question: "Jak poszło poranne zdanie przed telefonem?",
        options: [
          {
            value: "before",
            label: "Było, zanim telefon trafił do ręki",
            response:
              "To trudniejsze, niż brzmi, bo ręka ma swoje plany. Dobra robota. Dziś domykamy dzień z drugiej strony.",
          },
          {
            value: "later",
            label: "Przypomniało się później",
            response:
              "Też się liczy. Kotwica potrzebuje kilku dni, żeby osiąść. Dziś dokładamy drugą, wieczorną, niektórym pasuje bardziej.",
          },
          {
            value: "none",
            label: "Poranek wygrał",
            response:
              "Poranki bywają bezlitosne. Dzisiejsza praktyka jest wieczorna, więc masz drugą szansę w spokojniejszej porze dnia.",
          },
        ],
      },
      knowledge: [
        "Wieczór to druga naturalna kotwica. Brooks nazywa tę praktykę wdzięczną kontemplacją i trzyma ją w swojej wieczornej rutynie: krótki powrót do tego, co w mijającym dniu było dobre. A Robert Emmons, współautor badania z dnia pierwszego, w kolejnym eksperymencie kazał ludziom spisywać wdzięczność co wieczór. Spali dłużej, szybciej zasypiali i budzili się bardziej wypoczęci. To nie powinno dziwić, jeśli pomyślisz, z jaką listą w głowie zwykle zasypiasz.",
        "Bo pomyśl, co dzieje się w twojej głowie po zgaszeniu światła. Umysł przed snem i tak coś przeżuwa, nie da się tego wyłączyć. Zostawiony sam sobie wybiera niedokończone sprawy i jutrzejsze zmartwienia, bo tak działa skrzywienie negatywności omówione w dniu drugim. Wieczorna praktyka nie ucisza myślenia i nie ma takiego zadania. Podsuwa mu inny temat. Zamiast trzech otwartych spraw dostajesz trzy dobre momenty, i to na nich zasypiasz.",
        "Dwie wskazówki, żeby to działało dłużej niż tydzień. Po pierwsze, szukaj momentów, nie osiągnięć. Osiągnięcia są rzadkie i łatwo zamieniają praktykę w rozliczanie się z dnia. Momenty są codziennie: czyjś uśmiech, dziesięć minut słońca, że autobus przyjechał. Po drugie, nie powtarzaj wczorajszej listy. Emmons ostrzega, że to najczęstszy powód, dla którego praktyka umiera: robi się nudna. Umysł przyzwyczaja się do dobrych rzeczy tak samo szybko jak do złych, a wdzięczność działa właśnie dlatego, że mu na to nie pozwala. Więc codziennie coś nowego, choćby małego.",
        "Jest też wersja lżejsza, dla osób, które nie chcą praktyki codziennej: lista raz w tygodniu, na przykład w niedzielę wieczorem. Zanim uznasz to za wersję dla leniwych, przypomnij sobie dzień pierwszy. To dokładnie ten format, który działał w badaniu z 2003 roku. Co więcej, w późniejszym badaniu na Uniwersytecie Missouri studenci, którzy robili to raz w tygodniu, zyskali więcej niż ci, którzy robili to trzy razy w tygodniu. Nie dlatego, że rzadziej znaczy lepiej, bo codzienne spisywanie u Emmonsa też działało. Dlatego, że ta sama lista powtarzana co dwa dni szybko robi się rutyną, a cotygodniowa zostaje świeża. Codziennie czy co tydzień, wybór należy do ciebie, pod jednym warunkiem: nie przepisuj tej samej listy. Jedno jest nienegocjowalne: stała pora. Nawyk nie bierze się z rozmachu, tylko z powtarzalności.",
      ],
      quiz: [
        {
          question: "Co robi wieczorna praktyka wdzięczności z myśleniem przed snem?",
          options: [
            {
              text: "Wyłącza myślenie, żeby dało się zasnąć",
              correct: false,
              explanation:
                "Myślenia nie da się wyłączyć na życzenie. Da się za to zmienić, czym się zajmuje.",
            },
            {
              text: "Podsuwa myśleniu inny temat: dobre momenty zamiast otwartych spraw",
              correct: true,
              explanation:
                "Tak. Umysł i tak będzie przeżuwał. Pytanie tylko, co dostanie do przeżuwania.",
            },
          ],
        },
        {
          question: "Jaka jest lżejsza wersja tej praktyki?",
          options: [
            {
              text: "Lista wdzięczności raz w tygodniu",
              correct: true,
              explanation:
                "Tak, dokładnie format z badania z 2003 roku. Stałość znaczy więcej niż częstotliwość.",
            },
            {
              text: "Wdzięczność raz w miesiącu, ale bardzo intensywnie",
              correct: false,
              explanation:
                "Zrywy działają najsłabiej. Mała, regularna praktyka wygrywa z rzadką i wielką.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Trzy dobre momenty",
        body: [
          "Dziś przed snem, już po odłożeniu telefonu, przypomnij sobie trzy dobre momenty z mijającego dnia. Nie osiągnięcia, momenty: czyjś uśmiech, smak obiadu, chwila spokoju w tramwaju. Przy każdym zatrzymaj się na kilka sekund, zamiast od razu lecieć do następnego.",
          "Zapisz je w notatniku poniżej, choćby hasłowo. Po miesiącu taka lista to zaskakująco dobra lektura.",
        ],
        minimal: "Wersja minimalna: jeden dobry moment, przypomniany już w łóżku.",
        evening:
          "To dzisiaj praktyka wieczorna, więc zamiast osobnej refleksji jedno pytanie na przyszłość: bardziej twoja jest kotwica poranna czy wieczorna? Od jutra możesz trzymać obie albo tylko tę jedną.",
      },
    },
    {
      day: 5,
      title: "Rytm dnia",
      checkinAboutPrevious: {
        question: "Jak poszły wieczorne trzy momenty?",
        options: [
          {
            value: "three",
            label: "Były trzy, ze szczegółami",
            response:
              "Masz już obie kotwice: poranną i wieczorną. Ten komplet wystarcza na lata. Dziś coś pomiędzy.",
          },
          {
            value: "one",
            label: "Jeden, w półśnie",
            response:
              "Jeden moment w półśnie to dalej praktyka. Sen czasem wygrywa i dobrze, od tego jest.",
          },
          {
            value: "none",
            label: "Zasnęło się bez tego",
            response:
              "Bywa. Wieczór to najłatwiejsza pora do przegapienia, bo dzień się już kończy. Dzisiejsza praktyka rozkłada ciężar inaczej: na środek dnia.",
          },
        ],
      },
      knowledge: [
        "Tradycje religijne wiedzą od tysięcy lat coś, co psychologia odkrywa na nowo. Wdzięczność stoi w samym ich środku: katolicy i prawosławni nazywają swój najważniejszy obrzęd Eucharystią, czyli po grecku dziękczynieniem, a w islamie arabskie słowo na niewiarę oznacza dosłownie także niewdzięczność. Ale równie ważne jest, jak ją ćwiczą: modlitwa kilka razy dziennie to szkoła uwagi. Zwróć uwagę, że żadna z nich nie poprzestała na jednym długim nabożeństwie raz w tygodniu. Obok niedzielnej mszy, szabatu czy piątkowej modlitwy każda ma też praktykę codzienną, i to powtarzaną kilka razy dziennie. Muzułmanin modli się pięć razy dziennie, a istotą tej modlitwy nie jest prośba, tylko pochwała. Rytm małych powtórzeń działa lepiej niż jeden wielki zryw, bo nie pozwala uwadze odpłynąć na cały dzień. Nie liczy się długość jednej modlitwy, tylko to, że w ciągu dnia jest ich więcej.",
        "Thich Nhat Hanh proponował świecką wersję: dzwonki uważności. W jego wspólnocie co jakiś czas rozbrzmiewał dzwonek i wszyscy, w połowie zdania czy w połowie kroku, zatrzymywali się na jeden oddech. Na co dzień takiego dzwonka nie ma, ale on sam radził, żeby tak samo traktować dzwonek do drzwi albo dzwoniący telefon: nie odbierać od razu, tylko przez dwa pierwsze sygnały oddychać. Dzwonkiem może być też coś, co wcale nie dzwoni: próg drzwi, czajnik, posiłek, pierwsze kroki po wyjściu z domu. Takich sygnałów masz w ciągu dnia kilkadziesiąt, tylko jeszcze ich nie zauważasz.",
        "To trzeci poziom: rano, wieczorem, a teraz kilka małych pauz pomiędzy. I znowu zwróć uwagę, czego nie dokładamy: czasu. Każda pauza to jeden oddech i jedna rzecz, za którą w tej chwili czujesz wdzięczność, nikt nie zauważy, że ją robisz. Dokładamy częstotliwość, bo to z niej, a nie z długości, robi się nawyk. Tak samo nie zbudujesz mięśnia jednym wielkim treningiem w miesiącu.",
        "Jak wybrać te małe kotwice? Najlepiej takie, które i tak się wydarzą: coś, co robisz codziennie o podobnej porze, najlepiej trzy razy. Posiłki są najprostsze, bo każdy z nich jest gotowym powodem. Przejścia też działają: wyjście z domu, wejście do pracy, powrót. Alarm w telefonie zostaw jako plan awaryjny, nie pierwszy wybór. Sygnał, który sam sobie zadasz, łatwo wyłączyć albo przesunąć, a posiłek czy wyjście z domu i tak się wydarzą. Najtrwalsze kotwice to te, których nie da się odwołać.",
      ],
      quiz: [
        {
          question: "Czego uczy rytm modlitwy kilka razy dziennie?",
          options: [
            {
              text: "Że praktyka wymaga dużo czasu",
              correct: false,
              explanation:
                "Odwrotnie: pojedyncza pauza jest krótka. Siła bierze się z powtarzania, nie z długości.",
            },
            {
              text: "Że małe powtórzenia trzymają uwagę lepiej niż jeden zryw",
              correct: true,
              explanation:
                "Tak. Rytm nie pozwala uwadze odpłynąć na cały dzień. To samo robi kilka pauz wdzięczności.",
            },
          ],
        },
        {
          question: "Co może być „dzwonkiem uważności” w zwykłym dniu?",
          options: [
            {
              text: "Tylko prawdziwy dzwon albo aplikacja do medytacji",
              correct: false,
              explanation:
                "Niepotrzebny żaden sprzęt. Dzwonkiem może być dowolny stały punkt dnia.",
            },
            {
              text: "Próg drzwi, czajnik, posiłek, pierwszy krok z domu",
              correct: true,
              explanation:
                "Dokładnie. Rzeczy, które i tak się dzieją, zamieniają się w przypomnienia. Zero dodatkowego czasu.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Trzy pauzy na oddech",
        body: [
          "Wybierz dziś trzy małe kotwice: czynności, które i tak się wydarzą, najlepiej o podobnej porze. Najprościej posiłki: śniadanie, obiad, kolacja. Mogą być też przejścia: wyjście z domu, wejście do pracy, powrót. Alarmy w telefonie zostaw na wypadek, gdyby dzień nie miał żadnej stałej pory.",
          "Przy każdym sygnale zatrzymaj się na jeden oddech i nazwij jedną rzecz, za którą czujesz wdzięczność właśnie teraz, w tym miejscu, w tej sytuacji. Nie wczoraj, nie ogólnie: teraz. To całe zadanie, trzy oddechy na cały dzień.",
        ],
        minimal: "Wersja minimalna: jedna pauza przy jednym posiłku.",
        evening:
          "Wieczorem: która pauza była najłatwiejsza, a która w ogóle nie zadziałała? Jutro sygnały możesz przestawić w lepsze miejsca.",
      },
    },
    {
      day: 6,
      title: "Wdzięczność wyrażona",
      checkinAboutPrevious: {
        question: "Jak poszły trzy pauzy?",
        options: [
          {
            value: "all",
            label: "Wszystkie trzy zadziałały",
            response:
              "Rytm złapany za pierwszym razem to rzadkość. Dzisiejsza praktyka wychodzi z głowy do świata, to najprzyjemniejszy dzień kursu.",
          },
          {
            value: "some",
            label: "Jedna albo dwie",
            response:
              "Tak to zwykle wygląda na początku. Pauzy, które zadziałały, zostają, resztę można przestawić. Dziś coś zupełnie innego.",
          },
          {
            value: "none",
            label: "Sygnały przepadły w biegu dnia",
            response:
              "Środek dnia to najtrudniejszy teren, biegnie najszybciej. Dzisiejsza praktyka jest pojedyncza i konkretna, łatwiej ją upilnować.",
          },
        ],
      },
      knowledge: [
        "Wszystko do tej pory działo się w twojej głowie. I dobrze, bo to tam zaczyna się trening. Ale dziś krok, który według Brooksa zmienia najwięcej: wdzięczność wyrażona. Powód jest prosty. Odczuwana wdzięczność robi dobrze tobie. Wyrażona robi dobrze dwojgu ludziom, a przy okazji wzmacnia relację, która was łączy. Najgłośniejszy dowód pochodzi z laboratorium Martina Seligmana. Uczestnicy mieli tydzień na napisanie listu do kogoś, kto zrobił dla nich coś ważnego, a nigdy nie został porządnie podziękowany, i odczytanie go tej osobie twarzą w twarz. Z kilku testowanych ćwiczeń właśnie to dawało najtrwalszy wzrost szczęścia, mierzony jeszcze miesiąc później. Skoro podziękowanie działa tak mocno nawet po latach, pomyśl, ile takich listów nosisz w sobie niewysłanych.",
        "Nie musisz jednak odwiedzać nikogo z listem. Brooks sprowadza to do dwóch codziennych nawyków i w swoim protokole daje im dwa osobne kroki. Pierwszy to krótkie wiadomości z podziękowaniem. Drugi to dziękowanie na głos przy nadarzającej się okazji, w momencie, nie tydzień po fakcie. List Seligmana nadrabia zaległości, codzienny nawyk sprawia, że zaległości przestają powstawać. Emmons mówi to samo prościej: prawie każdy ma czas, żeby raz dziennie komuś podziękować, szczerze i konkretnie.",
        "Jest jeden warunek i Brooks poświęca mu osobny krok, więc potraktuj go poważnie: autentyczność. Pomyśl, jak w dzieciństwie kazano ci mówić „dziękuję”. Czy było w tym wtedy choć trochę wdzięczności? Właśnie. Podziękowanie z poczucia długu, wdzięczność na pokaz albo komplement, który jest przebraną autopromocją, psują cały efekt. Badania Emmonsa pokazują to samo od drugiej strony: kiedy ktoś czuje, że musi się odwdzięczyć, przestaje czuć wdzięczność, a zaczyna czuć dług. A dług nie zbliża do człowieka, tylko od niego odpycha.",
        "Test jest prosty: czy umiesz podziękować za coś konkretnego? „Dziękuję, że przełożyłaś to spotkanie, uratowało mi to środę” przechodzi. „Dzięki za wszystko” nie bardzo. Dobra wiadomość ma dwa elementy i oba widać w tym zdaniu: co ta osoba zrobiła i co to zmieniło dla ciebie. Nie musi być długa. Trzy zdania wystarczą. A teraz najlepsza część. Podziękowany człowiek chodzi potem inaczej po świecie i sam częściej komuś dziękuje. To cichy efekt fali, i ty go dziś uruchamiasz.",
      ],
      quiz: [
        {
          question: "Czym różni się wdzięczność wyrażona od odczuwanej?",
          options: [
            {
              text: "Niczym, ważne, co się czuje",
              correct: false,
              explanation:
                "Odczuwana działa na ciebie. Wyrażona działa na dwie osoby naraz i na relację między nimi.",
            },
            {
              text: "Wyrażona wzmacnia też relację i drugiego człowieka",
              correct: true,
              explanation:
                "Tak. Dlatego u Brooksa wyrażanie wdzięczności to osobne kroki protokołu, nie dodatek.",
            },
          ],
        },
        {
          question: "Które podziękowanie przechodzi test autentyczności?",
          options: [
            {
              text: "„Dzięki za wszystko, jesteś super”",
              correct: false,
              explanation:
                "Miłe, ale ogólnik. Bez konkretu podziękowanie waży niewiele i łatwo brzmi jak formułka.",
            },
            {
              text: "„Dziękuję, że przełożyłaś spotkanie, uratowało mi to środę”",
              correct: true,
              explanation:
                "Tak, bo widać, że naprawdę zauważona została konkretna rzecz. Konkret to test szczerości.",
            },
            {
              text: "„Muszę ci podziękować, bo wypada”",
              correct: false,
              explanation:
                "Wdzięczność z poczucia długu to dokładnie to, przed czym ostrzega Brooks. Lepiej krócej, ale naprawdę.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Jedno prawdziwe podziękowanie",
        body: [
          "Dziś wyślij jednej osobie jedną szczerą wiadomość z podziękowaniem. Za coś konkretnego: rzecz, którą zrobiła, słowa, które kiedyś padły, coś, co zauważasz od dawna, ale nigdy nie zostało powiedziane. Trzy zdania wystarczą. Sms, mail, wiadomość głosowa, forma bez znaczenia.",
          "Wersja odważniejsza: podziękuj komuś na głos, w momencie, konkretnie. Nie „dzięki”, tylko za co dokładnie. Zobacz, co to robi z rozmową.",
          "Dwie rzeczy na zapas. Jeśli nikt nie przychodzi ci do głowy, podziękuj komuś na żywo przy okazji: kasjerce, kierowcy, sąsiadowi. To pełnoprawna wersja tego zadania, nie gorsza. I druga: odpowiedź nie jest potrzebna. Wiadomość robi swoje po obu stronach już w momencie wysłania, echo bywa dodatkiem, nie miarą.",
        ],
        minimal:
          "Wersja minimalna: przy najbliższej okazji podziękuj konkretniej niż zwykle, choćby przy kasie albo w drzwiach.",
        evening:
          "Wieczorem: jeśli coś wróciło, zatrzymaj się przy tym na chwilę. A jeśli nie, wiadomość i tak zrobiła swoje.",
      },
    },
    {
      day: 7,
      title: "Wdzięczność mimo wszystko",
      checkinAboutPrevious: {
        question: "Jak poszło podziękowanie?",
        options: [
          {
            value: "sent",
            label: "Poszło, była nawet odpowiedź",
            response:
              "To są te momenty, dla których istnieje cały ten kurs. Dziś finał: najtrudniejsza i najdojrzalsza z praktyk.",
          },
          {
            value: "quiet",
            label: "Poszło, bez echa",
            response:
              "Echo nie jest potrzebne. Wiadomość zrobiła swoje po obu stronach, nawet jeśli po tamtej w ciszy.",
          },
          {
            value: "none",
            label: "Nie odważyło się",
            response:
              "Wyrażanie wdzięczności bywa dziwnie trudne, jakby było intymniejsze niż narzekanie. Wiadomość może poczekać, nie ma terminu ważności. Dziś i tak wchodzimy gdzie indziej.",
          },
        ],
      },
      knowledge: [
        "Ostatni poziom nie polega na dokładaniu praktyk, tylko na zmianie spojrzenia. Bo bądźmy szczerzy: co z dniami, które są po prostu złe? W taki dzień prośba o trzy dobre momenty przed snem brzmi jak kpina. Viktor Frankl, psychiatra, który przeżył obozy koncentracyjne, napisał zdanie, na którym stoi cała dzisiejsza lekcja: nawet gdy nie jesteśmy w stanie zmienić sytuacji powodującej cierpienie, wciąż możemy wybrać postawę, jaką wobec niej zajmiemy. Frankl opisuje wieczór w obozie, kiedy śmiertelnie zmęczeni więźniowie jedli zupę na podłodze baraku, a jeden z nich wbiegł i zawołał, żeby biec na plac apelowy zobaczyć zachód słońca. Stali w milczeniu kilka minut, patrząc na niebo od metalicznego błękitu po krwistą czerwień, odbite nawet w błotnistych kałużach. Potem jeden powiedział do drugiego: „Jaki piękny może być świat!”. Nikt z nich nie udawał, że obóz jest dobry. Zobaczyli coś prawdziwego obok niego. Peterson mówi tu rzecz najtrudniejszą z całego kursu: bądź wdzięczny pomimo cierpienia. Nie dlatego, że cierpienie jest dobre, i nie zamiast tego, żeby je czuć. To świadoma postawa, wybierana właśnie wtedy, kiedy nie przychodzi sama. Według niego to nie naiwność. To forma odwagi.",
        "Jedno zastrzeżenie, bo tu łatwo o nieporozumienie. To nie jest toksyczna pozytywność. Nie szukasz dobrego zamiast trudnego, tylko obok trudnego. Trudne zostaje trudne, nazwane po imieniu, i nikt nie każe ci go przemalowywać. Brooks ujmuje to bez owijania: bolesnej choroby nie wpisujesz na listę wdzięczności, wdzięczność ma być pomimo niej. Pytanie brzmi jedynie: czy oprócz tego jest tu coś, co mogę uczciwie docenić? Jeśli odpowiedź jest mała, to znaczy, że jest prawdziwa. Duże odpowiedzi w złe dni zwykle są zmyślone.",
        "A kiedy to wchodzi w nawyk, przestaje być wysiłkiem. Thich Nhat Hanh nazywał to współistnieniem: w jednym kwiecie można zobaczyć glebę, minerały, nasiono, słońce i deszcz, bo bez każdego z nich kwiatu by nie było. Kto naprawdę widzi tę sieć, nie musi się zmuszać do wdzięczności. Przychodzi sama. Nie z poczucia, że wszystko jest dobrze, tylko z faktu, że prawie nic z tego, co masz, nie zrobiło się samo.",
        "Na koniec to, co z tego tygodnia zabrać dalej, bo umiejętność bez powtórek zanika jak każda inna. Przez ten tydzień powstał cały rytm: zdanie po przebudzeniu, kilka pauz w ciągu dnia, trzy momenty przed snem, jedno prawdziwe podziękowanie komuś i odwrócone narzekanie, kiedy dzień nie idzie. W komplecie to jest właśnie to, co Brooks trzyma w swojej porannej i wieczornej rutynie. Jeśli po tym tygodniu cały ten rytm już siedzi, świetnie, trzymaj go. Jeśli jeszcze nie, możesz zacząć od kotwicy, która na pewno zostanie, najlepiej porannej albo wieczornej, a kolejne dokładaj, kiedy ta pierwsza stanie się nawykiem. Zmieniaj treść, żeby się nie znudziło. A jeśli wypadniesz z rytmu, wróć bez rozliczania się. Przerwa niczego nie psuje.",
        "Ten kurs nie znika po siódmym dniu. Wszystkie dni zostają otwarte, więc kiedy praktyka się rozsypie, wróć do dnia, którego akurat potrzebujesz: do drugiego, kiedy narzekanie znów wygrywa, do czwartego, kiedy wieczory zrobiły się ciężkie, do siódmego, kiedy jest po prostu źle. Można też przejść całość od początku, kiedy potrzebujesz. Za drugim razem czyta się to inaczej, bo czyta ktoś, kto ma już trochę doświadczenia. Siedem dni temu to była umiejętność do wytrenowania. Dziś jest już trochę twoja.",
      ],
      quiz: [
        {
          question: "Co znaczy „wdzięczność pomimo cierpienia” u Petersona?",
          options: [
            {
              text: "Udawanie, że cierpienie jest dobre",
              correct: false,
              explanation:
                "Nie. Cierpienie zostaje cierpieniem. Wdzięczność pomimo nie zaprzecza, tylko dokłada szerszy kadr.",
            },
            {
              text: "Świadomą postawę wybieraną także wtedy, gdy jest ciężko",
              correct: true,
              explanation:
                "Tak. I właśnie dlatego Peterson nazywa ją formą odwagi, nie naiwności.",
            },
            {
              text: "Tłumienie trudnych emocji",
              correct: false,
              explanation:
                "Tłumienie to droga donikąd. Tu chodzi o dodanie czegoś obok trudnego, nie o wyciszanie go.",
            },
          ],
        },
        {
          question: "Czym różni się uczciwa wdzięczność od toksycznej pozytywności?",
          options: [
            {
              text: "Szuka dobrego obok trudnego, nie zamiast niego",
              correct: true,
              explanation:
                "Dokładnie ta różnica niesie cały kurs. Trudne zostaje nazwane, a dobre bywa małe i właśnie dlatego prawdziwe.",
            },
            {
              text: "Niczym, to to samo w innym opakowaniu",
              correct: false,
              explanation:
                "Różnica jest zasadnicza: toksyczna pozytywność każe zaprzeczać trudnemu, uczciwa wdzięczność zostawia mu miejsce.",
            },
          ],
        },
      ],
      challenge: {
        lead: "Małe dobre w złym momencie",
        body: [
          "Ostatnia praktyka nie ma wyznaczonej godziny, ma wyzwalacz. Następnym razem, kiedy coś dziś pójdzie nie tak (a coś pójdzie: spóźnienie, przykra wiadomość, rozlana kawa), zatrzymaj się na jeden oddech i zapytaj: co tu mogę uczciwie docenić? I pozwól, żeby odpowiedź była mała. „Przynajmniej złapało mnie to w domu.” „Jest ktoś, do kogo mogę z tym zadzwonić.” Mała odpowiedź wystarczy, bo jest prawdziwa.",
          "Na przyszłość, żeby siedem dni nie rozpłynęło się w dwa tygodnie, prosty plan z tego tygodnia: rano jedno zdanie przed telefonem, wieczorem trzy dobre momenty, raz w tygodniu jedno wyrażone podziękowanie. Każdą z tych praktyk przypnij do czegoś, co i tak robisz: kawy, mycia zębów, drogi do pracy. Jeśli chcesz miary, potraktuj to jako wyzwanie na 30 dni i po miesiącu sprawdź, co się zmieniło.",
        ],
        minimal:
          "Wersja minimalna na dziś i na zawsze: wybierz jedną, dokładnie jedną praktykę z tego tygodnia, która zostaje z tobą na stałe.",
      },
    },
  ],
};
