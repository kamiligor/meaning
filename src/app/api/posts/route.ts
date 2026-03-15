import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts, getPostSlides } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") || 0);
  const limit = Math.min(Number(searchParams.get("limit") || 10), 50);
  const locale = searchParams.get("locale") || "en";
  const category = searchParams.get("category") || null;

  let allPosts = getPublishedPosts(locale);
  if (category) {
    allPosts = allPosts.filter((p) => p.category === category);
  }

  const page = allPosts.slice(offset, offset + limit + 1);
  const hasMore = page.length > limit;
  const items = hasMore ? page.slice(0, limit) : page;

  const postsWithSlides = items.map((post) => {
    const slides = getPostSlides(post);
    return {
      slug: post.slug,
      topicTag: post.topicTag,
      headline: post.headline,
      caption: post.caption,
      publishedAt: post.publishedAt,
      slides: slides.map((s) => ({
        filename: s.filename,
        slideNumber: s.slideNumber,
      })),
    };
  });

  return NextResponse.json({ posts: postsWithSlides, hasMore });
}
