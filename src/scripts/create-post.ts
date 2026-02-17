/**
 * CLI script to create a post and generate slides in one step.
 *
 * Usage:
 *   npx tsx src/scripts/create-post.ts '{"topicTag":"...","headline":"...", ...}'
 *   npx tsx src/scripts/create-post.ts --file post.json
 *   cat post.json | npx tsx src/scripts/create-post.ts --stdin
 *
 * Required fields: topicTag, headline, contentBody, quote, hashtags
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
import { saveFile } from "../lib/storage";
import crypto from "crypto";
import type { Post, ColorPalette } from "../db/schema";
import type { ReactElement } from "react";

const templates: ((post: Post, palette: ColorPalette) => ReactElement)[] = [
  SlideTitleTemplate,
  SlideContentTemplate,
  SlideQuoteTemplate,
  SlideCTATemplate,
];

interface PostInput {
  topicTag: string;
  headline: string;
  subtitle?: string;
  iconType?: string;
  contentTag?: string;
  contentBody: string;
  sectionNumber?: string;
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
    console.error("Required: topicTag, headline, contentBody, quote, hashtags");
    process.exit(1);
  }

  let input: PostInput;
  try {
    input = JSON.parse(rawJson);
  } catch {
    console.error("Invalid JSON input");
    process.exit(1);
  }

  if (!input.topicTag || !input.headline || !input.contentBody || !input.quote || !input.hashtags) {
    console.error("Missing required fields: topicTag, headline, contentBody, quote, hashtags");
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
      contentTag: input.contentTag || "Why it works",
      contentBody: input.contentBody,
      sectionNumber: input.sectionNumber || "01",
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

  // 4. Generate slides (1-4 for Instagram + 5-6 web variants)
  console.log("Generating slides...");
  for (let i = 0; i < 4; i++) {
    const jsx = templates[i](post, palette);
    const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
    const pngBuffer = Buffer.from(resvg.render().asPng());

    const hash = crypto.randomBytes(4).toString("hex");
    const filename = `post-${post.id}-slide-${i + 1}-${hash}.png`;
    const filePath = await saveFile(filename, pngBuffer);

    await db.insert(schema.slides).values({
      postId: post.id, slideNumber: i + 1, filename, filePath,
      width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fileSize: pngBuffer.length,
    });
    console.log(`  Slide ${i + 1}: ${filename} (${Math.round(pngBuffer.length / 1024)}KB)`);
  }

  // Web title (slide 5) — arrow down instead of right
  {
    const jsx = SlideTitleTemplate(post, palette, { arrowDown: true });
    const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
    const pngBuffer = Buffer.from(resvg.render().asPng());
    const hash = crypto.randomBytes(4).toString("hex");
    const filename = `post-${post.id}-slide-5-web-${hash}.png`;
    const filePath = await saveFile(filename, pngBuffer);
    await db.insert(schema.slides).values({
      postId: post.id, slideNumber: 5, filename, filePath,
      width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fileSize: pngBuffer.length,
    });
    console.log(`  Slide 5 (web): ${filename} (${Math.round(pngBuffer.length / 1024)}KB)`);
  }

  // Web quote (slide 6) — no icon
  {
    const jsx = SlideQuoteTemplate(post, palette, { hideIcon: true });
    const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
    const pngBuffer = Buffer.from(resvg.render().asPng());
    const hash = crypto.randomBytes(4).toString("hex");
    const filename = `post-${post.id}-slide-6-web-${hash}.png`;
    const filePath = await saveFile(filename, pngBuffer);
    await db.insert(schema.slides).values({
      postId: post.id, slideNumber: 6, filename, filePath,
      width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fileSize: pngBuffer.length,
    });
    console.log(`  Slide 6 (web): ${filename} (${Math.round(pngBuffer.length / 1024)}KB)`);
  }

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
