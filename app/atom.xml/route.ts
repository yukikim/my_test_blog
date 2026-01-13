import { NextResponse } from "next/server";
import { microcmsClient } from "@/lib/microcms";
import { getSiteUrl } from "@/lib/site";
import type { Post } from "@/types/post";
import { sanitizeHTML } from "@/lib/sanitize";

export const revalidate = 60;

export async function GET() {
  const siteUrl = getSiteUrl();
  const title = "Blog Feed (Atom)";
  const updated = new Date().toISOString();

  let items: Post[] = [];
  try {
    const data = await microcmsClient.getList<Post>({
      endpoint: "blogs",
      queries: { limit: 50, orders: "-publishedAt", fields: "id,title,content,publishedAt,updatedAt" },
    });
    items = data.contents;
  } catch {}

  const entries = items
    .map((p) => {
      const link = `${siteUrl}/blogs/${p.id}`;
      const updatedAt = p.updatedAt || p.publishedAt || updated;
      const safe = p.content ? sanitizeHTML(p.content) : "";
      return `\n  <entry>\n    <title>${escapeXml(p.title)}</title>\n    <link href="${link}"/>\n    <id>${link}</id>\n    <updated>${new Date(updatedAt).toISOString()}</updated>\n    <content type="html"><![CDATA[${safe}]]></content>\n  </entry>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <link href="${siteUrl}"/>
  <updated>${updated}</updated>
  <id>${siteUrl}/atom.xml</id>${entries}
</feed>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
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
