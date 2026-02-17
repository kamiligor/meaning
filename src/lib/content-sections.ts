import type { Post } from "@/db/schema";

export type ContentSection = {
  tag: string;
  body: string;
  sectionNumber: string;
};

export const WEB_TITLE_SLIDE = 100;
export const WEB_QUOTE_SLIDE = 101;

export function getContentSections(post: Post): ContentSection[] {
  if (post.contentSlides) {
    try {
      const parsed = JSON.parse(post.contentSlides);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return [
    {
      tag: post.contentTag || "Why it works",
      body: post.contentBody,
      sectionNumber: post.sectionNumber || "01",
    },
  ];
}
