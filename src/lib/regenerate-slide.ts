import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "./fonts";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "./constants";
import { getPalette } from "./palettes";
import { SlideTitleTemplate } from "@/templates/slide-title";
import { SlideContentTemplate } from "@/templates/slide-content";
import { SlideQuoteTemplate } from "@/templates/slide-quote";
import { SlideCTATemplate } from "@/templates/slide-cta";
import { WEB_TITLE_SLIDE, WEB_QUOTE_SLIDE } from "./content-sections";
import { saveFile } from "./storage";
import { getPostByGroupAndLocale, type PostData } from "./posts";
import type { Post } from "@/db/schema";
import type { ColorPalette } from "@/lib/palettes";

/**
 * Parse deterministic filename: {translationGroup}/{locale}/slide-{slideNumber}.png
 */
function parseFilename(filename: string): { group: string; locale: string; slideNumber: number } | null {
  const match = filename.match(/^(.+)\/([a-z]{2})\/slide-(\d+)\.png$/);
  if (!match) return null;
  return { group: match[1], locale: match[2], slideNumber: Number(match[3]) };
}

/**
 * Regenerate a single slide PNG by filename.
 * Filenames are deterministic: {translationGroup}/{locale}/slide-{slideNumber}.png
 * Returns the PNG buffer if successful, null otherwise.
 */
export async function regenerateSlide(filename: string): Promise<Buffer | null> {
  const parsed = parseFilename(filename);
  if (!parsed) return null;

  const post = getPostByGroupAndLocale(parsed.group, parsed.locale);
  if (!post) return null;

  const palette = getPalette(post.colorPalette || "sage");
  const p = post as unknown as Post;

  const jsx = getTemplateForSlide(p, palette, parsed.slideNumber, post);
  if (!jsx) return null;

  const fonts = await loadFonts();
  const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
  const pngBuffer = Buffer.from(resvg.render().asPng());

  await saveFile(filename, pngBuffer);

  return pngBuffer;
}

function getTemplateForSlide(
  post: Post,
  palette: ColorPalette,
  slideNumber: number,
  postData: PostData,
) {
  if (slideNumber === WEB_TITLE_SLIDE) {
    return SlideTitleTemplate(post, palette, { arrowDown: true });
  }
  if (slideNumber === WEB_QUOTE_SLIDE) {
    return SlideQuoteTemplate(post, palette, { hideIcon: true });
  }
  if (slideNumber === 1) {
    return SlideTitleTemplate(post, palette);
  }

  const sections = postData.contentSections;
  const quoteNum = sections.length + 2;
  const ctaNum = sections.length + 3;

  if (slideNumber === quoteNum) {
    return SlideQuoteTemplate(post, palette);
  }
  if (slideNumber === ctaNum) {
    return SlideCTATemplate(post, palette);
  }

  const sectionIndex = slideNumber - 2;
  if (sectionIndex >= 0 && sectionIndex < sections.length) {
    return SlideContentTemplate(post, palette, sections[sectionIndex]);
  }

  return null;
}
