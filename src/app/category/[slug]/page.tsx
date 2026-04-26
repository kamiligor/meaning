import { notFound } from "next/navigation";
import { getPublishedPosts, getPostSlides } from "@/lib/posts";
import { InfiniteFeed } from "@/components/feed/infinite-feed";
import { t, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cookies } from "next/headers";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getCategoryByLocalizedSlug } from "@/lib/categories";
import type { Metadata } from "next";

const LIMIT = 10;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://justmeaning.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryByLocalizedSlug(slug);
  if (!cat) return { title: "Not Found" };

  const cookieStore = await cookies();
  const locale: Locale = getLocaleFromCookies(cookieStore);
  const label = locale === "pl" ? cat.pl.label : cat.en.label;

  const title =
    locale === "pl"
      ? `${label} — Just have a little meaning`
      : `${label} — Just have a little meaning`;
  const description =
    locale === "pl"
      ? `Posty o ${label.toLowerCase()}. Krótkie, oparte na badaniach insighty z psychologii.`
      : `Posts about ${label.toLowerCase()}. Short, research-backed insights from psychology.`;

  const firstPost = getPublishedPosts(locale).find(
    (p) => p.category === cat.key
  );
  const ogImage = firstPost
    ? `/api/slides/${firstPost.translationGroup || firstPost.slug}/${firstPost.locale}/slide-1.png`
    : undefined;

  const path =
    locale === "pl"
      ? `/kategoria/${cat.pl.slug}`
      : `/category/${cat.en.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        en: `${SITE_URL}/category/${cat.en.slug}`,
        pl: `${SITE_URL}/kategoria/${cat.pl.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
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

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = getCategoryByLocalizedSlug(slug);
  if (!cat) notFound();

  const cookieStore = await cookies();
  const locale: Locale = getLocaleFromCookies(cookieStore);
  const d = t(locale);

  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Supabase unreachable — continue as logged out
  }

  const allPosts = getPublishedPosts(locale).filter(
    (p) => p.category === cat.key
  );

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
            initialCategory={cat.key}
          />
        )}
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
