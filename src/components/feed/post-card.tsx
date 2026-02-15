import Link from "next/link";
import { CarouselViewer } from "./carousel-viewer";

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
}

export function PostCard({ post }: PostCardProps) {
  if (post.slides.length === 0) return null;

  const cleanHeadline = post.headline.replace(/\{|\}/g, "");

  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F1F4F6]">
      {/* Carousel */}
      <CarouselViewer
        slides={post.slides}
        alt={cleanHeadline}
      />

      {/* Content */}
      <div className="p-5">
        {/* Topic tag */}
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
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </>
          )}
        </div>

        {/* Headline link */}
        <Link
          href={`/post/${post.slug}`}
          className="block text-lg font-bold text-[#1E2A36] leading-snug hover:text-[#7B9E8C] transition"
        >
          {cleanHeadline}
        </Link>

        {/* Caption preview */}
        {post.caption && (
          <p className="mt-2 text-sm text-[#4A5B6A] leading-relaxed line-clamp-3">
            {post.caption}
          </p>
        )}
      </div>
    </article>
  );
}
