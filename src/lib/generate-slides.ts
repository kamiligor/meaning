import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "./fonts";
import { SLIDE_WIDTH, SLIDE_HEIGHT, DEFAULT_PALETTE } from "./constants";
import { SlideTitleTemplate } from "@/templates/slide-title";
import { SlideContentTemplate } from "@/templates/slide-content";
import { SlideQuoteTemplate } from "@/templates/slide-quote";
import { SlideCTATemplate } from "@/templates/slide-cta";
import { db } from "@/db";
import { slides, posts, colorPalettes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveFile, deleteFile } from "./storage";
import crypto from "crypto";
import type { Post, ColorPalette } from "@/db/schema";
import type { ReactElement } from "react";

const templates: ((post: Post, palette: ColorPalette) => ReactElement)[] = [
  SlideTitleTemplate,
  SlideContentTemplate,
  SlideQuoteTemplate,
  SlideCTATemplate,
];

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

  // 5. Generate each slide
  const generatedSlides = [];

  for (let i = 0; i < 4; i++) {
    const jsx = templates[i](post, palette);

    // Satori: JSX -> SVG
    const svg = await satori(jsx, {
      width: SLIDE_WIDTH,
      height: SLIDE_HEIGHT,
      fonts,
    });

    // Resvg: SVG -> PNG
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width" as const, value: SLIDE_WIDTH },
    });
    const pngData = resvg.render();
    const pngBuffer = Buffer.from(pngData.asPng());

    // Save file
    const hash = crypto.randomBytes(4).toString("hex");
    const filename = `post-${postId}-slide-${i + 1}-${hash}.png`;
    const filePath = await saveFile(filename, pngBuffer);

    // Insert DB record
    const [slide] = await db
      .insert(slides)
      .values({
        postId,
        slideNumber: i + 1,
        filename,
        filePath,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        fileSize: pngBuffer.length,
      })
      .returning();

    generatedSlides.push(slide);
  }

  return generatedSlides;
}
