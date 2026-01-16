import Link from "next/link";
import { microcmsClient } from "@/lib/microcms";
import type { Post } from "@/types/post";
import PostList from "@/components/PostList";

export const revalidate = 60;

const DEFAULT_LIMIT = 9; // 1ページあたりの表示件数（任意に変更可）

async function getPosts(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const data = await microcmsClient.getList<Post>({
    endpoint: "blogs",
    queries: {
      limit,
      offset,
      orders: "-publishedAt",
      fields: "id,title,category,publishedAt,eyecatch,description",
    },
  });
  return data;
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const qp = searchParams ? await searchParams : {};

  const page = Number(Array.isArray(qp.page) ? qp.page[0] : qp.page) || 1;
  const limitFromQuery = Number(
    Array.isArray(qp.limit) ? qp.limit[0] : qp.limit,
  );
  const limit = Number.isFinite(limitFromQuery) && limitFromQuery > 0
    ? Math.min(limitFromQuery, 100) // microCMS の1リクエスト最大件数
    : DEFAULT_LIMIT;

  const { contents: posts, totalCount } = await getPosts(page, limit);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">ブログ一覧</h1>

      <PostList posts={posts} />

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-4 text-sm">
          {currentPage > 1 && (
            <Link
              href={{
                pathname: "/blogs",
                query: { page: currentPage - 1, limit },
              }}
              className="rounded border px-3 py-1 text-zinc-700 hover:bg-zinc-100"
            >
              前のページ
            </Link>
          )}
          <span className="text-zinc-500">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={{
                pathname: "/blogs",
                query: { page: currentPage + 1, limit },
              }}
              className="rounded border px-3 py-1 text-zinc-700 hover:bg-zinc-100"
            >
              次のページ
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
