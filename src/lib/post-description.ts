import type { PostData } from "./posts";

/** Roughly what Google shows before cutting a description off. */
const MAX = 155;

/**
 * A short description for search results and link previews.
 *
 * The Instagram caption used to be sent as-is: several thousand characters
 * ending in hashtags, of which a search engine shows the first line and a half.
 * A post can declare its own `description` in the frontmatter; otherwise this
 * takes the opening of the caption, drops the hashtags, and stops on a sentence
 * boundary so the snippet reads as a finished thought.
 */
export function postDescription(post: PostData): string {
  if (post.description) return post.description;

  const source = (post.caption ?? "")
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const fallback = `${post.topicTag}: ${post.headline.replace(/[{}]/g, "")}`;
  if (!source) return fallback.slice(0, MAX);
  if (source.length <= MAX) return source;

  // Prefer ending on a full sentence; fall back to a word boundary.
  const window = source.slice(0, MAX + 1);
  const lastSentence = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("? "),
    window.lastIndexOf("! ")
  );
  if (lastSentence > MAX * 0.5) return window.slice(0, lastSentence + 1);

  const lastSpace = window.lastIndexOf(" ");
  return `${window.slice(0, lastSpace > 0 ? lastSpace : MAX).trimEnd()}…`;
}
