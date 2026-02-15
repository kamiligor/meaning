"use client";

import { useEffect, useRef } from "react";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import { PostCard } from "./post-card";
import { FeedSkeleton } from "./feed-skeleton";
import { t, type Locale } from "@/lib/i18n";

interface Post {
  id: number;
  slug: string;
  topicTag: string;
  headline: string;
  caption: string | null;
  publishedAt: string | null;
  slides: { id: number; filename: string; slideNumber: number }[];
}

interface InfiniteFeedProps {
  initialPosts: Post[];
  initialCursor: number | null;
  locale: Locale;
}

export function InfiniteFeed({ initialPosts, initialCursor, locale }: InfiniteFeedProps) {
  const d = t(locale);
  const { posts, loading, hasMore, loadMore } = useInfinitePosts({
    initialPosts,
    initialCursor,
    locale,
  });
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Loading skeleton */}
      {loading && <FeedSkeleton count={2} />}

      {/* Sentinel for intersection observer */}
      {hasMore && <div ref={sentinelRef} className="h-1" />}

      {/* End of feed */}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-[#8A99A8] py-8">
          {d.endOfFeed}
        </p>
      )}
    </div>
  );
}
