"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface LikeContextValue {
  isLiked: (slug: string) => boolean;
  toggle: (slug: string) => Promise<void>;
  isLoggedIn: boolean;
}

const LikeContext = createContext<LikeContextValue | null>(null);

export function useLike() {
  const ctx = useContext(LikeContext);
  if (!ctx) throw new Error("useLike must be used within LikeProvider");
  return ctx;
}

interface LikeProviderProps {
  initialLikedSlugs: string[];
  isLoggedIn: boolean;
  children: ReactNode;
}

export function LikeProvider({ initialLikedSlugs, isLoggedIn, children }: LikeProviderProps) {
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set(initialLikedSlugs));

  const isLiked = useCallback((slug: string) => likedSlugs.has(slug), [likedSlugs]);

  const toggle = useCallback(async (slug: string) => {
    const prev = likedSlugs.has(slug);
    setLikedSlugs((s) => {
      const next = new Set(s);
      if (prev) next.delete(slug);
      else next.add(slug);
      return next;
    });

    try {
      const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLikedSlugs((s) => {
        const next = new Set(s);
        if (data.liked) next.add(slug);
        else next.delete(slug);
        return next;
      });
    } catch {
      // Revert
      setLikedSlugs((s) => {
        const next = new Set(s);
        if (prev) next.add(slug);
        else next.delete(slug);
        return next;
      });
    }
  }, [likedSlugs]);

  return (
    <LikeContext.Provider value={{ isLiked, toggle, isLoggedIn }}>
      {children}
    </LikeContext.Provider>
  );
}
