/**
 * Regenerate slides for posts matching a filter.
 *
 * Usage:
 *   npx tsx src/scripts/regenerate-slides.ts --locale pl
 *   npx tsx src/scripts/regenerate-slides.ts --id 6
 *   npx tsx src/scripts/regenerate-slides.ts --all
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "../lib/fonts";
import { SLIDE_WIDTH, SLIDE_HEIGHT, DEFAULT_PALETTE } from "../lib/constants";
import { SlideTitleTemplate } from "../templates/slide-title";
import { SlideContentTemplate } from "../templates/slide-content";
import { SlideQuoteTemplate } from "../templates/slide-quote";
import { SlideCTATemplate } from "../templates/slide-cta";
import { getContentSections, WEB_TITLE_SLIDE, WEB_QUOTE_SLIDE } from "../lib/content-sections";
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
    postId,
    slideNumber,
    filename,
    filePath,
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    fileSize: pngBuffer.length,
  });

  const sizeKB = Math.round(pngBuffer.length / 1024);
  console.log(`  Slide ${label}: ${filename} (${sizeKB}KB)`);
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  const args = process.argv.slice(2);
  let posts: Post[];

  if (args[0] === "--locale" && args[1]) {
    posts = await db.select().from(schema.posts).where(eq(schema.posts.locale, args[1]));
  } else if (args[0] === "--id" && args[1]) {
    posts = await db.select().from(schema.posts).where(eq(schema.posts.id, Number(args[1])));
  } else if (args[0] === "--all") {
    posts = await db.select().from(schema.posts);
  } else {
    console.error("Usage:");
    console.error("  npx tsx src/scripts/regenerate-slides.ts --locale pl");
    console.error("  npx tsx src/scripts/regenerate-slides.ts --id 6");
    console.error("  npx tsx src/scripts/regenerate-slides.ts --all");
    process.exit(1);
  }

  if (posts.length === 0) {
    console.log("No posts found.");
    process.exit(0);
  }

  console.log(`Found ${posts.length} post(s) to regenerate.`);

  const fonts = await loadFonts();
  console.log("Fonts loaded.\n");

  for (const post of posts) {
    console.log(`Post #${post.id}: ${post.headline}`);

    const dbPalette = await db.query.colorPalettes.findFirst({
      where: eq(schema.colorPalettes.id, post.colorPalette || "sage"),
    });
    const palette = dbPalette || (DEFAULT_PALETTE as unknown as ColorPalette);

    // Delete old slides
    await db.delete(schema.slides).where(eq(schema.slides.postId, post.id));

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
  }

  console.log("Done!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
