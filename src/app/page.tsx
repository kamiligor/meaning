import { getPublishedPosts, getPostSlides } from "@/lib/posts";
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

  const allPosts = getPublishedPosts(locale);

  const hasMore = allPosts.length > LIMIT;
  const items = hasMore ? allPosts.slice(0, LIMIT) : allPosts;

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
            initialHasMore={hasMore}
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
