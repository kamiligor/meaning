You are creating a new Instagram carousel post for the "Just have a little meaning" account (@justhavealittlemeaning on Instagram, justmeaning.com).

The user will provide a topic, fact, or idea. Your job is to orchestrate a 3-agent pipeline to generate the post content, then create the Markdown file and generate slide PNGs.

## Agent Pipeline (MANDATORY, sequential)

Every post MUST go through all 3 agents in order. Do NOT skip any step.

### Agent 1: psycholog-badawczy

Dispatch with this prompt structure:

```
Temat posta: [topic from user]
Język: [pl/en]

Twoim zadaniem jest przygotować fundament naukowy dla posta na Instagram o tym temacie.

Dostarcz:
1. Jakie twierdzenia można bezpiecznie postawić (evidence-based)?
2. Czego NIE powinniśmy twierdzić (za mało dowodów, uproszczenie)?
3. Kluczowe mechanizmy psychologiczne/naukowe do wyjaśnienia
4. 2-3 referencje (autor + tytuł książki/badania)
5. Czy temat wymaga disclaimera?

Format: zwróć krótki brief (max 300 słów), nie pisz gotowego posta.
```

### Agent 2: copywriter

Dispatch with this prompt structure (pass the brief from Agent 1):

```
Na podstawie briefu naukowego poniżej, napisz pełny post.

BRIEF NAUKOWY:
[paste Agent 1 output]

TEMAT: [topic]
JĘZYK: [pl/en]

Napisz plik Markdown z pełną strukturą posta (frontmatter + slide sections + web sections + caption).

ZASADY FORMATU:
- Slide sections: oznaczone `<!-- slide-only -->`, krótkie (~40-60 słów), z {akcentami}
- Web sections: BEZ markera, rozwijają wątki ze slajdów, BEZ {akcentów}
- Caption: po separatorze `---`, 150-300 słów na Instagram

ZASADY STYLU (KRYTYCZNE):
- Ton: "mądry znajomy, który studiował psychologię". Nie Wikipedia, nie poradnik.
- BEZ myślników em dash (—). Używaj kropek, przecinków lub przeformułuj zdanie.
- BEZ akademickich cytowań w treści (nie pisz "Walker, 2017" ani "badania Pandy")
- BEZ angielskich terminów w nawiasach
- BEZ zbyt szczegółowych porad (nie pisz "przesuwaj o 15-30 minut tygodniowo")
- BEZ anglicyzmów w polskich tekstach. Używaj polskich słów (nie "starter", "feedback", "mindset" tylko polskie odpowiedniki)
- BEZ powtarzania tej samej frazy w wielu akapitach
- BEZ kolokwializmów i filler phrases ("trochę jak", "chce ci się")
- BEZ antropomorfizacji i personifikacji ("organizm nie wie", "mózg chce"). Pisz precyzyjnie o mechanizmach, nie przypisuj organom ludzkiej świadomości.
- BEZ ozdobnych metafor i potocznych czasowników ("zegar skacze", "rytm się rozjeżdża"). Pisz bezpośrednio: przyczyna → skutek → wniosek. Styl Jordana Petersona: precyzyjny, konkretny, bez ozdóbek.
- Web sekcje MUSZĄ mieć inne nagłówki niż slide sekcje
- Nagłówki web sekcji: krótkie (2-3 słowa), przyziemne, konkretne. Nie coachingowe ("Jak zacząć bez wywracania wszystkiego"), nie self-helpowe ("Odkryj swoją siłę"). Dobre przykłady: "Zmęczenie i nastrój", "Jedna zmiana", "Poranek ustawia resztę dnia".
- ZAWSZE pierwsza web sekcja to "Dlaczego to działa" (pl) / "Why it works" (en). Każdy slajd ma taką sekcję, a web ją rozwija. Nagłówek jest celowo taki sam jak na slajdzie, bo to kluczowa sekcja posta.
- Web sekcje rozwijają slajdy, nie powtarzają ich dosłownie
- Krótkie akapity (2-3 zdania max)

STRUKTURA PLIKU:
[paste the Markdown template from "What to generate" section below]
```

### Agent 3: qa-tester

Dispatch with this prompt structure:

