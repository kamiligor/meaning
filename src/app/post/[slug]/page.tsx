import { notFound, permanentRedirect } from "next/navigation";
import { getLocale, getHost } from "@/lib/locale";
import { urlForLocale, SITE_HOSTS } from "@/lib/domains";
import { logoPngPath } from "@/lib/brand";
import {
  getPostBySlug,
  getPublishedPosts,
  getPostSlides,
  getTranslations,
  getRelatedPosts,
} from "@/lib/posts";
import { ContentText } from "@/components/feed/content-text";
import { CarouselViewer } from "@/components/feed/carousel-viewer";
import { PostViewBeacon } from "@/components/feed/post-view-beacon";
import { PostLangSwitcher } from "@/components/feed/post-lang-switcher";
import { WEB_QUOTE_SLIDE } from "@/lib/content-sections";
import { slideAltTexts } from "@/lib/slide-alt";
import { postDescription } from "@/lib/post-description";
import Image from "next/image";
import { t, isLocale, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/feed/newsletter-form";
import { Comments } from "@/components/feed/comments";
import { ShareButton } from "@/components/feed/share-button";
import { LikeButton } from "@/components/feed/like-button";
import { LikeProvider } from "@/components/feed/like-context";
import { SiteHeader } from "@/components/site-header";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getCategoryUrl, getCategoryLabel } from "@/lib/categories";
import { JsonLd } from "@/components/json-ld";

