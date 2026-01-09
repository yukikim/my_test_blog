import { notFound } from "next/navigation";
import { microcmsClient } from "@/lib/microcms";
import type { Post } from "@/types/post";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const data = await microcmsClient.getList<Post>({
      endpoint: "blogs",
      queries: { fields: "id", limit: 100 },
    });
    return data.contents.map((p) => ({ id: p.id }));
  } catch {
    // microCMS側でAPI未作成 or 非公開の場合でもビルドを通す
    return [];
  }
}

async function getPost(id: string) {
  try {
    const data = await microcmsClient.getListDetail<Post>({
      endpoint: "blogs",
      contentId: id,
    });
    return data;
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return notFound();
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      {post.publishedAt && (
        <div className="mb-8 text-sm text-zinc-500">
          {new Date(post.publishedAt).toLocaleDateString()}
        </div>
      )}
      {post.body ? (
        <article
          className="leading-7 text-zinc-800 dark:text-zinc-200 space-y-4"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      ) : (
        <p className="text-zinc-500">本文がありません。</p>
      )}
    </main>
  );
}
