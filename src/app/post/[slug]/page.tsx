import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts, slides } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { ContentText } from "@/components/feed/content-text";
import { PostLangSwitcher } from "@/components/feed/post-lang-switcher";
import { getContentSections, WEB_TITLE_SLIDE, WEB_QUOTE_SLIDE } from "@/lib/content-sections";
import Image from "next/image";
import { t, isLocale, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/feed/newsletter-form";

export async function generateStaticParams() {
  const allPosts = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.status, "published"));

  return allPosts.map((p) => ({ slug: p.slug }));
}

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
      locale: post.locale === "pl" ? "pl_PL" : "en_US",
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

  const locale: Locale = isLocale(post.locale) ? post.locale : "en";
  const d = t(locale);
  const feedUrl = `/?lang=${locale}`;

  const postSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.postId, post.id))
    .orderBy(slides.slideNumber);

  const cleanHeadline = post.headline.replace(/\{|\}/g, "");
  const dateLocale = locale === "pl" ? "pl-PL" : "en-US";

  // Fetch translations in the same group
  const translations = post.translationGroup
    ? (
        await db
          .select({ locale: posts.locale, slug: posts.slug })
          .from(posts)
          .where(
            and(
              eq(posts.translationGroup, post.translationGroup),
              eq(posts.status, "published")
            )
          )
      ).sort((a, b) => a.locale.localeCompare(b.locale))
    : [{ locale: post.locale, slug: post.slug }];

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F1F4F6]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={feedUrl}
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
            {d.back}
          </Link>
          <a href={feedUrl} className="flex flex-col items-center">
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
          {translations.length > 1 ? (
            <PostLangSwitcher current={locale} translations={translations} />
          ) : (
            <div className="w-12" />
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <article>
          {/* Title image (web variant without subtitle, fallback to slide 1) */}
          {(() => {
            const webTitle = postSlides.find((s) => s.slideNumber === WEB_TITLE_SLIDE) || postSlides.find((s) => s.slideNumber === 5) || postSlides[0];
            return webTitle ? (
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden">
                <Image
                  src={`/api/slides/${webTitle.filename}`}
                  alt={cleanHeadline}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null;
          })()}

          {/* Meta: topic + date */}
          <div className="mt-5">
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
                    {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
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
          </div>

          {/* Content body */}
          {(() => {
            const sections = getContentSections(post);
            return sections.map((section, i) => (
              <div key={i} className={i === 0 ? "mt-6" : "mt-8"}>
                <ContentText body={section.body} tag={section.tag} />
              </div>
            ));
          })()}

          {/* Caption */}
          {post.caption && (
            <div className="mt-6 text-[#4A5B6A] text-[15px] leading-relaxed whitespace-pre-line">
              {post.caption.replace(/\s*(?:#\S+\s*)+$/, "").trim()}
            </div>
          )}

          {/* Quote image (web variant without icon, fallback) */}
          {(() => {
            const webQuote = postSlides.find((s) => s.slideNumber === WEB_QUOTE_SLIDE) || postSlides.find((s) => s.slideNumber === 6) || postSlides.find((s) => s.slideNumber === 3);
            return webQuote ? (
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mt-10">
                <Image
                  src={`/api/slides/${webQuote.filename}`}
                  alt="Quote"
                  fill
                  className="object-cover"
                />
              </div>
            ) : null;
          })()}

          {/* References / Further reading */}
          {post.references && (() => {
            const refs: { title: string; author: string; url?: string }[] = JSON.parse(post.references);
            if (!refs.length) return null;
            return (
              <div className="mt-10">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-[#7B9E8C] mb-4">
                  {d.furtherReading}
                </h2>
                <ul className="space-y-3">
                  {refs.map((ref, i) => (
                    <li key={i} className="flex items-baseline gap-2 text-[13px]">
                      <span className="text-[#7B9E8C] shrink-0">&#x2022;</span>
                      <span>
                        {ref.url ? (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1E2A36] font-medium hover:text-[#7B9E8C] transition underline underline-offset-2 decoration-[#d1d8de] hover:decoration-[#7B9E8C]"
                          >
                            {ref.title}
                          </a>
                        ) : (
                          <span className="text-[#1E2A36] font-medium">{ref.title}</span>
                        )}
                        <span className="text-[#4A5B6A]"> &mdash; {ref.author}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

        </article>

        {/* Newsletter */}
        <div className="mt-10">
          <NewsletterForm locale={locale} variant="banner" />
        </div>

        {/* Back to feed */}
        <div className="mt-10 pt-6 border-t border-[#F1F4F6] text-center">
          <Link
            href={feedUrl}
            className="text-sm text-[#7B9E8C] font-semibold hover:text-[#6a8d7b] transition tracking-wider uppercase"
          >
            &larr; {d.backToFeed}
          </Link>
        </div>
      </main>
    </div>
  );
}
