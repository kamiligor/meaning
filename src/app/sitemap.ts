import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { getLocale } from "@/lib/locale";
import { urlForLocale, PROGRAM_LOCALE, standardsPath } from "@/lib/domains";
import { CATEGORIES, getCategoryUrl } from "@/lib/categories";

/**
 * One sitemap per domain: each host lists only the pages it serves, in its
 * own language. Listing both languages under one host would point crawlers
 * at URLs that redirect to the other domain.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = await getLocale();
  const url = (path: string) => urlForLocale(locale, path);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "daily", priority: 1.0 },
    {
      url: url(locale === "pl" ? "/misja" : "/mission"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  staticEntries.push({
    url: url(standardsPath(locale)),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.4,
  });

  if (locale === PROGRAM_LOCALE) {
    staticEntries.push({
      url: url("/program"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    // Mini courses live on the Polish domain only, like the program.
    for (const coursePath of ["/kursy", "/kurs-niescrollowania", "/kurs-wdziecznosci"]) {
      staticEntries.push({
        url: url(coursePath),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: url(getCategoryUrl(cat.key, locale)),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = getPublishedPosts(locale).map(
    (post) => ({
      url: url(`/post/${post.slug}`),
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [...staticEntries, ...categoryEntries, ...postEntries];
}
