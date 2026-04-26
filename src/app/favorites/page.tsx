import { redirect } from "next/navigation";
import { getPublishedPosts, getPostSlides } from "@/lib/posts";
import { InfiniteFeed } from "@/components/feed/infinite-feed";
import { type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cookies } from "next/headers";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { FAVORITES_KEY } from "@/lib/categories";
import type { Metadata } from "next";

const LIMIT = 10;

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved posts on Just have a little meaning.",
  robots: { index: false, follow: false },
};

export default async function FavoritesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/favorites");

  const cookieStore = await cookies();
  const locale: Locale = getLocaleFromCookies(cookieStore);

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
      <SiteHeader locale={locale} />
      <main className="max-w-lg mx-auto px-4 py-6">
        <InfiniteFeed
          initialPosts={postsWithSlides}
          initialHasMore={hasMore}
          locale={locale}
          isLoggedIn={true}
          initialCategory={FAVORITES_KEY}
        />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
