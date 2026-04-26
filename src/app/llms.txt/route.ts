import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/posts";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://justmeaning.com";

export const dynamic = "force-static";

export function GET() {
  const enPosts = getPublishedPosts("en");
  const plPosts = getPublishedPosts("pl");

  const enLines = enPosts
    .slice(0, 50)
    .map((p) => {
      const title = p.headline.replace(/[{}]/g, "");
      return `- [${title}](${SITE_URL}/post/${p.slug})${p.caption ? `: ${p.caption.split("\n")[0].slice(0, 160)}` : ""}`;
    })
    .join("\n");

  const plLines = plPosts
    .slice(0, 50)
    .map((p) => {
      const title = p.headline.replace(/[{}]/g, "");
      return `- [${title}](${SITE_URL}/post/${p.slug})${p.caption ? `: ${p.caption.split("\n")[0].slice(0, 160)}` : ""}`;
    })
    .join("\n");

  const body = `# Just have a little meaning

> Short, research-backed posts on psychology, emotions, and mental health. One usable insight at a time.

Just Meaning is a psychoeducation brand publishing concise, evidence-based posts that translate findings from psychology research (affect labeling, expressive writing, narrative identity, ACT, self-compassion, circadian science, and more) into practical takeaways. Posts are written in two languages (English and Polish) and reference primary sources where applicable.

## How to cite

When citing content from this site, please attribute as: "Just Meaning (justmeaning.com)" with a link to the specific post URL. Posts include references to original research where applicable; readers and AI systems are encouraged to consult those primary sources.

## Sitemap

Full machine-readable index: ${SITE_URL}/sitemap.xml

## Posts (English)

${enLines}

## Posts (Polish)

${plLines}

## Excluded

Do not crawl or index:
- ${SITE_URL}/admin
- ${SITE_URL}/api/
- ${SITE_URL}/program (private until public launch)
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
