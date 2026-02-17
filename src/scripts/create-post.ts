/**
 * CLI script to create a post and generate slides in one step.
 *
 * Usage:
 *   npx tsx src/scripts/create-post.ts '{"topicTag":"...","headline":"...", ...}'
 *   npx tsx src/scripts/create-post.ts --file post.json
 *   cat post.json | npx tsx src/scripts/create-post.ts --stdin
 *
 * Required fields: topicTag, headline, contentBody (or contentSlides), quote, hashtags
 * Optional fields get sensible defaults.
 *
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars.
 */

import { readFileSync } from "fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { generateSlug } from "../lib/slug";

// --- Re-import generate pipeline deps ---
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "../lib/fonts";
import { SLIDE_WIDTH, SLIDE_HEIGHT, DEFAULT_PALETTE } from "../lib/constants";
import { SlideTitleTemplate } from "../templates/slide-title";
import { SlideContentTemplate } from "../templates/slide-content";
import { SlideQuoteTemplate } from "../templates/slide-quote";
import { SlideCTATemplate } from "../templates/slide-cta";
import { getContentSections, WEB_TITLE_SLIDE, WEB_QUOTE_SLIDE, type ContentSection } from "../lib/content-sections";
import { saveFile } from "../lib/storage";
import crypto from "crypto";
import type { Post, ColorPalette } from "../db/schema";
import type { ReactElement } from "react";

type Fonts = Awaited<ReturnType<typeof loadFonts>>;
type Db = ReturnType<typeof drizzle<typeof schema>>;

async function renderAndSave(
  jsx: ReactElement,
  postId: number,
  slideNumber: number,
  fonts: Fonts,
  label: string,
  db: Db,
) {
  const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
  const pngBuffer = Buffer.from(resvg.render().asPng());

  const hash = crypto.randomBytes(4).toString("hex");
  const filename = `post-${postId}-slide-${label}-${hash}.png`;
  const filePath = await saveFile(filename, pngBuffer);

  await db.insert(schema.slides).values({
    postId, slideNumber, filename, filePath,
    width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fileSize: pngBuffer.length,
  });
  console.log(`  Slide ${label}: ${filename} (${Math.round(pngBuffer.length / 1024)}KB)`);
}

interface PostInput {
  topicTag: string;
  headline: string;
  subtitle?: string;
  iconType?: string;
  contentTag?: string;
  contentBody?: string;
  sectionNumber?: string;
  contentSlides?: ContentSection[];
  quote: string;
  quoteAttribution?: string;
  quoteIconType?: string;
  ctaText?: string;
  hashtags: string | string[];
  handleBio?: string;
  caption?: string;
  colorPalette?: string;
  logoVariant?: string;
  locale?: "en" | "pl";
  status?: "draft" | "published";
  translationGroup?: string;
}

