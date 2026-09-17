import { getPublishedPosts, getPostSlides } from "@/lib/posts";
import { CourseBanner } from "@/components/feed/course-banner";
import { InfiniteFeed } from "@/components/feed/infinite-feed";
import { t, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getLocale } from "@/lib/locale";
import { urlForLocale } from "@/lib/domains";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Metadata } from "next";

const LIMIT = 10;

export async function generateMetadata(): Promise<Metadata> {
  const locale: Locale = await getLocale();

  const title =
    locale === "pl"
      ? "Just have a little meaning — psychologia w praktyce"
      : "Just have a little meaning — psychology you can use";
  const description =
    locale === "pl"
      ? "Krótkie, oparte na badaniach posty o psychologii, emocjach i zdrowiu psychicznym. Jeden konkretny insight na raz."
      : "Short, research-backed posts on psychology, emotions, and mental health. One usable insight at a time.";

  const firstPost = getPublishedPosts(locale)[0];
  const ogImage = firstPost
    ? `/api/slides/${firstPost.translationGroup || firstPost.slug}/${firstPost.locale}/slide-1.png`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: urlForLocale(locale, "/"),
      languages: {
        en: urlForLocale("en", "/"),
        pl: urlForLocale("pl", "/"),
      },
    },
    openGraph: {
      title,
      description,
      url: urlForLocale(locale, "/"),
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
      ...(ogImage && { images: [{ url: ogImage, width: 1080, height: 1350 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function Home() {
  const locale: Locale = await getLocale();
  const d = t(locale);

  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Supabase unreachable — continue as logged out
  }

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
        {locale === "pl" && <CourseBanner slug="kurs-wdziecznosci" />}
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
            isLoggedIn={isLoggedIn}
          />
        )}
      </main>

      {/* Footer */}
      <SiteFooter locale={locale} />
    </div>
  );
}
