import { notFound } from "next/navigation";
import { microcmsClient } from "@/lib/microcms";
import type { Post } from "@/types/post";
import { sanitizeHTML } from "@/lib/sanitize";
import Link from "next/link";
import CategoryList from "@/components/CategoryListSide";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";
import { TagIcon, CalendarIcon } from '@heroicons/react/24/outline'
import PostList from "@/components/PostList";
import TagList from "@/components/TagList";

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
  async function getPosts() {
    try {
      const data = await microcmsClient.getList<Post>({ endpoint: "blogs" });
      return data.contents;
    } catch {
      return [];
    }
  }
  const posts = await getPosts();
  return (
    <div className="flex flex-wrap">

      <main className="p-6 content-back w-full lg:w-2/3">

        <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>

        <div className="flex justify-between border-b border-teal-700 border-dotted pb-1 mb-6">
          {/* カテゴリー・タグ */}
          <div className="space-y-2 text-sm flex justify-end items-center gap-4">
            {post.category?.id && (
              <div className="m-0">
                <Link
                  className="text-blue-600 hover:underline"
                  href={`/categories/${post.category.id}`}
                >
                  Category: {post.category.name ?? "category"}
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
                    <TagIcon className="inline-block w-4 h-4 mr-1" />{t.tag ?? "tag"}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* 投稿日 */}
          {post.publishedAt && (
            <div className="text-sm text-zinc-500">
              <CalendarIcon className="inline-block w-4 h-4 mr-1" /> {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {html ? (
          <article
            className="prose text-zinc-800 space-y-4 border-b border-teal-700 pb-4"
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
      </main>
      <menu className="content-frame p-6 text-gray-300 w-full lg:w-1/3">
        <h2 className="mb-4 text-lg font-bold">最新ポスト</h2>
        <PostList posts={posts} variant="full" />
        <div className="text-right">
          <Link
            href="/blogs"
            className="bg-blue-500 hover:bg-blue-700 text-white text4xl font-bold py-auto px-4 rounded h-8 inline-flex items-center mt-4"
            aria-label="blog list"
          >
            Blog List
          </Link>
        </div>
        <div className="my-6">
          <CategoryList />
          <div className="text-right">
            <Link
              href="/categories"
              className="bg-blue-500 hover:bg-blue-700 text-white text4xl font-bold py-auto px-4 rounded h-8 inline-flex items-center mt-4"
              aria-label="category list"
            >
              Category List
            </Link>

          </div>
        </div>
        <div className="my-6">
          <TagList />
          <div className="text-right">
            <Link
              href="/tags"
              className="bg-blue-500 hover:bg-blue-700 text-white text4xl font-bold py-auto px-4 rounded h-8 inline-flex items-center mt-4"
              aria-label="tag list"
            >
              Tag List
            </Link>

          </div>
        </div>
      </menu>
    </div>
  );
}
