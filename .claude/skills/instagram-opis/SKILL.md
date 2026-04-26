---
name: instagram-opis
description: Przygotuj opis (caption) na Instagram dla posta karuzelowego. Wywolaj gdy uzytkownik chce przygotowac opis do posta, lub napisze "przygotuj opis do nastepnego posta".
allowed-tools: Read, Write, Glob, Grep
---

# Przygotuj opis na Instagram

Przygotuj plik `instagram.md` z opisem posta na Instagram.

## Jak znaleźć post do opisania

Jeśli użytkownik podał slug lub tytuł posta, użyj go. Jeśli nie podał (np. napisał "przygotuj opis do następnego posta"):

1. Znajdź wszystkie opublikowane posty EN: `content/posts/*.md` z `locale: en` i `status: published`
2. Znajdź wszystkie istniejące opisy: `data/slides/*/en/instagram.md`
3. Wybierz najstarszy (wg `publishedAt`) post EN, który nie ma jeszcze `instagram.md`
4. Pokaż użytkownikowi który post wybrałeś i zapytaj o potwierdzenie

## Jak napisać opis

### Krok 1: Przeczytaj wzorce

Przeczytaj WSZYSTKIE istniejące pliki `data/slides/*/en/instagram.md` jako wzorce stylu i tonu.

### Krok 2: Przeczytaj post

Przeczytaj `content/posts/{slug}.md` — zarówno slide sections jak i web sections.

### Krok 3: Napisz opis

Napisz plik `data/slides/{slug}/en/instagram.md` w tym formacie:

```
[Hook - 1-2 zdania, najciekawsza myśl z posta]

[Rozwinięcie - 2-4 krótkie akapity, rozwijają hook naturalnym tonem]

[CTA - pytanie do czytelnika, zachęcające do interakcji]

We post psychology insights you can actually use. Just meaningful content. More at justmeaning.com -- link in bio.

#hashtag1 #hashtag2 #hashtag3 #hashtag4 #justhavealittlemeaning
```

### Zasady stylu (KRYTYCZNE):

- **Język:** angielski (EN) — zawsze
- **Ton:** naturalny, jak mądry znajomy. Nie akademicki, nie coachingowy, nie AI-generowany
- **Długość:** 80-130 słów (bez stopki i hashtagów). Celuj w ~100
- **Hook:** najciekawsza myśl z posta, nie generyczna mądrość. MUSI być inny niż tekst na slajdach
- **Rozwinięcie:** rozwijaj hook, dodaj kontekst. Krótkie akapity (1-3 zdania)
- **BEZ duplikatów ze slajdów** — caption to NOWY angle na temat, nie streszczenie karuzeli. Czytelnik widzi caption RAZEM ze slajdami. Czerpaj z web sekcji (te nie są na slajdach) lub dodaj nowy wątek
- **CTA:** pytanie na końcu (przed stopką), zachęca do komentarza
- **Stopka:** ZAWSZE ta sama: `We post psychology insights you can actually use. Just meaningful content. More at justmeaning.com -- link in bio.`
- **Hashtagi:** max 5, zawsze kończ na `#justhavealittlemeaning`
- **BEZ** emoji
- **BEZ** em dash (--) w treści (tylko w stopce jest ok)
- **BEZ** toksycznej pozytywności
- **BEZ** "studies show", "research says" — po prostu mów co jest prawdą
- **BEZ** wielkich obietnic ("this will change your life")
- **Użyj** `--` zamiast `—` jeśli koniecznie potrzebujesz myślnika w stopce

## Krok 4: Pokaż wynik

Po zapisaniu pliku pokaż użytkownikowi:
- Slug posta
- Pełną treść `instagram.md`
- Ścieżkę do pliku

$ARGUMENTS
