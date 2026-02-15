"use client";

import { useState, useCallback } from "react";

interface Slide {
  id: number;
  filename: string;
  slideNumber: number;
}

interface Post {
  id: number;
  slug: string;
  topicTag: string;
  headline: string;
  caption: string | null;
  publishedAt: string | null;
  slides: Slide[];
}

interface UseInfinitePostsOptions {
  initialPosts: Post[];
  initialCursor: number | null;
}

export function useInfinitePosts({
  initialPosts,
  initialCursor,
}: UseInfinitePostsOptions) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [cursor, setCursor] = useState<number | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const hasMore = cursor !== null;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?status=published&cursor=${cursor}&limit=10`
      );
      if (!res.ok) return;
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);

  return { posts, loading, hasMore, loadMore };
}
