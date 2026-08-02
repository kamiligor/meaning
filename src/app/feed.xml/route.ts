import { getPublishedPosts } from "@/lib/posts";
import { getLocale } from "@/lib/locale";
import { urlForLocale, SITE_HOSTS } from "@/lib/domains";
import { t } from "@/lib/i18n";

/** XML has five characters that cannot appear raw in text or attributes. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * One feed per domain, in that domain's language. Readers and aggregators pull
 * from it, and it gives new posts a second discovery path besides the sitemap.
 */
export async function GET() {
  const locale = await getLocale();
  const d = t(locale);
  const site = `https://${SITE_HOSTS[locale]}`;

  const posts = getPublishedPosts(locale).slice(0, 50);

  const items = posts
    .map((post) => {
      const url = urlForLocale(locale, `/post/${post.slug}`);
      const title = escapeXml(post.headline.replace(/[{}]/g, ""));
      const summary = escapeXml(
        (post.caption ?? "").split("\n")[0].slice(0, 500)
      );
      const date = new Date(
        post.publishedAt ?? post.updatedAt ?? Date.now()
      ).toUTCString();

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${summary}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(d.siteTitle)}</title>
    <link>${site}</link>
    <description>${escapeXml(d.siteDescription)}</description>
    <language>${locale}</language>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
