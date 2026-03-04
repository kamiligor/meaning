"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import { PostCard } from "./post-card";
import { FeedSkeleton } from "./feed-skeleton";
import { NewsletterForm } from "./newsletter-form";
import { LikeProvider } from "./like-context";
import { t, type Locale } from "@/lib/i18n";

interface Post {
  slug: string;
  topicTag: string;
  headline: string;
  caption: string | null;
  publishedAt: string | null;
  slides: { filename: string; slideNumber: number }[];
}

interface InfiniteFeedProps {
  initialPosts: Post[];
  initialHasMore: boolean;
  locale: Locale;
  isLoggedIn?: boolean;
}

export function InfiniteFeed({ initialPosts, initialHasMore, locale, isLoggedIn = false }: InfiniteFeedProps) {
  const d = t(locale);
  const { posts, loading, hasMore, loadMore } = useInfinitePosts({
    initialPosts,
    initialHasMore,
    locale,
  });
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [likedSlugs, setLikedSlugs] = useState<string[]>([]);

  // Fetch liked slugs on mount
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/posts/likes")
      .then((res) => res.json())
      .then((data) => setLikedSlugs(data.slugs))
      .catch(() => {});
  }, [isLoggedIn]);

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
    <LikeProvider initialLikedSlugs={likedSlugs} isLoggedIn={isLoggedIn}>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <Fragment key={post.slug}>
            <PostCard post={post} locale={locale} />
            {index === 1 && (
              <NewsletterForm locale={locale} variant="card" />
            )}
          </Fragment>
        ))}
        {posts.length > 0 && posts.length < 2 && (
          <NewsletterForm locale={locale} variant="card" />
        )}

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
    </LikeProvider>
  );
}
