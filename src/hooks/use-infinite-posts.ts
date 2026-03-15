"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface Slide {
  filename: string;
  slideNumber: number;
}

interface Post {
  slug: string;
  topicTag: string;
  headline: string;
  caption: string | null;
  publishedAt: string | null;
  slides: Slide[];
}

interface UseInfinitePostsOptions {
  initialPosts: Post[];
  initialHasMore: boolean;
  locale: string;
  category: string | null;
  favoriteSlugs?: string[];
}

const FAVORITES_KEY = "favorites";

export function useInfinitePosts({
  initialPosts,
  initialHasMore,
  locale,
  category,
  favoriteSlugs = [],
}: UseInfinitePostsOptions) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const prevCategoryRef = useRef(category);
  const prevFavoriteSlugsRef = useRef(favoriteSlugs);

  const buildUrl = useCallback(
    (offset: number) => {
      let url = `/api/posts?locale=${locale}&offset=${offset}&limit=10`;
      if (category === FAVORITES_KEY && favoriteSlugs.length > 0) {
        url += `&slugs=${favoriteSlugs.join(",")}`;
      } else if (category && category !== FAVORITES_KEY) {
        url += `&category=${category}`;
      }
      return url;
    },
    [locale, category, favoriteSlugs]
  );

  useEffect(() => {
    const categoryChanged = prevCategoryRef.current !== category;
    const favoritesChanged =
      category === FAVORITES_KEY &&
      prevFavoriteSlugsRef.current !== favoriteSlugs;

    if (!categoryChanged && !favoritesChanged) return;
    prevCategoryRef.current = category;
    prevFavoriteSlugsRef.current = favoriteSlugs;

    if (category === null) {
      setPosts(initialPosts);
      setHasMore(initialHasMore);
      return;
    }

    if (category === FAVORITES_KEY && favoriteSlugs.length === 0) {
      setPosts([]);
      setHasMore(false);
      return;
    }

    setPosts([]);
    setHasMore(true);
    setLoading(true);
    fetch(buildUrl(0))
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setHasMore(data.hasMore);
      })
      .finally(() => setLoading(false));
  }, [category, locale, initialPosts, initialHasMore, favoriteSlugs, buildUrl]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    if (category === FAVORITES_KEY && favoriteSlugs.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch(buildUrl(posts.length));
      if (!res.ok) return;
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  }, [posts.length, loading, hasMore, buildUrl, category, favoriteSlugs]);

  return { posts, loading, hasMore, loadMore };
}
