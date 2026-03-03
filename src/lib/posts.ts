import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { WEB_TITLE_SLIDE, WEB_QUOTE_SLIDE, type ContentSection } from "./content-sections";

export interface PostReference {
  title: string;
  author: string;
  url?: string;
}

export interface PostData {
  slug: string;
  status: "draft" | "published";
  locale: string;
  translationGroup: string | null;
  publishedAt: string | null;

  // Title slide
  topicTag: string;
  headline: string;
  subtitle: string | null;
  iconType: string | null;

  // Quote slide
  quote: string;
  quoteAttribution: string | null;
  quoteIconType: string | null;

  // CTA slide
  ctaText: string | null;
  hashtags: string; // JSON string for template compat
  handleBio: string | null;

  // Design
  colorPalette: string | null;
  logoVariant: string | null;

  // Parsed from markdown body
  contentSections: ContentSection[];
  caption: string | null;
  references: string | null; // JSON string for compat

  // Legacy compat fields used by templates
  contentTag: string | null;
  contentBody: string;
  sectionNumber: string | null;
  contentSlides: string | null; // JSON string
}

let cache: Map<string, PostData> | null = null;

function getPostsDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), "content", "posts"),
    path.join(__dirname, "..", "..", "content", "posts"),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function parseMarkdownSections(content: string): {
  sections: ContentSection[];
  caption: string | null;
} {
  // Split on horizontal rule (---) to separate content from caption
  const parts = content.split(/\n---\n/);
  const mainContent = parts[0].trim();
  const caption = parts.length > 1 ? parts.slice(1).join("\n---\n").trim() : null;

  // Parse ## headings into sections
  const sections: ContentSection[] = [];
  const headingPattern = /^## (.+)$/gm;
  const matches: { index: number; tag: string }[] = [];

  let match;
  while ((match = headingPattern.exec(mainContent)) !== null) {
    matches.push({ index: match.index, tag: match[1] });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].tag.length + 4; // "## " + tag + "\n"
    const end = i + 1 < matches.length ? matches[i + 1].index : mainContent.length;
    const body = mainContent.slice(start, end).trim();
    const sectionNumber = String(i + 1).padStart(2, "0");

    sections.push({
      tag: matches[i].tag,
      body,
      sectionNumber,
    });
  }

  // If no headings found, treat entire content as single section
  if (sections.length === 0 && mainContent.length > 0) {
    sections.push({
      tag: "Why it works",
      body: mainContent,
      sectionNumber: "01",
    });
  }

  return { sections, caption };
}

function parsePostFile(filePath: string): PostData | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const { sections, caption } = parseMarkdownSections(content);

    // Build references JSON string
    const refs = data.references
      ? JSON.stringify(data.references)
      : null;

    // Build hashtags JSON string
    const hashtags = Array.isArray(data.hashtags)
      ? JSON.stringify(data.hashtags)
      : JSON.stringify([]);

    // Build contentSlides JSON from sections
    const contentSlides = sections.length > 1
      ? JSON.stringify(sections)
      : null;

    return {
      slug: data.slug,
      status: data.status || "draft",
      locale: data.locale || "en",
      translationGroup: data.translationGroup || null,
      publishedAt: data.publishedAt || null,

      topicTag: data.topicTag,
      headline: data.headline,
      subtitle: data.subtitle ?? "Swipe to learn why",
      iconType: data.iconType ?? "clock",

      quote: data.quote,
      quoteAttribution: data.quoteAttribution || null,
      quoteIconType: data.quoteIconType ?? "sun",

      ctaText: data.ctaText ?? "Follow for {more} psychology life hacks",
      hashtags,
      handleBio: data.handleBio ?? "psychology \u00B7 life hacks \u00B7 mental health",

      colorPalette: data.colorPalette ?? "sage",
      logoVariant: data.logoVariant ?? "light",

      contentSections: sections,
      caption,
      references: refs,

      // Legacy compat
      contentTag: sections[0]?.tag ?? null,
      contentBody: sections[0]?.body ?? "",
      sectionNumber: sections[0]?.sectionNumber ?? "01",
      contentSlides,
    };
  } catch {
    return null;
  }
}

function loadAllPosts(): Map<string, PostData> {
  if (cache) return cache;

  const postMap = new Map<string, PostData>();
  const dir = getPostsDir();

  if (!fs.existsSync(dir)) return postMap;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const post = parsePostFile(path.join(dir, file));
    if (post) {
      postMap.set(post.slug, post);
    }
  }

  cache = postMap;
  return postMap;
}

export function invalidateCache(): void {
  cache = null;
}

export function getPostBySlug(slug: string): PostData | null {
  const posts = loadAllPosts();
  return posts.get(slug) ?? null;
}

export function getAllPosts(opts?: {
  status?: "draft" | "published";
  locale?: string;
}): PostData[] {
  const posts = Array.from(loadAllPosts().values());

  let filtered = posts;
  if (opts?.status) {
    filtered = filtered.filter((p) => p.status === opts.status);
  }
  if (opts?.locale) {
    filtered = filtered.filter((p) => p.locale === opts.locale);
  }

  // Sort by publishedAt desc, then slug
  filtered.sort((a, b) => {
    const dateA = a.publishedAt || "";
    const dateB = b.publishedAt || "";
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return a.slug.localeCompare(b.slug);
  });

  return filtered;
}

export function getPublishedPosts(locale: string): PostData[] {
  return getAllPosts({ status: "published", locale });
}

export function getTranslations(
  translationGroup: string | null
): { locale: string; slug: string }[] {
  if (!translationGroup) return [];
  const posts = loadAllPosts();
  const result: { locale: string; slug: string }[] = [];

  for (const post of posts.values()) {
    if (post.translationGroup === translationGroup) {
      result.push({ locale: post.locale, slug: post.slug });
    }
  }

  return result;
}

export interface SlideInfo {
  filename: string;
  slideNumber: number;
}

/**
 * Compute deterministic slide filenames for a post.
 * Slide naming: {slug}-slide-{slideNumber}.png
 */
export function getPostSlides(post: PostData): SlideInfo[] {
  const slides: SlideInfo[] = [];
  const { slug, contentSections } = post;

  // Slide 1: Title
  slides.push({ filename: `${slug}-slide-1.png`, slideNumber: 1 });

  // Slides 2..N+1: Content
  for (let i = 0; i < contentSections.length; i++) {
    const num = i + 2;
    slides.push({ filename: `${slug}-slide-${num}.png`, slideNumber: num });
  }

  // Quote
  const quoteNum = contentSections.length + 2;
  slides.push({ filename: `${slug}-slide-${quoteNum}.png`, slideNumber: quoteNum });

  // CTA
  const ctaNum = contentSections.length + 3;
  slides.push({ filename: `${slug}-slide-${ctaNum}.png`, slideNumber: ctaNum });

  // Web title variant (100)
  slides.push({ filename: `${slug}-slide-${WEB_TITLE_SLIDE}.png`, slideNumber: WEB_TITLE_SLIDE });

  // Web quote variant (101)
  slides.push({ filename: `${slug}-slide-${WEB_QUOTE_SLIDE}.png`, slideNumber: WEB_QUOTE_SLIDE });

  return slides;
}
