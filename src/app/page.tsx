import { db } from "@/db";
import { posts, slides } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { InfiniteFeed } from "@/components/feed/infinite-feed";
import { t, isLocale, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";

const LIMIT = 10;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: Locale = lang && isLocale(lang) ? lang : "en";
  const d = t(locale);

  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "published"), eq(posts.locale, locale)))
    .orderBy(desc(posts.id))
    .limit(LIMIT + 1);

  const hasMore = result.length > LIMIT;
  const items = hasMore ? result.slice(0, LIMIT) : result;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  const postsWithSlides = await Promise.all(
    items.map(async (post) => {
      const postSlides = await db
        .select()
        .from(slides)
        .where(eq(slides.postId, post.id))
        .orderBy(slides.slideNumber);
      return {
        id: post.id,
        slug: post.slug,
        topicTag: post.topicTag,
        headline: post.headline,
        caption: post.caption,
        publishedAt: post.publishedAt,
        slides: postSlides.map((s) => ({
          id: s.id,
          filename: s.filename,
          slideNumber: s.slideNumber,
        })),
      };
    })
  );

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <SiteHeader locale={locale} />

      {/* Feed */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {postsWithSlides.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8A99A8] text-lg">{d.noPostsTitle}</p>
            <p className="text-[#b5bfc9] text-sm mt-1">
              {d.noPostsSubtitle}
            </p>
          </div>
        ) : (
          <InfiniteFeed
            initialPosts={postsWithSlides}
            initialCursor={nextCursor}
            locale={locale}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F1F4F6] py-8 text-center">
        <p className="text-xs text-[#8A99A8] tracking-widest uppercase">
          {d.siteTitle}
        </p>
      </footer>
    </div>
  );
}
