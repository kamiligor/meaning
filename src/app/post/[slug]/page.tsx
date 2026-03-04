import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts, getPostSlides, getTranslations } from "@/lib/posts";
import { ContentText } from "@/components/feed/content-text";
import { PostLangSwitcher } from "@/components/feed/post-lang-switcher";
import { WEB_TITLE_SLIDE, WEB_QUOTE_SLIDE } from "@/lib/content-sections";
import Image from "next/image";
import { t, isLocale, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/feed/newsletter-form";
import { ShareButton } from "@/components/feed/share-button";
import { SiteHeader } from "@/components/site-header";

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
  const ogImage = `/api/slides/${slug}-slide-1.png`;

  return {
    title: `${cleanHeadline} | just have a little meaning`,
    description: post.caption || `${post.topicTag}: ${cleanHeadline}`,
    openGraph: {
      title: cleanHeadline,
      description: post.caption || `${post.topicTag}: ${cleanHeadline}`,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      locale: post.locale === "pl" ? "pl_PL" : "en_US",
      images: [{ url: ogImage, width: 1080, height: 1350 }],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanHeadline,
      description: post.caption || `${post.topicTag}: ${cleanHeadline}`,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== "published") notFound();

  const locale: Locale = isLocale(post.locale) ? post.locale : "en";
  const d = t(locale);
  const feedUrl = "/";

  const postSlides = getPostSlides(post);
  const cleanHeadline = post.headline.replace(/\{|\}/g, "");

  const translations = getTranslations(post.translationGroup)
    .sort((a, b) => a.locale.localeCompare(b.locale));

  // Find web variant slides
  const webTitleSlide = postSlides.find((s) => s.slideNumber === WEB_TITLE_SLIDE) || postSlides[0];
  const webQuoteSlide = postSlides.find((s) => s.slideNumber === WEB_QUOTE_SLIDE);

  // Parse references
  let refs: { title: string; author: string; url?: string }[] = [];
  if (post.references) {
    try {
      refs = JSON.parse(post.references);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
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

      <main className="max-w-lg mx-auto px-4 py-6">
        <article>
          {/* Title image (web variant) */}
          {webTitleSlide && (
            <div className="relative">
              <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden">
                <Image
                  src={`/api/slides/${webTitleSlide.filename}`}
                  alt={cleanHeadline}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Share tab */}
              <div className="absolute bottom-4 -right-4 md:-right-12 z-10">
                <ShareButton slug={post.slug} title={cleanHeadline} locale={locale} variant="post" />
              </div>
            </div>
          )}

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

          {/* Share tab */}
          <div className="mt-10 flex justify-end -mr-4 md:-mr-12">
            <ShareButton slug={post.slug} title={cleanHeadline} locale={locale} variant="post" />
          </div>

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
