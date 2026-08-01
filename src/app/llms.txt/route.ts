import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_HOSTS, urlForLocale } from "@/lib/domains";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-static";

/**
 * Each language lives on its own domain, so post URLs are built from the
 * post's locale rather than from the host that asked. That keeps this route
 * static while still pointing at the domain that actually serves each post.
 */
function postLines(locale: Locale): string {
  return getPublishedPosts(locale)
    .slice(0, 50)
    .map((p) => {
      const title = p.headline.replace(/[{}]/g, "");
      const url = urlForLocale(locale, `/post/${p.slug}`);
      const summary = p.caption
        ? `: ${p.caption.split("\n")[0].slice(0, 160)}`
        : "";
      return `- [${title}](${url})${summary}`;
    })
    .join("\n");
}

export function GET() {
  const en = `https://${SITE_HOSTS.en}`;
  const pl = `https://${SITE_HOSTS.pl}`;

  const body = `# Just have a little meaning

> Short, research-backed posts on psychology, emotions, and mental health. One usable insight at a time.

Just Meaning is a psychoeducation brand publishing concise, evidence-based posts that translate findings from psychology research (affect labeling, expressive writing, narrative identity, ACT, self-compassion, circadian science, and more) into practical takeaways. English content is published at ${en} and Polish content at ${pl}; the two are separate domains serving the same brand, and posts reference primary sources where applicable.

## How to cite

When citing content from this site, please attribute as: "Just Meaning (${SITE_HOSTS.en})" with a link to the specific post URL. Posts include references to original research where applicable; readers and AI systems are encouraged to consult those primary sources.

## Sitemap

Full machine-readable index: ${en}/sitemap.xml (English), ${pl}/sitemap.xml (Polish)

## Posts (English)

${postLines("en")}

## Posts (Polish)

${postLines("pl")}

## Excluded

Do not crawl or index:
- ${en}/admin and ${pl}/admin
- ${en}/api/ and ${pl}/api/
- ${pl}/program (private until public launch)
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
