import { notFound } from "next/navigation";
import { microcmsClient } from "@/lib/microcms";
import type { Post } from "@/types/post";
import { sanitizeHTML } from "@/lib/sanitize";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const data = await microcmsClient.getList<Post>({
      endpoint: "blogs",
      queries: { fields: "id", limit: 100 },
    });
    return data.contents.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

async function getPost(id: string) {
  try {
    const data = await microcmsClient.getListDetail<Post>({
      endpoint: "blogs",
      contentId: id,
    });
    return data as Post;
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  console.log(post);
  if (!post) return notFound();
  const candidates = ["content", "body", "text", "description", "richtext", "html"] as const;
  let html = "";
  for (const key of candidates) {
    const val = (post as Record<string, unknown>)[key];
    if (typeof val === "string" && val.trim().length) {
      html = val;
      break;
    }
  }
  const safe = sanitizeHTML(html);
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      {post.publishedAt && (
        <div className="mb-8 text-sm text-zinc-500">
          {new Date(post.publishedAt).toLocaleDateString()}
        </div>
      )}
      {html ? (
        <article
          className="leading-7 text-zinc-800 dark:text-zinc-200 space-y-4"
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      ) : (
        <p className="text-zinc-500">本文がありません。</p>
      )}
    </main>
  );
}
