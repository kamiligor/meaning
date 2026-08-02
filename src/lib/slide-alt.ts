import { getContentSections } from "./content-sections";
import type { PostData } from "./posts";

/** Accent braces are a rendering hint, not part of the sentence. */
function plain(text: string): string {
  return text.replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * The words printed on each slide, keyed by slide number.
 *
 * Slides are images of text, so this is what belongs in their alt attribute:
 * it is the honest description of the image, it is what a screen reader needs,
 * and it is the only way this copy reaches anything that reads the page rather
 * than looking at it.
 *
 * Numbering follows the generator: 1 is the title, then one slide per content
 * section, then the quote, then the call to action.
 */
export function slideAltTexts(post: PostData): Map<number, string> {
  const alts = new Map<number, string>();
  const sections = getContentSections(post);

  const title = [plain(post.headline), post.subtitle ? plain(post.subtitle) : null]
    .filter(Boolean)
    .join(". ");
  alts.set(1, title);

  sections.forEach((section, i) => {
    const parts = [plain(section.tag), plain(section.body)].filter(Boolean);
    alts.set(2 + i, parts.join(". "));
  });

  const quoteSlide = 2 + sections.length;
  if (post.quote) {
    const attribution = post.quoteAttribution
      ? ` ${plain(post.quoteAttribution)}`
      : "";
    alts.set(quoteSlide, `${plain(post.quote)}${attribution}`);
  }

  if (post.ctaText) {
    alts.set(quoteSlide + 1, plain(post.ctaText));
  }

  return alts;
}
