import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, slides } from "@/db/schema";
import { desc, eq, and, lt } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit") || 10), 50);
  const status = searchParams.get("status");
  const locale = searchParams.get("locale");

  const conditions = [];
  if (status) {
    conditions.push(eq(posts.status, status as "draft" | "published"));
  }
  if (locale) {
    conditions.push(eq(posts.locale, locale));
  }
  if (cursor) {
    conditions.push(lt(posts.id, Number(cursor)));
  }

  const result = await db
    .select()
    .from(posts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(posts.id))
    .limit(limit + 1);

  const hasMore = result.length > limit;
  const items = hasMore ? result.slice(0, limit) : result;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  // Fetch slides for each post
  const postsWithSlides = await Promise.all(
    items.map(async (post) => {
      const postSlides = await db
        .select()
        .from(slides)
        .where(eq(slides.postId, post.id))
        .orderBy(slides.slideNumber);
      return { ...post, slides: postSlides };
    })
  );

  return NextResponse.json({ posts: postsWithSlides, nextCursor });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const slug = generateSlug(body.headline);

  const [post] = await db
    .insert(posts)
    .values({
      slug,
      topicTag: body.topicTag,
      headline: body.headline,
      subtitle: body.subtitle,
      iconType: body.iconType || "clock",
      contentTag: body.contentTag,
      contentBody: body.contentBody,
      sectionNumber: body.sectionNumber || "01",
      quote: body.quote,
      quoteAttribution: body.quoteAttribution,
      quoteIconType: body.quoteIconType || "sun",
      ctaText: body.ctaText,
      hashtags: typeof body.hashtags === "string"
        ? body.hashtags
        : JSON.stringify(body.hashtags),
      handleBio: body.handleBio,
      caption: body.caption,
      locale: body.locale || "en",
      colorPalette: body.colorPalette || "sage",
      logoVariant: body.logoVariant || "light",
      status: body.status || "draft",
    })
    .returning();

  return NextResponse.json({ post }, { status: 201 });
}