```
Przeczytaj post: content/posts/[slug].md

Sprawdź go pod kątem tych zasad i zgłoś KAŻDE naruszenie:

CHECKLIST STYLU:
- [ ] Brak myślników em dash (—) w web sekcjach i caption
- [ ] Brak akademickich cytowań (np. "Walker, 2017", "badania X")
- [ ] Brak angielskich terminów w nawiasach
- [ ] Brak zbyt szczegółowych porad (kroki, minuty, procenty)
- [ ] Brak anglicyzmów w polskich tekstach
- [ ] Brak powtórzeń tej samej frazy w wielu akapitach
- [ ] Brak kolokwializmów i AI filler phrases
- [ ] Web sekcje mają inne nagłówki niż slide sekcje
- [ ] Web sekcje nie powtarzają dosłownie treści slajdów
- [ ] Akapity max 2-3 zdania
- [ ] Ton naturalny, nie akademicki i nie AI-generowany
- [ ] {Akcenty} TYLKO w slide-only sekcjach, NIE w web sekcjach

CHECKLIST MERYTORYCZNY:
- [ ] Treść jest evidence-based (nie wprowadza w błąd)
- [ ] Brak toksycznej pozytywności ("Dasz radę!", "Wszystko będzie dobrze!")
- [ ] Język nieoceniający i inkluzywny

Jeśli znajdziesz problemy, napisz konkretnie CO i GDZIE poprawić.
Jeśli post jest OK, napisz "POST OK".
```

If Agent 3 finds problems, fix them and re-run Agent 3 until the post passes.

## Language detection

Detect the language from the user's input:
- If the user writes in Polish or says "po polsku", set `locale: pl`
- If the user writes in English or says "po angielsku", set `locale: en`
- Default to English if unclear.

For Polish posts, use these defaults:
- subtitle: "Przesuń, żeby dowiedzieć się więcej"
- ctaText: "Obserwuj po {więcej} psychologicznych trików"
- handleBio: "psychologia · life hacki · zdrowie psychiczne"

## What to generate

Markdown file at `content/posts/{slug}.md`:

```markdown
---
slug: <kebab-case slug from headline>
status: published
locale: <en or pl>
translationGroup: <english slug to link translations>
publishedAt: "<YYYY-MM-DD>"

topicTag: <short category, e.g. "Psychology Life Hack">
headline: "<catchy title with {accent} words>"
subtitle: "<short CTA>"  # omit for default
iconType: <clock|sun|brain|heart|leaf>

quote: "<inspiring quote with {accent} words>"
quoteAttribution: "<attribution>"
quoteIconType: <clock|sun|brain|heart|leaf>  # omit for default (sun)

ctaText: "<CTA with {accent}>"  # omit for default
hashtags:
  - "#tag1"
  - "#tag2"
  - "#tag3"
  - "#tag4"
handleBio: "<bio text>"  # omit for default

colorPalette: <sage|slate|warm|lavender>  # omit for default (sage)

references:
  - title: "Book Title"
    author: "Author Name"
---

<!-- slide-only -->
## Slide Section Tag

Short content for Instagram slide with {highlighted} key phrases. ~40-60 words.

<!-- slide-only -->
## Another Slide Section

More slide content...

## Web Section Title

Expanded content for the website. Natural tone, short paragraphs. No {accent braces}.

## Another Web Section

More web content...

---

Instagram caption (150-300 words).
```

### Field guide:
- **headline**: max ~8 words, 1-2 words in `{curly braces}` for accent color
- **`<!-- slide-only -->` sections**: each becomes a content slide, `{curly braces}` for highlights
- **web sections** (no marker): expanded content for justmeaning.com, no `{curly braces}`
- **quote**: use `{curly braces}` for 1-2 accent words
- **`---` separator**: content after it = Instagram caption (not shown on website)
- **colorPalette**: sage (green), slate (blue), warm (terracotta), lavender (purple)

## Translations / translationGroup

1. **First language version**: set `translationGroup` to the English slug
2. **Adding a translation**: use the same `translationGroup` as the existing post
3. **Both at once**: same `translationGroup` (the English slug)

## After all 3 agents pass

1. Write the final Markdown file to `content/posts/{slug}.md`
2. Generate slide PNGs:
```bash
env $(grep -v '^#' .env.local | grep -v '^$' | xargs) npx tsx src/scripts/generate-slides.ts {slug}
```
3. Tell the user:
   - Post title and palette used
   - Where to view: `/post/{slug}`
   - Remind to check slides

$ARGUMENTS
