"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t, type Locale } from "@/lib/i18n";

interface LikeButtonProps {
  slug: string;
  liked: boolean;
  isLoggedIn: boolean;
  locale: Locale;
}

export function LikeButton({ slug, liked: initialLiked, isLoggedIn, locale }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [animating, setAnimating] = useState(false);
  const router = useRouter();
  const d = t(locale);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const prev = liked;
    setLiked(!prev);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    try {
      const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked);
    } catch {
      setLiked(prev);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-[#F1F4F6] transition-colors ${
        liked
          ? "text-red-500 hover:text-red-600"
          : "text-[#8A99A8] hover:text-red-400"
      } hover:bg-white`}
      aria-label={liked ? d.unlike : d.like}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animating ? "animate-like-pop" : ""}
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
