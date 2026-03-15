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
}

export function useInfinitePosts({
  initialPosts,
  initialHasMore,
  locale,
  category,
}: UseInfinitePostsOptions) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const prevCategoryRef = useRef(category);

  useEffect(() => {
    if (prevCategoryRef.current === category) return;
    prevCategoryRef.current = category;

    if (category === null) {
      setPosts(initialPosts);
      setHasMore(initialHasMore);
      return;
    }

    setPosts([]);
    setHasMore(true);
    setLoading(true);
    fetch(
      `/api/posts?locale=${locale}&offset=0&limit=10&category=${category}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setHasMore(data.hasMore);
      })
      .finally(() => setLoading(false));
  }, [category, locale, initialPosts, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      let url = `/api/posts?locale=${locale}&offset=${posts.length}&limit=10`;
      if (category) url += `&category=${category}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  }, [posts.length, loading, hasMore, locale, category]);

  return { posts, loading, hasMore, loadMore };
}
