import Link from "next/link";
import { CarouselViewer } from "./carousel-viewer";
import { ShareButton } from "./share-button";
import type { Locale } from "@/lib/i18n";

interface PostCardProps {
  post: {
    id: number;
    slug: string;
    topicTag: string;
    headline: string;
    caption: string | null;
    publishedAt: string | null;
    slides: { id: number; filename: string; slideNumber: number }[];
  };
  locale: Locale;
}

export function PostCard({ post, locale }: PostCardProps) {
  if (post.slides.length === 0) return null;

  const cleanHeadline = post.headline.replace(/\{|\}/g, "");

  return (
    <div className="relative">
      <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F1F4F6]">
        {/* Carousel — Instagram slides without CTA (no web variants) */}
        <CarouselViewer
          slides={(() => {
            const instagramSlides = post.slides
              .filter((s) => s.slideNumber < 100)
              .sort((a, b) => a.slideNumber - b.slideNumber);
            return instagramSlides.slice(0, -1); // drop CTA (last)
          })()}
          alt={cleanHeadline}
        />

        {/* Content */}
        <Link href={`/post/${post.slug}`} className="block p-5 hover:bg-[#FAFBFC] transition">
          {/* Topic tag */}
          <div className="mb-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#7B9E8C]">
              {post.topicTag}
            </span>
          </div>

          {/* Headline */}
          <span className="block text-lg font-bold text-[#1E2A36] leading-snug group-hover:text-[#7B9E8C] transition">
            {cleanHeadline}
          </span>
        </Link>
      </article>

      {/* Share button — outside card, aligned with topic tag */}
      <div className="absolute bottom-[3.25rem] -right-4 md:-right-12 z-10">
        <ShareButton slug={post.slug} title={cleanHeadline} locale={locale} variant="card" />
      </div>
    </div>
  );
}
