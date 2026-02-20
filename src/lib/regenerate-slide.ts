import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "./fonts";
import { SLIDE_WIDTH, SLIDE_HEIGHT, DEFAULT_PALETTE } from "./constants";
import { SlideTitleTemplate } from "@/templates/slide-title";
import { SlideContentTemplate } from "@/templates/slide-content";
import { SlideQuoteTemplate } from "@/templates/slide-quote";
import { SlideCTATemplate } from "@/templates/slide-cta";
import { getContentSections, WEB_TITLE_SLIDE, WEB_QUOTE_SLIDE } from "./content-sections";
import { db } from "@/db";
import { slides, posts, colorPalettes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveFile } from "./storage";
import type { Post, ColorPalette } from "@/db/schema";

/**
 * Regenerate a single slide PNG by filename.
 * Returns the PNG buffer if successful, null otherwise.
 */
export async function regenerateSlide(filename: string): Promise<Buffer | null> {
  // Find the slide record in DB
  const slide = await db.query.slides.findFirst({
    where: eq(slides.filename, filename),
  });
  if (!slide) return null;

  // Fetch the post
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, slide.postId),
  });
  if (!post) return null;

  // Fetch palette
  let palette: ColorPalette;
  const dbPalette = await db.query.colorPalettes.findFirst({
    where: eq(colorPalettes.id, post.colorPalette || "sage"),
  });
  palette = dbPalette || (DEFAULT_PALETTE as unknown as ColorPalette);

  // Determine which template to render
  const jsx = getTemplateForSlide(post, palette, slide.slideNumber);
  if (!jsx) return null;

  // Render to PNG
  const fonts = await loadFonts();
  const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
  const pngBuffer = Buffer.from(resvg.render().asPng());

  // Save with the original filename
  await saveFile(filename, pngBuffer);

  return pngBuffer;
}

function getTemplateForSlide(post: Post, palette: ColorPalette, slideNumber: number) {
  if (slideNumber === WEB_TITLE_SLIDE) {
    return SlideTitleTemplate(post, palette, { arrowDown: true });
  }
  if (slideNumber === WEB_QUOTE_SLIDE) {
    return SlideQuoteTemplate(post, palette, { hideIcon: true });
  }
  if (slideNumber === 1) {
    return SlideTitleTemplate(post, palette);
  }

  const sections = getContentSections(post);
  const quoteNum = sections.length + 2;
  const ctaNum = sections.length + 3;

  if (slideNumber === quoteNum) {
    return SlideQuoteTemplate(post, palette);
  }
  if (slideNumber === ctaNum) {
    return SlideCTATemplate(post, palette);
  }

  // Content slides: slideNumber 2..sections.length+1
  const sectionIndex = slideNumber - 2;
  if (sectionIndex >= 0 && sectionIndex < sections.length) {
    return SlideContentTemplate(post, palette, sections[sectionIndex]);
  }

  return null;
}