export async function generateStaticParams() {
  const allPosts = getPublishedPosts("en").concat(getPublishedPosts("pl"));
  return allPosts.map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: "Not Found" };

  const cleanHeadline = post.headline.replace(/\{|\}/g, "");
  const description = postDescription(post);
  const group = post.translationGroup || post.slug;
  const ogImage = `/api/slides/${group}/${post.locale}/slide-1.png`;
  const postLocale: Locale = isLocale(post.locale) ? post.locale : "en";

  // The post is canonical on its own language's domain, whichever host asked.
  const languages: Record<string, string> = {};
  for (const tr of getTranslations(post.translationGroup)) {
    languages[tr.locale] = urlForLocale(tr.locale as Locale, `/post/${tr.slug}`);
  }

  return {
    metadataBase: new URL(`https://${SITE_HOSTS[postLocale]}`),
    alternates: {
      canonical: urlForLocale(postLocale, `/post/${post.slug}`),
      languages,
    },
    title: `${cleanHeadline} | just have a little meaning`,
    description,
    openGraph: {
      title: cleanHeadline,
      description,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      locale: post.locale === "pl" ? "pl_PL" : "en_US",
      images: [{ url: ogImage, width: 1080, height: 1350 }],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanHeadline,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== "published") notFound();

  const locale: Locale = isLocale(post.locale) ? post.locale : "en";
  const siteUrl = `https://${SITE_HOSTS[locale]}`;
  const host = await getHost();

  // Each language has its own domain — send the post to the one that owns it.
  if (locale !== (await getLocale())) {
    permanentRedirect(urlForLocale(locale, `/post/${slug}`, host));
  }

  const d = t(locale);
  const feedUrl = "/";

  let isLoggedIn = false;
  let liked = false;
  let hasDisplayName = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle();
      hasDisplayName = !!profile?.display_name;

      const { data } = await supabase
        .from("user_interactions")
        .select("id")
        .eq("user_id", user.id)
        .eq("interaction_type", "like")
        .eq("target_type", "post")
        .eq("target_id", slug)
        .maybeSingle();
      liked = !!data;
    }
  } catch {
    // Supabase unreachable — continue as logged out
  }

  const postSlides = getPostSlides(post);
  const slideAlts = slideAltTexts(post);
  const related = getRelatedPosts(post);
  const description = postDescription(post);
  const cleanHeadline = post.headline.replace(/\{|\}/g, "");

  const translations = getTranslations(post.translationGroup)
    .sort((a, b) => a.locale.localeCompare(b.locale))
    .map((tr) => ({
      locale: tr.locale,
      href: urlForLocale(tr.locale as Locale, `/post/${tr.slug}`, host),
    }));

  // Find web quote slide
  const webQuoteSlide = postSlides.find((s) => s.slideNumber === WEB_QUOTE_SLIDE);

  // Parse references
  let refs: { title: string; author: string; url?: string }[] = [];
  if (post.references) {
    try {
      refs = JSON.parse(post.references);
    } catch {}
  }

  const group = post.translationGroup || post.slug;
  const ogImageUrl = `${siteUrl}/api/slides/${group}/${post.locale}/slide-1.png`;
  const postUrl = `${siteUrl}/post/${post.slug}`;
  const categoryLabel = post.category
    ? getCategoryLabel(post.category, locale)
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cleanHeadline,
    description,
    image: [ogImageUrl],
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    inLanguage: post.locale === "pl" ? "pl-PL" : "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    author: {
      "@type": "Organization",
      name: "Just Meaning",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Just Meaning",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}${logoPngPath(locale)}` },
    },
    ...(categoryLabel && { articleSection: categoryLabel }),
    ...(refs.length > 0 && {
      citation: refs.map((r) => ({
        "@type": "CreativeWork",
        name: r.title,
        author: { "@type": "Person", name: r.author },
        ...(r.url && { url: r.url }),
      })),
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "pl" ? "Strona główna" : "Home",
        item: siteUrl,
      },
      ...(post.category && categoryLabel
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: categoryLabel,
              item: `${siteUrl}${getCategoryUrl(post.category, locale)}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: cleanHeadline,
              item: postUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: cleanHeadline,
              item: postUrl,
            },
          ]),
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* Header */}
      <SiteHeader
        locale={locale}
        variant="compact"
        backHref={feedUrl}
        backLabel={d.back}
        langSwitcher={
          translations.length > 1 ? (
            <PostLangSwitcher current={locale} translations={translations} />
          ) : undefined
        }
      />

      <LikeProvider initialLikedSlugs={liked ? [slug] : []} isLoggedIn={isLoggedIn}>
      <main className="max-w-lg mx-auto px-4 py-6">
        <article>
          {/* Breadcrumb */}
          {post.category && (
            <nav className="mb-4 text-[12px] text-[#8A99A8]" aria-label="Breadcrumb">
              <Link href={getCategoryUrl(post.category, locale)} className="hover:text-[#7B9E8C] transition-colors">
                {getCategoryLabel(post.category, locale)}
              </Link>
              <span className="mx-1.5 text-[#d1d8de]">/</span>
              <span className="text-[#b5bfc9]">{cleanHeadline}</span>
            </nav>
          )}

          {/* Carousel — same slides as feed card (no web variants, no CTA) */}
          <div className="relative">
            <PostViewBeacon slug={post.slug} />
            <CarouselViewer
              readTrackingSlug={post.slug}
              slides={postSlides
                .filter((s) => s.slideNumber < 100)
                .sort((a, b) => a.slideNumber - b.slideNumber)
                .slice(0, -1)
                .map((s) => ({ ...s, alt: slideAlts.get(s.slideNumber) }))}
              alt={cleanHeadline}
            />
            {/* Like + Share */}
            <div className="absolute bottom-[3.5rem] -right-4 md:-right-12 z-10">
              <LikeButton slug={post.slug} locale={locale} />
            </div>
            <div className="absolute bottom-4 -right-4 md:-right-12 z-10">
              <ShareButton slug={post.slug} title={cleanHeadline} locale={locale} variant="post" />
            </div>
          </div>

          {/* Meta: topic */}
          <div className="mt-5">
            <div className="mb-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#7B9E8C]">
                {post.topicTag}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl font-bold text-[#1E2A36] leading-snug">
              {cleanHeadline}
            </h1>
          </div>

          {/* Content sections (web-only, or fallback to slide sections) */}
          {(post.webSections.length > 0 ? post.webSections : post.contentSections).map((section, i) => (
            <div key={i} className={i === 0 ? "mt-6" : "mt-8"}>
              <ContentText body={section.body} tag={section.tag} />
            </div>
          ))}

          {/* Quote image (web variant) */}
          {webQuoteSlide && (
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mt-10">
              <Image
                src={`/api/slides/${webQuoteSlide.filename}`}
                alt="Quote"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* References / Further reading */}
          {refs.length > 0 && (
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
          )}

          {/* Like + Share */}
          <div className="mt-10 flex flex-col items-end gap-2 -mr-4 md:-mr-12">
            <LikeButton slug={post.slug} locale={locale} />
            <ShareButton slug={post.slug} title={cleanHeadline} locale={locale} variant="post" />
          </div>

        </article>

        {related.length > 0 && (
          <nav
            className="mt-12 pt-8 border-t border-[#F1F4F6]"
            aria-label={d.readNext}
          >
            <h2 className="text-sm font-semibold tracking-widest uppercase text-[#8A99A8] mb-4">
              {d.readNext}
            </h2>
            <ul className="flex flex-col gap-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/post/${r.slug}`}
                    className="group flex flex-col gap-0.5"
                  >
                    <span className="text-[15px] font-medium text-[#1E2A36] group-hover:text-[#7B9E8C] transition-colors">
                      {r.headline.replace(/\{|\}/g, "")}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-[#b3bec8]">
                      {r.topicTag}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <Comments
          slug={post.slug}
          locale={locale}
          isLoggedIn={isLoggedIn}
          hasDisplayName={hasDisplayName}
        />

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
      </LikeProvider>
    </div>
  );
}
