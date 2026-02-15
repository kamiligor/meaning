import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts, slides } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CarouselViewer } from "@/components/feed/carousel-viewer";
import type { Metadata } from "next";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });

  if (!post) return { title: "Not Found" };

  const cleanHeadline = post.headline.replace(/\{|\}/g, "");

  const postSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.postId, post.id))
    .orderBy(slides.slideNumber)
    .limit(1);

  const ogImage = postSlides[0]
    ? `/api/slides/${postSlides[0].filename}`
    : undefined;

  return {
    title: `${cleanHeadline} | just have a little meaning`,
    description: post.caption || `${post.topicTag}: ${cleanHeadline}`,
    openGraph: {
      title: cleanHeadline,
      description: post.caption || `${post.topicTag}: ${cleanHeadline}`,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      images: ogImage ? [{ url: ogImage, width: 1080, height: 1350 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanHeadline,
      description: post.caption || `${post.topicTag}: ${cleanHeadline}`,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });

  if (!post || post.status !== "published") notFound();

  const postSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.postId, post.id))
    .orderBy(slides.slideNumber);

  const cleanHeadline = post.headline.replace(/\{|\}/g, "");

  const hashtags: string[] = (() => {
    try {
      return JSON.parse(post.hashtags);
    } catch {
      return post.hashtags.split(/[\s,]+/).filter(Boolean);
    }
  })();

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F1F4F6]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-[#8A99A8] hover:text-[#7B9E8C] transition flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4L6 8L10 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </Link>
          <a href="/" className="flex flex-col items-center">
            <span
              className="text-[8px] italic text-[#8A99A8] leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              just
            </span>
            <span
              className="text-base font-extrabold text-[#1E2A36] leading-none -mt-0.5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              have
            </span>
            <span
              className="text-[7px] italic text-[#7B9E8C] leading-none -mt-0.5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              a little
            </span>
            <span
              className="text-base font-extrabold text-[#7B9E8C] leading-none -mt-0.5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              meaning
            </span>
          </a>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <article>
          {/* Carousel */}
          {postSlides.length > 0 && (
            <CarouselViewer
              slides={postSlides.map((s) => ({
                filename: s.filename,
                slideNumber: s.slideNumber,
              }))}
              alt={cleanHeadline}
            />
          )}

          {/* Content */}
          <div className="mt-5">
            {/* Topic + date */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#7B9E8C]">
                {post.topicTag}
              </span>
              {post.publishedAt && (
                <>
                  <span className="text-[#d1d8de]">&middot;</span>
                  <time
                    className="text-xs text-[#8A99A8]"
                    dateTime={post.publishedAt}
                  >
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl font-bold text-[#1E2A36] leading-snug">
              {cleanHeadline}
            </h1>

            {/* Caption */}
            {post.caption && (
              <div className="mt-4 text-[#4A5B6A] text-sm leading-relaxed whitespace-pre-line">
                {post.caption}
              </div>
            )}

            {/* Hashtags */}
            {hashtags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs text-[#7B9E8C] bg-[#e8f0eb] px-3 py-1 rounded-full font-medium"
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Back to feed */}
        <div className="mt-10 pt-6 border-t border-[#F1F4F6] text-center">
          <Link
            href="/"
            className="text-sm text-[#7B9E8C] font-semibold hover:text-[#6a8d7b] transition tracking-wider uppercase"
          >
            &larr; Back to feed
          </Link>
        </div>
      </main>
    </div>
  );
}
