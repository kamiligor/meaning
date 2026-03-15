"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import { PostCard } from "./post-card";
import { FeedSkeleton } from "./feed-skeleton";
import { NewsletterForm } from "./newsletter-form";
import { LikeProvider } from "./like-context";
import { t, type Locale } from "@/lib/i18n";
import { CATEGORIES, getCategoryUrl, categoryKeyFromPath } from "@/lib/categories";
import { cn } from "@/lib/utils";

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
  initialCategory?: string | null;
}

export function InfiniteFeed({ initialPosts, initialHasMore, locale, isLoggedIn = false, initialCategory = null }: InfiniteFeedProps) {
  const d = t(locale);
  const [category, setCategory] = useState<string | null>(initialCategory);
  const { posts, loading, hasMore, loadMore } = useInfinitePosts({
    initialPosts,
    initialHasMore,
    locale,
    category,
  });
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [likedSlugs, setLikedSlugs] = useState<string[]>([]);

  const handleCategoryClick = useCallback((key: string | null) => {
    setCategory(key);
    const url = key ? getCategoryUrl(key, locale) : "/";
    window.history.pushState(null, "", url);
  }, [locale]);

  // Sync category state on browser back/forward
  useEffect(() => {
    const onPopState = () => {
      setCategory(categoryKeyFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
        {/* Category filters — full-bleed to match header width */}
        <div className="w-[100vw] relative left-1/2 -translate-x-1/2">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleCategoryClick(null)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer",
                  category === null
                    ? "bg-[#7B9E8C] text-white"
                    : "bg-[#F0F2F4] text-[#5A6A78] hover:bg-[#E4E8EB]"
                )}
              >
                {d.categoryAll}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={cn(
                    "shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer",
                    category === cat.key
                      ? "bg-[#7B9E8C] text-white"
                      : "bg-[#F0F2F4] text-[#5A6A78] hover:bg-[#E4E8EB]"
                  )}
                >
                  {locale === "pl" ? cat.pl.label : cat.en.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {posts.map((post, index) => (
          <Fragment key={post.slug}>
            <PostCard post={post} locale={locale} priority={index === 0} />
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

        {/* No results */}
        {!loading && !hasMore && posts.length === 0 && category !== null && (
          <p className="text-center text-sm text-[#8A99A8] py-12">
            {d.noPostsTitle}
          </p>
        )}
      </div>
    </LikeProvider>
  );
}
