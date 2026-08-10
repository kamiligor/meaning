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
        "Są ludzie, którym wdzięczność zdaje się przychodzić sama. Łatwo pomyśleć, że to kwestia charakteru: jedni tacy są, inni nie. Arthur Brooks, profesor Harvardu, który od lat bada, skąd bierze się szczęście, twierdzi coś innego: wdzięczność jest umiejętnością, nie cechą wrodzoną. Trenuje się ją tak samo jak mięsień, a efekty są mierzalne.",
        "Najbardziej znany dowód pochodzi z klasycznego badania z 2003 roku. Dwaj psychologowie poprosili jedną grupę, żeby co tydzień spisywała rzeczy, za które jest wdzięczna, a drugą, żeby spisywała uciążliwości i problemy. Po kilku tygodniach grupa spisująca dobre rzeczy była wyraźnie bardziej zadowolona z życia, bardziej optymistyczna, a nawet zgłaszała mniej dolegliwości fizycznych. Ta sama rzeczywistość, inna uwaga, inne życie.",
        "Ten kurs to siedem dni treningu w czterech krokach: najpierw przekonasz się, po co to w ogóle robić, potem zakotwiczysz jedną praktykę dziennie, następnie kilka małych pauz w ciągu dnia, a na końcu spróbujesz najtrudniejszego: znajdowania dobrego także w tym, co nie poszło.",
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
          "Zapisz w notatniku poniżej trzy rzeczy, za które czujesz wdzięczność w tej chwili. Mogą być duże (ktoś bliski, zdrowie) albo małe (ciepła woda, dzisiejsza kawa, że autobus przyjechał). Małe działają tak samo dobrze.",
          "Po zapisaniu zatrzymaj się na dziesięć sekund i zauważ, czy coś się zmieniło: w nastroju, w ciele, w tym, na co patrzysz. To pierwszy przedsmak mechanizmu, który będziemy trenować przez tydzień.",
        ],
        minimal: "Jeśli dziś nie wyjdzie nic więcej, wystarczy jedna rzecz, jedno zdanie w notatniku.",
        evening:
          "Kiedy lista już jest, spójrz na nią jeszcze raz: która z trzech rzeczy była najmniej oczywista? Takie znaleziska są najcenniejsze, bo pokazują, ile dobrego umyka na co dzień.",
      },
    },
    {
      day: 2,
      title: "Alternatywą nie jest neutralność",
      checkinAboutPrevious: {
        question: "Jak poszły twoje trzy rzeczy?",
        options: [
          {
            value: "written",
            label: "Zapisane, wszystkie trzy",
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
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Łatwo myśleć, że kto nie praktykuje wdzięczności, jest po prostu neutralny. Jordan Peterson stawia sprawę ostrzej: realną alternatywą dla wdzięczności nie jest neutralność, tylko resentyment, czyli hodowane latami poczucie krzywdy i gorycz, które korodują życie od środka. Wdzięczność nazywa jej antidotum i widzi w niej akt odwagi: świadome opowiedzenie się po stronie życia.",
        "Dlaczego domyślnie ciągnie nas w drugą stronę? Brooks przypomina o wbudowanym w mózg skrzywieniu negatywności: uwaga sama skanuje świat w poszukiwaniu tego, co nie gra, bo przez tysiące lat to właśnie ratowało życie. Zauważanie dobrego nie miało ewolucyjnego priorytetu. Dlatego narzekanie przychodzi samo, a wdzięczność trzeba trenować.",
        "Dobra wiadomość jest taka, że nie jesteśmy skazani na fabryczne ustawienia. Ta sama kora przedczołowa, która pozwala planować i myśleć o myśleniu, pozwala też świadomie przekierować uwagę. Nie da się wyłączyć skanera zagrożeń. Da się dołożyć drugi skaner.",
      ],
      quiz: [
        {
          question: "Co według Petersona jest realną alternatywą dla wdzięczności?",
          options: [
            {
              text: "Neutralność: po prostu brak wdzięczności",
              correct: false,
              explanation:
                "To pozorna opcja. Uwaga zostawiona samej sobie dryfuje w stronę krzywd i porównań, nie w stronę neutralności.",
            },
            {
              text: "Resentyment i gorycz",
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
                "To nie wada charakteru. To ewolucyjne ustawienie uwagi, wspólne dla wszystkich.",
            },
            {
              text: "Bo mózg ma wbudowane skrzywienie negatywności",
              correct: true,
              explanation:
                "Dokładnie. Skaner zagrożeń działa sam, skaner dobrego trzeba włączać ręcznie. Stąd trening.",
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
          "Dziś złap się na jednym narzekaniu. Na głos albo w myślach, obojętne: korki, pogoda, zmywanie, powolny internet. Nie tłum go i nie oceniaj, po prostu zauważ.",
          "A potem odwróć: zapytaj, co to narzekanie zdradza, że masz. Korki oznaczają auto i miejsce, do którego warto jechać. Zmywanie oznacza, że było co jeść. Powolny internet oznacza internet. Cisza w mieszkaniu oznacza własny kąt. Nie chodzi o skasowanie narzekania, tylko o dopisanie drugiej kolumny, której skaner negatywności sam nigdy nie wypełni.",
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
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Thich Nhat Hanh, wietnamski nauczyciel uważności, zaczynał dzień od gathy, czyli krótkiego wiersza recytowanego zaraz po przebudzeniu. Jego poranna gatha mówi mniej więcej tyle: budzę się i uśmiecham, przede mną dwadzieścia cztery zupełnie nowe godziny. Chodzi o jedno: przywitać dzień jako dar, zanim zacznie się szum.",
        "Brooks, z zupełnie innego świata, robi w praktyce to samo: wdzięczność ma u niego stałe miejsce w porannej rutynie, zanim dzień nabierze rozpędu. Logika jest prosta: pierwsza myśl dnia nadaje ton kolejnym. Jeśli pierwszym ruchem jest telefon i cudze pilne sprawy, dzień zaczyna się od reagowania. Jeśli pierwszym ruchem jest jedno zdanie wdzięczności, dzień zaczyna się od czegoś twojego.",
        "To nie musi być rytuał na dziesięć minut. Dwie minuty to dużo, wystarczy jedno zdanie. Nie dokładamy obowiązku, podmieniamy pierwszy odruch.",
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
        lead: "Jedno zdanie przed telefonem",
        body: [
          "Praktyka na najbliższy poranek (jeśli czytasz rano, zacznij od razu): zanim weźmiesz telefon do ręki, weź jeden oddech i powiedz sobie jedno zdanie podziękowania za nowy dzień. Własnymi słowami, bez formułek. Może być po cichu, może być banalne. „Dziękuję, że jest kolejny dzień” w zupełności wystarczy.",
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
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Drugi koniec dnia to druga naturalna kotwica. Brooks nazywa to wdzięczną kontemplacją i trzyma ją w wieczornej rutynie: krótki powrót do tego, co w mijającym dniu było dobre. W jego protokole wdzięczności to osobny, piąty krok, a badania, które przywołuje, wiążą praktykowanie wdzięczności także z lepszym snem.",
        "Mechanizm jest dość intuicyjny: umysł przed snem i tak coś przeżuwa. Zostawiony sam sobie wybiera niedokończone sprawy i jutrzejsze zmartwienia, bo tak działa skaner negatywności z dnia drugiego. Wieczorna praktyka nie ucisza myślenia, tylko podaje mu lepsze menu: trzy dobre momenty z dzisiaj zamiast trzech otwartych frontów.",
        "Jest też wersja lżejsza, dla osób, które nie chcą praktyki codziennej: lista wdzięczności raz w tygodniu, na przykład w niedzielę wieczorem. To dokładnie ten format, który działał w badaniu z 2003 roku, i pierwszy krok protokołu Brooksa. Codziennie czy co tydzień, wybór należy do ciebie. Ważne, żeby było stałe.",
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
              text: "Podaje myśleniu lepsze menu: dobre momenty zamiast otwartych spraw",
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
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Tradycje religijne wiedzą od tysięcy lat coś, co psychologia odkrywa na nowo: modlitwa kilka razy dziennie to także szkoła uwagi: sposób, żeby uwaga wracała do tego, co ważne. Rytm małych powtórzeń działa lepiej niż jeden wielki zryw, bo nie pozwala uwadze odpłynąć na cały dzień.",
        "Thich Nhat Hanh proponował świecką wersję tego rytmu: dzwonki uważności. W jego wspólnocie co jakiś czas rozbrzmiewał dzwon i wszyscy zatrzymywali się na jeden oddech. Ale dzwonem może być cokolwiek: próg drzwi, czajnik, sygnał telefonu, pierwsze kroki po wyjściu z domu. Każdy taki punkt dnia może być małym otwarciem na wdzięczność.",
        "Zauważ, że to trzeci poziom kursu: najpierw było raz dziennie rano, potem raz wieczorem, dziś kilka małych pauz pomiędzy. Nie dokładamy czasu, każda pauza to jeden oddech. Dokładamy częstotliwość, bo z niej robi się nawyk.",
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
          "Ustaw dziś trzy delikatne sygnały w ciągu dnia. Mogą to być trzy ciche alarmy w telefonie (to dobry przykład telefonu w roli narzędzia, nie pożeracza) albo trzy stałe kotwice: śniadanie, obiad, kolacja.",
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
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Wszystko do tej pory działo się w twojej głowie. Dziś krok, który według Brooksa zmienia najwięcej: wdzięczność wyrażona. W jego protokole to aż dwa kroki: pisanie krótkich wiadomości z podziękowaniem oraz dziękowanie na głos przy nadarzającej się okazji, w momencie, nie po fakcie. Odczuwana wdzięczność robi dobrze tobie. Wyrażona robi dobrze dwojgu ludziom i wzmacnia każdą relację, której dotknie.",
        "Jest jeden warunek i Brooks poświęca mu osobny krok protokołu: autentyczność. Podziękowanie z poczucia długu, wdzięczność na pokaz albo komplement, który jest przebraną autopromocją, psują cały efekt. Prosty test: czy umiesz podziękować za coś konkretnego? „Dziękuję, że przełożyłaś to spotkanie, uratowało mi to środę” działa. „Dzięki za wszystko” nie bardzo.",
        "I jeszcze jedno, co łatwo przeoczyć: twoja wdzięczność nie kończy się na tobie. Podziękowany człowiek chodzi potem inaczej po świecie, częściej sam komuś dziękuje. To cichy efekt fali i jeden z najlepszych powodów, żeby praktykować dalej.",
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
      title: "Dobre w tym, co jest",
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
        textLabel: "Chcesz coś dopisać? (opcjonalnie, tylko dla ciebie)",
      },
      knowledge: [
        "Ostatni poziom nie polega na dokładaniu kolejnych praktyk, tylko na zmianie spojrzenia. Thich Nhat Hanh nazywał to współistnieniem: każda rzecz, którą masz, istnieje dzięki niewidzialnej sieci ludzi i przyczyn. W kartce papieru, pisał, można zobaczyć chmurę, bo bez deszczu nie urosłoby drzewo, i drwala, i jego codzienny chleb. Kto naprawdę widzi tę sieć, ten nie musi się zmuszać do wdzięczności. Przychodzi sama.",
        "A co z dniami, które są po prostu złe? Tu Peterson mówi rzecz najtrudniejszą z całego kursu: wdzięczność pomimo cierpienia. Nie dlatego, że cierpienie jest dobre, i nie zamiast go czuć. Wdzięczność pomimo to świadoma postawa, wybierana właśnie wtedy, kiedy nie przychodzi sama. Według niego to nie naiwność, tylko forma odwagi.",
        "I domknięcie klamry z pierwszych dni: to nie jest toksyczna pozytywność. Nie szukamy dobrego zamiast trudnego, tylko obok trudnego. Trudne zostaje trudne, nazwane po imieniu. Pytanie brzmi jedynie: czy oprócz tego jest tu coś, co mogę uczciwie docenić? Jeśli odpowiedź jest mała, to znaczy, że jest prawdziwa.",
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
