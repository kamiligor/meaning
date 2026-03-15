"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import { PostCard } from "./post-card";
import { FeedSkeleton } from "./feed-skeleton";
import { NewsletterForm } from "./newsletter-form";
import { LikeProvider } from "./like-context";
import { t, type Locale } from "@/lib/i18n";
import { CATEGORIES, FAVORITES_KEY, getCategoryUrl, getFavoritesUrl, categoryKeyFromPath } from "@/lib/categories";
import { getPalette } from "@/lib/palettes";
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
  const [likedSlugs, setLikedSlugs] = useState<string[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { posts, loading, hasMore, loadMore } = useInfinitePosts({
    initialPosts,
    initialHasMore,
    locale,
    category,
    favoriteSlugs: likedSlugs,
  });

  const handleCategoryClick = useCallback((key: string | null) => {
    setCategory(key);
    let url: string;
    if (key === FAVORITES_KEY) {
      url = getFavoritesUrl(locale);
    } else if (key) {
      url = getCategoryUrl(key, locale);
    } else {
      url = "/";
    }
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
  const likedFetched = useRef(false);
  useEffect(() => {
    if (!isLoggedIn || likedFetched.current) return;
    likedFetched.current = true;
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
    <LikeProvider
      initialLikedSlugs={likedSlugs}
      isLoggedIn={isLoggedIn}
      onToggle={(slug, liked) => {
        setLikedSlugs((prev) => {
          if (liked && !prev.includes(slug)) return [...prev, slug];
          if (!liked && prev.includes(slug)) return prev.filter((s) => s !== slug);
          return prev;
        });
      }}
    >
      <div className="space-y-6">
        {/* Category filters — full-bleed to match header width */}
        <div className="w-[100vw] relative left-1/2 -translate-x-1/2">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleCategoryClick(null)}
                className={cn(
                  "shrink-0 px-3 py-1 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-2",
                  category === null
                    ? ""
                    : "border-transparent bg-[#F0F2F4] text-[#5A6A78] hover:bg-[#E4E8EB]"
                )}
                style={category === null ? { backgroundColor: "#F0F2F4", borderColor: "#1E2A36", color: "#1E2A36" } : undefined}
              >
                {d.categoryAll}
              </button>
              {CATEGORIES.map((cat) => {
                const palette = getPalette(cat.palette);
                return (
                  <button
                    key={cat.key}
                    onClick={() => handleCategoryClick(cat.key)}
                    className={cn(
                      "shrink-0 px-3 py-1 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-2",
                      category === cat.key
                        ? ""
                        : "border-transparent bg-[#F0F2F4] text-[#5A6A78] hover:bg-[#E4E8EB]"
                    )}
                    style={category === cat.key ? { backgroundColor: palette.primaryPale, borderColor: palette.primary, color: palette.primary } : undefined}
                  >
                    {locale === "pl" ? cat.pl.label : cat.en.label}
                  </button>
                );
              })}
              {isLoggedIn && (
                <button
                  onClick={() => handleCategoryClick(FAVORITES_KEY)}
                  className={cn(
                    "shrink-0 px-3 py-1 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-2",
                    category === FAVORITES_KEY
                      ? ""
                      : "border-transparent bg-[#F0F2F4] text-[#5A6A78] hover:bg-[#E4E8EB]"
                  )}
                  style={category === FAVORITES_KEY ? { backgroundColor: "#F0F2F4", borderColor: "#1E2A36", color: "#1E2A36" } : undefined}
                >
                  <svg className="inline-block w-3.5 h-3.5 mr-1 -mt-px" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" style={{ color: "#ef4444" }} /></svg>
                  {d.favorites}
                </button>
              )}
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
          <div className="text-center py-12">
            <p className="text-sm text-[#8A99A8]">
              {category === FAVORITES_KEY ? d.favoritesEmpty : d.noPostsTitle}
            </p>
            {category === FAVORITES_KEY && (
              <p className="text-xs text-[#b5bfc9] mt-1">{d.favoritesEmptySubtitle}</p>
            )}
          </div>
        )}
      </div>
    </LikeProvider>
  );
}