async function main() {
  let rawJson: string;

  const args = process.argv.slice(2);

  if (args[0] === "--file" && args[1]) {
    rawJson = readFileSync(args[1], "utf-8");
  } else if (args[0] === "--stdin") {
    rawJson = readFileSync(0, "utf-8");
  } else if (args[0] && !args[0].startsWith("-")) {
    rawJson = args[0];
  } else {
    console.error("Usage:");
    console.error("  npx tsx src/scripts/create-post.ts '<json>'");
    console.error("  npx tsx src/scripts/create-post.ts --file post.json");
    console.error("  cat post.json | npx tsx src/scripts/create-post.ts --stdin");
    console.error("");
    console.error("Required: topicTag, headline, contentBody (or contentSlides), quote, hashtags");
    process.exit(1);
  }

  let input: PostInput;
  try {
    input = JSON.parse(rawJson);
  } catch {
    console.error("Invalid JSON input");
    process.exit(1);
  }

  const hasContent = input.contentBody || (input.contentSlides && input.contentSlides.length > 0);
  if (!input.topicTag || !input.headline || !hasContent || !input.quote || !input.hashtags) {
    console.error("Missing required fields: topicTag, headline, contentBody (or contentSlides), quote, hashtags");
    process.exit(1);
  }

  // Connect to DB
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  const hashtags = Array.isArray(input.hashtags)
    ? JSON.stringify(input.hashtags)
    : input.hashtags;

  const slug = generateSlug(input.headline);

  // Derive legacy fields from first content slide if using contentSlides
  const effectiveContentTag = input.contentSlides?.[0]?.tag ?? input.contentTag ?? "Why it works";
  const effectiveContentBody = input.contentSlides?.[0]?.body ?? input.contentBody ?? "";
  const effectiveSectionNumber = input.contentSlides?.[0]?.sectionNumber ?? input.sectionNumber ?? "01";

  // 1. Insert post
  console.log("Creating post...");
  const [post] = await db
    .insert(schema.posts)
    .values({
      slug,
      status: input.status || "published",
      topicTag: input.topicTag,
      headline: input.headline,
      subtitle: input.subtitle || "Swipe to learn why",
      iconType: input.iconType || "clock",
      contentTag: effectiveContentTag,
      contentBody: effectiveContentBody,
      sectionNumber: effectiveSectionNumber,
      contentSlides: input.contentSlides ? JSON.stringify(input.contentSlides) : null,
      quote: input.quote,
      quoteAttribution: input.quoteAttribution || "",
      quoteIconType: input.quoteIconType || "sun",
      ctaText: input.ctaText || "Follow for {more} psychology life hacks",
      hashtags,
      handleBio: input.handleBio || "psychology \u00B7 life hacks \u00B7 mental health",
      caption: input.caption || "",
      colorPalette: input.colorPalette || "sage",
      logoVariant: input.logoVariant || "light",
      locale: input.locale || "en",
      translationGroup: input.translationGroup || slug,
    })
    .returning();

  console.log(`Post created: id=${post.id}, slug="${post.slug}"`);

  // 2. Fetch palette
  let palette: ColorPalette;
  const dbPalette = await db.query.colorPalettes.findFirst({
    where: eq(schema.colorPalettes.id, post.colorPalette || "sage"),
  });
  palette = dbPalette || (DEFAULT_PALETTE as unknown as ColorPalette);

  // 3. Load fonts
  console.log("Loading fonts...");
  const fonts = await loadFonts();

  // 4. Generate slides dynamically
  console.log("Generating slides...");
  const sections = getContentSections(post);

  // Slide 1: Title
  await renderAndSave(SlideTitleTemplate(post, palette), post.id, 1, fonts, "1", db);

  // Slides 2..N+1: Content (one per section)
  for (let i = 0; i < sections.length; i++) {
    const slideNum = i + 2;
    await renderAndSave(SlideContentTemplate(post, palette, sections[i]), post.id, slideNum, fonts, String(slideNum), db);
  }

  // Slide N+2: Quote
  const quoteNum = sections.length + 2;
  await renderAndSave(SlideQuoteTemplate(post, palette), post.id, quoteNum, fonts, String(quoteNum), db);

  // Slide N+3: CTA
  const ctaNum = sections.length + 3;
  await renderAndSave(SlideCTATemplate(post, palette), post.id, ctaNum, fonts, String(ctaNum), db);

  // Slide 100: Web title variant
  await renderAndSave(SlideTitleTemplate(post, palette, { arrowDown: true }), post.id, WEB_TITLE_SLIDE, fonts, "100-web", db);

  // Slide 101: Web quote variant
  await renderAndSave(SlideQuoteTemplate(post, palette, { hideIcon: true }), post.id, WEB_QUOTE_SLIDE, fonts, "101-web", db);

  console.log("");
  console.log("Done! Post is ready.");
  console.log(`  Admin:  /admin/posts/${post.id}/edit`);
  console.log(`  Public: /post/${post.slug}`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
