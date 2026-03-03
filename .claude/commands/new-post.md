You are creating a new Instagram carousel post for the "Just have a little meaning" account (@justhavealittlemeaning on Instagram, justmeaning.com) — a psychology & life hacks page.

The user will provide a topic, fact, or idea. Your job is to generate ALL post content and create a Markdown file + generate slide PNGs.

## Language detection

Detect the language from the user's input:
- If the user writes in Polish or says "po polsku", set `locale: pl` and generate ALL content in Polish (including subtitle, section tags, ctaText, handleBio, caption, quoteAttribution).
- If the user writes in English or says "po angielsku" / "in English", set `locale: en` and generate all content in English.
- Default to English if unclear.

For Polish posts, use these defaults:
- subtitle: "Przesuń, żeby dowiedzieć się więcej"
- section tags: "Dlaczego to działa", "Jak to działa", "Nauka za tym"
- ctaText: "Obserwuj po {więcej} psychologicznych trików"
- handleBio: "psychologia · life hacki · zdrowie psychiczne"

## Content guidelines

The account's tone is: calm, insightful, evidence-based, gently motivating. Think "your smart friend who studied psychology" — not clickbait, not academic.

**Content length rule:** Use multiple `## sections` (each becomes one content slide). Target ~40-60 words per section. If the topic needs more depth, use 2-3 sections.

## What to generate

Based on the user's input, generate a Markdown file at `content/posts/{slug}.md` with this structure:

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
quoteAttribution: "<— attribution>"
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
    url: "https://..."  # optional
---

## Section Tag

Content body with {highlighted} key phrases. ~40-60 words per section.

Separate paragraphs with blank lines.

## Another Section Tag

More content for a second slide...

---

Full Instagram caption (150-300 words): hook line, explanation, bullet points with arrows, book recommendations, closing CTA, then 8-12 hashtags.
```

### Field guide:
- **headline**: max ~8 words, 1-2 words in `{curly braces}` for accent color
- **sections (`##`)**: each becomes a content slide. Use `{curly braces}` for 3-5 highlighted phrases per section
- **quote**: use `{curly braces}` for 1-2 accent words
- **`---` separator**: content after it = Instagram caption (not shown on website)
- **colorPalette**: sage (green, default), slate (blue), warm (terracotta), lavender (purple) — pick based on topic mood

## Translations / translationGroup

Every post gets a `translationGroup` value to link translations together:

1. **First language version**: set `translationGroup` to the English slug
2. **Adding a translation**: use the same `translationGroup` as the existing post
3. **Creating multiple languages at once**: create both files with the same `translationGroup` (the English slug)

## How to create the post

1. Write the Markdown file to `content/posts/{slug}.md` using the Write tool
2. Generate slide PNGs:
```bash
env $(grep -v '^#' .env.local | grep -v '^$' | xargs) npx tsx src/scripts/generate-slides.ts {slug}
```

## After creation

Tell the user:
- The post title and which palette was used
- Where to view it: `/post/{slug}`
- Remind them to check the generated slides look good

$ARGUMENTS
