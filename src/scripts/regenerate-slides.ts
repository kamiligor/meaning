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

    for (let i = 0; i < 4; i++) {
      const jsx = templates[i](post, palette);
      const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
      const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
      const pngBuffer = Buffer.from(resvg.render().asPng());

      const hash = crypto.randomBytes(4).toString("hex");
      const filename = `post-${post.id}-slide-${i + 1}-${hash}.png`;
      const filePath = await saveFile(filename, pngBuffer);

      await db.insert(schema.slides).values({
        postId: post.id,
        slideNumber: i + 1,
        filename,
        filePath,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        fileSize: pngBuffer.length,
      });

      const sizeKB = Math.round(pngBuffer.length / 1024);
      console.log(`  Slide ${i + 1}: ${filename} (${sizeKB}KB)`);
    }

    // Web title variant (slide 5) — no subtitle text
    {
      const jsx = SlideTitleTemplate(post, palette, { arrowDown: true });
      const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
      const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
      const pngBuffer = Buffer.from(resvg.render().asPng());

      const hash = crypto.randomBytes(4).toString("hex");
      const filename = `post-${post.id}-slide-5-web-${hash}.png`;
      const filePath = await saveFile(filename, pngBuffer);

      await db.insert(schema.slides).values({
        postId: post.id,
        slideNumber: 5,
        filename,
        filePath,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        fileSize: pngBuffer.length,
      });

      const sizeKB = Math.round(pngBuffer.length / 1024);
      console.log(`  Slide 5 (web): ${filename} (${sizeKB}KB)`);
    }

    // Web quote variant (slide 6) — no icon
    {
      const jsx = SlideQuoteTemplate(post, palette, { hideIcon: true });
      const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
      const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
      const pngBuffer = Buffer.from(resvg.render().asPng());

      const hash = crypto.randomBytes(4).toString("hex");
      const filename = `post-${post.id}-slide-6-web-${hash}.png`;
      const filePath = await saveFile(filename, pngBuffer);

      await db.insert(schema.slides).values({
        postId: post.id,
        slideNumber: 6,
        filename,
        filePath,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        fileSize: pngBuffer.length,
      });

      const sizeKB = Math.round(pngBuffer.length / 1024);
      console.log(`  Slide 6 (web): ${filename} (${sizeKB}KB)`);
    }
    console.log("");
  }

  console.log("Done!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
