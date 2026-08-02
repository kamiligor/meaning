import type { MetadataRoute } from "next";
import { getLocale } from "@/lib/locale";
import { urlForLocale, SITE_HOSTS } from "@/lib/domains";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const locale = await getLocale();

  return {
    rules: [
      {
        userAgent: "*",
        // Slide PNGs live under /api/, and they are the only image every post
        // has — they are what open-graph previews and the Article schema point
        // at. Blocking the whole prefix hid every one of them from crawlers.
        allow: ["/", "/api/slides/"],
        disallow: ["/admin", "/api/", "/profil", "/program"],
      },
    ],
    sitemap: urlForLocale(locale, "/sitemap.xml"),
    host: `https://${SITE_HOSTS[locale]}`,
  };
}
