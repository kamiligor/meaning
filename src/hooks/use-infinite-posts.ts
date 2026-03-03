"use client";

import { useState, useCallback } from "react";

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
}

export function useInfinitePosts({
  initialPosts,
  initialHasMore,
  locale,
}: UseInfinitePostsOptions) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?locale=${locale}&offset=${posts.length}&limit=10`
      );
      if (!res.ok) return;
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  }, [posts.length, loading, hasMore, locale]);

  return { posts, loading, hasMore, loadMore };
}
