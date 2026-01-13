import { NextResponse } from "next/server";
import { microcmsClient } from "@/lib/microcms";
import { getSiteUrl } from "@/lib/site";
import type { Post } from "@/types/post";
import { sanitizeHTML } from "@/lib/sanitize";

export const revalidate = 60;

export async function GET() {
  const siteUrl = getSiteUrl();
  const title = "Blog Feed";
  const description = "Latest articles";

  let items: Post[] = [];
  try {
    const data = await microcmsClient.getList<Post>({
      endpoint: "blogs",
      queries: { limit: 50, orders: "-publishedAt", fields: "id,title,content,publishedAt,updatedAt" },
    });
    items = data.contents;
  } catch {}

  const xmlItems = items
    .map((p) => {
      const link = `${siteUrl}/blogs/${p.id}`;
      const pub = p.publishedAt || p.updatedAt || new Date().toISOString();
      const safe = p.content ? sanitizeHTML(p.content) : "";
      return `\n    <item>\n      <title>${escapeXml(p.title)}</title>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <pubDate>${new Date(pub).toUTCString()}</pubDate>\n      <description><![CDATA[${safe}]]></description>\n    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": `public, max-age=${revalidate}`,
    },
  });
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
