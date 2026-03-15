"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

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
  onToggle?: (slug: string, liked: boolean) => void;
  children: ReactNode;
}

export function LikeProvider({ initialLikedSlugs, isLoggedIn, onToggle, children }: LikeProviderProps) {
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set(initialLikedSlugs));
  const onToggleRef = useRef(onToggle);
  onToggleRef.current = onToggle;

  // Sync when initialLikedSlugs changes (e.g. after async fetch)
  useEffect(() => {
    if (initialLikedSlugs.length === 0) return;
    setLikedSlugs(new Set(initialLikedSlugs));
  }, [initialLikedSlugs]);

  const isLiked = useCallback((slug: string) => likedSlugs.has(slug), [likedSlugs]);

  const toggle = useCallback(async (slug: string) => {
    const prev = likedSlugs.has(slug);
    setLikedSlugs((s) => {
      const next = new Set(s);
      if (prev) next.delete(slug);
      else next.add(slug);
      return next;
    });
    // Notify parent optimistically
    onToggleRef.current?.(slug, !prev);

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
      // Sync with server response if different from optimistic
      if (data.liked === prev) {
        onToggleRef.current?.(slug, data.liked);
      }
    } catch {
      // Revert
      setLikedSlugs((s) => {
        const next = new Set(s);
        if (prev) next.add(slug);
        else next.delete(slug);
        return next;
      });
      onToggleRef.current?.(slug, prev);
    }
  }, [likedSlugs]);

  return (
    <LikeContext.Provider value={{ isLiked, toggle, isLoggedIn }}>
      {children}
    </LikeContext.Provider>
  );
}
