---
name: instagram-komentarz
description: Znajdz post na Instagramie i przygotuj komentarz z konta @justhavealittlemeaning. Uzytkownik musi byc zalogowany w przegladarce Playwright.
allowed-tools: Read, Glob, Grep, mcp__playwright__browser_snapshot, mcp__playwright__browser_click, mcp__playwright__browser_navigate, mcp__playwright__browser_navigate_back, mcp__playwright__browser_press_key, mcp__playwright__browser_type, mcp__playwright__browser_tabs, mcp__playwright__browser_wait_for, mcp__playwright__browser_take_screenshot
---

# Znajdz post i przygotuj komentarz na Instagram

## Wymagania wstepne

Uzytkownik MUSI byc zalogowany na Instagramie w przegladarce Playwright. NIE loguj sie automatycznie.

## Profil komentujacego (@justhavealittlemeaning)

**Kim jestesmy:** Konto o psychologii, pisaniu terapeutycznym i samorozwoju. Prowadzimy program pisania (The Life Writing Program). Nasz ton to "madry znajomy, ktory studiowal psychologie".

**Swiatopoglad:** Bliski Jordanowi Petersonowi. Bardziej konserwatywni niz lewicowi, ale tolerancyjni i wyrozumiali. Wierzymy w osobista odpowiedzialnosc, sens, cele, poradzenie sobie z cierpieniem. Nigdy nie hejtujemy. Nie wchodzimy w polityczne dyskusje na Instagramie.

**Kluczowe przekonanie o depresji:** Rozrozniamy depresje kliniczna (biologiczna, wymaga lekow i terapii) od stanu depresyjnego (sytuacyjnego, spowodowanego np. brakiem celu, chaosem w zyciu). Gdy wszystkie aspekty zycia sa ulozone a samopoczucie nadal jest zle - to prawdopodobnie depresja kliniczna. W innym przypadku praca nad wlasnym zyciem jest kluczowa. To NIE jest umniejszanie depresji - chodzi o rozpoznanie jaki rodzaj pomocy jest potrzebny.

Pelny profil przekonan: przeczytaj `/Users/kamilkucharski/.claude/projects/-Applications-MAMP-htdocs-jh/memory/user_worldview.md`

**Czego szukamy w postach do komentowania:**
- Posty o psychologii, samorozwoju, zdrowiu psychicznym, nawykach, produktywnosci, pisaniu
- Posty z umiarkowana liczba lajkow (100-10K) — duze konta daja zasiegi, ale komentarz musi byc wczesny
- Najlepiej: brak komentarzy jeszcze (pierwszy komentarz = najlepsza widocznosc)
- Konta w naszej niszy: psychologia, terapia, coaching, ksiazki, neurobiologia

**Czego unikamy:**
- Posty polityczne, kontrowersyjne, polaryzujace
- Hustle culture (chyba ze mozemy dodac niuans)
- Toksyczna pozytywnosc
- Posty zbyt daleko od naszej niszy (fitness, dieta, moda)

## Workflow

### Krok 1: Znajdz post

Uzyj Playwright zeby przejrzec Instagram:
1. Przejdz na strone glowna (feed) — sprawdz 5-10 ostatnich postow
2. Jesli nic dobrego — przejdz do Explore
3. Szukaj postow ktore pasuja do naszego profilu

Dla kazdego kandydata sprawdz:
- Temat (czy w naszej niszy?)
- Liczba lajkow i komentarzy
- Czy jestesmy wczesni? (mniej komentarzy = lepiej)

### Krok 2: Przedstaw post uzytkownikowi

Pokaz:
- Konto i opis posta
- Liczbe lajkow/komentarzy
- Dlaczego ten post jest dobry do komentowania

### Krok 3: Napisz komentarz

Zasady komentarzy:
- **Jezyk:** angielski (konto jest angielskojezyczne)
- **Dlugosc:** 1-2 zdania MAX
- **Ton:** naturalny, grounded, osobisty. Jak ktos kto pracuje z samorefleksja/pisaniem
- **BEZ** emoji
- **BEZ** em dash
- **BEZ** generycznych pochwal ("great post", "this is so true", "love this")
- **BEZ** dlugich intelektualnych wywodow
- **BEZ** promocji (nie wspominaj o naszym koncie/stronie)
- **DOBRY komentarz:** relatable, osobisty, dodaje wartosc, nawiazuje do pisania/journalingu/refleksji gdy to naturalne
- Moze delikatnie pokazywac nasz expertise (psychologia, pisanie terapeutyczne) bez bycia promocyjnym

### Krok 4: Czekaj na zatwierdzenie

NIGDY nie publikuj komentarza automatycznie. Przedstaw propozycje i czekaj na zatwierdzenie uzytkownika. Uzytkownik sam wklei i wysle komentarz.

## Przeczytaj tez

Przed napisaniem komentarza przeczytaj `docs/instagram-comments-log.md` zeby zobaczyc poprzednie komentarze i zachowac spojnosc stylu.

$ARGUMENTS
