import { notFound } from "next/navigation";
import { microcmsClient } from "@/lib/microcms";
import type { Post } from "@/types/post";
import { sanitizeHTML } from "@/lib/sanitize";
import Link from "next/link";
import CategoryList from "@/components/CategoryList";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";

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

async function getPost(id: string, draftKey?: string) {
  try {
    const data = await microcmsClient.getListDetail<Post>({
      endpoint: "blogs",
      contentId: id,
      queries: draftKey ? { draftKey } : undefined,
    });
    return data as Post;
  } catch {
    return null;
  }
}

export default async function PostPage({ params, searchParams }:
  { params: Promise<{ id: string }>, searchParams?: Promise<{ [key: string]: string | undefined }> }) {
  const { id } = await params;
  const qp = searchParams ? await searchParams : {};
  const draftKey = qp?.draftKey;
  if (!id) return notFound();

  const post = await getPost(id, draftKey);
  console.log("Fetched post:", post.tag);
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
      <div className="mb-4 space-y-2 text-sm">
        {post.category?.id && (
          <div>
            <Link
              className="text-blue-600 hover:underline"
              href={`/categories/${post.category.id}`}
            >
              #{post.category.name ?? "category"}
            </Link>
          </div>
        )}
        {post.tag && post.tag.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            {post.tag.map((t) => (
              <Link
                key={t.id}
                className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 hover:bg-emerald-100"
                href={`/tags/${t.id}`}
              >
                #{t.tag ?? "tag"}
              </Link>
            ))}
          </div>
        )}
      </div>
      {post.publishedAt && (
        <div className="mb-8 text-sm text-zinc-500">
          {new Date(post.publishedAt).toLocaleDateString()}
        </div>
      )}
      {html ? (
        <article
          className="prose text-zinc-800 space-y-4"
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      ) : (
        <p className="text-zinc-500">本文がありません。</p>
      )}
      <div className="mt-12">
        <CommentsList postId={post.id} />
      </div>
      <div className="mt-12">
        <CommentForm postId={post.id} />
      </div>
      <div className="mt-12">
        <CategoryList />
      </div>
    </main>
  );
}
