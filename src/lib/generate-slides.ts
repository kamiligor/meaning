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
import { saveFile, deleteFile } from "./storage";
import crypto from "crypto";
import type { Post, ColorPalette } from "@/db/schema";
import type { ReactElement } from "react";

async function renderAndSave(
  jsx: ReactElement,
  postId: number,
  slideNumber: number,
  fonts: Awaited<ReturnType<typeof loadFonts>>,
  label: string,
) {
  const svg = await satori(jsx, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: SLIDE_WIDTH } });
  const pngBuffer = Buffer.from(resvg.render().asPng());

  const hash = crypto.randomBytes(4).toString("hex");
  const filename = `post-${postId}-slide-${label}-${hash}.png`;
  const filePath = await saveFile(filename, pngBuffer);

  const [slide] = await db
    .insert(slides)
    .values({ postId, slideNumber, filename, filePath, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fileSize: pngBuffer.length })
    .returning();

  return slide;
}

export async function generatePostSlides(postId: number) {
  // 1. Fetch post
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  });
  if (!post) throw new Error("Post not found");

  // 2. Fetch palette (fall back to default)
  let palette: ColorPalette;
  const dbPalette = await db.query.colorPalettes.findFirst({
    where: eq(colorPalettes.id, post.colorPalette || "sage"),
  });
  if (dbPalette) {
    palette = dbPalette;
  } else {
    palette = DEFAULT_PALETTE as unknown as ColorPalette;
  }

  // 3. Load fonts
  const fonts = await loadFonts();

  // 4. Delete existing slides for this post
  const existingSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.postId, postId));

  for (const s of existingSlides) {
    await deleteFile(s.filename);
  }
  await db.delete(slides).where(eq(slides.postId, postId));

  // 5. Generate slides dynamically
  const generatedSlides = [];
  const sections = getContentSections(post);

  // Slide 1: Title
  generatedSlides.push(await renderAndSave(SlideTitleTemplate(post, palette), postId, 1, fonts, "1"));

  // Slides 2..N+1: Content (one per section)
  for (let i = 0; i < sections.length; i++) {
    const slideNum = i + 2;
    generatedSlides.push(await renderAndSave(SlideContentTemplate(post, palette, sections[i]), postId, slideNum, fonts, String(slideNum)));
  }

  // Slide N+2: Quote
  const quoteNum = sections.length + 2;
  generatedSlides.push(await renderAndSave(SlideQuoteTemplate(post, palette), postId, quoteNum, fonts, String(quoteNum)));

  // Slide N+3: CTA
  const ctaNum = sections.length + 3;
  generatedSlides.push(await renderAndSave(SlideCTATemplate(post, palette), postId, ctaNum, fonts, String(ctaNum)));

  // Slide 100: Web title variant (arrow down)
  generatedSlides.push(await renderAndSave(SlideTitleTemplate(post, palette, { arrowDown: true }), postId, WEB_TITLE_SLIDE, fonts, "100-web"));

  // Slide 101: Web quote variant (no icon)
  generatedSlides.push(await renderAndSave(SlideQuoteTemplate(post, palette, { hideIcon: true }), postId, WEB_QUOTE_SLIDE, fonts, "101-web"));

  return generatedSlides;
}
