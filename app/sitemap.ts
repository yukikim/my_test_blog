import type { MetadataRoute } from "next";
import { microcmsClient } from "@/lib/microcms";
import { getSiteUrl } from "@/lib/site";
import type { Post } from "@/types/post";
import type { Category } from "@/types/category";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const pages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "daily",
      priority: 1.0,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.6,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/profile`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/profile/work-history`,
      changeFrequency: "monthly",
      priority: 0.4,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/skills`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: new Date(),
    },
  ];

  try {
    const posts = await microcmsClient.getList<Post>({
      endpoint: "blogs",
      queries: { fields: "id,updatedAt,publishedAt", limit: 100 },
    });
    for (const p of posts.contents) {
      pages.push({
        url: `${siteUrl}/blogs/${p.id}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : p.publishedAt ? new Date(p.publishedAt) : new Date(),
      });
    }
  } catch {}

  try {
    const categories = await microcmsClient.getList<Category>({
      endpoint: "categories",
      queries: { fields: "id,updatedAt,publishedAt", limit: 100 },
    });
    for (const c of categories.contents) {
      pages.push({
        url: `${siteUrl}/categories/${c.id}`,
        changeFrequency: "weekly",
        priority: 0.5,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : c.publishedAt ? new Date(c.publishedAt) : new Date(),
      });
    }
  } catch {}

  return pages;
}
