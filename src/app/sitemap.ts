import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { CATEGORIES } from "@/lib/categories";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://justmeaning.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/mission`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/misja`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.flatMap((cat) => [
    {
      url: `${SITE_URL}/category/${cat.en.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/kategoria/${cat.pl.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]);

  const posts = getAllPosts({ status: "published" });
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...postEntries];
}
