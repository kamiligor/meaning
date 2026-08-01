import type { MetadataRoute } from "next";
import { getLocale } from "@/lib/locale";
import { urlForLocale, SITE_HOSTS } from "@/lib/domains";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const locale = await getLocale();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/profil", "/program"],
      },
    ],
    sitemap: urlForLocale(locale, "/sitemap.xml"),
    host: `https://${SITE_HOSTS[locale]}`,
  };
}
