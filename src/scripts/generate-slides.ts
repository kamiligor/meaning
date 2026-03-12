/**
 * Generate slide PNGs from Markdown post files.
 *
 * Usage:
 *   npx tsx src/scripts/generate-slides.ts wstawaj-o-stalej-porze   # one post
 *   npx tsx src/scripts/generate-slides.ts --all                     # all posts
 *
 * Filenames are deterministic: {slug}-slide-{slideNumber}.png
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "../lib/fonts";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "../lib/constants";
import { getPalette } from "../lib/palettes";
import { SlideTitleTemplate } from "../templates/slide-title";
import { SlideContentTemplate } from "../templates/slide-content";
import { SlideQuoteTemplate } from "../templates/slide-quote";
import { SlideCTATemplate } from "../templates/slide-cta";
import { WEB_TITLE_SLIDE, WEB_QUOTE_SLIDE } from "../lib/content-sections";
import { saveFile } from "../lib/storage";
import { getPostBySlug, getAllPosts, type PostData } from "../lib/posts";
import type { Post } from "../db/schema";
import type { ReactElement } from "react";

type Fonts = Awaited<ReturnType<typeof loadFonts>>;

function postDataAsPost(post: PostData): Post {
  // Templates expect the Post type from DB schema.
  // PostData has the same fields so we cast for compat.
  return post as unknown as Post;
}

function slideFilename(slug: string, slideNumber: number): string {
  return `${slug}-slide-${slideNumber}.png`;
}

async function renderAndSave(
  jsx: ReactElement,
  slug: string,
  slideNumber: number,
  fonts: Fonts,
) {
  const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
  const pngBuffer = Buffer.from(resvg.render().asPng());

  const filename = slideFilename(slug, slideNumber);
  await saveFile(filename, pngBuffer);

  const sizeKB = Math.round(pngBuffer.length / 1024);
  console.log(`  Slide ${slideNumber}: ${filename} (${sizeKB}KB)`);
}

async function generateForPost(post: PostData, fonts: Fonts) {
  const palette = getPalette(post.colorPalette || "sage");
  const p = postDataAsPost(post);
  const sections = post.contentSections;

  // Slide 1: Title
  await renderAndSave(SlideTitleTemplate(p, palette), post.slug, 1, fonts);

  // Slides 2..N+1: Content (one per section)
  for (let i = 0; i < sections.length; i++) {
    const slideNum = i + 2;
    await renderAndSave(SlideContentTemplate(p, palette, sections[i]), post.slug, slideNum, fonts);
  }

  let nextNum = sections.length + 2;

  // Quote slide (only if quote is present)
  if (post.quote) {
    await renderAndSave(SlideQuoteTemplate(p, palette), post.slug, nextNum, fonts);
    nextNum++;
  }

  // CTA slide
  await renderAndSave(SlideCTATemplate(p, palette), post.slug, nextNum, fonts);

  // Slide 100: Web title variant
  await renderAndSave(SlideTitleTemplate(p, palette, { arrowDown: true }), post.slug, WEB_TITLE_SLIDE, fonts);

  // Slide 101: Web quote variant (only if quote is present)
  if (post.quote) {
    await renderAndSave(SlideQuoteTemplate(p, palette, { hideIcon: true }), post.slug, WEB_QUOTE_SLIDE, fonts);
  }
}

async function main() {
  const args = process.argv.slice(2);

  let postsToGenerate: PostData[];

  if (args[0] === "--all") {
    postsToGenerate = getAllPosts();
  } else if (args[0] && !args[0].startsWith("-")) {
    const post = getPostBySlug(args[0]);
    if (!post) {
      console.error(`Post not found: ${args[0]}`);
      process.exit(1);
    }
    postsToGenerate = [post];
  } else {
    console.error("Usage:");
    console.error("  npx tsx src/scripts/generate-slides.ts <slug>");
    console.error("  npx tsx src/scripts/generate-slides.ts --all");
    process.exit(1);
  }

  console.log(`Generating slides for ${postsToGenerate.length} post(s).\n`);

  const fonts = await loadFonts();
  console.log("Fonts loaded.\n");

  for (const post of postsToGenerate) {
    console.log(`Post: ${post.headline} (${post.slug})`);
    await generateForPost(post, fonts);
    console.log("");
  }

  console.log("Done!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
