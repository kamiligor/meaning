"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t, type Locale } from "@/lib/i18n";
import { useLike } from "./like-context";

interface LikeButtonProps {
  slug: string;
  locale: Locale;
}

export function LikeButton({ slug, locale }: LikeButtonProps) {
  const { isLiked, toggle, isLoggedIn } = useLike();
  const liked = isLiked(slug);
  const [animating, setAnimating] = useState(false);
  const router = useRouter();
  const d = t(locale);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    await toggle(slug);
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-[#F1F4F6] transition-colors cursor-pointer ${
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
