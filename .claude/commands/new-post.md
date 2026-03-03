You are creating a new Instagram carousel post for the "Just have a little meaning" account (@justhavealittlemeaning on Instagram, justmeaning.com) — a psychology & life hacks page.

The user will provide a topic, fact, or idea. Your job is to generate ALL post content and create it via the CLI script.

## Language detection

Detect the language from the user's input:
- If the user writes in Polish or says "po polsku", set `"locale": "pl"` and generate ALL content in Polish (including subtitle, contentTag, ctaText, handleBio, caption, quoteAttribution).
- If the user writes in English or says "po angielsku" / "in English", set `"locale": "en"` and generate all content in English.
- Default to English if unclear.

For Polish posts, use these defaults:
- subtitle: "Przesuń, żeby dowiedzieć się więcej"
- contentTag: "Dlaczego to działa", "Jak to działa", "Nauka za tym"
- ctaText: "Obserwuj po {więcej} psychologicznych trików"
- handleBio: "psychologia · life hacki · zdrowie psychiczne"

## Content guidelines

The account's tone is: calm, insightful, evidence-based, gently motivating. Think "your smart friend who studied psychology" — not clickbait, not academic.

**Content length rule:** ALWAYS use `contentSlides` (array) instead of `contentBody` (single string). This gives you control over how many content slides are generated. Each section = one slide PNG. Target ~40-60 words per section. If the topic needs more depth, use 2-3 sections.

## What to generate

Based on the user's input, generate these fields:

1. **topicTag** — short category label, e.g. "Psychology Life Hack", "Cognitive Bias" (2-4 words, uppercase-style)
2. **headline** — catchy title with one or two words in `{curly braces}` for accent color (max ~8 words)
3. **subtitle** — short CTA (language-appropriate)
4. **iconType** — one of: clock, sun, brain, heart, leaf (pick the most fitting)
5. **contentTag** — label for content slide (language-appropriate)
6. **contentBody** — If the content is short (~40-60 words), use this single field. Use `{curly braces}` for 3-5 key phrases to highlight. Separate paragraphs with `\n\n`.
7. **sectionNumber** — "01" (when using single contentBody)
8. **contentSlides** — (optional, preferred for longer content) Array of `[{tag, body, sectionNumber}]`. Each section becomes a separate slide PNG. Use this when content exceeds ~60 words — split into multiple sections of ~40-60 words each. Example: `[{"tag": "How it works", "body": "First part with {highlights}...", "sectionNumber": "01"}, {"tag": "Why it matters", "body": "Second part...", "sectionNumber": "02"}]`. When using `contentSlides`, `contentBody` is optional (first slide's body is used as fallback).
9. **quote** — an inspiring/thoughtful quote related to the topic. Use `{curly braces}` for 1-2 accent words.
10. **quoteAttribution** — attribution with em-dash
11. **quoteIconType** — one of: clock, sun, brain, heart, leaf
12. **ctaText** — call to action (language-appropriate)
13. **hashtags** — JSON array of 4 relevant hashtags for the slide
14. **caption** — full Instagram caption (150-300 words): hook line, explanation, bullet points with arrows, book recommendations if relevant, closing CTA, then 8-12 hashtags at the end
15. **colorPalette** — one of: "sage" (green, default), "slate" (blue), "warm" (terracotta), "lavender" (purple). Pick based on topic mood.
16. **locale** — "en" or "pl"
17. **references** — (optional) Array of 2-4 recommended books/articles related to the topic: `[{"title":"Book Title","author":"Author Name","url":"https://..."}]`. Use localized book titles when a published translation exists in the post's language; otherwise use the original title. The `url` field is optional.



## Translations / translationGroup

Every post gets a `translationGroup` value to link translations together. The rules:

1. **First language version** (no existing translation): omit `translationGroup` — it will auto-set to the post's slug.
2. **Adding a translation of an existing post**: set `"translationGroup"` to the **existing post's `translationGroup`** value (its English slug). To find it, query the DB or check the existing post.
3. **Creating multiple languages at once**: create the English version first (auto-generates group), then create other languages with `"translationGroup": "<english-slug>"`.

When the user asks to create a post in multiple languages, ALWAYS:
- Create the English version first
- Then create each additional language with the same `translationGroup`
- Confirm which languages were created and linked

## How to create the post

After generating the content, construct a JSON object and run:

1. Write the JSON to a temp file (e.g. `tmp-post.json`) using the Write tool
2. Run:
```bash
env $(grep -v '^#' .env.local | grep -v '^$' | xargs) npx tsx src/scripts/create-post.ts --file tmp-post.json
```
3. Delete `tmp-post.json` after success

Important:
- Use `\n\n` for paragraph breaks in contentBody and caption
- hashtags must be a JSON array of strings
- The script will create the post AND generate all slides automatically (title + N content + quote + CTA for Instagram, plus 2 web variants at slideNumber 100/101)

## After creation

Tell the user:
- The post title and which palette was used
- Where to view it: admin URL and public URL
- Remind them to check the generated slides look good

$ARGUMENTS
