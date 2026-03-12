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
  quote: string | null;
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
  contentSections: ContentSection[]; // <!-- slide-only --> sections (for slides)
  webSections: ContentSection[];     // unmarked sections (for web page)
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
  slideSections: ContentSection[];
  webSections: ContentSection[];
  caption: string | null;
} {
  // Split on horizontal rule (---) to separate content from caption
  const parts = content.split(/\n---\n/);
  const mainContent = parts[0].trim();
  const caption = parts.length > 1 ? parts.slice(1).join("\n---\n").trim() : null;

  // Parse ## headings into sections, detecting <!-- slide-only --> markers
  const slideSections: ContentSection[] = [];
  const webSections: ContentSection[] = [];
  const headingPattern = /^## (.+)$/gm;
  const matches: { index: number; tag: string; fullMatch: string }[] = [];

  let match;
  while ((match = headingPattern.exec(mainContent)) !== null) {
    matches.push({ index: match.index, tag: match[1], fullMatch: match[0] });
  }

  let slideCount = 0;
  let webCount = 0;

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].fullMatch.length + 1; // heading + "\n"
    const end = i + 1 < matches.length ? matches[i + 1].index : mainContent.length;
    const rawBlock = mainContent.slice(start, end).trim();

    // Check if <!-- slide-only --> appears before this heading
    // Look at text between previous section end and this heading start
    const blockStart = i === 0 ? 0 : matches[i - 1].index + matches[i - 1].fullMatch.length;
    const textBefore = mainContent.slice(blockStart, matches[i].index);
    const isSlideOnly = /<!--\s*slide-only\s*-->/.test(textBefore);

    // Remove <!-- slide-only --> comment from the body if it leaked in
    const body = rawBlock.replace(/<!--\s*slide-only\s*-->\s*/g, "").trim();

    if (isSlideOnly) {
      slideCount++;
      slideSections.push({
        tag: matches[i].tag,
        body,
        sectionNumber: String(slideCount).padStart(2, "0"),
      });
    } else {
      webCount++;
      webSections.push({
        tag: matches[i].tag,
        body,
        sectionNumber: String(webCount).padStart(2, "0"),
      });
    }
  }

  // If no headings found, treat entire content as single web section
  if (matches.length === 0 && mainContent.length > 0) {
    webSections.push({
      tag: "Why it works",
      body: mainContent,
      sectionNumber: "01",
    });
  }

  return { slideSections, webSections, caption };
}

function parsePostFile(filePath: string): PostData | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const { slideSections, webSections, caption } = parseMarkdownSections(content);

    // Build references JSON string
    const refs = data.references
      ? JSON.stringify(data.references)
      : null;

    // Build hashtags JSON string
    const hashtags = Array.isArray(data.hashtags)
      ? JSON.stringify(data.hashtags)
      : JSON.stringify([]);

    // Build contentSlides JSON from slide sections
    const contentSlides = slideSections.length > 1
      ? JSON.stringify(slideSections)
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

      quote: data.quote || null,
      quoteAttribution: data.quoteAttribution || null,
      quoteIconType: data.quoteIconType ?? "sun",

      ctaText: data.ctaText ?? "Follow for {more} psychology life hacks",
      hashtags,
      handleBio: data.handleBio ?? "psychology \u00B7 life hacks \u00B7 mental health",

      colorPalette: data.colorPalette ?? "sage",
      logoVariant: data.logoVariant ?? "light",

      contentSections: slideSections,
      webSections,
      caption,
      references: refs,

      // Legacy compat
      contentTag: slideSections[0]?.tag ?? null,
      contentBody: slideSections[0]?.body ?? "",
      sectionNumber: slideSections[0]?.sectionNumber ?? "01",
      contentSlides,
    };
  } catch {
    return null;
  }
}

function loadAllPosts(): Map<string, PostData> {
  // In dev mode, always reload from disk
  if (cache && process.env.NODE_ENV === "production") return cache;

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

export function getPostByGroupAndLocale(group: string, locale: string): PostData | null {
  const posts = loadAllPosts();
  for (const post of posts.values()) {
    if ((post.translationGroup || post.slug) === group && post.locale === locale) {
      return post;
    }
  }
  return null;
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
 * Build slide path prefix for a post: {translationGroup}/{locale}
 */
function slideDir(post: PostData): string {
  const group = post.translationGroup || post.slug;
  return `${group}/${post.locale}`;
}

/**
 * Compute deterministic slide filenames for a post.
 * Slide naming: {translationGroup}/{locale}/slide-{slideNumber}.png
 */
export function getPostSlides(post: PostData): SlideInfo[] {
  const slides: SlideInfo[] = [];
  const dir = slideDir(post);

  // Slide 1: Title
  slides.push({ filename: `${dir}/slide-1.png`, slideNumber: 1 });

  // Slides 2..N+1: Content
  for (let i = 0; i < post.contentSections.length; i++) {
    const num = i + 2;
    slides.push({ filename: `${dir}/slide-${num}.png`, slideNumber: num });
  }

  let nextNum = post.contentSections.length + 2;

  // Quote (only if present)
  if (post.quote) {
    slides.push({ filename: `${dir}/slide-${nextNum}.png`, slideNumber: nextNum });
    nextNum++;
  }

  // CTA
  slides.push({ filename: `${dir}/slide-${nextNum}.png`, slideNumber: nextNum });

  // Web title variant (100)
  slides.push({ filename: `${dir}/slide-${WEB_TITLE_SLIDE}.png`, slideNumber: WEB_TITLE_SLIDE });

  // Web quote variant (101, only if quote exists)
  if (post.quote) {
    slides.push({ filename: `${dir}/slide-${WEB_QUOTE_SLIDE}.png`, slideNumber: WEB_QUOTE_SLIDE });
  }

  return slides;
}
